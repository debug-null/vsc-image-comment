import * as vscode from "vscode";
import utils from "../lib/utils";
import * as fse from "fs-extra";
import path = require("path");

interface RangeType {
  filePath: string;
  sl: number;
  sc: number;
  el: number;
  ec: number;
}

export class Decorator {
  context: vscode.ExtensionContext;
  lineDecorator?: vscode.TextEditorDecorationType;
  gutterDecorator?: vscode.TextEditorDecorationType;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.reload();
  }

  reload() {
    if (this.lineDecorator) {
      this.lineDecorator.dispose();
    }
    if (this.gutterDecorator) {
      this.gutterDecorator.dispose();
    }

    const lineProp: vscode.DecorationRenderOptions = {
      outline: "2px #00FF00 dotted",
      borderRadius: "2px",
      borderSpacing: "10"
      // gutterIconPath: context.asAbsolutePath("images/icon.png")
    };
    // const gutterProp: vscode.DecorationRenderOptions = {};

    this.lineDecorator = vscode.window.createTextEditorDecorationType(lineProp);
  }

  async render() {
    if (!vscode.window.activeTextEditor) {
      return;
    }
    const editor = vscode.window.activeTextEditor;
    const rootStorgeDir = utils.getRootDir();
    const isPathExists = fse.pathExistsSync(rootStorgeDir);
    if (!rootStorgeDir || !isPathExists) {
      return;
    }

    const commentFiles = fse.readdirSync(rootStorgeDir);

    const rangeArr = commentFiles
      .map((item: string) => {
        let fileName = item.split(".")[0];
        let lineArr = fileName.split("#");
        if (lineArr.length === 4) {
          return {
            filePath: path.resolve(rootStorgeDir, encodeURIComponent(item)),
            sl: +lineArr[0],
            sc: +lineArr[1],
            el: +lineArr[2],
            ec: +lineArr[3]
          };
        }
      })
      .filter((item) => item) as RangeType[];

    const gutterProps = rangeArr.map((range: RangeType) => {
      const markdown = new vscode.MarkdownString(`<img src='${range.filePath}' width="100%" height="100%"/>`);

      markdown.isTrusted = true;
      markdown.supportHtml = true;

      const commentCommandUri = vscode.Uri.parse(
        `command:comment.remove?${encodeURIComponent(
          JSON.stringify({
            range
          })
        )}`
      );
      markdown.appendMarkdown(`[删除图片注释](${commentCommandUri})`);

      return {
        range: new vscode.Range(range.sl, range.sc, range.el, range.ec),
        hoverMessage: markdown
      };
    });

    editor.setDecorations(this.lineDecorator!, gutterProps);
  }
}
