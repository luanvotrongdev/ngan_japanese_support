import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyMigrations } from '../src/lib/server/db/migrations';

process.on('uncaughtException', (err) => {
	process.stderr.write(`uncaughtException: ${err.stack ?? err.message}\n`);
});
process.on('unhandledRejection', (err) => {
	process.stderr.write(`unhandledRejection: ${String(err)}\n`);
});

const base = dirname(fileURLToPath(import.meta.url));
const migrationsFolder =
	[join(base, '..', 'drizzle'), join(base, 'drizzle')].find((candidate) => existsSync(candidate)) ??
	join(base, 'drizzle');

try {
	applyMigrations(migrationsFolder);
} catch (error) {
	process.stderr.write(`Migration failed: ${String(error)}\n`);
	process.exit(1);
}

const server = http.createServer();

const host = process.env.HOST ?? '127.0.0.1';
server.listen({ host, port: 0 }, async () => {
	try {
		const { port } = server.address() as AddressInfo;
		process.env.ORIGIN = `http://${host}:${port}`;
		const { handler } = await import('../build/handler.js');
		server.on('request', (req, res) => {
			handler(req, res, () => {
				res.statusCode = 404;
				res.end('Not found');
			});
		});
		process.stdout.write(`READY ${port}\n`);
	} catch (error) {
		process.stderr.write(`Handler init failed: ${error.stack ?? String(error)}\n`);
		process.exit(1);
	}
});