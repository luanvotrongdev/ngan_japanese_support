import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const envPath = join(process.cwd(), 'build', 'env.js');
const original = readFileSync(envPath, 'utf-8');

const patched = original.replace(
	/const dir = path\.dirname\(fileURLToPath\(import\.meta\.url\)\);/,
	'const dir = path.resolve("build");'
);

if (patched === original) {
	console.error('patch-env: pattern not found in build/env.js — handler may already be patched');
	process.exit(0);
}

writeFileSync(envPath, patched);
console.log('patch-env: patched build/env.js to use process.cwd() for asset resolution');