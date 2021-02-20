import { join } from 'path';

const APP_DIR = './dist';
const USR_ROOT = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const USR_APP_DIR = join(USR_ROOT, 'vsc-home');
const WIDGETS_ROOT = 'widgets';
const LAYOUTS_ROOT = 'layouts';

export default {
  APP_DIR,
  USR_ROOT,
  USR_APP_DIR,
  WIDGETS_ROOT,
  LAYOUTS_ROOT
};