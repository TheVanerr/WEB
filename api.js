// Veri katmanı — Firebase yerine Cloudflare (D1 + R2 + Worker API).
// DolfinDB arayüzü eski koda uyumlu tutuldu; içi fetch ile /api/* çağırır.

async function req(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    let msg = 'HTTP ' + res.status;
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (_) { /* metin değilse geç */ }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

const A = '/api/admin';

const DolfinDB = {
  ready() { return Promise.resolve(); },

  getMachines() { return req(A + '/machines'); },
  getDocuments() { return req(A + '/documents'); },
  getAssignments() { return req(A + '/assignments'); },

  addMachine(m) {
    return req(A + '/machines', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(m),
    }).then((r) => r.id);
  },
  addDocument(d) {
    return req(A + '/documents', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(d),
    }).then((r) => r.id);
  },
  addAssignment(a) {
    return req(A + '/assignments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(a),
    }).then((r) => r.id);
  },

  deleteMachine(id) { return req(A + '/machines/' + id, { method: 'DELETE' }); },
  deleteDocument(id) { return req(A + '/documents/' + id, { method: 'DELETE' }); },
  deleteAssignment(id) { return req(A + '/assignments/' + id, { method: 'DELETE' }); },

  // Dosyayı R2'ye yükler, { r2Key, dosyaUrl } döner.
  uploadFile(file, dokumanKodu) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('dokumanKodu', dokumanKodu || '');
    return req(A + '/upload', { method: 'POST', body: fd });
  },
};

// Müşteri girişi: { machine, documents } döner.
async function customerLogin(seriNo, model) {
  return req('/api/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ seriNo, model }),
  });
}

// Eski koddaki isimle uyumlu hata biçimleyici.
function formatFirebaseError(err) {
  return err && err.message ? err.message : 'Bilinmeyen hata oluştu.';
}

export { DolfinDB, customerLogin, formatFirebaseError };
