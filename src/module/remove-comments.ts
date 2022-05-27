import path = require("path");
import * as vscode from "vscode";
import utils from "../lib/utils";
import * as fse from "fs-extra";
import { Decorator } from "../lib/decorator";

interface RangeType {
  filePath: string;
  sl: number;
  sc: number;
  el: number;
  ec: number;
}

const removeComments = (contenxt: vscode.ExtensionContext, decorator: Decorator) => {
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
    decorator.render();
  });
};

module.exports = removeComments;
