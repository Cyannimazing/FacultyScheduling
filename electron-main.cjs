const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let phpProcess;
let viteProcess;

// Simple function to wait for server to be ready
const waitForServer = (url, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkServer = () => {
      const req = http.get(url, (res) => {
        console.log(`Server responded with status: ${res.statusCode}`);
        resolve();
      });
      
      req.on('error', (error) => {
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Server not ready after ${timeout}ms`));
        } else {
          console.log('Server not ready yet, retrying...');
          setTimeout(checkServer, 1000);
        }
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Server not ready after ${timeout}ms`));
        } else {
          setTimeout(checkServer, 1000);
        }
      });
    };
    
    checkServer();
  });
};

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
    titleBarStyle: 'default',
    show: false,
    title: 'Desktop Schedule'
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
      try {
        fs.copyFileSync(
          path.join(__dirname, '.env.desktop'),
          path.join(__dirname, '.env')
        );
        console.log('Copied .env.desktop to .env');
      } catch (error) {
        console.log('Warning: Could not copy .env.desktop to .env:', error.message);
      }
    }

    // Try to use bundled PHP first, fallback to system PHP
    let phpExecutable = 'php';
    const bundledPhpPath = path.join(__dirname, 'php-portable', 'php.exe');
    
    if (fs.existsSync(bundledPhpPath)) {
      phpExecutable = bundledPhpPath;
      console.log('Using bundled PHP:', phpExecutable);
    } else {
      console.log('Using system PHP (bundled PHP not found)');
    }

    const phpArgs = ['artisan', 'serve', '--port=8000', '--host=127.0.0.1'];
    console.log('Starting PHP server with:', phpExecutable, phpArgs);
    
    phpProcess = spawn(phpExecutable, phpArgs, {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    phpProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`PHP: ${output}`);
      if (output.includes('started') || output.includes('Development Server')) {
        resolve();
      }
    });

    phpProcess.stderr.on('data', (data) => {
      console.error(`PHP Error: ${data}`);
    });

    phpProcess.on('close', (code) => {
      console.log(`PHP process exited with code ${code}`);
    });

    phpProcess.on('error', (error) => {
      console.error('Failed to start PHP process:', error);
      reject(error);
    });

    // Resolve after a delay as fallback
    setTimeout(() => {
      console.log('PHP server should be ready (timeout)');
      resolve();
    }, 5000);
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
    console.log('Desktop Schedule starting up...');
    console.log('Development mode:', isDev);
    
    console.log('Starting Laravel server...');
    await startLaravelServer();
    
    if (isDev) {
      console.log('Starting Vite server...');
      await startViteServer();
    }
    
    console.log('Waiting for servers to be ready...');
    await waitForServer('http://localhost:8000', 30000);
    
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

