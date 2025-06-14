'use client';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const FilePreview = ({ fileName, content }) => {
  if (!content) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>{fileName}</h3>
      <SyntaxHighlighter language="javascript" style={tomorrow}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default FilePreview;
