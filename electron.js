const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let phpProcess;
let viteProcess;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    titleBarStyle: 'default',
    show: false
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('http://localhost:8000');
  }
};

const startLaravelServer = () => {
  return new Promise((resolve, reject) => {
    // Copy .env.desktop to .env for production
    if (!isDev) {
      const fs = require('fs');
      const path = require('path');
      try {
        fs.copyFileSync(
          path.join(__dirname, '.env.desktop'),
          path.join(__dirname, '.env')
        );
      } catch (error) {
        console.log('Warning: Could not copy .env.desktop to .env');
      }
    }

    phpProcess = spawn('php', ['artisan', 'serve', '--port=8000'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    phpProcess.stdout.on('data', (data) => {
      console.log(`PHP: ${data}`);
      if (data.toString().includes('started')) {
        resolve();
      }
    });

    phpProcess.stderr.on('data', (data) => {
      console.error(`PHP Error: ${data}`);
    });

    phpProcess.on('close', (code) => {
      console.log(`PHP process exited with code ${code}`);
    });

    // Resolve after a short delay as fallback
    setTimeout(resolve, 3000);
  });
};

const startViteServer = () => {
  if (isDev) {
    return new Promise((resolve) => {
      viteProcess = spawn('npm', ['run', 'dev'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      viteProcess.stdout.on('data', (data) => {
        console.log(`Vite: ${data}`);
      });

      viteProcess.stderr.on('data', (data) => {
        console.error(`Vite Error: ${data}`);
      });

      // Give vite some time to start
      setTimeout(resolve, 5000);
    });
  } else {
    // In production, assets are already built
    return Promise.resolve();
  }
};

app.whenReady().then(async () => {
  try {
    console.log('Starting Laravel server...');
    await startLaravelServer();
    
    console.log('Starting Vite server...');
    await startViteServer();
    
    console.log('Waiting for servers to be ready...');
    await waitOn({ resources: ['http://localhost:8000'], timeout: 30000 });
    
    console.log('Creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to start servers:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill PHP and Vite processes
  if (phpProcess) {
    phpProcess.kill('SIGTERM');
  }
  if (viteProcess) {
    viteProcess.kill('SIGTERM');
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill PHP and Vite processes
  if (phpProcess) {
    phpProcess.kill('SIGTERM');
  }
  if (viteProcess) {
    viteProcess.kill('SIGTERM');
  }
});

