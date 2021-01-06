import * as vscode from 'vscode';
const os = require('os');
const homedir = os.homedir();

export const templateAdd = {
	name: 'es-cli.template.add',
	callback: function (...arg: any) {
		vscode.window
			.showInputBox({
				// 这个对象中所有参数都是可选参数
				password: false, // 输入内容是否是密码
				ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
				placeHolder: '请输入模板名称', // 在输入框内的提示信息
				prompt: '赶紧输入，不输入就赶紧滚', // 在输入框下方的提示信息
				validateInput: function (text) {
					return text;
				}, // 对输入内容进行验证并返回
			})
			.then(function (msg) {
                console.log('用户输入：' + msg);
                
			});
	},
};

export const templateEdit = {
	name: 'es-cli.template.edit',
	callback: function () {
		vscode.window
			.showOpenDialog({
				// 可选对象
				canSelectFiles: true, // 是否可选文件
				canSelectFolders: false, // 是否可选文件夹
				canSelectMany: false, // 是否可以选择多个
				defaultUri: vscode.Uri.file(homedir+ '\\.es-cli\\template'), // 默认打开本地路径
				openLabel: '按钮文字说明',
			})
			.then(function (msg) {
                if(msg) {
                    console.log(msg);
                   
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(msg[0].path));
                }
			});
	},
};
