import React from 'react';
import Editor from './editor';

const WidgetNotes = ({ id }: { id: string }) => {
  return <Editor {...{ id }} />;
};

export default WidgetNotes;
