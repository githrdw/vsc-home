
<p align="center">
  <img src="packages/core/assets/logo_vschome.white.min.png" height="56" alt="VSCH Logo" />
</p>
<h1 align="center">VSC-Home</h1>
<i><p align="center">
An homecoming dashboard extension for Visual Studio Code
</p></i>
<br/>
<img src="assets/Demo - Dashboard.png" alt="Screenshot of usage" />
<br/>
<br/>

## Introdcution
`Home` is an extension for Visual Studio Code that allows you to design your own **dashboard** with built-in or custom **React components**.
The following features are available:

* Drag-n-drop grid
* Colorable
* Default widgets
  * List of **recent opened** folders/worspaces
  * **Custom list** of folders/workspaces
* Your own React widgets

> Note that this project is in very early stage and much needs to be done

## How to add your widget
For the time-being the following steps must be taken
1. Ensure that there is at least one widget placed on your dashboard
2. Open the appdata folder on your machine
<br/>**Windows**<br/> `%appdata%/vsc-home`
<br/>**Mac**<br/> (not yet verified where this directory is)
<br/>**Linux**<br/> (not yet verified where this directory is)
3. Create or go to the directory `widgets`
4. Clone the widget template here
<br/>*Make sure that this directory starts with `vsch_`*
5. Build the widget (resulting in a `dist` folder)
6. Re-open the sidebar
7. Drag your widget into the grid

All configurations are stored in AppData, feel free to have a look and customize!

## Technical details
The application consists of three modules; a sidebar, grid (both web views) and the core. 

### Core
Causes the web views to be opened and handles requests to the VSCode api.
Also sets up an EventBus for the webviews, so they are able to communicate with each other.

Used techniques: 
[VSCode API](https://code.visualstudio.com/api/references/vscode-api), Typescript, Webpack

### Grid
The most important element of this extension, namely providing a drag-n-drop grid on which widgets can be placed.

Used techniques: 
[React](https://github.com/facebook/react), 
[ChakraUI](https://github.com/chakra-ui/chakra-ui),
[React-grid-layout](https://github.com/react-grid-layout/react-grid-layout), 
Typescript, 
Webpack 
(with [module-federation](https://module-federation.github.io/blog/get-started) to dynamically load React components!)

### Sidebar
Sidebar with `Home` icon as shortcut / escape hatch to the dashboard itself.
Also contains a list of components to use that can be dragged to the grid 

Used techniques: HTML, Sass, ES6, Rollup

## Todo
- Add more widget controls
  - Delete
  - Change color
  - Change icon
- Add more built-in widgets
  - WYSIWYG notes editor
- Collection widget
  - Add context menu for modifying the list of folders
- Recent projects widget
  - Option to limit projects count
  - Option to duplicate / transform to static collection widget
- Access to VS Code API from external widget
- Automate the custom React component creation flow
- CORS
