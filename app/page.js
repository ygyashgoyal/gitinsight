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

    const parsedFiles = extractFilesFromTree(parsedTree); // flatten to [{ path, content }]
    await sendFilesToEmbeddingAPI(parsedFiles);
  };

  const extractFilesFromTree = (tree) => {
    const files = [];

    const traverse = (node, currentPath = '') => {
      if (node.type === 'file') {
        files.push({ path: `${currentPath}/${node.name}`, content: node.content });
      } else if (node.type === 'folder' && node.children) {
        node.children.forEach(child => traverse(child, `${currentPath}/${node.name}`));
      }
    };

    traverse(tree);
    return files;
  };

  const sendFilesToEmbeddingAPI = async (files) => {
    try {
      const response = await fetch('/api/embedFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to embed files');
      }

      console.log('✅ Embedding complete');
    } catch (err) {
      console.error('❌ Error embedding files:', err.message);
    }
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
