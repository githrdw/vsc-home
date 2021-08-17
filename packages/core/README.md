
<p align="center">
  <img src="https://github.com/githrdw/vsc-home/raw/main/packages/core/assets/logo_vschome.white.min.png" height="56" alt="VSCH Logo" />
</p>
<h1 align="center">VSC-Home</h1>
<i><p align="center">
A homecoming dashboard extension for Visual Studio Code
</p></i>
<br/>
<img src="https://github.com/githrdw/vsc-home/raw/main/packages/core/assets/Demo - Dashboard 4.png" alt="Screenshot of usage" />
<br/>
<br/>

## Introduction
`Home` is an extension for Visual Studio Code that allows you to design your own **dashboard** with built-in or custom **React components**.
The following features are available:

* ➕ Create and name multiple layouts
* 🐲 Drag-n-drop grid
* 🎨 Colorable
* 🌟 Default widgets
  * List of **recent opened** folders/worspaces
  * **Custom list** of folders/workspaces
  * **WYSIWYG** editor
* 🎉 Your own React widgets
<br/>
<br/>

<img src="https://github.com/githrdw/vsc-home/raw/main/packages/core/assets/Demo - Dashboard 3.png" alt="Screenshot of usage" />
<br/>
<br/>

## How to add your widget
You can start using the [vsch-template](https://github.com/githrdw/vsch-template):
1. Go to `%appdata%/vsc-home/widgets` or similar
2. Clone the template and name the directory `vsch_Demo`:
```
git clone git@github.com:githrdw/vsch-template.git vsch_Demo
```
3. Build and install the widget
```
cd vsch_Demo
yarn install
# or npm install
yarn build
# or npm build
```
4. Drag your new widget into the grid

All configurations are stored in AppData, feel free to have a look and customize!