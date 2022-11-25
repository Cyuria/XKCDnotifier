# The XKCD Notifier

## What is it?

The xkcd notifier automatically pulls up the most recent xkcd comic, if it hasn't already been shown.

## Futher setup

You can setup the XKCD notifier to run on a schedule using crontab in linux or task scheduler in windows.
This is the intended use, I personally have it run upon login.

## How to build

You need nodejs and electron.
Start by installing electron in the main directory, then electron-forge etc.
Better instructions can be found [on the electron site](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app#setting-up-your-project).

Then just run `npm run make` and wait for it to finish.

