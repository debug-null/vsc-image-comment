import path = require("path");
import * as vscode from "vscode";
import utils from "../lib/utils";
import * as fse from "fs-extra";

interface RangeType {
  filePath: string;
  sl: number;
  sc: number;
  el: number;
  ec: number;
}

const removeComments = (contenxt: vscode.ExtensionContext) => {
  vscode.commands.registerCommand("comment.remove", async (params) => {
    const { range } = params;
    if (!range || !range.filePath) {
      return;
    }
    fse.removeSync(range.filePath);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    // TODO: 不知该如何删除选中行的样式
    let decorationType = vscode.window.createTextEditorDecorationType({});
    editor.setDecorations(decorationType, [new vscode.Range(range.sl, range.sc, range.el, range.ec)]);
  });
};

module.exports = removeComments;
