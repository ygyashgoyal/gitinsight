import JSZip from 'jszip';

export const parseZip = async (arrayBuffer) => {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const tree = {};

  await Promise.all(
    Object.keys(zip.files).map(async (path) => {
      const file = zip.files[path];
      const parts = path.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (part === '') return;
        if (!current[part]) {
          current[part] = index === parts.length - 1 && !file.dir ? { __file__: true } : {};
        }
        current = current[part];
      });

      if (!file.dir) {
        current.__content__ = await file.async('text');
      }
    })
  );

  return tree;
};
