-- Dolfin Dokümantasyon Sistemi — D1 (SQLite) şeması
-- Cloudflare panelindeki D1 konsoluna yapıştırıp çalıştır.

CREATE TABLE IF NOT EXISTS machines (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  seriNo       TEXT UNIQUE NOT NULL,
  makineModeli TEXT NOT NULL,
  altModel     TEXT,
  musteriAdi   TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  dokumanKodu     TEXT UNIQUE NOT NULL,
  dokumanAdi      TEXT,
  dokumanTuru     TEXT,
  versiyon        TEXT,
  dosyaAdi        TEXT,
  dosyaBoyutu     TEXT,
  dosyaTipi       TEXT,
  r2Key           TEXT,
  olusturmaTarihi TEXT
);

CREATE TABLE IF NOT EXISTS assignments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  makineSeriNo TEXT NOT NULL,
  dokumanKodu  TEXT NOT NULL,
  UNIQUE (makineSeriNo, dokumanKodu)
);

CREATE INDEX IF NOT EXISTS idx_machines_seri     ON machines(seriNo);
CREATE INDEX IF NOT EXISTS idx_documents_kod      ON documents(dokumanKodu);
CREATE INDEX IF NOT EXISTS idx_assignments_seri   ON assignments(makineSeriNo);
