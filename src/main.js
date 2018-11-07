/**
 * AriaNgGUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018 Xmader. All Rights Reserved.
 * @license MIT
 * 
 * 仅支持 Android 4.4.3+ (因为 Android 4.4.3 以下的Webview不支持Promise)
 */

const shellExecPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        window.ShellExec.exec(cmd, (res) => {
            console.log('exit status: ' + res.exitStatus)
            console.log('cmd output: ' + res.output)

            if (res.exitStatus == 0) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}

const copyFilePromise = () => {

}


document.addEventListener('deviceready', function () {
    const aria2FileURL = cordova.file.applicationDirectory + "www/aria2/android/aria2c"
    const aria2ConfFileURL = cordova.file.applicationDirectory + "www/aria2/aria2.conf"

    const successCallback = async function (copiedFileEntry) {
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
