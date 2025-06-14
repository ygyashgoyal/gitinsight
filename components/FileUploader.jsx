'use client';
import React from 'react';

const FileUploader = ({ onZipUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      const arrayBuffer = await file.arrayBuffer();
      onZipUpload(arrayBuffer);
    } else {
      alert('Please upload a .zip file');
    }
  };

  return <input type="file" accept=".zip" onChange={handleFileChange} />;
};

export default FileUploader;
