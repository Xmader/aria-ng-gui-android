"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * AriaNg GUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018-2019 Xmader. All Rights Reserved.
 * @license MIT
 */
// 输出版权信息
console.info("AriaNg GUI for Android\n\nCopyright (c) 2018-2019 Xmader\nReleased under the MIT license\n\nSource Code: https://github.com/Xmader/aria-ng-gui-android/\n");
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
};
/**
 * 手动请求 android.permission.WRITE_EXTERNAL_STORAGE 权限 
 * @returns {Promise<boolean>}
 */


var requestWriteExternalStoragePermission =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var permissions, name;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // @ts-ignore
            permissions = window.cordova.plugins.permissions;
            name = permissions.WRITE_EXTERNAL_STORAGE;
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              permissions.requestPermission(name, function (result) {
                if (result && result.hasPermission) {
                  resolve(true);
                } else {
                  reject(false);
                }
              }, function (err) {
                reject(err);
              });
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function requestWriteExternalStoragePermission() {
    return _ref.apply(this, arguments);
  };
}(); // 等待 Cordova 完全加载


document.addEventListener("deviceready",
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var appDir, dataDir, aria2FileURL, aria2ConfFileURL, downloadDir, appVersion, logoDiv, copiedFileEntry, copiedAria2FileURL, copiedAria2ConfFileURL, n, res;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          appDir = top.cordova.file.applicationDirectory;
          dataDir = top.cordova.file.dataDirectory;
          aria2FileURL = appDir + "www/aria2/android/aria2c";
          aria2ConfFileURL = appDir + "www/aria2/aria2.conf";
          downloadDir = "/storage/emulated/0/Download/"; // 显示 AriaNg GUI for Android 的版本号

          _context2.next = 7;
          return top.cordova.getAppVersion.getVersionNumber();

        case 7:
          appVersion = _context2.sent;
          logoDiv = document.getElementById("aria-ng-logo");
          logoDiv.title = "AriaNg GUI for Android v".concat(appVersion, " | ").concat(logoDiv.title); // const savedAppVersion = localStorage.getItem("appVersion")
          // console.log(savedAppVersion)
          // if (appVersion != savedAppVersion || !(await fileOrDirExistsPromise(dataDir + "aria2c"))) {
          //     top.localStorage.setItem("appVersion", appVersion)
          // }
          // 手动请求 存储空间读写 的权限

          _context2.next = 12;
          return requestWriteExternalStoragePermission();

        case 12:
          _context2.next = 14;
          return fileOrDirExistsPromise(dataDir + "aria2.conf");

        case 14:
          if (_context2.sent) {
            _context2.next = 17;
            break;
          }

          _context2.next = 17;
          return copyFilePromise(aria2ConfFileURL, dataDir);

        case 17:
          _context2.next = 19;
          return copyFilePromise(aria2FileURL, dataDir);

        case 19:
          copiedFileEntry = _context2.sent;
          // 获取复制到的文件路径
          copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "");
          copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf"); // 运行aria2c前的准备工作
          // 1. 创建aria2.session会话文件

          _context2.next = 24;
          return shellExecPromise(["touch", downloadDir + "aria2.session"]);

        case 24:
          _context2.next = 26;
          return shellExecPromise(["chmod", "0777", copiedAria2FileURL]);

        case 26:
          // 创建因为端口被占用而运行失败的次数的计数器
          n = 0; // 在aria2c异常关闭后自动重启aria2c

        case 27:
          if (!true) {
            _context2.next = 48;
            break;
          }

          _context2.prev = 28;
          _context2.next = 31;
          return shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL]);

        case 31:
          res = _context2.sent;
          console.log(res.output); // 被手动关闭时取消自动重启aria2c

          if (!res.output.includes("second(s) has passed. Stopping application.")) {
            _context2.next = 35;
            break;
          }

          return _context2.abrupt("break", 48);

        case 35:
          _context2.next = 46;
          break;

        case 37:
          _context2.prev = 37;
          _context2.t0 = _context2["catch"](28);
          console.log(_context2.t0.output); // 端口被占用达到一定次数后时取消自动重启aria2c

          if (!_context2.t0.output.includes("Failed to bind a socket, cause: Address already in use")) {
            _context2.next = 46;
            break;
          }

          if (!(n > 5)) {
            _context2.next = 45;
            break;
          }

          return _context2.abrupt("break", 48);

        case 45:
          n++;

        case 46:
          _context2.next = 27;
          break;

        case 48:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[28, 37]]);
})), false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzhCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQkErQ1gsZ0JBQWdCLENBQUMsQ0FBQyxrQkFBRCxFQUFxQixpQkFBaUIsc0JBQXRDLENBQUQsQ0EvQ0w7O0FBQUE7QUErQ3ZCLFVBQUEsR0EvQ3VCO0FBZ0Q3QixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBRyxDQUFDLE1BQWhCLEVBaEQ2QixDQWtEN0I7O0FBbEQ2QixlQW1EekIsR0FBRyxDQUFDLE1BQUosQ0FBVyxRQUFYLENBQW9CLDZDQUFwQixDQW5EeUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQXVEN0IsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGFBQUksTUFBaEIsRUF2RDZCLENBeUQ3Qjs7QUF6RDZCLGVBMER6QixhQUFJLE1BQUosQ0FBVyxRQUFYLENBQW9CLHdEQUFwQixDQTFEeUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsZ0JBMkRyQixDQUFDLEdBQUcsQ0EzRGlCO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBOERyQixVQUFBLENBQUM7O0FBOURvQjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBekMsSUFtRUcsS0FuRUgiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBcmlhTmcgR1VJIGZvciBBbmRyb2lkXHJcbiAqIEBhdXRob3IgWG1hZGVyXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE4LTIwMTkgWG1hZGVyLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBAbGljZW5zZSBNSVRcclxuICovXHJcblxyXG4vLyDovpPlh7rniYjmnYPkv6Hmga9cclxuY29uc29sZS5pbmZvKGBBcmlhTmcgR1VJIGZvciBBbmRyb2lkXHJcblxyXG5Db3B5cmlnaHQgKGMpIDIwMTgtMjAxOSBYbWFkZXJcclxuUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcblxyXG5Tb3VyY2UgQ29kZTogaHR0cHM6Ly9naXRodWIuY29tL1htYWRlci9hcmlhLW5nLWd1aS1hbmRyb2lkL1xyXG5gKVxyXG5cclxuLyoqXHJcbiAqIOi/kOihjOS4gOS4qiBzaGVsbCDlrZDov5vnqIvlubblnKggc2hlbGwg5LiK6L+Q6KGM5ZG95LukXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW119IGNtZCBcclxuICogQHJldHVybnMge1Byb21pc2U8eyBleGl0U3RhdHVzOiBudW1iZXI7IG91dHB1dDogc3RyaW5nOyB9Pn1cclxuICovXHJcbmNvbnN0IHNoZWxsRXhlY1Byb21pc2UgPSAoY21kKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5TaGVsbEV4ZWMuZXhlYyhjbWQsIChyZXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlcy5leGl0U3RhdHVzID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5aSN5Yi25paH5Lu2XHJcbiAqIOWmguaenOaWh+S7tuW3suWtmOWcqCwg5YiZ6Ieq5Yqo6KaG55uWXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNQYXRoIOa6kOaWh+S7tui3r+W+hFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzdERpciDnm67moIfnm67lvZVcclxuICogQHBhcmFtIHtzdHJpbmc9fSBkZXN0RmlsZU5hbWUg55uu5qCH5paH5Lu25ZCNICjlpoLmnpznlZnnqbosIOWImeS4jeaUueWPmOaWh+S7tuWQjSlcclxuICogQHJldHVybnMge1Byb21pc2U8RW50cnk+fVxyXG4gKi9cclxuY29uc3QgY29weUZpbGVQcm9taXNlID0gKHNyY1BhdGgsIGRlc3REaXIsIGRlc3RGaWxlTmFtZSA9IG51bGwpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VjY2Vzc0NhbGxiYWNrID0gKGVudHJ5KSA9PiByZXNvbHZlKGVudHJ5KVxyXG4gICAgICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSAoZSkgPT4gcmVqZWN0KGUpXHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHNyY1BhdGgsIGZ1bmN0aW9uIChmaWxlRW50cnkpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZGVzdERpciwgZnVuY3Rpb24gKGRpckVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlRW50cnkuY29weVRvKGRpckVudHJ5LCBkZXN0RmlsZU5hbWUgfHwgZmlsZUVudHJ5Lm5hbWUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOWIpOaWreaWh+S7tuaIluebruW9leaYr+WQpuWtmOWcqFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcclxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAqL1xyXG5jb25zdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlID0gKGZpbGVQYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBzdWNjZXNzQ2FsbGJhY2sgPSAoKSA9PiByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT0gMSkgeyAvLyDmlofku7bmiJbnm67lvZXkuI3lrZjlnKggRmlsZUVycm9yLk5PVF9GT1VORF9FUlJcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIOWFtuWug+mUmeivr1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlUGF0aCwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOS7juS4gOS4quaWh+S7tui3r+W+hOiOt+WPluaWh+S7tuWQjVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggXHJcbiAqL1xyXG5jb25zdCBnZXRGaWxlTmFtZSA9IChmaWxlUGF0aCkgPT4ge1xyXG4gICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICog5oqK5YWo6YOo57uZ5a6a55qE6Lev5b6E54mH5q616L+e5o6l5Yiw5LiA6LW3XHJcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSBwYXRocyBcclxuICovXHJcbmNvbnN0IGpvaW5QYXRoID0gKC4uLnBhdGhzKSA9PiB7XHJcbiAgICByZXR1cm4gcGF0aHMuam9pbihcIi9cIikucmVwbGFjZSgvKFteOl0pXFwvezMsfXwoW14vOl0pXFwvezJ9L2csIFwiJDEkMi9cIilcclxufVxyXG5cclxuLyoqXHJcbiAqIOaJi+WKqOivt+axgiBhbmRyb2lkLnBlcm1pc3Npb24uV1JJVEVfRVhURVJOQUxfU1RPUkFHRSDmnYPpmZAgXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxyXG4gKi9cclxuY29uc3QgcmVxdWVzdFdyaXRlRXh0ZXJuYWxTdG9yYWdlUGVybWlzc2lvbiA9IGFzeW5jICgpID0+IHtcclxuICAgIFxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgY29uc3QgcGVybWlzc2lvbnMgPSB3aW5kb3cuY29yZG92YS5wbHVnaW5zLnBlcm1pc3Npb25zXHJcbiAgICBjb25zdCBuYW1lID0gcGVybWlzc2lvbnMuV1JJVEVfRVhURVJOQUxfU1RPUkFHRVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24obmFtZSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5oYXNQZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG59XHJcblxyXG4vLyDnrYnlvoUgQ29yZG92YSDlrozlhajliqDovb1cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZXJlYWR5XCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGFwcERpciA9IHRvcC5jb3Jkb3ZhLmZpbGUuYXBwbGljYXRpb25EaXJlY3RvcnlcclxuICAgIGNvbnN0IGRhdGFEaXIgPSB0b3AuY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnlcclxuXHJcbiAgICBjb25zdCBhcmlhMkZpbGVVUkwgPSBhcHBEaXIgKyBcInd3dy9hcmlhMi9hbmRyb2lkL2FyaWEyY1wiXHJcbiAgICBjb25zdCBhcmlhMkNvbmZGaWxlVVJMID0gYXBwRGlyICsgXCJ3d3cvYXJpYTIvYXJpYTIuY29uZlwiXHJcbiAgICBjb25zdCBkb3dubG9hZERpciA9IFwiL3N0b3JhZ2UvZW11bGF0ZWQvMC9Eb3dubG9hZC9cIlxyXG5cclxuICAgIC8vIOaYvuekuiBBcmlhTmcgR1VJIGZvciBBbmRyb2lkIOeahOeJiOacrOWPt1xyXG4gICAgY29uc3QgYXBwVmVyc2lvbiA9IGF3YWl0IHRvcC5jb3Jkb3ZhLmdldEFwcFZlcnNpb24uZ2V0VmVyc2lvbk51bWJlcigpXHJcbiAgICBjb25zdCBsb2dvRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmlhLW5nLWxvZ29cIilcclxuICAgIGxvZ29EaXYudGl0bGUgPSBgQXJpYU5nIEdVSSBmb3IgQW5kcm9pZCB2JHthcHBWZXJzaW9ufSB8ICR7bG9nb0Rpdi50aXRsZX1gXHJcblxyXG4gICAgLy8gY29uc3Qgc2F2ZWRBcHBWZXJzaW9uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhcHBWZXJzaW9uXCIpXHJcbiAgICAvLyBjb25zb2xlLmxvZyhzYXZlZEFwcFZlcnNpb24pXHJcbiAgICAvLyBpZiAoYXBwVmVyc2lvbiAhPSBzYXZlZEFwcFZlcnNpb24gfHwgIShhd2FpdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlKGRhdGFEaXIgKyBcImFyaWEyY1wiKSkpIHtcclxuICAgIC8vICAgICB0b3AubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhcHBWZXJzaW9uXCIsIGFwcFZlcnNpb24pXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8g5omL5Yqo6K+35rGCIOWtmOWCqOepuumXtOivu+WGmSDnmoTmnYPpmZBcclxuICAgIGF3YWl0IHJlcXVlc3RXcml0ZUV4dGVybmFsU3RvcmFnZVBlcm1pc3Npb24oKVxyXG5cclxuICAgIC8vIOS7heW9k2FyaWEyLmNvbmbmlofku7bkuI3lrZjlnKjml7blpI3liLZhcmlhMi5jb25mLCDpmLLmraLphY3nva7mlofku7booqvopobnm5ZcclxuICAgIGlmICghYXdhaXQgZmlsZU9yRGlyRXhpc3RzUHJvbWlzZShkYXRhRGlyICsgXCJhcmlhMi5jb25mXCIpKSB7XHJcbiAgICAgICAgYXdhaXQgY29weUZpbGVQcm9taXNlKGFyaWEyQ29uZkZpbGVVUkwsIGRhdGFEaXIpXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5aSN5Yi2YXJpYTJjXHJcbiAgICBjb25zdCBjb3BpZWRGaWxlRW50cnkgPSBhd2FpdCBjb3B5RmlsZVByb21pc2UoYXJpYTJGaWxlVVJMLCBkYXRhRGlyKVxyXG5cclxuICAgIC8vIOiOt+WPluWkjeWItuWIsOeahOaWh+S7tui3r+W+hFxyXG4gICAgY29uc3QgY29waWVkQXJpYTJGaWxlVVJMID0gY29waWVkRmlsZUVudHJ5Lm5hdGl2ZVVSTC5yZXBsYWNlKFwiZmlsZTovL1wiLCBcIlwiKVxyXG4gICAgY29uc3QgY29waWVkQXJpYTJDb25mRmlsZVVSTCA9IGNvcGllZEFyaWEyRmlsZVVSTC5yZXBsYWNlKC9cXC9hcmlhMmMkLywgXCIvYXJpYTIuY29uZlwiKVxyXG5cclxuICAgIC8vIOi/kOihjGFyaWEyY+WJjeeahOWHhuWkh+W3peS9nFxyXG4gICAgLy8gMS4g5Yib5bu6YXJpYTIuc2Vzc2lvbuS8muivneaWh+S7tlxyXG4gICAgYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbXCJ0b3VjaFwiLCBkb3dubG9hZERpciArIFwiYXJpYTIuc2Vzc2lvblwiXSlcclxuICAgIC8vIDIuIOiuqWFyaWEyY+WPr+aJp+ihjOaWh+S7tuaciei/kOihjOadg+mZkFxyXG4gICAgYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbXCJjaG1vZFwiLCBcIjA3NzdcIiwgY29waWVkQXJpYTJGaWxlVVJMXSlcclxuXHJcbiAgICAvLyDliJvlu7rlm6DkuLrnq6/lj6PooqvljaDnlKjogIzov5DooYzlpLHotKXnmoTmrKHmlbDnmoTorqHmlbDlmahcclxuICAgIGxldCBuID0gMFxyXG5cclxuICAgIC8vIOWcqGFyaWEyY+W8guW4uOWFs+mXreWQjuiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyDov5DooYxhcmlhMmNcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbY29waWVkQXJpYTJGaWxlVVJMLCBcIi0tY29uZi1wYXRoPVwiICsgY29waWVkQXJpYTJDb25mRmlsZVVSTF0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5vdXRwdXQpXHJcblxyXG4gICAgICAgICAgICAvLyDooqvmiYvliqjlhbPpl63ml7blj5bmtojoh6rliqjph43lkK9hcmlhMmNcclxuICAgICAgICAgICAgaWYgKHJlcy5vdXRwdXQuaW5jbHVkZXMoXCJzZWNvbmQocykgaGFzIHBhc3NlZC4gU3RvcHBpbmcgYXBwbGljYXRpb24uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMub3V0cHV0KVxyXG5cclxuICAgICAgICAgICAgLy8g56uv5Y+j6KKr5Y2g55So6L6+5Yiw5LiA5a6a5qyh5pWw5ZCO5pe25Y+W5raI6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICAgICAgICAgIGlmIChyZXMub3V0cHV0LmluY2x1ZGVzKFwiRmFpbGVkIHRvIGJpbmQgYSBzb2NrZXQsIGNhdXNlOiBBZGRyZXNzIGFscmVhZHkgaW4gdXNlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobiA+IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbisrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0sIGZhbHNlKVxyXG4iXX0=