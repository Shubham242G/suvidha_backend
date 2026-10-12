import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const ensureDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

const mimeToExt = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};

export const storeFileAndReturnNameBase64 = async (base64) => {
  ensureDir();

  const match = base64.match(/^data:(.+?);base64,(.+)$/);
  let ext = 'bin';
  let data = base64;

  if (match) {
    ext = mimeToExt[match[1]] || 'bin';
    data = match[2];
  }

  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await fs.promises.writeFile(filepath, Buffer.from(data, 'base64'));
  return filename;
};

export const deleteFile = async (filename) => {
  if (!filename) return;
  try {
    await fs.promises.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    /* ignore */
  }
};