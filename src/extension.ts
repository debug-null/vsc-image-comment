// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { TextDecoder, TextEncoder } from "util";
import * as path from "path";
import * as fs from "fs";
import utils from "./lib/utils";


/**
 * 此生命周期方法在插件激活时执行
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  require('./module/will-comments')(context);
  

  let disposable33 = vscode.languages.registerHoverProvider("*", {
    provideHover(document, position, token) {
      const fileName = document.fileName;
      // console.log("🚀 ~ file: extension.ts ~ line 92 ~ provideHover ~ fileName", fileName);
      // const word = document.getText(document.getWordRangeAtPosition(position));
      // if (/\/package\.json$/.test(fileName) && /\bauthor\b/.test(word)) {
      //   return new vscode.Hover('悬停提示: 彭道宽牛逼!22');
      // }
      // return undefined;

      // const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
      // const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);
      // console.log("🚀 ~ file: extension.ts ~ line 101 ~ provideHover ~ contents", contents);
      // // contents.isTrusted = true;

      // return new vscode.Hover(contents);

      const markdown = new vscode.MarkdownString(`<h1>图片注释</h1> <img src='https://s0.2mdn.net/simgad/15402265117070747571'/>`);

      // markdown.isTrusted = true;
      markdown.supportHtml= true;

      return new vscode.Hover(markdown, new vscode.Range(position, position));
    }
  });

  context.subscriptions.push(disposable33);
}

// 当插件被设置为无效时执行此生命周期钩子
export function deactivate() {}
