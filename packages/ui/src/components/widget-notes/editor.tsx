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
import { Box } from '@chakra-ui/react';
import EventBus from '@hooks/event-bus';
import FloatingActions from './floating-actions';

const Component = ({
  id,
  raw,
  setCallbacks,
}: {
  id: string;
  raw?: string;
  setCallbacks: (callbacks: any) => void;
}) => {
  const [state, _setState] = useState(EditorState.createEmpty());
  const [styleBarActive, setStyleBarActive] = useState(false);
  const Bus = useContext(EventBus);
  const editorRef = useRef<Editor>(null);
  const fileName = `${(window as any).VSCH_UID || 'default'}_${id}.html`;

  const convertContent = (data: string) => {
    const html = convertFromHTML(data);
    const content = ContentState.createFromBlockArray(
      html.contentBlocks,
      html.entityMap
    );
    setState(EditorState.createWithContent(content));
  };
  const setState = (newState: EditorState) => {
    _setState(newState);
    const content = newState.getCurrentContent();
    if (state.getCurrentContent() !== content) {
      const data = stateToHTML(content);

      Bus.emit('vsch.ui.setData', {
        module: 'notes',
        fileName,
        data,
      });
    }
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

  const toggleBlock = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    style: string
  ) => {
    e.preventDefault();
    setState(RichUtils.toggleBlockType(state, style));
  };

  const applyStyle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    style: string
  ) => {
    e.preventDefault();
    setState(RichUtils.toggleInlineStyle(state, style));
  };

  useEffect(() => {
    if (raw) convertContent(raw);
    else {
      Bus.emit('vsch.ui.getData', {
        module: 'notes',
        fileName,
      }).then(({ data }: { data: string }) => {
        if (data) convertContent(data);
      });
      setCallbacks({
        delete: () => {
          Bus.emit('vsch.ui.deleteData', {
            module: 'notes',
            fileName,
          });
        },
      });
    }
  }, []);

  return (
    <FloatingActions open={styleBarActive} {...{ toggleBlock, applyStyle }}>
      <Box
        height="100%"
        cursor="text"
        onKeyDown={keyDown}
        display="flex"
        flex="1"
        flexDir="column"
        position="relative"
      >
        <Editor
          ref={editorRef}
          editorState={state}
          onChange={setState}
          onFocus={() => setStyleBarActive(true)}
          onBlur={() => setStyleBarActive(false)}
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
    </FloatingActions>
  );
};

export default Component;
