import { extendTheme } from '@chakra-ui/react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../assets/index.scss';

const config = {
  initialColorMode: 'dark',
};

const colors = {
  white: {
    2: 'rgba(255, 255, 255, .2)',
  },
  gray: {
    300: 'var(--vscode-foreground, #cccccc)',
    800: 'var(--vscode-editor-background, #1e1e1e)',
  },
  black: {
    2: 'rgba(0, 0, 0, .2)',
  },
  green: {
    2: 'rgba(56, 161, 105, .2)',
  },
  red: {
    2: 'rgba(229, 62, 62, .2)',
  },
  blue: {
    2: 'rgb(49, 130, 206, .2)',
  },
};

const styles = {
  global: {
    body: {
      bg: 'gray.800',
      font: "var(--vscode-font-family, 'Segoe WPC', 'Segoe UI', sans-serif)",
      color: 'gray.300',
    },
  },
};

export default extendTheme({ config, colors, styles });
