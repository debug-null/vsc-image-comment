// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
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
  console.log('Congratulations, your extension "pseudo" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("pseudo.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from paste-img!");

    vscode.window.showInformationMessage("普通消息");
    vscode.window.showWarningMessage("警告消息");
    vscode.window.showErrorMessage("错误消息");
  });
  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand("plugin-demo.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    vscode.window.showErrorMessage("的点点滴滴");
  });
  context.subscriptions.push(disposable2);

  let command = vscode.commands.registerTextEditorCommand("will.selection", async function (textEditor, edit) {
    const text = textEditor.document.getText(textEditor.selection);
    console.log("选中的文本是:", text);
    vscode.window.showErrorMessage(text);

    let savePath = utils.getTmpFolder();
    let newSavePath = path.resolve(savePath, `pic_${new Date().getTime()}.png`);
    console.log("🚀 ~ file: extension.ts ~ line 71 ~ command ~ newPath", newSavePath);

    try {
      let images = await utils.getPasteImage(newSavePath);
      console.log("🚀 ~ file: extension.ts ~ line 61 ~ command ~ images", images);
    } catch (error) {
      console.log("🚀 ~ file: extension.ts ~ line 63 ~ command ~ error", error);
    }
  });

  context.subscriptions.push(command);
}

// 当插件被设置为无效时执行此生命周期钩子
export function deactivate() {}
