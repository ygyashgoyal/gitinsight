'use client';
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import GitHubLinkUploader from '../components/GitHubLinkUploader';
import FileTree from '../components/FileTree';
import FilePreview from '../components/FilePreview';
import { parseZip } from '../lib/parseZip';

const HomePage = () => {
  const [tree, setTree] = useState(null);
  const [selected, setSelected] = useState({ fileName: '', content: '' });

  const handleZipBuffer = async (arrayBuffer) => {
    const parsedTree = await parseZip(arrayBuffer);
    setTree(parsedTree);
    setSelected({ fileName: '', content: '' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        GitInsight - Upload or Fetch a GitHub Repo
      </h1>
      <div className='p-10 flex gap-5 flex-col items-center'>
      <FileUploader onZipUpload={handleZipBuffer} />

      <p className='text-3xl font-bold'>-----------------OR------------------</p>

      <GitHubLinkUploader onZipUpload={handleZipBuffer} />
      </div>

      {tree && (
        <div style={{ marginTop: '1.5rem' }}>
          <FileTree tree={tree} onSelect={(fileName, content) => setSelected({ fileName, content })} />
          <FilePreview fileName={selected.fileName} content={selected.content} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
