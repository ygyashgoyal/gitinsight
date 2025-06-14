// app/api/fetchRepoZip/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { user, repo } = await req.json();

    const branches = ['main', 'master'];
    let zipRes = null;

    for (const branch of branches) {
      const zipUrl = `https://github.com/${user}/${repo}/archive/refs/heads/${branch}.zip`;
      zipRes = await fetch(zipUrl);

      if (zipRes.ok) {
        const buffer = await zipRes.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/zip',
          },
        });
      }
    }

    return NextResponse.json(
      { error: 'Could not fetch ZIP. Repo might be private or no valid branches found.' },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
