// Admin: makine sil (ve makinenin atamalarını temizle).
export async function onRequestDelete({ params, env }) {
  const machine = await env.DB.prepare('SELECT seriNo FROM machines WHERE id = ?').bind(params.id).first();
  if (machine) {
    await env.DB.prepare('DELETE FROM assignments WHERE makineSeriNo = ?').bind(machine.seriNo).run();
    await env.DB.prepare('DELETE FROM machines WHERE id = ?').bind(params.id).run();
  }
  return new Response(null, { status: 204 });
}
