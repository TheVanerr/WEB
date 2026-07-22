// Admin: makine listele / ekle. /api/admin/* Cloudflare Access ile korunur.
const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ env }) {
  const res = await env.DB.prepare('SELECT * FROM machines ORDER BY id DESC').all();
  return json((res.results || []).map((r) => ({ ...r, _id: r.id })));
}

export async function onRequestPost({ request, env }) {
  const m = await request.json();
  const seriNo = String(m.seriNo ?? '').trim();
  if (!seriNo) return json({ error: 'Seri no gerekli.' }, 400);

  const exists = await env.DB.prepare('SELECT id FROM machines WHERE seriNo = ?').bind(seriNo).first();
  if (exists) return json({ error: 'Bu seri numarası zaten kayıtlı.' }, 409);

  const r = await env.DB
    .prepare('INSERT INTO machines (seriNo, makineModeli, altModel, musteriAdi) VALUES (?, ?, ?, ?)')
    .bind(seriNo, m.makineModeli ?? '', m.altModel ?? '', m.musteriAdi ?? '')
    .run();

  return json({ id: r.meta.last_row_id });
}
