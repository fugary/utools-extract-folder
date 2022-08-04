window.onload = function () {
    Vue.createApp({
        data() {
            return {
                filesData: [],
                folderName: '',
                releaseSubFolders: true,
                renameDuplicateFiles: true
            }
        },
        methods: {
            clearFileNames() {
                this.filesData = [];
                this.folderName = '';
                this.releaseSubFolders = true;
                this.renameDuplicateFiles = true;
            },
            releaseFolderFile() {
                window.releaseFolderFile(this.filesData, this.folderName, this.releaseSubFolders, this.renameDuplicateFiles);
                utools.showNotification('文件夹解散完成');
                this.clearFileNames();
            },
            removeFileFromList(file) {
                const idx = this.filesData.indexOf(file);
                this.filesData.splice(idx, 1);
            }
        },
        mounted() {
            utools.onPluginEnter(({ code, type, payload, optional }) => {
                console.log('用户进入插件', code, type, payload)
                if (type === "files") {
                    this.filesData = payload || []
                }
                document.documentElement.className = utools.isDarkColors() ? 'dark' : ''
            });
        }
    }).mount("#app");
}