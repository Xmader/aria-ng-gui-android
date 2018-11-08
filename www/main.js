"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * AriaNg GUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018 Xmader. All Rights Reserved.
 * @license MIT
 */
// 输出版权信息
console.info("AriaNg GUI for Android\n\nCopyright (c) 2018 Xmader\nReleased under the MIT license\n\nSource Code: https://github.com/Xmader/aria-ng-gui-android/\n");
/**
 * 运行一个 shell 子进程并在 shell 上运行命令
 * @param {string | string[]} cmd 
 * @returns {Promise<{ exitStatus: number; output: string; }>}
 */

var shellExecPromise = function shellExecPromise(cmd) {
  return new Promise(function (resolve, reject) {
    window.ShellExec.exec(cmd, function (res) {
      if (res.exitStatus == 0) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
};
/**
 * 复制文件
 * 如果文件已存在, 则自动覆盖
 * @param {string} srcPath 源文件路径
 * @param {string} destDir 目标目录
 * @param {string=} destFileName 目标文件名 (如果留空, 则不改变文件名)
 * @returns {Promise<Entry>}
 */


var copyFilePromise = function copyFilePromise(srcPath, destDir) {
  var destFileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return new Promise(function (resolve, reject) {
    var successCallback = function successCallback(entry) {
      return resolve(entry);
    };

    var errorCallback = function errorCallback(e) {
      return reject(e);
    };

    window.resolveLocalFileSystemURL(srcPath, function (fileEntry) {
      window.resolveLocalFileSystemURL(destDir, function (dirEntry) {
        fileEntry.copyTo(dirEntry, destFileName || fileEntry.name, successCallback, errorCallback);
      });
    }, errorCallback);
  });
};
/**
 * 判断文件或目录是否存在
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */


var fileOrDirExistsPromise = function fileOrDirExistsPromise(filePath) {
  return new Promise(function (resolve) {
    var successCallback = function successCallback() {
      return resolve(true);
    };

    var errorCallback = function errorCallback(e) {
      if (e.code == 1) {
        // 文件或目录不存在 FileError.NOT_FOUND_ERR
        resolve(false);
      } else {
        // 其它错误
        resolve(true);
      }
    };

    window.resolveLocalFileSystemURL(filePath, successCallback, errorCallback);
  });
};
/**
 * 从一个文件路径获取文件名
 * @param {string} filePath 
 */


var getFileName = function getFileName(filePath) {
  return filePath.split("/").pop();
};
/**
 * 把全部给定的路径片段连接到一起
 * @param {...string} paths 
 */


var joinPath = function joinPath() {
  for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  return paths.join("/").replace(/([^:])\/{3,}|([^/:])\/{2}/g, "$1$2/");
}; // 等待 Cordova 完全加载


document.addEventListener("deviceready",
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var appDir, dataDir, aria2FileURL, aria2ConfFileURL, downloadDir, appVersion, logoDiv, copiedFileEntry, copiedAria2FileURL, copiedAria2ConfFileURL, n, res;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          appDir = top.cordova.file.applicationDirectory;
          dataDir = top.cordova.file.dataDirectory;
          aria2FileURL = appDir + "www/aria2/android/aria2c";
          aria2ConfFileURL = appDir + "www/aria2/aria2.conf";
          downloadDir = "/storage/emulated/0/Download/"; // 显示 AriaNg GUI for Android 的版本号

          _context.next = 7;
          return top.cordova.getAppVersion.getVersionNumber();

        case 7:
          appVersion = _context.sent;
          logoDiv = document.getElementById("aria-ng-logo");
          logoDiv.title = "AriaNg GUI for Android v".concat(appVersion, " | ").concat(logoDiv.title); // const savedAppVersion = localStorage.getItem("appVersion")
          // console.log(savedAppVersion)
          // if (appVersion != savedAppVersion || !(await fileOrDirExistsPromise(dataDir + "aria2c"))) {
          //     top.localStorage.setItem("appVersion", appVersion)
          // }
          // 仅当aria2.conf文件不存在时复制aria2.conf, 防止配置文件被覆盖

          _context.next = 12;
          return fileOrDirExistsPromise(dataDir + "aria2.conf");

        case 12:
          if (_context.sent) {
            _context.next = 15;
            break;
          }

          _context.next = 15;
          return copyFilePromise(aria2ConfFileURL, dataDir);

        case 15:
          _context.next = 17;
          return copyFilePromise(aria2FileURL, dataDir);

        case 17:
          copiedFileEntry = _context.sent;
          // 获取复制到的文件路径
          copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "");
          copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf"); // 运行aria2c前的准备工作
          // 1. 创建aria2.session会话文件

          _context.next = 22;
          return shellExecPromise(["touch", downloadDir + "aria2.session"]);

        case 22:
          _context.next = 24;
          return shellExecPromise(["chmod", "0777", copiedAria2FileURL]);

        case 24:
          // 创建因为端口被占用而运行失败的次数的计数器
          n = 0; // 在aria2c异常关闭后自动重启aria2c

        case 25:
          if (!true) {
            _context.next = 46;
            break;
          }

          _context.prev = 26;
          _context.next = 29;
          return shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL]);

        case 29:
          res = _context.sent;
          console.log(res.output); // 被手动关闭时取消自动重启aria2c

          if (!res.output.includes("second(s) has passed. Stopping application.")) {
            _context.next = 33;
            break;
          }

          return _context.abrupt("break", 46);

        case 33:
          _context.next = 44;
          break;

        case 35:
          _context.prev = 35;
          _context.t0 = _context["catch"](26);
          console.log(_context.t0.output); // 端口被占用达到一定次数后时取消自动重启aria2c

          if (!_context.t0.output.includes("Failed to bind a socket, cause: Address already in use")) {
            _context.next = 44;
            break;
          }

          if (!(n > 5)) {
            _context.next = 43;
            break;
          }

          return _context.abrupt("break", 46);

        case 43:
          n++;

        case 44:
          _context.next = 25;
          break;

        case 46:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[26, 35]]);
})), false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cm9pZFxyXG4gKiBAYXV0aG9yIFhtYWRlclxyXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxOCBYbWFkZXIuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqIEBsaWNlbnNlIE1JVFxyXG4gKi9cclxuXHJcbi8vIOi+k+WHuueJiOadg+S/oeaBr1xyXG5jb25zb2xlLmluZm8oYEFyaWFOZyBHVUkgZm9yIEFuZHJvaWRcclxuXHJcbkNvcHlyaWdodCAoYykgMjAxOCBYbWFkZXJcclxuUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcblxyXG5Tb3VyY2UgQ29kZTogaHR0cHM6Ly9naXRodWIuY29tL1htYWRlci9hcmlhLW5nLWd1aS1hbmRyb2lkL1xyXG5gKVxyXG5cclxuLyoqXHJcbiAqIOi/kOihjOS4gOS4qiBzaGVsbCDlrZDov5vnqIvlubblnKggc2hlbGwg5LiK6L+Q6KGM5ZG95LukXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW119IGNtZCBcclxuICogQHJldHVybnMge1Byb21pc2U8eyBleGl0U3RhdHVzOiBudW1iZXI7IG91dHB1dDogc3RyaW5nOyB9Pn1cclxuICovXHJcbmNvbnN0IHNoZWxsRXhlY1Byb21pc2UgPSAoY21kKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5TaGVsbEV4ZWMuZXhlYyhjbWQsIChyZXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlcy5leGl0U3RhdHVzID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5aSN5Yi25paH5Lu2XHJcbiAqIOWmguaenOaWh+S7tuW3suWtmOWcqCwg5YiZ6Ieq5Yqo6KaG55uWXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNQYXRoIOa6kOaWh+S7tui3r+W+hFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzdERpciDnm67moIfnm67lvZVcclxuICogQHBhcmFtIHtzdHJpbmc9fSBkZXN0RmlsZU5hbWUg55uu5qCH5paH5Lu25ZCNICjlpoLmnpznlZnnqbosIOWImeS4jeaUueWPmOaWh+S7tuWQjSlcclxuICogQHJldHVybnMge1Byb21pc2U8RW50cnk+fVxyXG4gKi9cclxuY29uc3QgY29weUZpbGVQcm9taXNlID0gKHNyY1BhdGgsIGRlc3REaXIsIGRlc3RGaWxlTmFtZSA9IG51bGwpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VjY2Vzc0NhbGxiYWNrID0gKGVudHJ5KSA9PiByZXNvbHZlKGVudHJ5KVxyXG4gICAgICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSAoZSkgPT4gcmVqZWN0KGUpXHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHNyY1BhdGgsIGZ1bmN0aW9uIChmaWxlRW50cnkpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZGVzdERpciwgZnVuY3Rpb24gKGRpckVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlRW50cnkuY29weVRvKGRpckVudHJ5LCBkZXN0RmlsZU5hbWUgfHwgZmlsZUVudHJ5Lm5hbWUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOWIpOaWreaWh+S7tuaIluebruW9leaYr+WQpuWtmOWcqFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcclxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAqL1xyXG5jb25zdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlID0gKGZpbGVQYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBzdWNjZXNzQ2FsbGJhY2sgPSAoKSA9PiByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT0gMSkgeyAvLyDmlofku7bmiJbnm67lvZXkuI3lrZjlnKggRmlsZUVycm9yLk5PVF9GT1VORF9FUlJcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIOWFtuWug+mUmeivr1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlUGF0aCwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOS7juS4gOS4quaWh+S7tui3r+W+hOiOt+WPluaWh+S7tuWQjVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggXHJcbiAqL1xyXG5jb25zdCBnZXRGaWxlTmFtZSA9IChmaWxlUGF0aCkgPT4ge1xyXG4gICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICog5oqK5YWo6YOo57uZ5a6a55qE6Lev5b6E54mH5q616L+e5o6l5Yiw5LiA6LW3XHJcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSBwYXRocyBcclxuICovXHJcbmNvbnN0IGpvaW5QYXRoID0gKC4uLnBhdGhzKSA9PiB7XHJcbiAgICByZXR1cm4gcGF0aHMuam9pbihcIi9cIikucmVwbGFjZSgvKFteOl0pXFwvezMsfXwoW14vOl0pXFwvezJ9L2csIFwiJDEkMi9cIilcclxufVxyXG5cclxuXHJcbi8vIOetieW+hSBDb3Jkb3ZhIOWujOWFqOWKoOi9vVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgYXBwRGlyID0gdG9wLmNvcmRvdmEuZmlsZS5hcHBsaWNhdGlvbkRpcmVjdG9yeVxyXG4gICAgY29uc3QgZGF0YURpciA9IHRvcC5jb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeVxyXG5cclxuICAgIGNvbnN0IGFyaWEyRmlsZVVSTCA9IGFwcERpciArIFwid3d3L2FyaWEyL2FuZHJvaWQvYXJpYTJjXCJcclxuICAgIGNvbnN0IGFyaWEyQ29uZkZpbGVVUkwgPSBhcHBEaXIgKyBcInd3dy9hcmlhMi9hcmlhMi5jb25mXCJcclxuICAgIGNvbnN0IGRvd25sb2FkRGlyID0gXCIvc3RvcmFnZS9lbXVsYXRlZC8wL0Rvd25sb2FkL1wiXHJcblxyXG4gICAgLy8g5pi+56S6IEFyaWFOZyBHVUkgZm9yIEFuZHJvaWQg55qE54mI5pys5Y+3XHJcbiAgICBjb25zdCBhcHBWZXJzaW9uID0gYXdhaXQgdG9wLmNvcmRvdmEuZ2V0QXBwVmVyc2lvbi5nZXRWZXJzaW9uTnVtYmVyKClcclxuICAgIGNvbnN0IGxvZ29EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyaWEtbmctbG9nb1wiKVxyXG4gICAgbG9nb0Rpdi50aXRsZSA9IGBBcmlhTmcgR1VJIGZvciBBbmRyb2lkIHYke2FwcFZlcnNpb259IHwgJHtsb2dvRGl2LnRpdGxlfWBcclxuXHJcbiAgICAvLyBjb25zdCBzYXZlZEFwcFZlcnNpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFwcFZlcnNpb25cIilcclxuICAgIC8vIGNvbnNvbGUubG9nKHNhdmVkQXBwVmVyc2lvbilcclxuICAgIC8vIGlmIChhcHBWZXJzaW9uICE9IHNhdmVkQXBwVmVyc2lvbiB8fCAhKGF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTJjXCIpKSkge1xyXG4gICAgLy8gICAgIHRvcC5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFwcFZlcnNpb25cIiwgYXBwVmVyc2lvbilcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyDku4XlvZNhcmlhMi5jb25m5paH5Lu25LiN5a2Y5Zyo5pe25aSN5Yi2YXJpYTIuY29uZiwg6Ziy5q2i6YWN572u5paH5Lu26KKr6KaG55uWXHJcbiAgICBpZiAoIWF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTIuY29uZlwiKSkge1xyXG4gICAgICAgIGF3YWl0IGNvcHlGaWxlUHJvbWlzZShhcmlhMkNvbmZGaWxlVVJMLCBkYXRhRGlyKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWkjeWItmFyaWEyY1xyXG4gICAgY29uc3QgY29waWVkRmlsZUVudHJ5ID0gYXdhaXQgY29weUZpbGVQcm9taXNlKGFyaWEyRmlsZVVSTCwgZGF0YURpcilcclxuXHJcbiAgICAvLyDojrflj5blpI3liLbliLDnmoTmlofku7bot6/lvoRcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyRmlsZVVSTCA9IGNvcGllZEZpbGVFbnRyeS5uYXRpdmVVUkwucmVwbGFjZShcImZpbGU6Ly9cIiwgXCJcIilcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyQ29uZkZpbGVVUkwgPSBjb3BpZWRBcmlhMkZpbGVVUkwucmVwbGFjZSgvXFwvYXJpYTJjJC8sIFwiL2FyaWEyLmNvbmZcIilcclxuXHJcbiAgICAvLyDov5DooYxhcmlhMmPliY3nmoTlh4blpIflt6XkvZxcclxuICAgIC8vIDEuIOWIm+W7umFyaWEyLnNlc3Npb27kvJror53mlofku7ZcclxuICAgIGF3YWl0IHNoZWxsRXhlY1Byb21pc2UoW1widG91Y2hcIiwgZG93bmxvYWREaXIgKyBcImFyaWEyLnNlc3Npb25cIl0pXHJcbiAgICAvLyAyLiDorqlhcmlhMmPlj6/miafooYzmlofku7bmnInov5DooYzmnYPpmZBcclxuICAgIGF3YWl0IHNoZWxsRXhlY1Byb21pc2UoW1wiY2htb2RcIiwgXCIwNzc3XCIsIGNvcGllZEFyaWEyRmlsZVVSTF0pXHJcblxyXG4gICAgLy8g5Yib5bu65Zug5Li656uv5Y+j6KKr5Y2g55So6ICM6L+Q6KGM5aSx6LSl55qE5qyh5pWw55qE6K6h5pWw5ZmoXHJcbiAgICBsZXQgbiA9IDBcclxuXHJcbiAgICAvLyDlnKhhcmlhMmPlvILluLjlhbPpl63lkI7oh6rliqjph43lkK9hcmlhMmNcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8g6L+Q6KGMYXJpYTJjXHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHNoZWxsRXhlY1Byb21pc2UoW2NvcGllZEFyaWEyRmlsZVVSTCwgXCItLWNvbmYtcGF0aD1cIiArIGNvcGllZEFyaWEyQ29uZkZpbGVVUkxdKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMub3V0cHV0KVxyXG5cclxuICAgICAgICAgICAgLy8g6KKr5omL5Yqo5YWz6Zet5pe25Y+W5raI6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICAgICAgICAgIGlmIChyZXMub3V0cHV0LmluY2x1ZGVzKFwic2Vjb25kKHMpIGhhcyBwYXNzZWQuIFN0b3BwaW5nIGFwcGxpY2F0aW9uLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChyZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLm91dHB1dClcclxuXHJcbiAgICAgICAgICAgIC8vIOerr+WPo+iiq+WNoOeUqOi+vuWIsOS4gOWumuasoeaVsOWQjuaXtuWPlua2iOiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgICAgICBpZiAocmVzLm91dHB1dC5pbmNsdWRlcyhcIkZhaWxlZCB0byBiaW5kIGEgc29ja2V0LCBjYXVzZTogQWRkcmVzcyBhbHJlYWR5IGluIHVzZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPiA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG4rK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCBmYWxzZSlcclxuIl19