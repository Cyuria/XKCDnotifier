const { app, BrowserWindow } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.maximize();
  win.loadFile('index.html');
};

const compareXKCD = latestComic => {
  if (!fs.existsSync(path.join(__dirname, 'lastComic.json'))) return true;

  const lastComic = JSON.parse(fs.readFileSync(path.join(__dirname, 'lastComic.json')));
  return latestComic.num !== lastComic.num;
};

const loadIfXKCD = () => {
  const options = {
    host: "xkcd.com",
    path: "/info.0.json"
  };

  https.request(options, res => {
    var out = '';
    res.on('data', chunk => { out += chunk; });
    res.on('end', () => {
      const latestComic = JSON.parse(out);
      if (compareXKCD(latestComic)) {
        fs.writeFileSync(path.join(__dirname, 'lastComic.json'), JSON.stringify(latestComic));
        createWindow();
      } else app.quit();
    });
  }).end();
}

app.whenReady().then(() => {
  
  loadIfXKCD();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Check when all windows have been closed
app.on('window-all-closed', () => {
  // Quit if not on MacOS
  if (process.platform !== 'darwin') app.quit();
});


