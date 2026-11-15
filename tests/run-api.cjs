const { spawn, spawnSync } = require('node:child_process');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { once } = require('node:events');

const backend = resolve(__dirname, '../backend');
const directory = mkdtempSync(join(tmpdir(), 'focusflow-test-'));
const env = {
  ...process.env,
  DATABASE_URL: 'file:' + join(directory, 'tests.db').replaceAll('\\', '/'),
  PORT: process.env.TEST_API_PORT || '3191',
};
env.API_URL = `http://127.0.0.1:${env.PORT}/tasks`;

function run(args, cwd = backend) {
  const result = spawnSync(process.execPath, args, { cwd, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command failed: ${args.join(' ')}`);
}

async function main() {
  let server;
  try {
    run(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
    server = spawn(process.execPath, ['dist/main.js'], { cwd: backend, env, stdio: 'inherit' });
    let ready = false;
    for (let attempt = 0; attempt < 50 && server.exitCode === null; attempt++) {
      const response = await fetch(env.API_URL).catch(() => undefined);
      if (response?.ok) {
        ready = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!ready) throw new Error('Test API did not start.');
    run(['api.cjs'], __dirname);
    run(['--test', 'task-contract.cjs'], __dirname);
  } finally {
    if (server?.pid && server.exitCode === null) {
      const exit = once(server, 'exit');
      server.kill();
      await exit;
    }
    rmSync(directory, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
