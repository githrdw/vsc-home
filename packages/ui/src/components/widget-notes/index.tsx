import React from 'react';
import Editor from './editor';

const WidgetNotes = ({
  id,
  setCallbacks,
}: {
  id: string;
  setCallbacks: () => void;
}) => {
  return <Editor {...{ id, setCallbacks }} />;
};

export default WidgetNotes;
