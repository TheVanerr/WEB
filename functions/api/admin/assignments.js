// Admin: atama (makine-doküman eşleştirmesi) listele / ekle.
const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ env }) {
  const res = await env.DB.prepare('SELECT * FROM assignments').all();
  return json((res.results || []).map((a) => ({ ...a, _id: a.id })));
}

export async function onRequestPost({ request, env }) {
  const a = await request.json();
  const seri = String(a.makineSeriNo ?? '').trim();
  const kod = String(a.dokumanKodu ?? '').trim();
  if (!seri || !kod) return json({ error: 'Eksik veri.' }, 400);

  const doc = await env.DB.prepare('SELECT id FROM documents WHERE dokumanKodu = ?').bind(kod).first();
  if (!doc) return json({ error: 'Bu doküman kodu ile kayıt bulunamadı.' }, 404);

  const dup = await env.DB
    .prepare('SELECT id FROM assignments WHERE makineSeriNo = ? AND dokumanKodu = ?')
    .bind(seri, kod)
    .first();
  if (dup) return json({ error: 'Bu doküman zaten bu makineye tanımlı.' }, 409);

  const r = await env.DB
    .prepare('INSERT INTO assignments (makineSeriNo, dokumanKodu) VALUES (?, ?)')
    .bind(seri, kod)
    .run();

  return json({ id: r.meta.last_row_id });
}
