// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Decorator } from "./lib/decorator";
/**
 * 此生命周期方法在插件激活时执行
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
  const decorator: Decorator = new Decorator(context);
  decorator.render();   // 渲染样式

  require("./module/will-comments")(context, decorator);
  require("./module/remove-comments")(context, decorator);
}

// 当插件被设置为无效时执行此生命周期钩子
export function deactivate() {}
