// lib/qdrantClient.js

import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY, // optional if not using auth
});

const COLLECTION_NAME = 'gitinsight_chunks';

export async function ensureCollectionExists() {
  const collections = await client.getCollections();
  const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

  if (!exists) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384,         // vector size for e5-small/bge-small
        distance: 'Cosine' // similarity metric
      },
    });
  }
}

export async function insertChunkEmbedding({ id, embedding, text, filePath }) {
  await client.upsert(COLLECTION_NAME, {
    points: [{
      id,
      vector: embedding,
      payload: { text, filePath },
    }],
  });
}

export async function searchSimilarChunks(queryEmbedding, topK = 5) {
  return await client.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: topK,
  });
}
