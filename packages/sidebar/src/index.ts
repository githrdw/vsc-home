import './theme.scss'

import {  unsafeCSS, customElement } from 'lit-element';
import BXButton from 'carbon-web-components/es/components/button/button.js';
import EventBus from 'core/src/utils/EventBusClient.js';

import DragTile from './components/drag-tile'
import Dropdown from 'carbon-web-components/es/components/dropdown/dropdown.js';
import DropdownItem from 'carbon-web-components/es/components/dropdown/dropdown-item.js';

const styleSheets = Array.from(document.styleSheets).find(({ href }) => !!href)
const styleString = styleSheets ? Array.from(styleSheets.rules).map(rule => rule.cssText).join('') : ''
const sharedCss = unsafeCSS(styleString)


@customElement('vsch-drag-tile')
default class extends DragTile {
  static styles = sharedCss
}

@customElement('vsch-dropdown')
default class extends Dropdown {
  static styles = sharedCss

  open = true

}

@customElement('bx-dropdown-item')
default class extends DropdownItem {
  static styles = sharedCss
}

@customElement('vsch-btn')
default class extends BXButton {
  static styles = sharedCss
}


new EventBus()