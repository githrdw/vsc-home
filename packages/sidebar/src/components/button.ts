import BXButton from 'carbon-web-components/es/components/button/button.js';
import { css, customElement } from 'lit-element';

@customElement('vsch-btn')
default class extends BXButton {
  static styles = css`
    ${BXButton.styles}
    .bx--btn {
      min-height: 1.5rem;
      padding: 0 1rem;
    }
  `;
}