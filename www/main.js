
document.addEventListener('deviceready', function () {

    window.ShellExec.exec('uptime', function (res) {
        console.log('exit status: ' + res.exitStatus)
        console.log('cmd output: ' + res.output)
    })

}, false);
