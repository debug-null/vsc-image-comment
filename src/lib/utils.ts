import * as fs from 'fs';
import { spawn, exec } from 'child_process';
import * as vscode from 'vscode';
import * as path from "path";
import { tmpdir } from "os";
import * as pkg from '../../package.json';

/**
 * 获取临时文件目录
 * @returns 
 */
function getTmpFolder() {
    let savePath = path.join(tmpdir(), pkg.name);
    if (!fs.existsSync(savePath)) { fs.mkdirSync(savePath); }
    return savePath;
}

/**
 *  获取剪贴板图片 (将图片文件保存至imagePath路径)
 * @param imagePath 图片存储路径
 * @returns 
 */
function getPasteImage(imagePath: string) : Promise<string[]>{
    return new Promise((resolve, reject) => {
        if (!imagePath) { return; }

        let platform = process.platform;
        if (platform === 'win32') {
            // Windows
            const scriptPath = path.join(__dirname, '..' , 'src/lib/script/pc.ps1');
            let command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
            let powershellExisted = fs.existsSync(command);
            let output = '';
            if (!powershellExisted) {
                command = "powershell";
            }

            const powershell = spawn(command, [
                '-noprofile',
                '-noninteractive',
                '-nologo',
                '-sta',
                '-executionpolicy', 'unrestricted',
                '-windowstyle', 'hidden',
                '-file', scriptPath,
                imagePath
            ]);
            // the powershell can't auto exit in windows 7 .
            let timer = setTimeout(() => powershell.kill(), 2000);

            powershell.on('error', (e: any) => {
                if (e.code === 'ENOENT') {
                    vscode.window.showErrorMessage('powershell_not_found');
                } else {
                    vscode.window.showErrorMessage(e);
                }
            });

            powershell.on('exit', function (code, signal) {
                // console.debug('exit', code, signal);
            });
            powershell.stdout.on('data', (data) => {
                data.toString().split('\n').forEach(d => output += (d.indexOf('Active code page:') < 0 ? d + '\n' : ''));
                clearTimeout(timer);
                timer = setTimeout(() => powershell.kill(), 2000);
            });
            powershell.on('close', (code) => {
                resolve(output.trim().split('\n').map(i => i.trim()));
            });
        }
        else if (platform === 'darwin') {
            // Mac
            const scriptPath = path.join(__dirname, '..' , 'src/lib/script/mac.applescript');
            let ascript = spawn('osascript', [scriptPath, imagePath]);
            ascript.on('error', (e: any) => {
                vscode.window.showErrorMessage(e);
            });
            ascript.on('exit', (code, signal) => {
                console.debug('exit', code, signal);
            });
            ascript.stdout.on('data', (data) => {
                resolve(data.toString().trim().split('\n'));
            });
        } else {
            // Linux

            const scriptPath = path.join(__dirname, '..', '..' , 'script/linux.sh');

            let ascript = spawn('sh', [scriptPath, imagePath]);
            ascript.on('error', (e: any) => {
                vscode.window.showErrorMessage(e);
            });
            ascript.on('exit', (code, signal) => {
                // console.debug('exit',code,signal);
            });
            ascript.stdout.on('data', (data) => {
                let result = data.toString().trim();
                if (result === "no xclip") {
                    vscode.window.showInformationMessage('install_xclip');
                    return;
                }
                let match = decodeURI(result).trim().match(/((\/[^\/]+)+\/[^\/]*?\.(jpg|jpeg|gif|bmp|png))/g);
                resolve(match || []);
            });
        }
    });
}

export default {getPasteImage,getTmpFolder};