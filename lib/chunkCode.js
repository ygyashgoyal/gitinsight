// lib/chunkCode.js

export function chunkCode(content, maxLines = 80) {
  const lines = content.split('\n');
  const chunks = [];
  let chunk = [];

  for (const line of lines) {
    chunk.push(line);
    if (chunk.length >= maxLines) {
      chunks.push(chunk.join('\n'));
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    chunks.push(chunk.join('\n'));
  }

  return chunks;
}
