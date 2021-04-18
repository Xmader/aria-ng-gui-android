"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * AriaNg GUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018-2021 Xmader. All Rights Reserved.
 * @license MIT
 */
// 输出版权信息
console.info("AriaNg GUI for Android\n\nCopyright (c) 2018-2021 Xmader\nReleased under the MIT license\n\nSource Code: https://github.com/Xmader/aria-ng-gui-android/\n");
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
}();
/**
 * 获取文件/目录 Entry
 * @param {string} path 文件路径
 * @returns {Promise<Entry>}
 */


var getEntry = function getEntry(path) {
  return new Promise(function (resolve, reject) {
    window.resolveLocalFileSystemURL(path, resolve, reject);
  });
};
/**
 * 写入文件
 * @param {FileEntry} entry 
 * @param {BlobPart} data 文件内容
 */


var writeFileEntry = function writeFileEntry(entry, data) {
  return new Promise(function (resolve, reject) {
    entry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function () {
        return resolve();
      };

      fileWriter.onerror = reject;
      var blob = new Blob([data]);
      fileWriter.write(blob);
    });
  });
};
/**
 * 读取文件
 * @param {FileEntry} entry
 * @returns {Promise<string>}
 */


var readFileEntry =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(entry) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var errorCallback = reject;
              entry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function () {
                  resolve(this.result);
                };

                reader.readAsText(file);
              }, errorCallback);
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function readFileEntry(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * 后台运行
 * https://github.com/katzer/cordova-plugin-background-mode
 */


var enableBgMode = function enableBgMode() {
  var cordova = top.cordova;
  cordova.plugins.backgroundMode.enable();
  cordova.plugins.backgroundMode.overrideBackButton();
  cordova.plugins.backgroundMode.disableBatteryOptimizations();
  cordova.plugins.backgroundMode.setDefaults({
    hidden: false
  });
  cordova.plugins.backgroundMode.on("activate", function () {
    cordova.plugins.backgroundMode.disableWebViewOptimizations();
  });
}; // 等待 Cordova 完全加载


document.addEventListener("deviceready",
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  var appDir, dataDir, aria2FileURL, aria2ConfFileURL, downloadDir, appVersion, logoDiv, copiedFileEntry, copiedAria2FileURL, copiedAria2ConfFileURL, confFileEntry, conf, saveLocalConfig, n, res;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          appDir = top.cordova.file.applicationDirectory;
          dataDir = top.cordova.file.dataDirectory;
          aria2FileURL = appDir + "www/aria2/android/aria2c";
          aria2ConfFileURL = appDir + "www/aria2/aria2.conf";
          downloadDir = "/storage/emulated/0/Download/"; // 显示 AriaNg GUI for Android 的版本号

          _context4.next = 7;
          return top.cordova.getAppVersion.getVersionNumber();

        case 7:
          appVersion = _context4.sent;
          logoDiv = document.getElementById("aria-ng-logo");
          logoDiv.title = "AriaNg GUI for Android v".concat(appVersion, " | ").concat(logoDiv.title); // const savedAppVersion = localStorage.getItem("appVersion")
          // console.log(savedAppVersion)
          // if (appVersion != savedAppVersion || !(await fileOrDirExistsPromise(dataDir + "aria2c"))) {
          //     top.localStorage.setItem("appVersion", appVersion)
          // }
          // 手动请求 存储空间读写 的权限

          _context4.next = 12;
          return requestWriteExternalStoragePermission();

        case 12:
          _context4.next = 14;
          return fileOrDirExistsPromise(dataDir + "aria2.conf");

        case 14:
          if (_context4.sent) {
            _context4.next = 17;
            break;
          }

          _context4.next = 17;
          return copyFilePromise(aria2ConfFileURL, dataDir);

        case 17:
          _context4.next = 19;
          return copyFilePromise(aria2FileURL, dataDir);

        case 19:
          copiedFileEntry = _context4.sent;
          // 获取复制到的文件路径
          copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "");
          copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf"); // 支持保存配置修改到 aria2.conf 配置文件

          _context4.next = 24;
          return getEntry("file://" + copiedAria2ConfFileURL);

        case 24:
          confFileEntry = _context4.sent;
          conf = "";

          saveLocalConfig =
          /*#__PURE__*/
          function () {
            var _ref4 = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee3(options) {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (conf) {
                        _context3.next = 4;
                        break;
                      }

                      _context3.next = 3;
                      return readFileEntry(confFileEntry);

                    case 3:
                      conf = _context3.sent;

                    case 4:
                      Object.entries(options).forEach(function (_ref5) {
                        var _ref6 = _slicedToArray(_ref5, 2),
                            key = _ref6[0],
                            value = _ref6[1];

                        var r = new RegExp("^(?:#\\s*)?(".concat(key, "=).*"), "m");

                        if (r.test(conf)) {
                          conf = conf.replace(r, "$1" + value);
                        } else {
                          conf += "\n".concat(key, "=").concat(value);
                        }
                      });
                      _context3.next = 7;
                      return writeFileEntry(confFileEntry, conf);

                    case 7:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            }));

            return function saveLocalConfig(_x2) {
              return _ref4.apply(this, arguments);
            };
          }();

          window.saveLocalConfig = saveLocalConfig; // 运行aria2c前的准备工作
          // 1. 创建aria2.session会话文件

          _context4.next = 30;
          return shellExecPromise(["touch", downloadDir + "aria2.session"]);

        case 30:
          _context4.next = 32;
          return shellExecPromise(["chmod", "0777", copiedAria2FileURL]);

        case 32:
          // 让程序在后台运行，以及添加运行通知
          enableBgMode(); // 创建因为端口被占用而运行失败的次数的计数器

          n = 0; // 在aria2c异常关闭后自动重启aria2c

        case 34:
          if (!true) {
            _context4.next = 55;
            break;
          }

          _context4.prev = 35;
          _context4.next = 38;
          return shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL]);

        case 38:
          res = _context4.sent;
          console.log(res.output); // 被手动关闭时取消自动重启aria2c

          if (!res.output.includes("second(s) has passed. Stopping application.")) {
            _context4.next = 42;
            break;
          }

          return _context4.abrupt("break", 55);

        case 42:
          _context4.next = 53;
          break;

        case 44:
          _context4.prev = 44;
          _context4.t0 = _context4["catch"](35);
          console.log(_context4.t0.output); // 端口被占用达到一定次数后时取消自动重启aria2c

          if (!_context4.t0.output.includes("Failed to bind a socket, cause: Address already in use")) {
            _context4.next = 53;
            break;
          }

          if (!(n > 5)) {
            _context4.next = 52;
            break;
          }

          return _context4.abrupt("break", 55);

        case 52:
          n++;

        case 53:
          _context4.next = 34;
          break;

        case 55:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4, null, [[35, 44]]);
})), false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWtGN0IsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGFBQUksTUFBaEIsRUFsRjZCLENBb0Y3Qjs7QUFwRjZCLGVBcUZ6QixhQUFJLE1BQUosQ0FBVyxRQUFYLENBQW9CLHdEQUFwQixDQXJGeUI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsZ0JBc0ZyQixDQUFDLEdBQUcsQ0F0RmlCO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBeUZyQixVQUFBLENBQUM7O0FBekZvQjtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBekMsSUE4RkcsS0E5RkgiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBcmlhTmcgR1VJIGZvciBBbmRyb2lkXHJcbiAqIEBhdXRob3IgWG1hZGVyXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEgWG1hZGVyLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBAbGljZW5zZSBNSVRcclxuICovXHJcblxyXG4vLyDovpPlh7rniYjmnYPkv6Hmga9cclxuY29uc29sZS5pbmZvKGBBcmlhTmcgR1VJIGZvciBBbmRyb2lkXHJcblxyXG5Db3B5cmlnaHQgKGMpIDIwMTgtMjAyMSBYbWFkZXJcclxuUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcblxyXG5Tb3VyY2UgQ29kZTogaHR0cHM6Ly9naXRodWIuY29tL1htYWRlci9hcmlhLW5nLWd1aS1hbmRyb2lkL1xyXG5gKVxyXG5cclxuLyoqXHJcbiAqIOi/kOihjOS4gOS4qiBzaGVsbCDlrZDov5vnqIvlubblnKggc2hlbGwg5LiK6L+Q6KGM5ZG95LukXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgc3RyaW5nW119IGNtZCBcclxuICogQHJldHVybnMge1Byb21pc2U8eyBleGl0U3RhdHVzOiBudW1iZXI7IG91dHB1dDogc3RyaW5nOyB9Pn1cclxuICovXHJcbmNvbnN0IHNoZWxsRXhlY1Byb21pc2UgPSAoY21kKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5TaGVsbEV4ZWMuZXhlYyhjbWQsIChyZXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlcy5leGl0U3RhdHVzID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5aSN5Yi25paH5Lu2XHJcbiAqIOWmguaenOaWh+S7tuW3suWtmOWcqCwg5YiZ6Ieq5Yqo6KaG55uWXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzcmNQYXRoIOa6kOaWh+S7tui3r+W+hFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzdERpciDnm67moIfnm67lvZVcclxuICogQHBhcmFtIHtzdHJpbmc9fSBkZXN0RmlsZU5hbWUg55uu5qCH5paH5Lu25ZCNICjlpoLmnpznlZnnqbosIOWImeS4jeaUueWPmOaWh+S7tuWQjSlcclxuICogQHJldHVybnMge1Byb21pc2U8RW50cnk+fVxyXG4gKi9cclxuY29uc3QgY29weUZpbGVQcm9taXNlID0gKHNyY1BhdGgsIGRlc3REaXIsIGRlc3RGaWxlTmFtZSA9IG51bGwpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VjY2Vzc0NhbGxiYWNrID0gKGVudHJ5KSA9PiByZXNvbHZlKGVudHJ5KVxyXG4gICAgICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSAoZSkgPT4gcmVqZWN0KGUpXHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHNyY1BhdGgsIGZ1bmN0aW9uIChmaWxlRW50cnkpIHtcclxuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZGVzdERpciwgZnVuY3Rpb24gKGRpckVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlRW50cnkuY29weVRvKGRpckVudHJ5LCBkZXN0RmlsZU5hbWUgfHwgZmlsZUVudHJ5Lm5hbWUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOWIpOaWreaWh+S7tuaIluebruW9leaYr+WQpuWtmOWcqFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcclxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAqL1xyXG5jb25zdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlID0gKGZpbGVQYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBzdWNjZXNzQ2FsbGJhY2sgPSAoKSA9PiByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT0gMSkgeyAvLyDmlofku7bmiJbnm67lvZXkuI3lrZjlnKggRmlsZUVycm9yLk5PVF9GT1VORF9FUlJcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIOWFtuWug+mUmeivr1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlUGF0aCwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOS7juS4gOS4quaWh+S7tui3r+W+hOiOt+WPluaWh+S7tuWQjVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggXHJcbiAqL1xyXG5jb25zdCBnZXRGaWxlTmFtZSA9IChmaWxlUGF0aCkgPT4ge1xyXG4gICAgcmV0dXJuIGZpbGVQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICog5oqK5YWo6YOo57uZ5a6a55qE6Lev5b6E54mH5q616L+e5o6l5Yiw5LiA6LW3XHJcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSBwYXRocyBcclxuICovXHJcbmNvbnN0IGpvaW5QYXRoID0gKC4uLnBhdGhzKSA9PiB7XHJcbiAgICByZXR1cm4gcGF0aHMuam9pbihcIi9cIikucmVwbGFjZSgvKFteOl0pXFwvezMsfXwoW14vOl0pXFwvezJ9L2csIFwiJDEkMi9cIilcclxufVxyXG5cclxuLyoqXHJcbiAqIOaJi+WKqOivt+axgiBhbmRyb2lkLnBlcm1pc3Npb24uV1JJVEVfRVhURVJOQUxfU1RPUkFHRSDmnYPpmZAgXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxyXG4gKi9cclxuY29uc3QgcmVxdWVzdFdyaXRlRXh0ZXJuYWxTdG9yYWdlUGVybWlzc2lvbiA9IGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBjb25zdCBwZXJtaXNzaW9ucyA9IHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMucGVybWlzc2lvbnNcclxuICAgIGNvbnN0IG5hbWUgPSBwZXJtaXNzaW9ucy5XUklURV9FWFRFUk5BTF9TVE9SQUdFXHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBwZXJtaXNzaW9ucy5yZXF1ZXN0UGVybWlzc2lvbihuYW1lLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmhhc1Blcm1pc3Npb24pIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDojrflj5bmlofku7Yv55uu5b2VIEVudHJ5XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIOaWh+S7tui3r+W+hFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbnRyeT59XHJcbiAqL1xyXG5jb25zdCBnZXRFbnRyeSA9IChwYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHBhdGgsIHJlc29sdmUsIHJlamVjdClcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlhpnlhaXmlofku7ZcclxuICogQHBhcmFtIHtGaWxlRW50cnl9IGVudHJ5IFxyXG4gKiBAcGFyYW0ge0Jsb2JQYXJ0fSBkYXRhIOaWh+S7tuWGheWuuVxyXG4gKi9cclxuY29uc3Qgd3JpdGVGaWxlRW50cnkgPSAoZW50cnksIGRhdGEpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgZW50cnkuY3JlYXRlV3JpdGVyKChmaWxlV3JpdGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGZpbGVXcml0ZXIub253cml0ZWVuZCA9ICgpID0+IHJlc29sdmUoKVxyXG4gICAgICAgICAgICBmaWxlV3JpdGVyLm9uZXJyb3IgPSByZWplY3RcclxuICAgICAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtkYXRhXSlcclxuICAgICAgICAgICAgZmlsZVdyaXRlci53cml0ZShibG9iKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog6K+75Y+W5paH5Lu2XHJcbiAqIEBwYXJhbSB7RmlsZUVudHJ5fSBlbnRyeVxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxyXG4gKi9cclxuY29uc3QgcmVhZEZpbGVFbnRyeSA9IGFzeW5jIChlbnRyeSkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBlcnJvckNhbGxiYWNrID0gcmVqZWN0XHJcbiAgICAgICAgZW50cnkuZmlsZSgoZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzdWx0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpXHJcbiAgICAgICAgfSwgZXJyb3JDYWxsYmFjaylcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlkI7lj7Dov5DooYxcclxuICogaHR0cHM6Ly9naXRodWIuY29tL2thdHplci9jb3Jkb3ZhLXBsdWdpbi1iYWNrZ3JvdW5kLW1vZGVcclxuICovXHJcbmNvbnN0IGVuYWJsZUJnTW9kZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNvcmRvdmEgPSB0b3AuY29yZG92YVxyXG4gICAgY29yZG92YS5wbHVnaW5zLmJhY2tncm91bmRNb2RlLmVuYWJsZSgpXHJcbiAgICBjb3Jkb3ZhLnBsdWdpbnMuYmFja2dyb3VuZE1vZGUub3ZlcnJpZGVCYWNrQnV0dG9uKClcclxuICAgIGNvcmRvdmEucGx1Z2lucy5iYWNrZ3JvdW5kTW9kZS5kaXNhYmxlQmF0dGVyeU9wdGltaXphdGlvbnMoKVxyXG4gICAgY29yZG92YS5wbHVnaW5zLmJhY2tncm91bmRNb2RlLnNldERlZmF1bHRzKHsgaGlkZGVuOiBmYWxzZSB9KVxyXG4gICAgY29yZG92YS5wbHVnaW5zLmJhY2tncm91bmRNb2RlLm9uKFwiYWN0aXZhdGVcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvcmRvdmEucGx1Z2lucy5iYWNrZ3JvdW5kTW9kZS5kaXNhYmxlV2ViVmlld09wdGltaXphdGlvbnMoKVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8g562J5b6FIENvcmRvdmEg5a6M5YWo5Yqg6L29XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhcHBEaXIgPSB0b3AuY29yZG92YS5maWxlLmFwcGxpY2F0aW9uRGlyZWN0b3J5XHJcbiAgICBjb25zdCBkYXRhRGlyID0gdG9wLmNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5XHJcblxyXG4gICAgY29uc3QgYXJpYTJGaWxlVVJMID0gYXBwRGlyICsgXCJ3d3cvYXJpYTIvYW5kcm9pZC9hcmlhMmNcIlxyXG4gICAgY29uc3QgYXJpYTJDb25mRmlsZVVSTCA9IGFwcERpciArIFwid3d3L2FyaWEyL2FyaWEyLmNvbmZcIlxyXG4gICAgY29uc3QgZG93bmxvYWREaXIgPSBcIi9zdG9yYWdlL2VtdWxhdGVkLzAvRG93bmxvYWQvXCJcclxuXHJcbiAgICAvLyDmmL7npLogQXJpYU5nIEdVSSBmb3IgQW5kcm9pZCDnmoTniYjmnKzlj7dcclxuICAgIGNvbnN0IGFwcFZlcnNpb24gPSBhd2FpdCB0b3AuY29yZG92YS5nZXRBcHBWZXJzaW9uLmdldFZlcnNpb25OdW1iZXIoKVxyXG4gICAgY29uc3QgbG9nb0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJpYS1uZy1sb2dvXCIpXHJcbiAgICBsb2dvRGl2LnRpdGxlID0gYEFyaWFOZyBHVUkgZm9yIEFuZHJvaWQgdiR7YXBwVmVyc2lvbn0gfCAke2xvZ29EaXYudGl0bGV9YFxyXG5cclxuICAgIC8vIGNvbnN0IHNhdmVkQXBwVmVyc2lvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYXBwVmVyc2lvblwiKVxyXG4gICAgLy8gY29uc29sZS5sb2coc2F2ZWRBcHBWZXJzaW9uKVxyXG4gICAgLy8gaWYgKGFwcFZlcnNpb24gIT0gc2F2ZWRBcHBWZXJzaW9uIHx8ICEoYXdhaXQgZmlsZU9yRGlyRXhpc3RzUHJvbWlzZShkYXRhRGlyICsgXCJhcmlhMmNcIikpKSB7XHJcbiAgICAvLyAgICAgdG9wLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYXBwVmVyc2lvblwiLCBhcHBWZXJzaW9uKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIOaJi+WKqOivt+axgiDlrZjlgqjnqbrpl7Tor7vlhpkg55qE5p2D6ZmQXHJcbiAgICBhd2FpdCByZXF1ZXN0V3JpdGVFeHRlcm5hbFN0b3JhZ2VQZXJtaXNzaW9uKClcclxuXHJcbiAgICAvLyDku4XlvZNhcmlhMi5jb25m5paH5Lu25LiN5a2Y5Zyo5pe25aSN5Yi2YXJpYTIuY29uZiwg6Ziy5q2i6YWN572u5paH5Lu26KKr6KaG55uWXHJcbiAgICBpZiAoIWF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTIuY29uZlwiKSkge1xyXG4gICAgICAgIGF3YWl0IGNvcHlGaWxlUHJvbWlzZShhcmlhMkNvbmZGaWxlVVJMLCBkYXRhRGlyKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWkjeWItmFyaWEyY1xyXG4gICAgY29uc3QgY29waWVkRmlsZUVudHJ5ID0gYXdhaXQgY29weUZpbGVQcm9taXNlKGFyaWEyRmlsZVVSTCwgZGF0YURpcilcclxuXHJcbiAgICAvLyDojrflj5blpI3liLbliLDnmoTmlofku7bot6/lvoRcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyRmlsZVVSTCA9IGNvcGllZEZpbGVFbnRyeS5uYXRpdmVVUkwucmVwbGFjZShcImZpbGU6Ly9cIiwgXCJcIilcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyQ29uZkZpbGVVUkwgPSBjb3BpZWRBcmlhMkZpbGVVUkwucmVwbGFjZSgvXFwvYXJpYTJjJC8sIFwiL2FyaWEyLmNvbmZcIilcclxuXHJcbiAgICAvLyDmlK/mjIHkv53lrZjphY3nva7kv67mlLnliLAgYXJpYTIuY29uZiDphY3nva7mlofku7ZcclxuICAgIGNvbnN0IGNvbmZGaWxlRW50cnkgPSBhd2FpdCBnZXRFbnRyeShcImZpbGU6Ly9cIiArIGNvcGllZEFyaWEyQ29uZkZpbGVVUkwpXHJcbiAgICBsZXQgY29uZiA9IFwiXCJcclxuICAgIGNvbnN0IHNhdmVMb2NhbENvbmZpZyA9IGFzeW5jIChvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgaWYgKCFjb25mKSB7XHJcbiAgICAgICAgICAgIGNvbmYgPSBhd2FpdCByZWFkRmlsZUVudHJ5KGNvbmZGaWxlRW50cnkpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvcHRpb25zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgciA9IG5ldyBSZWdFeHAoYF4oPzojXFxcXHMqKT8oJHtrZXl9PSkuKmAsIFwibVwiKVxyXG4gICAgICAgICAgICBpZiAoci50ZXN0KGNvbmYpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25mID0gY29uZi5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIkMVwiICsgdmFsdWVcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbmYgKz0gYFxcbiR7a2V5fT0ke3ZhbHVlfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGF3YWl0IHdyaXRlRmlsZUVudHJ5KGNvbmZGaWxlRW50cnksIGNvbmYpXHJcbiAgICB9XHJcbiAgICB3aW5kb3cuc2F2ZUxvY2FsQ29uZmlnID0gc2F2ZUxvY2FsQ29uZmlnXHJcblxyXG4gICAgLy8g6L+Q6KGMYXJpYTJj5YmN55qE5YeG5aSH5bel5L2cXHJcbiAgICAvLyAxLiDliJvlu7phcmlhMi5zZXNzaW9u5Lya6K+d5paH5Lu2XHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcInRvdWNoXCIsIGRvd25sb2FkRGlyICsgXCJhcmlhMi5zZXNzaW9uXCJdKVxyXG4gICAgLy8gMi4g6K6pYXJpYTJj5Y+v5omn6KGM5paH5Lu25pyJ6L+Q6KGM5p2D6ZmQXHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcImNobW9kXCIsIFwiMDc3N1wiLCBjb3BpZWRBcmlhMkZpbGVVUkxdKVxyXG5cclxuICAgIC8vIOiuqeeoi+W6j+WcqOWQjuWPsOi/kOihjO+8jOS7peWPiua3u+WKoOi/kOihjOmAmuefpVxyXG4gICAgZW5hYmxlQmdNb2RlKClcclxuXHJcbiAgICAvLyDliJvlu7rlm6DkuLrnq6/lj6PooqvljaDnlKjogIzov5DooYzlpLHotKXnmoTmrKHmlbDnmoTorqHmlbDlmahcclxuICAgIGxldCBuID0gMFxyXG5cclxuICAgIC8vIOWcqGFyaWEyY+W8guW4uOWFs+mXreWQjuiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyDov5DooYxhcmlhMmNcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbY29waWVkQXJpYTJGaWxlVVJMLCBcIi0tY29uZi1wYXRoPVwiICsgY29waWVkQXJpYTJDb25mRmlsZVVSTF0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5vdXRwdXQpXHJcblxyXG4gICAgICAgICAgICAvLyDooqvmiYvliqjlhbPpl63ml7blj5bmtojoh6rliqjph43lkK9hcmlhMmNcclxuICAgICAgICAgICAgaWYgKHJlcy5vdXRwdXQuaW5jbHVkZXMoXCJzZWNvbmQocykgaGFzIHBhc3NlZC4gU3RvcHBpbmcgYXBwbGljYXRpb24uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMub3V0cHV0KVxyXG5cclxuICAgICAgICAgICAgLy8g56uv5Y+j6KKr5Y2g55So6L6+5Yiw5LiA5a6a5qyh5pWw5ZCO5pe25Y+W5raI6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICAgICAgICAgIGlmIChyZXMub3V0cHV0LmluY2x1ZGVzKFwiRmFpbGVkIHRvIGJpbmQgYSBzb2NrZXQsIGNhdXNlOiBBZGRyZXNzIGFscmVhZHkgaW4gdXNlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobiA+IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbisrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0sIGZhbHNlKVxyXG4iXX0=