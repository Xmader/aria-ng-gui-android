
# cordova create AriaNgGUIAndroid com.xmader.aria_ng_gui_android AriaNgGUI

cordova plugin add https://github.com/petervojtek/cordova-plugin-shell-exec.git
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-app-version
cordova plugin add cordova-plugin-android-permissions

cordova platform add android@9
cordova prepare android

# 将'<script src="cordova.js"></script><script src="js/babel-polyfill.min.js"></script><script src="main.js"></script>'放入index.html中

cordova build android --release --archs=arm --device
