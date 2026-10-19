import { spawn } from 'child_process';

console.log('🚀 Starting Fine Gift Studio Backend + Frontend Dev Servers...\n');

// 1. Start Backend API Server
const serverProcess = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Frontend
const viteProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  try {
    serverProcess.kill();
  } catch {}
  try {
    viteProcess.kill();
  } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
