import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertFromHTML,
  ContentState,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Box } from '@chakra-ui/layout';
import EventBus from '@hooks/event-bus';

const Component = ({ id }: { id: string }) => {
  const [state, _setState] = useState(EditorState.createEmpty());
  const Bus = useContext(EventBus);
  const editorRef: any = useRef();

  useEffect(() => {
    Bus.emit('vsch.ui.getData', {
      module: 'notes',
      fileName: id + '.html',
    }).then(({ data }: { data: string }) => {
      if (data) {
        const html = convertFromHTML(data);
        const content = ContentState.createFromBlockArray(
          html.contentBlocks,
          html.entityMap
        );
        setState(EditorState.createWithContent(content));
      }
    });
  }, []);

  const setState = (newState: EditorState) => {
    _setState(newState);
    const content = newState.getCurrentContent();
    const html = stateToHTML(content);

    Bus.emit('vsch.ui.setData', {
      module: 'notes',
      fileName: id + '.html',
      data: html,
    });
  };

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
      ID: {id}
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
