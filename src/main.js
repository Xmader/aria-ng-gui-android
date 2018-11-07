/**
 * AriaNgGUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018 Xmader. All Rights Reserved.
 * @license MIT
 */

// 输出版权信息
console.info(`AriaNgGUI for Android

Copyright (c) 2018 Xmader
Released under the MIT license

Source Code: https://github.com/Xmader/aria-ng-gui-android/
`)

/**
 * 运行一个 shell 子进程并在 shell 上运行命令
 * @param {string | string[]} cmd 
 * @returns {Promise<{ exitStatus: number; output: string; }>}
 */
const shellExecPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        window.ShellExec.exec(cmd, (res) => {
            if (res.exitStatus == 0) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * 复制文件
 * @param {string} srcPath 源文件路径
 * @param {string} destDir 目标目录
 * @param {string=} destFileName 目标文件名 (如果留空, 则不改变文件名)
 * @returns {Promise<Entry>}
 */
const copyFilePromise = (srcPath, destDir, destFileName = null) => {
    return new Promise((resolve, reject) => {
        const successCallback = (entry) => resolve(entry)
        const errorCallback = (e) => reject(e)

        window.resolveLocalFileSystemURL(srcPath, function (fileEntry) {
            window.resolveLocalFileSystemURL(destDir, function (dirEntry) {
                fileEntry.copyTo(dirEntry, destFileName || fileEntry.name, successCallback, errorCallback)
            })
        }, errorCallback)
    })
}


document.addEventListener("deviceready", async function () {
    const aria2FileURL = cordova.file.applicationDirectory + "www/aria2/android/aria2c"
    const aria2ConfFileURL = cordova.file.applicationDirectory + "www/aria2/aria2.conf"
    const downloadDir = "/storage/emulated/0/Download/"

    const successCallback = async function (copiedFileEntry) {
        const copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "")
        const copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf")

        await shellExecPromise(["touch", downloadDir + "aria2.session"])
        await shellExecPromise(["chmod", "0777", copiedAria2FileURL])

        let n = 0

        // 在aria2c异常关闭后自动重启aria2c
        while (true) {
            try {
                const res = await shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL])
                console.log(res.output)

                // 被手动关闭时取消自动重启aria2c
                if (res.output.includes("second(s) has passed. Stopping application.")) {
                    break;
                }
            } catch (res) {
                console.log(res.output)

                // 端口被占用达到一定次数后时取消自动重启aria2c
                if (res.output.includes("Failed to bind a socket, cause: Address already in use")) {
                    if (n > 5) {
                        break;
                    } else {
                        n++
                    }
                }
            }
        }

    }

    // 复制aria2.conf
    await copyFilePromise(aria2ConfFileURL, cordova.file.dataDirectory)

    // 复制aria2c
    const copiedFileEntry = await copyFilePromise(aria2FileURL, cordova.file.dataDirectory)
    successCallback(copiedFileEntry)
}, false)
