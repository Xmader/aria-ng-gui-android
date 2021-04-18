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
      }, errorCallback);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFBO0FBQUE7QUFrRjdCLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFJLE1BQWhCLEVBbEY2QixDQW9GN0I7O0FBcEY2QixlQXFGekIsYUFBSSxNQUFKLENBQVcsUUFBWCxDQUFvQix3REFBcEIsQ0FyRnlCO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdCQXNGckIsQ0FBQyxHQUFHLENBdEZpQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQXlGckIsVUFBQSxDQUFDOztBQXpGb0I7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQXpDLElBOEZHLEtBOUZIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQXJpYU5nIEdVSSBmb3IgQW5kcm9pZFxyXG4gKiBAYXV0aG9yIFhtYWRlclxyXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxOC0yMDIxIFhtYWRlci4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogQGxpY2Vuc2UgTUlUXHJcbiAqL1xyXG5cclxuLy8g6L6T5Ye654mI5p2D5L+h5oGvXHJcbmNvbnNvbGUuaW5mbyhgQXJpYU5nIEdVSSBmb3IgQW5kcm9pZFxyXG5cclxuQ29weXJpZ2h0IChjKSAyMDE4LTIwMjEgWG1hZGVyXHJcblJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG5cclxuU291cmNlIENvZGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9YbWFkZXIvYXJpYS1uZy1ndWktYW5kcm9pZC9cclxuYClcclxuXHJcbi8qKlxyXG4gKiDov5DooYzkuIDkuKogc2hlbGwg5a2Q6L+b56iL5bm25ZyoIHNoZWxsIOS4iui/kOihjOWRveS7pFxyXG4gKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdfSBjbWQgXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPHsgZXhpdFN0YXR1czogbnVtYmVyOyBvdXRwdXQ6IHN0cmluZzsgfT59XHJcbiAqL1xyXG5jb25zdCBzaGVsbEV4ZWNQcm9taXNlID0gKGNtZCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB3aW5kb3cuU2hlbGxFeGVjLmV4ZWMoY21kLCAocmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXMuZXhpdFN0YXR1cyA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChyZXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOWkjeWItuaWh+S7tlxyXG4gKiDlpoLmnpzmlofku7blt7LlrZjlnKgsIOWImeiHquWKqOimhuebllxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3JjUGF0aCDmupDmlofku7bot6/lvoRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRlc3REaXIg55uu5qCH55uu5b2VXHJcbiAqIEBwYXJhbSB7c3RyaW5nPX0gZGVzdEZpbGVOYW1lIOebruagh+aWh+S7tuWQjSAo5aaC5p6c55WZ56m6LCDliJnkuI3mlLnlj5jmlofku7blkI0pXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPEVudHJ5Pn1cclxuICovXHJcbmNvbnN0IGNvcHlGaWxlUHJvbWlzZSA9IChzcmNQYXRoLCBkZXN0RGlyLCBkZXN0RmlsZU5hbWUgPSBudWxsKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3NDYWxsYmFjayA9IChlbnRyeSkgPT4gcmVzb2x2ZShlbnRyeSlcclxuICAgICAgICBjb25zdCBlcnJvckNhbGxiYWNrID0gKGUpID0+IHJlamVjdChlKVxyXG5cclxuICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChzcmNQYXRoLCBmdW5jdGlvbiAoZmlsZUVudHJ5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGRlc3REaXIsIGZ1bmN0aW9uIChkaXJFbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgZmlsZUVudHJ5LmNvcHlUbyhkaXJFbnRyeSwgZGVzdEZpbGVOYW1lIHx8IGZpbGVFbnRyeS5uYW1lLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spXHJcbiAgICAgICAgICAgIH0sIGVycm9yQ2FsbGJhY2spXHJcbiAgICAgICAgfSwgZXJyb3JDYWxsYmFjaylcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDliKTmlq3mlofku7bmiJbnm67lvZXmmK/lkKblrZjlnKhcclxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxyXG4gKi9cclxuY29uc3QgZmlsZU9yRGlyRXhpc3RzUHJvbWlzZSA9IChmaWxlUGF0aCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3VjY2Vzc0NhbGxiYWNrID0gKCkgPT4gcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5jb2RlID09IDEpIHsgLy8g5paH5Lu25oiW55uu5b2V5LiN5a2Y5ZyoIEZpbGVFcnJvci5OT1RfRk9VTkRfRVJSXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKVxyXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyDlhbblroPplJnor69cclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZmlsZVBhdGgsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDku47kuIDkuKrmlofku7bot6/lvoTojrflj5bmlofku7blkI1cclxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIFxyXG4gKi9cclxuY29uc3QgZ2V0RmlsZU5hbWUgPSAoZmlsZVBhdGgpID0+IHtcclxuICAgIHJldHVybiBmaWxlUGF0aC5zcGxpdChcIi9cIikucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIOaKiuWFqOmDqOe7meWumueahOi3r+W+hOeJh+autei/nuaOpeWIsOS4gOi1t1xyXG4gKiBAcGFyYW0gey4uLnN0cmluZ30gcGF0aHMgXHJcbiAqL1xyXG5jb25zdCBqb2luUGF0aCA9ICguLi5wYXRocykgPT4ge1xyXG4gICAgcmV0dXJuIHBhdGhzLmpvaW4oXCIvXCIpLnJlcGxhY2UoLyhbXjpdKVxcL3szLH18KFteLzpdKVxcL3syfS9nLCBcIiQxJDIvXCIpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmiYvliqjor7fmsYIgYW5kcm9pZC5wZXJtaXNzaW9uLldSSVRFX0VYVEVSTkFMX1NUT1JBR0Ug5p2D6ZmQIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cclxuICovXHJcbmNvbnN0IHJlcXVlc3RXcml0ZUV4dGVybmFsU3RvcmFnZVBlcm1pc3Npb24gPSBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgY29uc3QgcGVybWlzc2lvbnMgPSB3aW5kb3cuY29yZG92YS5wbHVnaW5zLnBlcm1pc3Npb25zXHJcbiAgICBjb25zdCBuYW1lID0gcGVybWlzc2lvbnMuV1JJVEVfRVhURVJOQUxfU1RPUkFHRVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24obmFtZSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5oYXNQZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG59XHJcblxyXG4vKipcclxuICog6I635Y+W5paH5Lu2L+ebruW9lSBFbnRyeVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCDmlofku7bot6/lvoRcclxuICogQHJldHVybnMge1Byb21pc2U8RW50cnk+fVxyXG4gKi9cclxuY29uc3QgZ2V0RW50cnkgPSAocGF0aCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChwYXRoLCByZXNvbHZlLCByZWplY3QpXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5YaZ5YWl5paH5Lu2XHJcbiAqIEBwYXJhbSB7RmlsZUVudHJ5fSBlbnRyeSBcclxuICogQHBhcmFtIHtCbG9iUGFydH0gZGF0YSDmlofku7blhoXlrrlcclxuICovXHJcbmNvbnN0IHdyaXRlRmlsZUVudHJ5ID0gKGVudHJ5LCBkYXRhKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGVudHJ5LmNyZWF0ZVdyaXRlcigoZmlsZVdyaXRlcikgPT4ge1xyXG4gICAgICAgICAgICBmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSAoKSA9PiByZXNvbHZlKClcclxuICAgICAgICAgICAgZmlsZVdyaXRlci5vbmVycm9yID0gcmVqZWN0XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbZGF0YV0pXHJcbiAgICAgICAgICAgIGZpbGVXcml0ZXIud3JpdGUoYmxvYilcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOivu+WPluaWh+S7tlxyXG4gKiBAcGFyYW0ge0ZpbGVFbnRyeX0gZW50cnlcclxuICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cclxuICovXHJcbmNvbnN0IHJlYWRGaWxlRW50cnkgPSBhc3luYyAoZW50cnkpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IHJlamVjdFxyXG4gICAgICAgIGVudHJ5LmZpbGUoKGZpbGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgICAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3VsdClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKVxyXG4gICAgICAgIH0sIGVycm9yQ2FsbGJhY2spXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5ZCO5Y+w6L+Q6KGMXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9rYXR6ZXIvY29yZG92YS1wbHVnaW4tYmFja2dyb3VuZC1tb2RlXHJcbiAqL1xyXG5jb25zdCBlbmFibGVCZ01vZGUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjb3Jkb3ZhID0gdG9wLmNvcmRvdmFcclxuICAgIGNvcmRvdmEucGx1Z2lucy5iYWNrZ3JvdW5kTW9kZS5lbmFibGUoKVxyXG4gICAgY29yZG92YS5wbHVnaW5zLmJhY2tncm91bmRNb2RlLm92ZXJyaWRlQmFja0J1dHRvbigpXHJcbiAgICBjb3Jkb3ZhLnBsdWdpbnMuYmFja2dyb3VuZE1vZGUuZGlzYWJsZUJhdHRlcnlPcHRpbWl6YXRpb25zKClcclxuICAgIGNvcmRvdmEucGx1Z2lucy5iYWNrZ3JvdW5kTW9kZS5zZXREZWZhdWx0cyh7IGhpZGRlbjogZmFsc2UgfSlcclxuICAgIGNvcmRvdmEucGx1Z2lucy5iYWNrZ3JvdW5kTW9kZS5vbihcImFjdGl2YXRlXCIsICgpID0+IHtcclxuICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuYmFja2dyb3VuZE1vZGUuZGlzYWJsZVdlYlZpZXdPcHRpbWl6YXRpb25zKClcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIOetieW+hSBDb3Jkb3ZhIOWujOWFqOWKoOi9vVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgYXBwRGlyID0gdG9wLmNvcmRvdmEuZmlsZS5hcHBsaWNhdGlvbkRpcmVjdG9yeVxyXG4gICAgY29uc3QgZGF0YURpciA9IHRvcC5jb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeVxyXG5cclxuICAgIGNvbnN0IGFyaWEyRmlsZVVSTCA9IGFwcERpciArIFwid3d3L2FyaWEyL2FuZHJvaWQvYXJpYTJjXCJcclxuICAgIGNvbnN0IGFyaWEyQ29uZkZpbGVVUkwgPSBhcHBEaXIgKyBcInd3dy9hcmlhMi9hcmlhMi5jb25mXCJcclxuICAgIGNvbnN0IGRvd25sb2FkRGlyID0gXCIvc3RvcmFnZS9lbXVsYXRlZC8wL0Rvd25sb2FkL1wiXHJcblxyXG4gICAgLy8g5pi+56S6IEFyaWFOZyBHVUkgZm9yIEFuZHJvaWQg55qE54mI5pys5Y+3XHJcbiAgICBjb25zdCBhcHBWZXJzaW9uID0gYXdhaXQgdG9wLmNvcmRvdmEuZ2V0QXBwVmVyc2lvbi5nZXRWZXJzaW9uTnVtYmVyKClcclxuICAgIGNvbnN0IGxvZ29EaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyaWEtbmctbG9nb1wiKVxyXG4gICAgbG9nb0Rpdi50aXRsZSA9IGBBcmlhTmcgR1VJIGZvciBBbmRyb2lkIHYke2FwcFZlcnNpb259IHwgJHtsb2dvRGl2LnRpdGxlfWBcclxuXHJcbiAgICAvLyBjb25zdCBzYXZlZEFwcFZlcnNpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFwcFZlcnNpb25cIilcclxuICAgIC8vIGNvbnNvbGUubG9nKHNhdmVkQXBwVmVyc2lvbilcclxuICAgIC8vIGlmIChhcHBWZXJzaW9uICE9IHNhdmVkQXBwVmVyc2lvbiB8fCAhKGF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTJjXCIpKSkge1xyXG4gICAgLy8gICAgIHRvcC5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFwcFZlcnNpb25cIiwgYXBwVmVyc2lvbilcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyDmiYvliqjor7fmsYIg5a2Y5YKo56m66Ze06K+75YaZIOeahOadg+mZkFxyXG4gICAgYXdhaXQgcmVxdWVzdFdyaXRlRXh0ZXJuYWxTdG9yYWdlUGVybWlzc2lvbigpXHJcblxyXG4gICAgLy8g5LuF5b2TYXJpYTIuY29uZuaWh+S7tuS4jeWtmOWcqOaXtuWkjeWItmFyaWEyLmNvbmYsIOmYsuatoumFjee9ruaWh+S7tuiiq+imhuebllxyXG4gICAgaWYgKCFhd2FpdCBmaWxlT3JEaXJFeGlzdHNQcm9taXNlKGRhdGFEaXIgKyBcImFyaWEyLmNvbmZcIikpIHtcclxuICAgICAgICBhd2FpdCBjb3B5RmlsZVByb21pc2UoYXJpYTJDb25mRmlsZVVSTCwgZGF0YURpcilcclxuICAgIH1cclxuXHJcbiAgICAvLyDlpI3liLZhcmlhMmNcclxuICAgIGNvbnN0IGNvcGllZEZpbGVFbnRyeSA9IGF3YWl0IGNvcHlGaWxlUHJvbWlzZShhcmlhMkZpbGVVUkwsIGRhdGFEaXIpXHJcblxyXG4gICAgLy8g6I635Y+W5aSN5Yi25Yiw55qE5paH5Lu26Lev5b6EXHJcbiAgICBjb25zdCBjb3BpZWRBcmlhMkZpbGVVUkwgPSBjb3BpZWRGaWxlRW50cnkubmF0aXZlVVJMLnJlcGxhY2UoXCJmaWxlOi8vXCIsIFwiXCIpXHJcbiAgICBjb25zdCBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMID0gY29waWVkQXJpYTJGaWxlVVJMLnJlcGxhY2UoL1xcL2FyaWEyYyQvLCBcIi9hcmlhMi5jb25mXCIpXHJcblxyXG4gICAgLy8g5pSv5oyB5L+d5a2Y6YWN572u5L+u5pS55YiwIGFyaWEyLmNvbmYg6YWN572u5paH5Lu2XHJcbiAgICBjb25zdCBjb25mRmlsZUVudHJ5ID0gYXdhaXQgZ2V0RW50cnkoXCJmaWxlOi8vXCIgKyBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMKVxyXG4gICAgbGV0IGNvbmYgPSBcIlwiXHJcbiAgICBjb25zdCBzYXZlTG9jYWxDb25maWcgPSBhc3luYyAob3B0aW9ucykgPT4ge1xyXG4gICAgICAgIGlmICghY29uZikge1xyXG4gICAgICAgICAgICBjb25mID0gYXdhaXQgcmVhZEZpbGVFbnRyeShjb25mRmlsZUVudHJ5KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMob3B0aW9ucykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHIgPSBuZXcgUmVnRXhwKGBeKD86I1xcXFxzKik/KCR7a2V5fT0pLipgLCBcIm1cIilcclxuICAgICAgICAgICAgaWYgKHIudGVzdChjb25mKSkge1xyXG4gICAgICAgICAgICAgICAgY29uZiA9IGNvbmYucmVwbGFjZShcclxuICAgICAgICAgICAgICAgICAgICByLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiJDFcIiArIHZhbHVlXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25mICs9IGBcXG4ke2tleX09JHt2YWx1ZX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBhd2FpdCB3cml0ZUZpbGVFbnRyeShjb25mRmlsZUVudHJ5LCBjb25mKVxyXG4gICAgfVxyXG4gICAgd2luZG93LnNhdmVMb2NhbENvbmZpZyA9IHNhdmVMb2NhbENvbmZpZ1xyXG5cclxuICAgIC8vIOi/kOihjGFyaWEyY+WJjeeahOWHhuWkh+W3peS9nFxyXG4gICAgLy8gMS4g5Yib5bu6YXJpYTIuc2Vzc2lvbuS8muivneaWh+S7tlxyXG4gICAgYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbXCJ0b3VjaFwiLCBkb3dubG9hZERpciArIFwiYXJpYTIuc2Vzc2lvblwiXSlcclxuICAgIC8vIDIuIOiuqWFyaWEyY+WPr+aJp+ihjOaWh+S7tuaciei/kOihjOadg+mZkFxyXG4gICAgYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbXCJjaG1vZFwiLCBcIjA3NzdcIiwgY29waWVkQXJpYTJGaWxlVVJMXSlcclxuXHJcbiAgICAvLyDorqnnqIvluo/lnKjlkI7lj7Dov5DooYzvvIzku6Xlj4rmt7vliqDov5DooYzpgJrnn6VcclxuICAgIGVuYWJsZUJnTW9kZSgpXHJcblxyXG4gICAgLy8g5Yib5bu65Zug5Li656uv5Y+j6KKr5Y2g55So6ICM6L+Q6KGM5aSx6LSl55qE5qyh5pWw55qE6K6h5pWw5ZmoXHJcbiAgICBsZXQgbiA9IDBcclxuXHJcbiAgICAvLyDlnKhhcmlhMmPlvILluLjlhbPpl63lkI7oh6rliqjph43lkK9hcmlhMmNcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8g6L+Q6KGMYXJpYTJjXHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHNoZWxsRXhlY1Byb21pc2UoW2NvcGllZEFyaWEyRmlsZVVSTCwgXCItLWNvbmYtcGF0aD1cIiArIGNvcGllZEFyaWEyQ29uZkZpbGVVUkxdKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMub3V0cHV0KVxyXG5cclxuICAgICAgICAgICAgLy8g6KKr5omL5Yqo5YWz6Zet5pe25Y+W5raI6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICAgICAgICAgIGlmIChyZXMub3V0cHV0LmluY2x1ZGVzKFwic2Vjb25kKHMpIGhhcyBwYXNzZWQuIFN0b3BwaW5nIGFwcGxpY2F0aW9uLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChyZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLm91dHB1dClcclxuXHJcbiAgICAgICAgICAgIC8vIOerr+WPo+iiq+WNoOeUqOi+vuWIsOS4gOWumuasoeaVsOWQjuaXtuWPlua2iOiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgICAgICBpZiAocmVzLm91dHB1dC5pbmNsdWRlcyhcIkZhaWxlZCB0byBiaW5kIGEgc29ja2V0LCBjYXVzZTogQWRkcmVzcyBhbHJlYWR5IGluIHVzZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPiA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG4rK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCBmYWxzZSlcclxuIl19