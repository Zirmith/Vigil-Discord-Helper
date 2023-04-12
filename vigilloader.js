const vigi_infotext = document.getElementById('vigi_infotext');
const {ipcRenderer} = require('electron')

setTimeout(() => {
    vigi_infotext.innerHTML = 'Checking For Updates...';
    setTimeout(() => {
        ipcRenderer.send('vigil', {method: "checkforupdates"});
    }, 1000);
}, 6000);



ipcRenderer.on('update-available', (event, message) => {
  // Handle update available
  vigi_infotext.innerText = 'Update available downloading!';
});

ipcRenderer.on('update-not-available', (event, message) => {
  // Handle update not available
  vigi_infotext.innerText = 'No update available.';
});
