"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
}(); // 等待 Cordova 完全加载


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
          // 创建因为端口被占用而运行失败的次数的计数器
          n = 0; // 在aria2c异常关闭后自动重启aria2c

        case 33:
          if (!true) {
            _context4.next = 54;
            break;
          }

          _context4.prev = 34;
          _context4.next = 37;
          return shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL]);

        case 37:
          res = _context4.sent;
          console.log(res.output); // 被手动关闭时取消自动重启aria2c

          if (!res.output.includes("second(s) has passed. Stopping application.")) {
            _context4.next = 41;
            break;
          }

          return _context4.abrupt("break", 54);

        case 41:
          _context4.next = 52;
          break;

        case 43:
          _context4.prev = 43;
          _context4.t0 = _context4["catch"](34);
          console.log(_context4.t0.output); // 端口被占用达到一定次数后时取消自动重启aria2c

          if (!_context4.t0.output.includes("Failed to bind a socket, cause: Address already in use")) {
            _context4.next = 52;
            break;
          }

          if (!(n > 5)) {
            _context4.next = 51;
            break;
          }

          return _context4.abrupt("break", 54);

        case 51:
          n++;

        case 52:
          _context4.next = 33;
          break;

        case 54:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4, null, [[34, 43]]);
})), false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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T0FBRCxFQUFVLE1BQVYsRUFBa0Isa0JBQWxCLENBQUQsQ0E5RGU7O0FBQUE7QUFnRXJDO0FBQ0ksVUFBQSxDQWpFaUMsR0FpRTdCLENBakU2QixFQW1FckM7O0FBbkVxQztBQUFBLGVBb0U5QixJQXBFOEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGlCQXVFWCxnQkFBZ0IsQ0FBQyxDQUFDLGtCQUFELEVBQXFCLGlCQUFpQixzQkFBdEMsQ0FBRCxDQXZFTDs7QUFBQTtBQXVFdkIsVUFBQSxHQXZFdUI7QUF3RTdCLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFHLENBQUMsTUFBaEIsRUF4RTZCLENBMEU3Qjs7QUExRTZCLGVBMkV6QixHQUFHLENBQUMsTUFBSixDQUFXLFFBQVgsQ0FBb0IsNkNBQXBCLENBM0V5QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBK0U3QixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBSSxNQUFoQixFQS9FNkIsQ0FpRjdCOztBQWpGNkIsZUFrRnpCLGFBQUksTUFBSixDQUFXLFFBQVgsQ0FBb0Isd0RBQXBCLENBbEZ5QjtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnQkFtRnJCLENBQUMsR0FBRyxDQW5GaUI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFzRnJCLFVBQUEsQ0FBQzs7QUF0Rm9CO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUF6QyxJQTJGRyxLQTNGSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEFyaWFOZyBHVUkgZm9yIEFuZHJvaWRcclxuICogQGF1dGhvciBYbWFkZXJcclxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTgtMjAxOSBYbWFkZXIuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqIEBsaWNlbnNlIE1JVFxyXG4gKi9cclxuXHJcbi8vIOi+k+WHuueJiOadg+S/oeaBr1xyXG5jb25zb2xlLmluZm8oYEFyaWFOZyBHVUkgZm9yIEFuZHJvaWRcclxuXHJcbkNvcHlyaWdodCAoYykgMjAxOC0yMDE5IFhtYWRlclxyXG5SZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuXHJcblNvdXJjZSBDb2RlOiBodHRwczovL2dpdGh1Yi5jb20vWG1hZGVyL2FyaWEtbmctZ3VpLWFuZHJvaWQvXHJcbmApXHJcblxyXG4vKipcclxuICog6L+Q6KGM5LiA5LiqIHNoZWxsIOWtkOi/m+eoi+W5tuWcqCBzaGVsbCDkuIrov5DooYzlkb3ku6RcclxuICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXX0gY21kIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7IGV4aXRTdGF0dXM6IG51bWJlcjsgb3V0cHV0OiBzdHJpbmc7IH0+fVxyXG4gKi9cclxuY29uc3Qgc2hlbGxFeGVjUHJvbWlzZSA9IChjbWQpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LlNoZWxsRXhlYy5leGVjKGNtZCwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzLmV4aXRTdGF0dXMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlpI3liLbmlofku7ZcclxuICog5aaC5p6c5paH5Lu25bey5a2Y5ZyoLCDliJnoh6rliqjopobnm5ZcclxuICogQHBhcmFtIHtzdHJpbmd9IHNyY1BhdGgg5rqQ5paH5Lu26Lev5b6EXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXN0RGlyIOebruagh+ebruW9lVxyXG4gKiBAcGFyYW0ge3N0cmluZz19IGRlc3RGaWxlTmFtZSDnm67moIfmlofku7blkI0gKOWmguaenOeVmeepuiwg5YiZ5LiN5pS55Y+Y5paH5Lu25ZCNKVxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbnRyeT59XHJcbiAqL1xyXG5jb25zdCBjb3B5RmlsZVByb21pc2UgPSAoc3JjUGF0aCwgZGVzdERpciwgZGVzdEZpbGVOYW1lID0gbnVsbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBzdWNjZXNzQ2FsbGJhY2sgPSAoZW50cnkpID0+IHJlc29sdmUoZW50cnkpXHJcbiAgICAgICAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChlKSA9PiByZWplY3QoZSlcclxuXHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoc3JjUGF0aCwgZnVuY3Rpb24gKGZpbGVFbnRyeSkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChkZXN0RGlyLCBmdW5jdGlvbiAoZGlyRW50cnkpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVFbnRyeS5jb3B5VG8oZGlyRW50cnksIGRlc3RGaWxlTmFtZSB8fCBmaWxlRW50cnkubmFtZSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sIGVycm9yQ2FsbGJhY2spXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5Yik5pat5paH5Lu25oiW55uu5b2V5piv5ZCm5a2Y5ZyoXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cclxuICovXHJcbmNvbnN0IGZpbGVPckRpckV4aXN0c1Byb21pc2UgPSAoZmlsZVBhdGgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3NDYWxsYmFjayA9ICgpID0+IHJlc29sdmUodHJ1ZSlcclxuICAgICAgICBjb25zdCBlcnJvckNhbGxiYWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PSAxKSB7IC8vIOaWh+S7tuaIluebruW9leS4jeWtmOWcqCBGaWxlRXJyb3IuTk9UX0ZPVU5EX0VSUlxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8g5YW25a6D6ZSZ6K+vXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGZpbGVQYXRoLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spXHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICog5LuO5LiA5Liq5paH5Lu26Lev5b6E6I635Y+W5paH5Lu25ZCNXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCBcclxuICovXHJcbmNvbnN0IGdldEZpbGVOYW1lID0gKGZpbGVQYXRoKSA9PiB7XHJcbiAgICByZXR1cm4gZmlsZVBhdGguc3BsaXQoXCIvXCIpLnBvcCgpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmiorlhajpg6jnu5nlrprnmoTot6/lvoTniYfmrrXov57mjqXliLDkuIDotbdcclxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHBhdGhzIFxyXG4gKi9cclxuY29uc3Qgam9pblBhdGggPSAoLi4ucGF0aHMpID0+IHtcclxuICAgIHJldHVybiBwYXRocy5qb2luKFwiL1wiKS5yZXBsYWNlKC8oW146XSlcXC97Myx9fChbXi86XSlcXC97Mn0vZywgXCIkMSQyL1wiKVxyXG59XHJcblxyXG4vKipcclxuICog5omL5Yqo6K+35rGCIGFuZHJvaWQucGVybWlzc2lvbi5XUklURV9FWFRFUk5BTF9TVE9SQUdFIOadg+mZkCBcclxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAqL1xyXG5jb25zdCByZXF1ZXN0V3JpdGVFeHRlcm5hbFN0b3JhZ2VQZXJtaXNzaW9uID0gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGNvbnN0IHBlcm1pc3Npb25zID0gd2luZG93LmNvcmRvdmEucGx1Z2lucy5wZXJtaXNzaW9uc1xyXG4gICAgY29uc3QgbmFtZSA9IHBlcm1pc3Npb25zLldSSVRFX0VYVEVSTkFMX1NUT1JBR0VcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKG5hbWUsIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaGFzUGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIOiOt+WPluaWh+S7ti/nm67lvZUgRW50cnlcclxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGgg5paH5Lu26Lev5b6EXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPEVudHJ5Pn1cclxuICovXHJcbmNvbnN0IGdldEVudHJ5ID0gKHBhdGgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwocGF0aCwgcmVzb2x2ZSwgcmVqZWN0KVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIOWGmeWFpeaWh+S7tlxyXG4gKiBAcGFyYW0ge0ZpbGVFbnRyeX0gZW50cnkgXHJcbiAqIEBwYXJhbSB7QmxvYlBhcnR9IGRhdGEg5paH5Lu25YaF5a65XHJcbiAqL1xyXG5jb25zdCB3cml0ZUZpbGVFbnRyeSA9IChlbnRyeSwgZGF0YSkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBlbnRyeS5jcmVhdGVXcml0ZXIoKGZpbGVXcml0ZXIpID0+IHtcclxuICAgICAgICAgICAgZmlsZVdyaXRlci5vbndyaXRlZW5kID0gKCkgPT4gcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIGZpbGVXcml0ZXIub25lcnJvciA9IHJlamVjdFxyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2RhdGFdKVxyXG4gICAgICAgICAgICBmaWxlV3JpdGVyLndyaXRlKGJsb2IpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDor7vlj5bmlofku7ZcclxuICogQHBhcmFtIHtGaWxlRW50cnl9IGVudHJ5XHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XHJcbiAqL1xyXG5jb25zdCByZWFkRmlsZUVudHJ5ID0gYXN5bmMgKGVudHJ5KSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSByZWplY3RcclxuICAgICAgICBlbnRyeS5maWxlKChmaWxlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXN1bHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSlcclxuICAgICAgICB9LCBlcnJvckNhbGxiYWNrKVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8g562J5b6FIENvcmRvdmEg5a6M5YWo5Yqg6L29XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhcHBEaXIgPSB0b3AuY29yZG92YS5maWxlLmFwcGxpY2F0aW9uRGlyZWN0b3J5XHJcbiAgICBjb25zdCBkYXRhRGlyID0gdG9wLmNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5XHJcblxyXG4gICAgY29uc3QgYXJpYTJGaWxlVVJMID0gYXBwRGlyICsgXCJ3d3cvYXJpYTIvYW5kcm9pZC9hcmlhMmNcIlxyXG4gICAgY29uc3QgYXJpYTJDb25mRmlsZVVSTCA9IGFwcERpciArIFwid3d3L2FyaWEyL2FyaWEyLmNvbmZcIlxyXG4gICAgY29uc3QgZG93bmxvYWREaXIgPSBcIi9zdG9yYWdlL2VtdWxhdGVkLzAvRG93bmxvYWQvXCJcclxuXHJcbiAgICAvLyDmmL7npLogQXJpYU5nIEdVSSBmb3IgQW5kcm9pZCDnmoTniYjmnKzlj7dcclxuICAgIGNvbnN0IGFwcFZlcnNpb24gPSBhd2FpdCB0b3AuY29yZG92YS5nZXRBcHBWZXJzaW9uLmdldFZlcnNpb25OdW1iZXIoKVxyXG4gICAgY29uc3QgbG9nb0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJpYS1uZy1sb2dvXCIpXHJcbiAgICBsb2dvRGl2LnRpdGxlID0gYEFyaWFOZyBHVUkgZm9yIEFuZHJvaWQgdiR7YXBwVmVyc2lvbn0gfCAke2xvZ29EaXYudGl0bGV9YFxyXG5cclxuICAgIC8vIGNvbnN0IHNhdmVkQXBwVmVyc2lvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYXBwVmVyc2lvblwiKVxyXG4gICAgLy8gY29uc29sZS5sb2coc2F2ZWRBcHBWZXJzaW9uKVxyXG4gICAgLy8gaWYgKGFwcFZlcnNpb24gIT0gc2F2ZWRBcHBWZXJzaW9uIHx8ICEoYXdhaXQgZmlsZU9yRGlyRXhpc3RzUHJvbWlzZShkYXRhRGlyICsgXCJhcmlhMmNcIikpKSB7XHJcbiAgICAvLyAgICAgdG9wLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYXBwVmVyc2lvblwiLCBhcHBWZXJzaW9uKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIOaJi+WKqOivt+axgiDlrZjlgqjnqbrpl7Tor7vlhpkg55qE5p2D6ZmQXHJcbiAgICBhd2FpdCByZXF1ZXN0V3JpdGVFeHRlcm5hbFN0b3JhZ2VQZXJtaXNzaW9uKClcclxuXHJcbiAgICAvLyDku4XlvZNhcmlhMi5jb25m5paH5Lu25LiN5a2Y5Zyo5pe25aSN5Yi2YXJpYTIuY29uZiwg6Ziy5q2i6YWN572u5paH5Lu26KKr6KaG55uWXHJcbiAgICBpZiAoIWF3YWl0IGZpbGVPckRpckV4aXN0c1Byb21pc2UoZGF0YURpciArIFwiYXJpYTIuY29uZlwiKSkge1xyXG4gICAgICAgIGF3YWl0IGNvcHlGaWxlUHJvbWlzZShhcmlhMkNvbmZGaWxlVVJMLCBkYXRhRGlyKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWkjeWItmFyaWEyY1xyXG4gICAgY29uc3QgY29waWVkRmlsZUVudHJ5ID0gYXdhaXQgY29weUZpbGVQcm9taXNlKGFyaWEyRmlsZVVSTCwgZGF0YURpcilcclxuXHJcbiAgICAvLyDojrflj5blpI3liLbliLDnmoTmlofku7bot6/lvoRcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyRmlsZVVSTCA9IGNvcGllZEZpbGVFbnRyeS5uYXRpdmVVUkwucmVwbGFjZShcImZpbGU6Ly9cIiwgXCJcIilcclxuICAgIGNvbnN0IGNvcGllZEFyaWEyQ29uZkZpbGVVUkwgPSBjb3BpZWRBcmlhMkZpbGVVUkwucmVwbGFjZSgvXFwvYXJpYTJjJC8sIFwiL2FyaWEyLmNvbmZcIilcclxuXHJcbiAgICAvLyDmlK/mjIHkv53lrZjphY3nva7kv67mlLnliLAgYXJpYTIuY29uZiDphY3nva7mlofku7ZcclxuICAgIGNvbnN0IGNvbmZGaWxlRW50cnkgPSBhd2FpdCBnZXRFbnRyeShcImZpbGU6Ly9cIiArIGNvcGllZEFyaWEyQ29uZkZpbGVVUkwpXHJcbiAgICBsZXQgY29uZiA9IFwiXCJcclxuICAgIGNvbnN0IHNhdmVMb2NhbENvbmZpZyA9IGFzeW5jIChvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgaWYgKCFjb25mKSB7XHJcbiAgICAgICAgICAgIGNvbmYgPSBhd2FpdCByZWFkRmlsZUVudHJ5KGNvbmZGaWxlRW50cnkpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvcHRpb25zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgciA9IG5ldyBSZWdFeHAoYF4oPzojXFxcXHMqKT8oJHtrZXl9PSkuKmAsIFwibVwiKVxyXG4gICAgICAgICAgICBpZiAoci50ZXN0KGNvbmYpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25mID0gY29uZi5yZXBsYWNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIkMVwiICsgdmFsdWVcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbmYgKz0gYFxcbiR7a2V5fT0ke3ZhbHVlfWBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGF3YWl0IHdyaXRlRmlsZUVudHJ5KGNvbmZGaWxlRW50cnksIGNvbmYpXHJcbiAgICB9XHJcbiAgICB3aW5kb3cuc2F2ZUxvY2FsQ29uZmlnID0gc2F2ZUxvY2FsQ29uZmlnXHJcblxyXG4gICAgLy8g6L+Q6KGMYXJpYTJj5YmN55qE5YeG5aSH5bel5L2cXHJcbiAgICAvLyAxLiDliJvlu7phcmlhMi5zZXNzaW9u5Lya6K+d5paH5Lu2XHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcInRvdWNoXCIsIGRvd25sb2FkRGlyICsgXCJhcmlhMi5zZXNzaW9uXCJdKVxyXG4gICAgLy8gMi4g6K6pYXJpYTJj5Y+v5omn6KGM5paH5Lu25pyJ6L+Q6KGM5p2D6ZmQXHJcbiAgICBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtcImNobW9kXCIsIFwiMDc3N1wiLCBjb3BpZWRBcmlhMkZpbGVVUkxdKVxyXG5cclxuICAgIC8vIOWIm+W7uuWboOS4uuerr+WPo+iiq+WNoOeUqOiAjOi/kOihjOWksei0peeahOasoeaVsOeahOiuoeaVsOWZqFxyXG4gICAgbGV0IG4gPSAwXHJcblxyXG4gICAgLy8g5ZyoYXJpYTJj5byC5bi45YWz6Zet5ZCO6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIOi/kOihjGFyaWEyY1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtjb3BpZWRBcmlhMkZpbGVVUkwsIFwiLS1jb25mLXBhdGg9XCIgKyBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMXSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLm91dHB1dClcclxuXHJcbiAgICAgICAgICAgIC8vIOiiq+aJi+WKqOWFs+mXreaXtuWPlua2iOiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgICAgICBpZiAocmVzLm91dHB1dC5pbmNsdWRlcyhcInNlY29uZChzKSBoYXMgcGFzc2VkLiBTdG9wcGluZyBhcHBsaWNhdGlvbi5cIikpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAocmVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5vdXRwdXQpXHJcblxyXG4gICAgICAgICAgICAvLyDnq6/lj6PooqvljaDnlKjovr7liLDkuIDlrprmrKHmlbDlkI7ml7blj5bmtojoh6rliqjph43lkK9hcmlhMmNcclxuICAgICAgICAgICAgaWYgKHJlcy5vdXRwdXQuaW5jbHVkZXMoXCJGYWlsZWQgdG8gYmluZCBhIHNvY2tldCwgY2F1c2U6IEFkZHJlc3MgYWxyZWFkeSBpbiB1c2VcIikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuID4gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuKytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSwgZmFsc2UpXHJcbiJdfQ==