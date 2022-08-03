const { moveOrCopyFile, customCopyFile, customMoveFile, releaseFolderFile } = require('./utils')
const electron = require('electron')
window.electron = electron;

window.moveOrCopyFile = moveOrCopyFile;
window.customMoveFile = customMoveFile;
window.customCopyFile = customCopyFile;
window.releaseFolderFile = releaseFolderFile;

