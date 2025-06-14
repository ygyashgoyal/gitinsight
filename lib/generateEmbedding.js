// lib/generateEmbedding.js

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = 'intfloat/e5-small'; // or 'BAAI/bge-small-en'

export async function generateEmbedding(text) {
  const response = await fetch(`https://api-inference.huggingface.co/pipeline/feature-extraction/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(text),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Embedding API error: ${error}`);
  }

  const result = await response.json();
  return result[0]; // returns a single embedding vector
}
