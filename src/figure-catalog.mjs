// Shared by the local preview, release build and GitHub Pages publication.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function figureCatalog(root) {
  const directory=path.join(root,'public/images/figuren');
  let entries;
  try { entries=await fs.readdir(directory,{withFileTypes:true}); }
  catch(error) { if(error.code==='ENOENT')return {figures:[]}; throw error; }
  return {figures:entries
    .filter(entry=>entry.isFile() && !entry.name.startsWith('.') && /\.(png|jpe?g)$/i.test(entry.name))
    .map(entry=>entry.name).sort()
    .map(name=>({src:`./public/images/figuren/${encodeURIComponent(name)}`}))};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await figureCatalog(path.resolve(process.argv[2] || '.')),null,2));
}
