"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * AriaNgGUI for Android
 * @author Xmader
 * @copyright Copyright (c) 2018 Xmader. All Rights Reserved.
 * @license MIT
 */
// 输出版权信息
console.info("AriaNgGUI for Android\n\nCopyright (c) 2018 Xmader\nReleased under the MIT license\n\nSource Code: https://github.com/Xmader/aria-ng-gui-android/\n");
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

var copyFilePromise = function copyFilePromise() {};

document.addEventListener('deviceready', function () {
  var aria2FileURL = cordova.file.applicationDirectory + "www/aria2/android/aria2c";
  var aria2ConfFileURL = cordova.file.applicationDirectory + "www/aria2/aria2.conf";
  var downloadDir = "/storage/emulated/0/Download/";

  var successCallback =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(copiedFileEntry) {
      var copiedAria2FileURL, copiedAria2ConfFileURL, n, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              copiedAria2FileURL = copiedFileEntry.nativeURL.replace("file://", "");
              copiedAria2ConfFileURL = copiedAria2FileURL.replace(/\/aria2c$/, "/aria2.conf");
              _context.next = 4;
              return shellExecPromise(["touch", downloadDir + "aria2.session"]);

            case 4:
              _context.next = 6;
              return shellExecPromise(["chmod", "0777", copiedAria2FileURL]);

            case 6:
              n = 0; // 在aria2c异常关闭后自动重启aria2c

            case 7:
              if (!true) {
                _context.next = 28;
                break;
              }

              _context.prev = 8;
              _context.next = 11;
              return shellExecPromise([copiedAria2FileURL, "--conf-path=" + copiedAria2ConfFileURL]);

            case 11:
              res = _context.sent;
              console.log(res.output); // 被手动关闭时取消自动重启aria2c

              if (!res.output.includes("second(s) has passed. Stopping application.")) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("break", 28);

            case 15:
              _context.next = 26;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](8);
              console.log(_context.t0.output); // 端口被占用达到一定次数后时取消自动重启aria2c

              if (!_context.t0.output.includes("Failed to bind a socket, cause: Address already in use")) {
                _context.next = 26;
                break;
              }

              if (!(n > 5)) {
                _context.next = 25;
                break;
              }

              return _context.abrupt("break", 28);

            case 25:
              n++;

            case 26:
              _context.next = 7;
              break;

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[8, 17]]);
    }));

    return function successCallback(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var errorCallback = function errorCallback(e) {
    console.error(e);
  }; // 复制aria2.conf


  window.resolveLocalFileSystemURL(aria2ConfFileURL, function (fileEntry) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
      fileEntry.copyTo(dirEntry, fileEntry.name, function () {}, errorCallback);
    });
  }, errorCallback); // 复制aria2c

  window.resolveLocalFileSystemURL(aria2FileURL, function (fileEntry) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
      fileEntry.copyTo(dirEntry, fileEntry.name, successCallback, errorCallback);
    });
  }, errorCallback);
}, false);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBeUNqRDs7O0FBQ0EsRUFBQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsZ0JBQWpDLEVBQW1ELFVBQVUsU0FBVixFQUFxQjtBQUNwRSxJQUFBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxPQUFPLENBQUMsSUFBUixDQUFhLGFBQTlDLEVBQTZELFVBQVUsUUFBVixFQUFvQjtBQUM3RSxNQUFBLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFFBQWpCLEVBQTJCLFNBQVMsQ0FBQyxJQUFyQyxFQUEyQyxZQUFZLENBQUcsQ0FBMUQsRUFBNEQsYUFBNUQ7QUFDSCxLQUZEO0FBR0gsR0FKRCxFQUlHLGFBSkgsRUExQ2lELENBZ0RqRDs7QUFDQSxFQUFBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxZQUFqQyxFQUErQyxVQUFVLFNBQVYsRUFBcUI7QUFDaEUsSUFBQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxhQUE5QyxFQUE2RCxVQUFVLFFBQVYsRUFBb0I7QUFDN0UsTUFBQSxTQUFTLENBQUMsTUFBVixDQUFpQixRQUFqQixFQUEyQixTQUFTLENBQUMsSUFBckMsRUFBMkMsZUFBM0MsRUFBNEQsYUFBNUQ7QUFDSCxLQUZEO0FBR0gsR0FKRCxFQUlHLGFBSkg7QUFNSCxDQXZERCxFQXVERyxLQXZESCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEFyaWFOZ0dVSSBmb3IgQW5kcm9pZFxyXG4gKiBAYXV0aG9yIFhtYWRlclxyXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxOCBYbWFkZXIuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqIEBsaWNlbnNlIE1JVFxyXG4gKi9cclxuXHJcbi8vIOi+k+WHuueJiOadg+S/oeaBr1xyXG5jb25zb2xlLmluZm8oYEFyaWFOZ0dVSSBmb3IgQW5kcm9pZFxyXG5cclxuQ29weXJpZ2h0IChjKSAyMDE4IFhtYWRlclxyXG5SZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuXHJcblNvdXJjZSBDb2RlOiBodHRwczovL2dpdGh1Yi5jb20vWG1hZGVyL2FyaWEtbmctZ3VpLWFuZHJvaWQvXHJcbmApXHJcblxyXG4vKipcclxuICog6L+Q6KGM5LiA5LiqIHNoZWxsIOWtkOi/m+eoi+W5tuWcqCBzaGVsbCDkuIrov5DooYzlkb3ku6RcclxuICogQHBhcmFtIHtzdHJpbmcgfCBzdHJpbmdbXX0gY21kIFxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7IGV4aXRTdGF0dXM6IG51bWJlcjsgb3V0cHV0OiBzdHJpbmc7IH0+fVxyXG4gKi9cclxuY29uc3Qgc2hlbGxFeGVjUHJvbWlzZSA9IChjbWQpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LlNoZWxsRXhlYy5leGVjKGNtZCwgKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzLmV4aXRTdGF0dXMgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNvcHlGaWxlUHJvbWlzZSA9ICgpID0+IHtcclxuXHJcbn1cclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGFyaWEyRmlsZVVSTCA9IGNvcmRvdmEuZmlsZS5hcHBsaWNhdGlvbkRpcmVjdG9yeSArIFwid3d3L2FyaWEyL2FuZHJvaWQvYXJpYTJjXCJcclxuICAgIGNvbnN0IGFyaWEyQ29uZkZpbGVVUkwgPSBjb3Jkb3ZhLmZpbGUuYXBwbGljYXRpb25EaXJlY3RvcnkgKyBcInd3dy9hcmlhMi9hcmlhMi5jb25mXCJcclxuICAgIGNvbnN0IGRvd25sb2FkRGlyID0gXCIvc3RvcmFnZS9lbXVsYXRlZC8wL0Rvd25sb2FkL1wiXHJcblxyXG4gICAgY29uc3Qgc3VjY2Vzc0NhbGxiYWNrID0gYXN5bmMgZnVuY3Rpb24gKGNvcGllZEZpbGVFbnRyeSkge1xyXG4gICAgICAgIGNvbnN0IGNvcGllZEFyaWEyRmlsZVVSTCA9IGNvcGllZEZpbGVFbnRyeS5uYXRpdmVVUkwucmVwbGFjZShcImZpbGU6Ly9cIiwgXCJcIilcclxuICAgICAgICBjb25zdCBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMID0gY29waWVkQXJpYTJGaWxlVVJMLnJlcGxhY2UoL1xcL2FyaWEyYyQvLCBcIi9hcmlhMi5jb25mXCIpXHJcblxyXG4gICAgICAgIGF3YWl0IHNoZWxsRXhlY1Byb21pc2UoW1widG91Y2hcIiwgZG93bmxvYWREaXIgKyBcImFyaWEyLnNlc3Npb25cIl0pXHJcbiAgICAgICAgYXdhaXQgc2hlbGxFeGVjUHJvbWlzZShbXCJjaG1vZFwiLCBcIjA3NzdcIiwgY29waWVkQXJpYTJGaWxlVVJMXSlcclxuXHJcbiAgICAgICAgbGV0IG4gPSAwXHJcblxyXG4gICAgICAgIC8vIOWcqGFyaWEyY+W8guW4uOWFs+mXreWQjuiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBzaGVsbEV4ZWNQcm9taXNlKFtjb3BpZWRBcmlhMkZpbGVVUkwsIFwiLS1jb25mLXBhdGg9XCIgKyBjb3BpZWRBcmlhMkNvbmZGaWxlVVJMXSlcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5vdXRwdXQpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6KKr5omL5Yqo5YWz6Zet5pe25Y+W5raI6Ieq5Yqo6YeN5ZCvYXJpYTJjXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLm91dHB1dC5pbmNsdWRlcyhcInNlY29uZChzKSBoYXMgcGFzc2VkLiBTdG9wcGluZyBhcHBsaWNhdGlvbi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMub3V0cHV0KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOerr+WPo+iiq+WNoOeUqOi+vuWIsOS4gOWumuasoeaVsOWQjuaXtuWPlua2iOiHquWKqOmHjeWQr2FyaWEyY1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5vdXRwdXQuaW5jbHVkZXMoXCJGYWlsZWQgdG8gYmluZCBhIHNvY2tldCwgY2F1c2U6IEFkZHJlc3MgYWxyZWFkeSBpbiB1c2VcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA+IDUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbisrXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGNvbnN0IGVycm9yQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZSkgeyBjb25zb2xlLmVycm9yKGUpIH1cclxuXHJcbiAgICAvLyDlpI3liLZhcmlhMi5jb25mXHJcbiAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChhcmlhMkNvbmZGaWxlVVJMLCBmdW5jdGlvbiAoZmlsZUVudHJ5KSB7XHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIGZ1bmN0aW9uIChkaXJFbnRyeSkge1xyXG4gICAgICAgICAgICBmaWxlRW50cnkuY29weVRvKGRpckVudHJ5LCBmaWxlRW50cnkubmFtZSwgZnVuY3Rpb24gKCkgeyB9LCBlcnJvckNhbGxiYWNrKTtcclxuICAgICAgICB9KVxyXG4gICAgfSwgZXJyb3JDYWxsYmFjaylcclxuXHJcbiAgICAvLyDlpI3liLZhcmlhMmNcclxuICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGFyaWEyRmlsZVVSTCwgZnVuY3Rpb24gKGZpbGVFbnRyeSkge1xyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBmdW5jdGlvbiAoZGlyRW50cnkpIHtcclxuICAgICAgICAgICAgZmlsZUVudHJ5LmNvcHlUbyhkaXJFbnRyeSwgZmlsZUVudHJ5Lm5hbWUsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XHJcbiAgICAgICAgfSlcclxuICAgIH0sIGVycm9yQ2FsbGJhY2spXHJcblxyXG59LCBmYWxzZSk7XHJcbiJdfQ==