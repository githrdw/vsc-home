import { extendTheme } from '@chakra-ui/react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../assets/index.scss';

const styles = {
  global: {
    body: {
      bg: 'var(--vscode-editor-background, #1e1e1e)',
      font: "var(--vscode-font-family, 'Segoe WPC', 'Segoe UI', sans-serif)",
      color: 'var(--vscode-foreground, #cccccc)',
    },
    button: {
      color: 'var(--vscode-foreground, #cccccc)',
      cursor: 'pointer',
    },
    input: {
      color: 'var(--vscode-foreground, #cccccc)',
      outline: 'none',
    },
    pre: {
      fontFamily: 'var(--vscode-editor-font-family, Monaco)',
      margin: 0,
    },
  },
};

const colors = {
  gray: {
    700: 'var(--vscode-editor-background, #1e1e1e)',
  },
};

export default extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  styles,
  colors,
});
