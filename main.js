const { app, BrowserWindow } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Create sleep helper function
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

// Create function to check if xkcd.com is available
const xkcdCheckAccess = () => {
  const options = {
    host: "xkcd.com",
    path: "/info.0.json"
  };
  return new Promise((resolve, reject) => {
    const request = https.get(options, response => {
      resolve(true);
    });
    request.on("error", err => {
      resolve(false);
    });
  });
};

// Function to load electron window
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //fullscreen: true, // Uncomment to enable fullscreen window
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.maximize();
  win.loadFile('index.html');
};

// Function to check if the latest xkcd comic has been displayed
const compareXKCD = latestComic => {
  if (!fs.existsSync(path.join(__dirname, 'lastComic.json'))) return true;

  const lastComic = JSON.parse(fs.readFileSync(path.join(__dirname, 'lastComic.json')));
  return latestComic.num !== lastComic.num;
};

// Function to load window if new xkcd comic available
const loadIfXKCD = () => {
  const options = {
    host: "xkcd.com",
    path: "/info.0.json"
  };

  // Get the latest xkcd comic
  https.request(options, res => {
    var out = '';
    res.on('data', chunk => { out += chunk; });
    res.on('end', () => {
      // Check if it is a different comic
      const latestComic = JSON.parse(out);
      if (compareXKCD(latestComic)) {
        // Write the new comic data to a file
        fs.writeFileSync(path.join(__dirname, 'lastComic.json'), JSON.stringify(latestComic));
        // Create the electron window
        createWindow();
      }
      // Otherwise stop running
      else app.quit();
    });
  }).end();
};

// Function to wait until xkcd.com is available
const waitUntilConnection = async () => {
  // Check if xkcd.com is unavailable
  while (!(await xkcdCheckAccess())) {
    // Wait ten seconds before checking again
    await sleep(10000);
  }

  // Run main window loading functions
  loadIfXKCD();
  // MacOS stuff
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

};

app.whenReady().then(waitUntilConnection);

// Check when all windows have been closed
app.on('window-all-closed', () => {
  // Quit if not on MacOS
  if (process.platform !== 'darwin') app.quit();
});


