// Admin: dosyayı R2'ye yükle, obje anahtarını (r2Key) dön.
const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const file = form.get('file');
  const kodRaw = String(form.get('dokumanKodu') || '').trim();

  if (!file || typeof file === 'string') return json({ error: 'Dosya bulunamadı.' }, 400);

  const kod = (kodRaw || crypto.randomUUID()).replace(/[^A-Za-z0-9._-]/g, '_');
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `docs/${kod}.${ext}`;

  const buf = await file.arrayBuffer();
  await env.BUCKET.put(key, buf, {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  return json({ r2Key: key, dosyaUrl: '/api/file/' + key });
}
