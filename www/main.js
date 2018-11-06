
document.addEventListener('deviceready', function () {
    const aria2FileURL = cordova.file.applicationDirectory + "www/aria2/android/aria2c"
    const aria2ConfFileURL = cordova.file.applicationDirectory + "www/aria2/aria2.conf"

    const successCallback = function (copiedFileEntry) {
        const copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "")
        const copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf")
        // console.log(copiedAria2FileURL)
        // console.log(copiedAria2ConfFileURL)

        window.ShellExec.exec(["chmod", "0777", copiedAria2FileURL], function (res) {
            console.log('exit status: ' + res.exitStatus)
            console.log('cmd output: ' + res.output)
        })
        window.ShellExec.exec([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL], function (res) {
            console.log('exit status: ' + res.exitStatus)
            console.log('cmd output: ' + res.output)
        })

    }
    const errorCallback = function (e) { console.error(e) }

    // 复制aria2.conf
    window.resolveLocalFileSystemURL(aria2ConfFileURL, function (fileEntry) {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            fileEntry.copyTo(dirEntry, fileEntry.name, function () { }, errorCallback);
        })
    }, errorCallback)

    // 复制aria2c
    window.resolveLocalFileSystemURL(aria2FileURL, function (fileEntry) {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            fileEntry.copyTo(dirEntry, fileEntry.name, successCallback, errorCallback);
        })
    }, errorCallback)

}, false);
