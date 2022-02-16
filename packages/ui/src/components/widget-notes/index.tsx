import React from 'react';
import Editor from './editor';

const WidgetNotes = ({
  id,
  raw,
  setCallbacks,
}: {
  id: string;
  raw?: string;
  setCallbacks: () => void;
}) => {
  return <Editor {...{ id, raw, setCallbacks }} />;
};

export default WidgetNotes;
