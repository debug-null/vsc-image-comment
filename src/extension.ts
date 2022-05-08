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

	/** 获取剪切板图片 */
    // let savePath = utils.getTmpFolder();
    // let newSavePath = path.resolve(savePath, `pic_${new Date().getTime()}.png`);
    // console.log("🚀 ~ file: extension.ts ~ line 71 ~ command ~ newPath", newSavePath);

    // try {
    //   let images = await utils.getPasteImage(newSavePath);
    //   console.log("🚀 ~ file: extension.ts ~ line 61 ~ command ~ images", images);
    // } catch (error) {
    //   console.log("🚀 ~ file: extension.ts ~ line 63 ~ command ~ error", error);
    // }

    // const editor = vscode.window.activeTextEditor;
    // console.log("🚀 ~ file: extension.ts ~ line 56 ~ command ~ editor", editor);
    // console.log( editor.selection.start.line);
	/** 获取剪切板图片  end*/

    let decorationType = vscode.window.createTextEditorDecorationType({
      //   backgroundColor: "#f00",
      //   border: '1px solid red;',
      outline: "#00FF00 dotted",
      gutterIconPath: context.asAbsolutePath("images/icon.png")
    });
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
      /**
       *   range
       *  * @param startLine 开始的行数
       * @param startCharacter 从开始行数的第几个字符开始.
       * @param endLine 结束的行数.
       * @param endCharacter 从结束行数的第几个字符结束.
       */
      activeTextEditor.setDecorations(decorationType, [new vscode.Range(3, 3, 5, 0)]);
    }
  });

  context.subscriptions.push(command);
}

// 当插件被设置为无效时执行此生命周期钩子
export function deactivate() {}
