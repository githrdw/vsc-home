import React from 'react';
import Editor from './editor';

const WidgetNotes = ({
  id,
  raw,
  setCallbacks,
  updateData,
}: {
  id: string;
  raw?: string;
  setCallbacks: () => void;
  updateData: () => void;
}) => {
  return <Editor {...{ id, raw, setCallbacks, updateData }} />;
};

export default WidgetNotes;
