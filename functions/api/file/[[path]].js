// Dosya indirme: R2'den akıtır. Şimdilik herkese açık (giren indirir).
export async function onRequestGet({ params, env }) {
  const key = Array.isArray(params.path) ? params.path.join('/') : params.path;
  if (!key) return new Response('Bulunamadı', { status: 404 });

  const obj = await env.BUCKET.get(key);
  if (!obj) return new Response('Bulunamadı', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=3600');
  return new Response(obj.body, { headers });
}
