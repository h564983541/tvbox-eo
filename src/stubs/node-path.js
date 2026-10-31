// path 垫片，理由同 node-fs.js
export const join = (...parts) => parts.filter(Boolean).join('/');
export const resolve = (...parts) => parts.filter(Boolean).join('/');
export const dirname = (p) => String(p).split('/').slice(0, -1).join('/') || '/';
export const basename = (p) => String(p).split('/').pop() || '';
export const extname = (p) => {
  const b = String(p).split('/').pop() || '';
  const i = b.lastIndexOf('.');
  return i > 0 ? b.slice(i) : '';
};
export const sep = '/';
export default { join, resolve, dirname, basename, extname, sep };
