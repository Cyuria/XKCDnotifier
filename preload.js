window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  fetch('./lastComic.json').then(res => { return res.json(); }).then(xkcdData => {
    document.querySelector('.heading').innerText = xkcdData.safe_title;
    document.querySelector('.comic').src = xkcdData.img;
    document.querySelector('.alt').innerText = xkcdData.alt;
  });
});

