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
        // 未选中任何字符
        return;
      }

      // 获取剪切板图片
      let savePath = utils.getTmpFolder();
      let newSavePath = path.resolve(savePath, `pic_${new Date().getTime()}.png`);
      let pasteImg = [];
      try {
        pasteImg = await utils.getPasteImage(newSavePath);
        console.log("🚀 ~ file: will-comments.ts ~ line 27 ~ command ~ pasteImg", pasteImg);
      } catch (error) {
        console.error("🚀 ~ file: extension.ts ~ line 63 ~ command ~ error", error);
        return;
      }
      if (!pasteImg) {
        return;
      }

      let imagePath = pasteImg[0];

      const rootStorgeDir = utils.getRootDir();
      if (!rootStorgeDir || !imagePath || imagePath === "no image") {
        console.info("剪切板无图片数据");
        return;
      }

      fse.ensureDirSync(rootStorgeDir);
      let imgSaveName = `${start.line}#${start.character}#${end.line}#${end.character}.png`;
      let targetPath = path.join(rootStorgeDir, imgSaveName);
      fse.copySync(imagePath, targetPath);

      const rangeArr = [
        {
          filePath: path.resolve(rootStorgeDir, encodeURIComponent(imgSaveName)),
          sl: +start.line,
          sc: +start.character,
          el: +end.line,
          ec: +end.character
        }
      ];
      utils.createTip(rangeArr);
    }
  });
  context.subscriptions.push(command);
};

module.exports = willComments;
