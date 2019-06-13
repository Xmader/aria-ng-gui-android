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
    }, _callee, this);
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
  }, _callee2, this, [[28, 37]]);
})), false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzhCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxpQkErQ1gsZ0JBQWdCLENBQUMsQ0FBQyxrQkFBRCxFQUFxQixpQkFBaUIsc0JBQXRDLENBQUQsQ0EvQ0w7O0FBQUE7QUErQ3ZCLFVBQUEsR0EvQ3VCO0FBZ0Q3QixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBRyxDQUFDLE1BQWhCLEVBaEQ2QixDQWtEN0I7O0FBbEQ2QixlQW1EekIsR0FBRyxDQUFDLE1BQUosQ0FBVyxRQUFYLENBQW9CLDZDQUFwQixDQW5EeUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQXVEN0IsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGFBQUksTUFBaEIsRUF2RDZCLENBeUQ3Qjs7QUF6RDZCLGVBMER6QixhQUFJLE1BQUosQ0FBVyxRQUFYLENBQW9CLHdEQUFwQixDQTFEeUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsZ0JBMkRyQixDQUFDLEdBQUcsQ0EzRGlCO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBOERyQixVQUFBLENBQUM7O0FBOURvQjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBekMsSUFtRUcsS0FuRUgiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBcmlhTmcgR1VJIGZvciBBbmRyb2lkXHJcbiAqIEBhdXRob3IgWG1hZGVyXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE4IFhtYWRlci4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogQGxpY2Vuc2UgTUlUXHJcbiAqL1xyXG5cclxuLy8g6L6T5Ye654mI5p2D5L+h5oGvXHJcbmNvbnNvbGUuaW5mbyhgQXJpYU5nIEdVSSBmb3IgQW5kcm9pZFxyXG5cclxuQ29weXJpZ2h0IChjKSAyMDE4IFhtYWRlclxyXG5SZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuXHJcblNvdXJjZSBDb2RlOiBodHRwczovL2dpdGh1Yi5jb20vWG1hZGVyL2FyaWEtbmctZ3VpLWFuZHJvaWQvXHJcbmApXHJcblxyXG4vKipcclxuICog6L+Q6KGM5LiA5LiqIHNoZWxsIOWtkOi/m+eoi+W5tuWcqCBzaGVsbCDkuIrov5DooYzlkb3ku6RcclxuICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXX0gY21kIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7IGV4aXRTdGF0dXM6IG51bWJlcjsgb3V0cHV0OiBzdHJpbmc7IH0+fVxyXG4gKi9cclxuY29uc3Qgc2hlbGxFeGVjUHJvbWlzZSA9IChjbWQpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LlNoZWxsRXhlYy5leGVjKGNtZCwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzLmV4aXRTdGF0dXMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlpI3liLbmlofku7ZcclxuICog5aaC5p6c5paH5Lu25bey5a2Y5ZyoLCDliJnoh6rliqjopobnm5ZcclxuICogQHBhcmFtIHtzdHJpbmd9IHNyY1BhdGgg5rqQ5paH5Lu26Lev5b6EXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXN0RGlyIOebruagh+ebruW9lVxyXG4gKiBAcGFyYW0ge3N0cmluZz19IGRlc3RGaWxlTmFtZSDnm67moIfmlofku7blkI0gKOWmguaenOeVmeepuiwg5YiZ5LiN5pS55Y+Y5paH5Lu25ZCNKVxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbnRyeT59XHJcbiAqL1xyXG5jb25zdCBjb3B5RmlsZVByb21pc2UgPSAoc3JjUGF0aCwgZGVzdERpciwgZGVzdEZpbGVOYW1lID0gbnVsbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBzdWNjZXNzQ2FsbGJhY2sgPSAoZW50cnkpID0+IHJlc29sdmUoZW50cnkpXHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChlKSA9PiByZWplY3QoZSlcclxuXHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoc3JjUGF0aCwgZnVuY3Rpb24gKGZpbGVFbnRyeSkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChkZXN0RGlyLCBmdW5jdGlvbiAoZGlyRW50cnkpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVFbnRyeS5jb3B5VG8oZGlyRW50cnksIGRlc3RGaWxlTmFtZSB8fCBmaWxlRW50cnkubmFtZSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sIGVycm9yQ2FsbGJhY2spXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5Yik5pat5paH5Lu25oiW55uu5b2V5piv5ZCm5a2Y5ZyoXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cclxuICovXHJcbmNvbnN0IGZpbGVPckRpckV4aXN0c1Byb21pc2UgPSAoZmlsZVBhdGgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3NDYWxsYmFjayA9ICgpID0+IHJlc29sdmUodHJ1ZSlcclxuICAgICAgICBjb25zdCBlcnJvckNhbGxiYWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PSAxKSB7IC8vIOaWh+S7tuaIluebruW9leS4jeWtmOWcqCBGaWxlRXJyb3IuTk9UX0ZPVU5EX0VSUlxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8g5YW25a6D6ZSZ6K+vXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGZpbGVQYXRoLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5LuO5LiA5Liq5paH5Lu26Lev5b6E6I635Y+W5paH5Lu25ZCNXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCBcclxuICovXHJcbmNvbnN0IGdldEZpbGVOYW1lID0gKGZpbGVQYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoXCIvXCIpLnBvcCgpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmiorlhajpg6jnu5nlrprnmoTot6/lvoTniYfmrrXov57mjqXliLDkuIDotbdcclxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHBhdGhzIFxyXG4gKi9cclxuY29uc3Qgam9pblBhdGggPSAoLi4ucGF0aHMpID0+IHtcclxuICAgIHJldHVybiBwYXRocy5qb2luKFwiL1wiKS5yZXBsYWNlKC8oW146XSlcXC97Myx9fChbXi86XSlcXC97Mn0vZywgXCIkMSQyL1wiKVxyXG59XHJcblxyXG4vKipcclxuICog5omL5Yqo6K+35rGCIGFuZHJvaWQucGVybWlzc2lvbi5XUklURV9FWFRFUk5BTF9TVE9SQUdFIOadg+mZkCBcclxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAqL1xyXG5jb25zdCByZXF1ZXN0V3JpdGVFeHRlcm5hbFN0b3JhZ2VQZXJtaXNzaW9uID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBjb25zdCBwZXJtaXNzaW9ucyA9IHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMucGVybWlzc2lvbnNcclxuICAgIGNvbnN0IG5hbWUgPSBwZXJtaXNzaW9ucy5XUklURV9FWFRFUk5BTF9TVE9SQUdFXHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBwZXJtaXNzaW9ucy5yZXF1ZXN0UGVybWlzc2lvbihuYW1lLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmhhc1Blcm1pc3Npb24pIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbn1cclxuXHJcbi8vIOetieW+hSBDb3Jkb3ZhIOWujOWFqOWKoOi9vVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgYXBwRGlyID0gdG9wLmNvcmRvdmEuZmlsZS5hcHBsaWNhdGlvbkRpcmVjdG9yeVxyXG4gICAgY29uc3QgZGF0YURpciA9IHRvcC5jb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeVxyXG5cclxuICAgIGNvbnN0IGFyaWEyRmlsZVVSTCA9IGFwcERpciArIFwid3d3L2FyaWEyL2FuZHJvaWQvYXJpYTJjXCJcclxuICAgIGNvbnN0IGFyaWEyQ29uZkZpbGVVUkwgPSBhcHBEaXIgKyBcInd3dy9hcmlhMi9hcmlhMi5jb25mXCJcclxuICAgIGNvbnN0IGRvd25sb2FkRGlyID0gXCIvc3RvcmFnZS9lbXVsYXRlZC8wL0Rvd25sb2FkL1wiXHJcblxyXG4gICAgLy8g5pi+56S6IEFyaWFOZyBHVUkgZm9yIEFuZHJvaWQg55qE54mI5pys5Y+3XHJcbiAgICBjb25zdCBhcHBWZXJzaW9uID0gYXdhaXQgdG9wLmNvcmRvdmEuZ2V0QXBwVmVyc2lvbi5nZXRWZXJzaW9uTnVtYmVyKClcclxuICAgIGNvbnN0IGxvZ29EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyaWEtbmctbG9nb1wiKVxyXG4gICAgbG9nb0Rpdi50aXRsZSA9IGBBcmlhTmcgR1VJIGZvciBBbmRyb2lkIHYke2FwcFZlcnNpb259IHwgJHtsb2dvRGl2LnRpdGxlfWBcclxuXHJcbiAgICAvLyBjb25zdCBzYXZlZEFwcFZlcnNpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFwcFZlcnNpb25cIilcclxuICAgIC8vIGNvbnNvbGUubG9nKHNhdmVkQXBwVmVyc2lvbilcclxuICAgIC8vIGlmIChhcHBWZXJzaW9uICE9IHNhdmVkQXBwVmVyc2lvbiB8fCAhKGF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTJjXCIpKSkge1xyXG4gICAgLy8gICAgIHRvcC5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFwcFZlcnNpb25cIiwgYXBwVmVyc2lvbilcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyDmiYvliqjor7fmsYIg5a2Y5YKo56m66Ze06K+75YaZIOeahOadg+mZkFxyXG4gICAgYXdhaXQgcmVxdWVzdFdyaXRlRXh0ZXJuYWxTdG9yYWdlUGVybWlzc2lvbigpXHJcblxyXG4gICAgLy8g5LuF5b2TYXJpYTIuY29uZuaWh+S7tuS4jeWtmOWcqOaXtuWkjeWItmFyaWEyLmNvbmYsIOmYsuatoumFjee9ruaWh+S7tuiiq+imhuebllxyXG4gICAgaWYgKCFhd2FpdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlKGRhdGFEaXIgKyBcImFyaWEyLmNvbmZcIikpIHtcclxuICAgICAgICBhd2FpdCBjb3B5RmlsZVByb21pc2UoYXJpYTJDb25mRmlsZVVSTCwgZGF0YURpcilcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpI3liLZhcmlhMmNcclxuICAgIGNvbnN0IGNvcGllZEZpbGVFbnRyeSA9IGF3YWl0IGNvcHlGaWxlUHJvbWlzZShhcmlhMkZpbGVVUkwsIGRhdGFEaXIpXHJcblxyXG4gICAgLy8g6I635Y+W5aSN5Yi25Yiw55qE5paH5Lu26Lev5b6EXHJcbiAgICBjb25zdCBjb3BpZWRBcmlhMkZpbGVVUkwgPSBjb3BpZWRGaWxlRW50cnkubmF0aXZlVVJMLnJlcGxhY2UoXCJmaWxlOi8vXCIsIFwiXCIpXHJcbiAgICBjb25zdCBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMID0gY29waWVkQXJpYTJGaWxlVVJMLnJlcGxhY2UoL1xcL2FyaWEyYyQvLCBcIi9hcmlhMi5jb25mXCIpXHJcblxyXG4gICAgLy8g6L+Q6KGMYXJpYTJj5YmN55qE5YeG5aSH5bel5L2cXHJcbiAgICAvLyAxLiDliJvlu7phcmlhMi5zZXNzaW9u5Lya6K+d5paH5Lu2XHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcInRvdWNoXCIsIGRvd25sb2FkRGlyICsgXCJhcmlhMi5zZXNzaW9uXCJdKVxyXG4gICAgLy8gMi4g6K6pYXJpYTJj5Y+v5omn6KGM5paH5Lu25pyJ6L+Q6KGM5p2D6ZmQXHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcImNobW9kXCIsIFwiMDc3N1wiLCBjb3BpZWRBcmlhMkZpbGVVUkxdKVxyXG5cclxuICAgIC8vIOWIm+W7uuWboOS4uuerr+WPo+iiq+WNoOeUqOiAjOi/kOihjOWksei0peeahOasoeaVsOeahOiuoeaVsOWZqFxyXG4gICAgbGV0IG4gPSAwXHJcblxyXG4gICAgLy8g5ZyoYXJpYTJj5byC5bi45YWz6Zet5ZCO6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIOi/kOihjGFyaWEyY1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtjb3BpZWRBcmlhMkZpbGVVUkwsIFwiLS1jb25mLXBhdGg9XCIgKyBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMXSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLm91dHB1dClcclxuXHJcbiAgICAgICAgICAgIC8vIOiiq+aJi+WKqOWFs+mXreaXtuWPlua2iOiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgICAgICBpZiAocmVzLm91dHB1dC5pbmNsdWRlcyhcInNlY29uZChzKSBoYXMgcGFzc2VkLiBTdG9wcGluZyBhcHBsaWNhdGlvbi5cIikpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAocmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5vdXRwdXQpXHJcblxyXG4gICAgICAgICAgICAvLyDnq6/lj6PooqvljaDnlKjovr7liLDkuIDlrprmrKHmlbDlkI7ml7blj5bmtojoh6rliqjph43lkK9hcmlhMmNcclxuICAgICAgICAgICAgaWYgKHJlcy5vdXRwdXQuaW5jbHVkZXMoXCJGYWlsZWQgdG8gYmluZCBhIHNvY2tldCwgY2F1c2U6IEFkZHJlc3MgYWxyZWFkeSBpbiB1c2VcIikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuID4gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuKytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSwgZmFsc2UpXHJcbiJdfQ==