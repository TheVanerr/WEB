// Müşteri girişi: seri no + model doğrula, o makineye tanımlı dokümanları dön.
// Herkese açık (Cloudflare Access ile korunmaz).

const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } });

function normModel(v) {
  return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Geçersiz istek' }, 400); }

  const seriNo = String(body.seriNo ?? '').trim();
  const model = normModel(body.model);
  if (!seriNo || !model) return json({ error: 'Seri no ve makine modeli gerekli.' }, 400);

  // Birebir eşleşme
  let machine = await env.DB.prepare('SELECT * FROM machines WHERE seriNo = ?').bind(seriNo).first();

  // Sayısal tolerans (0123 == 123)
  if (!machine && /^\d+$/.test(seriNo)) {
    machine = await env.DB
      .prepare("SELECT * FROM machines WHERE seriNo GLOB '[0-9]*' AND CAST(seriNo AS INTEGER) = CAST(? AS INTEGER)")
      .bind(seriNo)
      .first();
  }

  if (!machine) return json({ error: 'Seri no veya makine modeli hatalı.' }, 404);

  const ana = normModel(machine.makineModeli);
  const alt = normModel(machine.altModel);
  if (ana !== model && alt !== model) {
    return json({ error: 'Seri no veya makine modeli hatalı.' }, 404);
  }

  const docsRes = await env.DB
    .prepare('SELECT d.* FROM documents d JOIN assignments a ON a.dokumanKodu = d.dokumanKodu WHERE a.makineSeriNo = ?')
    .bind(machine.seriNo)
    .all();

  const documents = (docsRes.results || []).map((d) => ({
    ...d,
    _id: d.id,
    dosyaUrl: d.r2Key ? '/api/file/' + d.r2Key : null,
  }));

  return json({ machine, documents });
}
