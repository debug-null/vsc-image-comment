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

const renderComments = (context: vscode.ExtensionContext) => {
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

  utils.createTip(rangeArr);
};

module.exports = renderComments;
