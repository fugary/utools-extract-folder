window.onload = function () {
    Vue.createApp({
        data() {
            return {
                filesData: [],
                folderName: '',
                releaseSubFolders: true,
                renameDuplicateFiles: true,
                renameAllFiles: false
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