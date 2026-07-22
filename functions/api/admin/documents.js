// Admin: doküman meta listele / ekle. Dosyanın kendisi R2'de, burada sadece bilgi.
const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });

export async function onRequestGet({ env }) {
  const res = await env.DB.prepare('SELECT * FROM documents ORDER BY id DESC').all();
  return json(
    (res.results || []).map((d) => ({
      ...d,
      _id: d.id,
      dosyaUrl: d.r2Key ? '/api/file/' + d.r2Key : null,
    }))
  );
}

export async function onRequestPost({ request, env }) {
  const d = await request.json();
  const kod = String(d.dokumanKodu ?? '').trim();
  if (!kod) return json({ error: 'Doküman kodu gerekli.' }, 400);

  const exists = await env.DB.prepare('SELECT id FROM documents WHERE dokumanKodu = ?').bind(kod).first();
  if (exists) return json({ error: 'Bu doküman kodu zaten kayıtlı.' }, 409);

  const r = await env.DB
    .prepare(
      'INSERT INTO documents (dokumanKodu, dokumanAdi, dokumanTuru, versiyon, dosyaAdi, dosyaBoyutu, dosyaTipi, r2Key, olusturmaTarihi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(
      kod,
      d.dokumanAdi ?? '',
      d.dokumanTuru ?? '',
      d.versiyon ?? '',
      d.dosyaAdi ?? '',
      d.dosyaBoyutu ?? '',
      d.dosyaTipi ?? '',
      d.r2Key ?? null,
      d.olusturmaTarihi ?? new Date().toISOString()
    )
    .run();

  return json({ id: r.meta.last_row_id });
}
