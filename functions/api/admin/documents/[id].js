// Admin: doküman sil — hem R2 dosyasını hem atamalarını birlikte temizler (cascade).
export async function onRequestDelete({ params, env }) {
  const doc = await env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(params.id).first();
  if (doc) {
    if (doc.r2Key) {
      try { await env.BUCKET.delete(doc.r2Key); } catch (_) { /* yoksa geç */ }
    }
    await env.DB.prepare('DELETE FROM assignments WHERE dokumanKodu = ?').bind(doc.dokumanKodu).run();
    await env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(params.id).run();
  }
  return new Response(null, { status: 204 });
}
