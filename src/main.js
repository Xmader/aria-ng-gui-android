/**
 * AriaNg GUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018-2021 Xmader. All Rights Reserved.
 * @license MIT
 */

// 输出版权信息
console.info(`AriaNg GUI for Android

Copyright (c) 2018-2021 Xmader
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
 * 如果文件已存在, 则自动覆盖
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

/**
 * 判断文件或目录是否存在
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const fileOrDirExistsPromise = (filePath) => {
    return new Promise((resolve) => {
        const successCallback = () => resolve(true)
        const errorCallback = (e) => {
            if (e.code == 1) { // 文件或目录不存在 FileError.NOT_FOUND_ERR
                resolve(false)
            } else { // 其它错误
                resolve(true)
            }
        }

        window.resolveLocalFileSystemURL(filePath, successCallback, errorCallback)
    })
}

/**
 * 从一个文件路径获取文件名
 * @param {string} filePath 
 */
const getFileName = (filePath) => {
    return filePath.split("/").pop()
}

/**
 * 把全部给定的路径片段连接到一起
 * @param {...string} paths 
 */
const joinPath = (...paths) => {
    return paths.join("/").replace(/([^:])\/{3,}|([^/:])\/{2}/g, "$1$2/")
}

/**
 * 手动请求 android.permission.WRITE_EXTERNAL_STORAGE 权限 
 * @returns {Promise<boolean>}
 */
const requestWriteExternalStoragePermission = async () => {

    // @ts-ignore
    const permissions = window.cordova.plugins.permissions
    const name = permissions.WRITE_EXTERNAL_STORAGE

    return new Promise((resolve, reject) => {
        permissions.requestPermission(name, (result) => {
            if (result && result.hasPermission) {
                resolve(true)
            } else {
                reject(false)
            }
        }, (err) => {
            reject(err)
        })
    })

}

/**
 * 获取文件/目录 Entry
 * @param {string} path 文件路径
 * @returns {Promise<Entry>}
 */
const getEntry = (path) => {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(path, resolve, reject)
    })
}

/**
 * 写入文件
 * @param {FileEntry} entry 
 * @param {BlobPart} data 文件内容
 */
const writeFileEntry = (entry, data) => {
    return new Promise((resolve, reject) => {
        entry.createWriter((fileWriter) => {
            fileWriter.onwriteend = () => resolve()
            fileWriter.onerror = reject
            const blob = new Blob([data])
            fileWriter.write(blob)
        })
    })
}

/**
 * 读取文件
 * @param {FileEntry} entry
 * @returns {Promise<string>}
 */
const readFileEntry = async (entry) => {
    return new Promise((resolve, reject) => {
        const errorCallback = reject
        entry.file((file) => {
            const reader = new FileReader()
            reader.onloadend = function () {
                resolve(this.result)
            }
            reader.readAsText(file)
        }, errorCallback)
    })
}

/**
 * 后台运行
 * https://github.com/katzer/cordova-plugin-background-mode
 */
const enableBgMode = () => {
    const cordova = top.cordova
    cordova.plugins.backgroundMode.enable()
    cordova.plugins.backgroundMode.overrideBackButton()
    cordova.plugins.backgroundMode.disableBatteryOptimizations()
    cordova.plugins.backgroundMode.setDefaults({ hidden: false })
    cordova.plugins.backgroundMode.on("activate", () => {
        cordova.plugins.backgroundMode.disableWebViewOptimizations()
    })
}

// 等待 Cordova 完全加载
document.addEventListener("deviceready", async function () {
    const appDir = top.cordova.file.applicationDirectory
    const dataDir = top.cordova.file.dataDirectory

    const aria2FileURL = appDir + "www/aria2/android/aria2c"
    const aria2ConfFileURL = appDir + "www/aria2/aria2.conf"
    const downloadDir = "/storage/emulated/0/Download/"

    // 显示 AriaNg GUI for Android 的版本号
    const appVersion = await top.cordova.getAppVersion.getVersionNumber()
    const logoDiv = document.getElementById("aria-ng-logo")
    logoDiv.title = `AriaNg GUI for Android v${appVersion} | ${logoDiv.title}`

    // const savedAppVersion = localStorage.getItem("appVersion")
    // console.log(savedAppVersion)
    // if (appVersion != savedAppVersion || !(await fileOrDirExistsPromise(dataDir + "aria2c"))) {
    //     top.localStorage.setItem("appVersion", appVersion)
    // }

    // 手动请求 存储空间读写 的权限
    await requestWriteExternalStoragePermission()

    // 仅当aria2.conf文件不存在时复制aria2.conf, 防止配置文件被覆盖
    if (!await fileOrDirExistsPromise(dataDir + "aria2.conf")) {
        await copyFilePromise(aria2ConfFileURL, dataDir)
    }

    // 复制aria2c
    const copiedFileEntry = await copyFilePromise(aria2FileURL, dataDir)

    // 获取复制到的文件路径
    const copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "")
    const copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf")

    // 支持保存配置修改到 aria2.conf 配置文件
    const confFileEntry = await getEntry("file://" + copiedAria2ConfFileURL)
    let conf = ""
    const saveLocalConfig = async (options) => {
        if (!conf) {
            conf = await readFileEntry(confFileEntry)
        }

        Object.entries(options).forEach(([key, value]) => {
            const r = new RegExp(`^(?:#\\s*)?(${key}=).*`, "m")
            if (r.test(conf)) {
                conf = conf.replace(
                    r,
                    "$1" + value
                )
            } else {
                conf += `\n${key}=${value}`
            }
        })

        await writeFileEntry(confFileEntry, conf)
    }
    window.saveLocalConfig = saveLocalConfig

    // 运行aria2c前的准备工作
    // 1. 创建aria2.session会话文件
    await shellExecPromise(["touch", downloadDir + "aria2.session"])
    // 2. 让aria2c可执行文件有运行权限
    await shellExecPromise(["chmod", "0777", copiedAria2FileURL])

    // 让程序在后台运行，以及添加运行通知
    enableBgMode()

    // 创建因为端口被占用而运行失败的次数的计数器
    let n = 0

    // 在aria2c异常关闭后自动重启aria2c
    while (true) {
        try {
            // 运行aria2c
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
}, false)
