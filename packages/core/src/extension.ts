// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Api from './api';
import MainWebview from './views/MainWebview';
import SidebarWebview from './views/SidebarWebview';
import InitialAppdata from './utils/InitAppdata';

const EventBus = new Api();
const userConfig = vscode.workspace.getConfiguration('home');
let currentPanel: vscode.WebviewPanel | undefined = undefined;

const EmitViewChange = (active: boolean) => {
	EventBus.emitAll({ payload: { action: 'ui.isActive', active } });
};

const openMainView = (context: vscode.ExtensionContext) => {
	const columnToShowIn = vscode.window.activeTextEditor
		? vscode.window.activeTextEditor.viewColumn
		: undefined;
	if (currentPanel) {
		currentPanel.reveal(columnToShowIn);
	} else {
		const assets = (file: string) => import(`@vsch/ui/dist/${file}`);
		const view = new MainWebview(context, assets);
		view.onReady(webview => {
			currentPanel = view.panel;
			EmitViewChange(true);
			EventBus.register(webview);
		});
		view.panel?.onDidChangeViewState(({ webviewPanel: { active } }) => EmitViewChange(active));
		view.onDestroy((webview) => {
			currentPanel = undefined;
			EventBus.unregister(webview);
			EmitViewChange(false);
		});

		view.getWebviewContent();
	}
};

const openSidebarView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@vsch/sidebar/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	InitialAppdata();

	const mainViewCommand = vscode.commands.registerCommand('vsch.openMainView', async () => {
		// The code you place here will be executed every time your command is executed
		openMainView(context);
	});

	const openOnStartup = userConfig.get('openOnStartup');
	if (openOnStartup) {
		openMainView(context);
	}
	context.subscriptions.push(mainViewCommand);

	const sidebarView = vscode.window.registerWebviewViewProvider("vsch.openSidebarView", openSidebarView(context));
	context.subscriptions.push(sidebarView);
}

// this method is called when your extension is deactivated
export function deactivate() { }
