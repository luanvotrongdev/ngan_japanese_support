import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [major, minor] = Bun.version.split('.').slice(0, 2).map(Number) as [number, number];
if (major < 1 || (major === 1 && minor < 4)) {
	throw new Error(`desktop:build:sidecar requires Bun >= 1.4 (compile.assets); running Bun ${Bun.version}`);
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(repoRoot, 'src-tauri', 'binaries');
mkdirSync(outDir, { recursive: true });

const TRIPLES = {
	'bun-darwin-arm64': 'aarch64-apple-darwin',
	'bun-darwin-x64': 'x86_64-apple-darwin',
	'bun-windows-x64': 'x86_64-pc-windows-msvc.exe',
	'bun-linux-x64': 'x86_64-unknown-linux-gnu'
} as const;

type Target = keyof typeof TRIPLES;

const HOST: Record<string, Target> = {
	'darwin-arm64': 'bun-darwin-arm64',
	'darwin-x64': 'bun-darwin-x64',
	'win32-x64': 'bun-windows-x64',
	'linux-x64': 'bun-linux-x64'
};

const alias = HOST[`${process.platform}-${process.arch}`];
if (!alias) {
	throw new Error(`Unsupported host ${process.platform}-${process.arch}`);
}

const all = process.argv.slice(2).includes('--all');
const targets: Target[] = (all ? Object.keys(TRIPLES) : [alias]) as Target[];

const entry = join(repoRoot, 'desktop', 'server-entry.ts');

const assets = [join(repoRoot, 'drizzle')];

async function producedExecutable(): Promise<string> {
	const candidates = [
		join(repoRoot, 'server-entry'),
		join(repoRoot, '.sidecar.tmp'),
		join(outDir, '.sidecar.tmp')
	];
	const hit = candidates.find((candidate) => existsSync(candidate));
	if (!hit) {
		throw new Error('Bun compile produced no executable to rename');
	}
	return hit;
}

for (const target of targets) {
	const triple = TRIPLES[target];
	const outfile = join(outDir, `session-server-${triple}`);
	console.log(`Compiling sidecar ${target} -> ${outfile}`);
	await Bun.build({
		entrypoints: [entry],
		target,
		outfile: join(outDir, '.sidecar.tmp'),
		minify: true,
		compile: { assets }
	});
	const produced = await producedExecutable();
	renameSync(produced, outfile);
	console.log(`  done (${outfile})`);
}