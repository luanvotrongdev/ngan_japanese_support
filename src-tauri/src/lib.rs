#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};
use tauri::Manager;

static READY: AtomicBool = AtomicBool::new(false);

#[tauri::command]
fn greet() -> String {
    "Ngan Japanese Support is running".to_string()
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let handle = app.handle().clone();
            let port = start_sidecar(&handle)?;
            let url = format!("http://127.0.0.1:{}", port);
            let window = app.get_webview_window("main").expect("no main window");
            let _ = window.navigate(url.parse().unwrap());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_sidecar(app: &tauri::AppHandle) -> Result<u16, Box<dyn std::error::Error>> {
    use tauri_plugin_shell::process::CommandEvent;
    use tauri_plugin_shell::ShellExt;

    let project_root = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .to_path_buf();
    let sidecar_command = app.shell().sidecar("session-server")?;
    let (mut rx, _child) = sidecar_command.current_dir(project_root).spawn()?;

    let deadline = Instant::now() + Duration::from_secs(60);
    loop {
        if Instant::now() >= deadline {
            return Err("sidecar did not emit READY within 60s".into());
        }
        if let Ok(event) = rx.try_recv() {
            if let CommandEvent::Stdout(line) = event {
                let text = String::from_utf8_lossy(&line);
                if let Some(p) = text.strip_prefix("READY ") {
                    if let Ok(port) = p.trim().parse::<u16>() {
                        READY.store(true, Ordering::SeqCst);
                        return Ok(port);
                    }
                }
            }
        }
        std::thread::sleep(Duration::from_millis(50));
    }
}
