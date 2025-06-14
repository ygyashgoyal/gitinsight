import { chunkCode } from '@/lib/chunkCode';
import { generateEmbedding } from '@/lib/generateEmbedding';
import { insertChunkEmbedding, ensureCollectionExists } from '@/lib/qdrantClient';

export async function POST(req) {
  const { files } = await req.json(); // expects [{ path: 'src/app.js', content: '...' }]

  try {
    await ensureCollectionExists();

    for (const file of files) {
      const chunks = chunkCode(file.content);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);
        await insertChunkEmbedding({
          id: `${file.path}-${i}`,
          embedding,
          text: chunk,
          filePath: file.path,
        });
      }
    }

    console.log('📄 Received files for embedding:', files.map(f => f.path));

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
