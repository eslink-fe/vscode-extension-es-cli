import * as vscode from 'vscode';
import * as fse from 'fs-extra';
const os = require('os');
const path = require('path');
const fs = require('fs');
const homedir = os.homedir();

const templateConfigPath = homedir + '\\.es-cli\\template\\config.json';
const templateUserConfigPath = homedir + '\\.es-cli\\template\\user.json';
const templateListPath =  homedir + '\\.es-cli\\template\\list';

const {workspace, Uri} = vscode;

function readFile(filePath:string) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err:any, data:any) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

interface IFileData {
    name: string
}

//获取模板扩展名
function getExtname(filename:string): string {
	console.log(filename);
	if (!filename) return '';
	let some = filename.split('.');
	some.shift();
	return '.' + some.join('.');
}

function compileTemplate(data:IFileData, tempalte:string): string {
	return tempalte.replace(/\$\{name\}/g, data.name);
}

function makeFile(name:string, newPath:string, tempPath:string) {
    readFile(tempPath)
        .then((text:any) => {
            const fileText = compileTemplate({ name }, text);
            fs.writeFile(newPath, fileText, 'utf8', (err: any) => {
                console.log(err);
            });
        });
}

export default {
	name: 'es-cli.file.create',
	callback: async function (target:any) {
        let targetPath = target._fsPath;
        if(path.extname(targetPath)) {
            targetPath = path.dirname(targetPath);
        }
        const config = await fse.readJSON(templateConfigPath);
        const userConfig = await fse.readJSON(templateUserConfigPath);
        const list = [...config.list, ...userConfig.list];
        list.map(item => {
            item.label = item.name;
            item.description = item.fileName;
            item.picked = false;
        });
        const one = await vscode.window.showQuickPick(list);
        const name = await vscode.window.showInputBox({
            placeHolder: '请输入文件名'
        });
        const extname = path.extname(one.fileName);
        if (extname) {
            // 单模板
            const filePath = path.resolve(templateListPath, one.fileName);
            let newFileName = `${name}${extname}`;
            if (name) {
                makeFile(name, `${targetPath}\\${newFileName}`, filePath);
            }
        } else {
            const filePath = path.resolve(templateListPath, one.fileName);
            workspace.fs.createDirectory(Uri.file(targetPath + '\\' + name ));
            const templateList = await workspace.fs.readDirectory(Uri.file(filePath));
            templateList.forEach(async ary => {
                let tempFileName = ary[0];
                let ext = getExtname(tempFileName);
                let newFileName = `${name}${ext}`;
                if(name) {
                    makeFile(name, `${targetPath}\\${newFileName}`, `${filePath}\\${tempFileName}`);
                }
            });
        }
	},
};
