import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Database } from 'bun:sqlite';

const TRIPLE: Record<string, string> = {
	'darwin-arm64': 'aarch64-apple-darwin',
	'darwin-x64': 'x86_64-apple-darwin',
	'win32-x64': 'x86_64-pc-windows-msvc.exe'
};

function assert(cond: boolean, msg: string): asserts cond {
	if (!cond) throw new Error(msg);
}

async function waitReady(child: ReturnType<typeof spawn>, deadlineMs: number): Promise<number> {
	let port: number | null = null;
	let stderr = '';

	child.stdout?.on('data', (chunk) => {
		const match = /READY (\d+)/.exec(String(chunk));
		if (match) port = Number(match[1]);
	});
	child.stderr?.on('data', (chunk) => (stderr += String(chunk)));

	const deadline = Date.now() + deadlineMs;
	while (port === null) {
		if (Date.now() > deadline) {
			throw new Error(`timed out waiting for READY; stderr:\n${stderr}`);
		}
		if (child.exitCode !== null) {
			throw new Error(`sidecar exited early (exit ${child.exitCode}); stderr:\n${stderr}`);
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	return port;
}

function main(): Promise<void> {
	return new Promise((resolve, reject) => {
		(async () => {
			const key = `${process.platform}-${process.arch}`;
			const triple = TRIPLE[key];
			assert(!!triple, `desktop:smoke does not support ${key}`);

			const sidecarPath = join(import.meta.dir, '..', 'src-tauri', 'binaries', `session-server-${triple}`);
			const appdata = mkdtempSync(join(tmpdir(), 'ngan-smoke-'));
			const dbPath = join(appdata, 'smoke.db');
			const repoRoot = join(import.meta.dir, '..');

			const child = spawn(sidecarPath, [], {
				cwd: repoRoot,
				env: { ...process.env, DATABASE_URL: dbPath },
				stdio: ['ignore', 'pipe', 'pipe']
			});

			try {
				const port = await waitReady(child, 20000);
				const origin = `http://127.0.0.1:${port}`;

				const sessions = await fetch(`${origin}/sessions`);
				assert(sessions.status === 200, `GET /sessions -> ${sessions.status}`);
				const html = await sessions.text();
				const asset = /(?:src|href)="(\.?\/?_app\/immutable\/[^"]+)"/.exec(html)?.[1];
				assert(!!asset, `expected /_app/immutable asset in HTML`);
				const assetRes = await fetch(origin + asset.replace(/^\./, ''));
				assert(assetRes.status === 200, `GET ${asset} -> ${assetRes.status}`);

				const sl = await fetch(`${origin}/set-language`, {
					method: 'POST',
					redirect: 'manual',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						origin
					},
					body: new URLSearchParams({ lang: 'en', from: '/' }).toString()
				});
				assert(sl.status !== 403, `POST /set-language -> 403 (CSRF blocked)`);
				assert([200, 303].includes(sl.status), `POST /set-language -> ${sl.status}, expected 200 or 303`);
				const cookies = sl.headers.get('set-cookie') ?? '';
				assert(cookies.includes('lang=en'), `expected lang=en cookie, got: ${cookies}`);

				child.kill();
				await new Promise((resolveExit) => child.once('exit', resolveExit));

				const db = new Database(dbPath, { readonly: true });
				const tables: string[] = db
					.query(`select name from sqlite_master where type = 'table'`)
					.all()
					.map((row: { name: string }) => row.name);
				assert(tables.includes('study_sessions'), `migrations incomplete; tables=${tables.join(',')}`);
				const applied = (db.query('select count(*) as n from __drizzle_migrations').get() as { n: number }).n;
				assert(applied >= 1, 'expected at least one applied migration');
				db.close();
				rmSync(appdata, { recursive: true, force: true });

				console.log(`smoke PASS: ${triple} | READY ${port} | GET 200 + asset 200 + POST ${sl.status} (cookie OK) | migrations=${applied}`);
				resolve();
			} catch (error) {
				child.kill();
				rmSync(appdata, { recursive: true, force: true });
				reject(error);
			}
		})();
	});
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('smoke FAIL:', error);
		process.exit(1);
	});