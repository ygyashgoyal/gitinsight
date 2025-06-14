'use client';
import React, { useState } from 'react';

const GitHubLinkUploader = ({ onZipUpload }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    let user, repo;

    try {
      const urlObj = new URL(url.trim());
      [user, repo] = urlObj.pathname.split('/').filter(Boolean);
      if (!user || !repo) throw new Error();
    } catch {
      alert('Invalid GitHub URL. Use format: https://github.com/user/repo');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/fetchRepoZip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, repo }),
      });

      if (!res.ok) {
        throw new Error('Repo not found or no valid branches.');
      }

      const arrayBuffer = await res.arrayBuffer();
      onZipUpload(arrayBuffer);
    } catch (err) {
      alert('❌ Could not fetch the repository zip. It may be private or have no valid branch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="https://github.com/user/repo"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '300px', marginRight: '0.5rem' }}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Repo'}
      </button>
    </div>
  );
};

export default GitHubLinkUploader;
