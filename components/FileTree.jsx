'use client';
import React from 'react';

const FileTree = ({ tree, onSelect, path = '' }) => {
  return (
    <ul style={{ marginLeft: '1rem' }}>
      {Object.entries(tree).map(([name, node]) => {
        if (name === '__file__' || name === '__content__') return null;
        const fullPath = path ? `${path}/${name}` : name;
        const isFile = node.__file__;

        return (
          <li key={fullPath}>
            <span
              onClick={() => isFile && onSelect(fullPath, node.__content__)}
              style={{ cursor: isFile ? 'pointer' : 'default', fontWeight: isFile ? 'normal' : 'bold' }}
            >
              {isFile ? '📄' : '📁'} {name}
            </span>
            {!isFile && <FileTree tree={node} onSelect={onSelect} path={fullPath} />}
          </li>
        );
      })}
    </ul>
  );
};

export default FileTree;
