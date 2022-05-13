import path = require("path");
import * as vscode from "vscode";
import utils from "../lib/utils";
const fse = require("fs-extra");


const renderComments = (context: vscode.ExtensionContext) => {
  const rootStorgeDir = utils.getRootDir();
  if (!rootStorgeDir) {
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
          sl:+lineArr[0],
          sc:+lineArr[1],
          el:+lineArr[2],
          ec:+lineArr[3]
        };
      }
    })
    .filter((item: any) => item);

    utils.createTip(rangeArr);

};

module.exports = renderComments;
