import React, { useState, useRef } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import { Box } from '@chakra-ui/layout';

const Component = () => {
  const [state, setState] = useState(EditorState.createEmpty());
  const editorRef: any = useRef();

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const keyDown: any = (e: KeyboardEvent) => {
    if (e.code === 'Tab') {
      e.preventDefault();
      const newContentState = Modifier.replaceText(
        state.getCurrentContent(),
        state.getSelection(),
        '  '
      );
      setState(EditorState.push(state, newContentState, 'insert-characters'));
    } else {
      e.stopPropagation();
    }
  };

  return (
    <Box
      height="100%"
      onClick={() => editorRef.current.focus()}
      cursor="text"
      onKeyDown={keyDown}
    >
      <Editor
        ref={editorRef}
        editorState={state}
        onChange={setState}
        handleKeyCommand={handleKeyCommand}
        customStyleMap={{
          CODE: {
            fontFamily: 'var(--vscode-editor-font-family, Monaco)',
            paddingInline: '.2em',
            borderRadius: '2px',
            background: 'rgba(0, 0, 0, 0.16)',
          },
        }}
      />
    </Box>
  );
};

export default Component;
