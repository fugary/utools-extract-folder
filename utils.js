const fs = require('fs');
const path = require('path');

function readDirFiles(file) {
    const subFileNames = fs.readdirSync(file.path);
    const subFiles = subFileNames.map(subFileName => {
        const subPath = path.join(file.path, subFileName);
        const stat = fs.statSync(subPath);
        return {
            name: subFileName,
            path: subPath,
            isDirectory: stat.isDirectory(),
            isFile: stat.isFile()
        }
    })
    return subFiles;
}

function toAbsoluteDir(dir, filePath) {
    dir = dir.trim();
    if (!path.isAbsolute(dir)) {
        dir = path.join(path.resolve(filePath, '..'), dir);
    }
    return dir;
}

const moveOrCopyFile = function (files, dir, copy, checkFileFunc) {
    // 如果不是绝对路径，根据文件转换成绝对路径
    dir = toAbsoluteDir(dir, files[0].path);
    files.forEach(file => {
        if (checkFileFunc && !checkFileFunc(file)) {
            return;
        }
        if (file.isDirectory) {
            const subFiles = readDirFiles(file);
            moveOrCopyFile(subFiles, path.join(dir, file.name), copy);
            if (!subFiles.length) { // 空文件夹没有复制和移动的问题
                fs.mkdirSync(path.join(dir, file.name), {recursive: true});
            }
            if (!copy) { // 处理移动完还有个文件夹残留问题
                fs.rmdirSync(file.path);
            }
        } else {
            if (copy) {
                customCopyFile(file.path, path.join(dir, file.name));
            } else {
                customMoveFile(file.path, path.join(dir, file.name));
            }
        }
    });
};

const releaseFolderFile = function (folders, dir, releaseSubFolders, renameDuplicateFiles) {
    // 如果不是绝对路径，根据文件转换成绝对路径
    dir = toAbsoluteDir(dir, folders[0].path);
    folders.forEach(file => {
        if (file.isDirectory) {
            const subFiles = readDirFiles(file);
            subFiles.filter(subFile => subFile.isFile).forEach(subFile => {
                if(renameDuplicateFiles){
                    customCheckAndMoveFile(subFile.path, path.join(dir, subFile.name));
                } else {
                    customMoveFile(subFile.path, path.join(dir, subFile.name));
                }
            });
            const subFolders = subFiles.filter(subFile => subFile.isDirectory);
            if (subFolders.length) {
                if (releaseSubFolders) {
                    releaseFolderFile(subFolders, dir);
                } else {
                    moveOrCopyFile(subFolders, dir);
                }
            }
            fs.rmdirSync(file.path);
        }
    });
}

const customCheckAndMoveFile = function (fromPath, toPath) {
    if (fs.existsSync(toPath)) {
        const pathInfo = path.parse(toPath);
        toPath = path.join(pathInfo.dir, pathInfo.name + '__extracted' + pathInfo.ext)
        customCheckAndMoveFile(fromPath, toPath);
    } else {
        customMoveFile(fromPath, toPath);
    }
}

const customMoveFile = function (fromPath, toPath) {
    fs.mkdirSync(path.resolve(toPath, '..'), {recursive: true});
    try {
        fs.renameSync(fromPath, toPath);
    } catch (e) {
        utools.showNotification('不支持跨盘移动文件，请使用复制方式');
        throw e;
    }
}

const customCopyFile = function (fromPath, toPath) {
    fs.mkdirSync(path.resolve(toPath, '..'), {recursive: true});
    fs.copyFileSync(fromPath, toPath);
}

module.exports = {
    moveOrCopyFile,
    customMoveFile,
    customCopyFile,
    releaseFolderFile
}