import * as vscode from "vscode";
import WillComments from "../lib/will";
import utils from "../lib/utils";
import * as path from "path";
const fse = require("fs-extra");

let willComments = (context: vscode.ExtensionContext) => {
  let command = vscode.commands.registerTextEditorCommand("will.selection", async function (textEditor, edit) {
    const text = textEditor.document.getText(textEditor.selection);
    console.log("选中的文本是:", text);

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const { start, end } = editor.selection;
      console.log("🚀 ~ file: will-comments.ts ~ line 11 ~ command ~ start, end", start, end);
      if (start.line === end.line && start.character === end.character) {
        //   未选中任何字符
        return;
      }

      // 获取剪切板图片
      let savePath = utils.getTmpFolder();
      let newSavePath = path.resolve(savePath, `pic_${new Date().getTime()}.png`);
      let pasteImg = [];
      try {
        pasteImg = await utils.getPasteImage(newSavePath);
      } catch (error) {
        console.log("🚀 ~ file: extension.ts ~ line 63 ~ command ~ error", error);
        return;
      }
      if (!pasteImg) {
        return;
      }

      let imagePath = pasteImg[0];

      const rootStorgeDir = utils.getRootDir();
      if (!rootStorgeDir || !imagePath || imagePath === "no image") {
        return;
      }

      fse.ensureDirSync(rootStorgeDir);
      let imgSaveName = `${start.line}#${start.character}#${end.line}#${end.character}`;
      let targetPath = path.join(rootStorgeDir, imgSaveName + ".png");
      fse.copySync(imagePath, targetPath);

      let decorationType = vscode.window.createTextEditorDecorationType({
        //   backgroundColor: "#f00",
        border: "1px solid red;",
        outline: "#00FF00 dotted"
        // gutterIconPath: context.asAbsolutePath("images/icon.png")
      });
      /**
       *  vscode.Range
       * @param startLine 开始的行数
       * @param startCharacter 从开始行数的第几个字符开始.
       * @param endLine 结束的行数.
       * @param endCharacter 从结束行数的第几个字符结束.
       */
      editor.setDecorations(decorationType, [new vscode.Range(start.line, start.character, end.line, end.character)]);
    }
  });
  context.subscriptions.push(command);
};
module.exports = willComments;
