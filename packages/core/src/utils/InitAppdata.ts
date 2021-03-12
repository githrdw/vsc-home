import { Uri, workspace, window } from "vscode";
import { join } from 'path';
import vars from '../vars';

export default async function () {
  const root = Uri.file(vars.USR_APP_DIR);
  try {
    await workspace.fs.createDirectory(root);
  } catch (e) {
    window.showErrorMessage(`Not able to create configuration directory in AppData: ${e.toString()}`);
  }

  const widgets = Uri.file(join(vars.USR_APP_DIR, vars.WIDGETS_ROOT));
  try {
    await workspace.fs.createDirectory(widgets);
  } catch (e) {
    console.warn(`Not able to create widgets directory in configuration directory: ${e.toString()}`);
  }
}