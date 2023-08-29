window.onload = function () {
    const OPTIONS_KEY = 'releaseFolderOptions';
    Vue.createApp({
        data() {
            let releaseSubFolders = true;
            let renameDuplicateFiles = true;
            let renameAllFiles = false;
            const options = utools.dbStorage.getItem(OPTIONS_KEY);
            if (options) {
                releaseSubFolders = options.releaseSubFolders;
                renameDuplicateFiles = options.renameDuplicateFiles;
                renameAllFiles = options.renameAllFiles;
            }
            return {
                filesData: [],
                folderName: '',
                releaseSubFolders,
                renameDuplicateFiles,
                renameAllFiles
            }
        },
        computed: {
            releaseOptions({releaseSubFolders, renameDuplicateFiles, renameAllFiles}) {
                return {
                    releaseSubFolders,
                    renameDuplicateFiles,
                    renameAllFiles
                }
            }
        },
        watch: {
            releaseOptions() {
                this.saveOptions()
            }
        },
        methods: {
            clearFileNames() {
                this.filesData = [];
                this.folderName = '';
                this.releaseSubFolders = true;
                this.renameDuplicateFiles = true;
                this.renameAllFiles = false;
            },
            releaseFolderFile() {
                window.releaseFolderFile(this.filesData, this.folderName, this.releaseSubFolders, this.renameDuplicateFiles, this.renameAllFiles);
                utools.showNotification('文件夹解散完成');
                this.clearFileNames();
                utools.outPlugin();
                utools.hideMainWindow();
            },
            saveOptions() {
                const {releaseSubFolders, renameDuplicateFiles, renameAllFiles} = this
                utools.dbStorage.setItem(OPTIONS_KEY, {
                    releaseSubFolders,
                    renameDuplicateFiles,
                    renameAllFiles
                })
            },
            removeFileFromList(file) {
                const idx = this.filesData.indexOf(file);
                this.filesData.splice(idx, 1);
            }
        },
        mounted() {
            document.documentElement.className = utools.isDarkColors() ? 'dark' : ''
            utools.onPluginEnter(({ code, type, payload, optional }) => {
                console.log('用户进入插件', code, type, payload)
                if (type === "files") {
                    this.filesData = payload || []
                }
            });
        }
    }).mount("#app");
}