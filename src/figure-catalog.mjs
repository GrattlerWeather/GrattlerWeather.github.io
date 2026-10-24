// Shared by the local preview, release build and GitHub Pages publication.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function figureCatalog(root) {
  const directory=path.join(root,'public/images/figuren');
  let entries;
  try { entries=await fs.readdir(directory,{withFileTypes:true}); }
  catch(error) { if(error.code==='ENOENT')return {figures:[]}; throw error; }
  const figures=await Promise.all(entries
    .filter(entry=>entry.isFile() && !entry.name.startsWith('.') && /\.(png|jpe?g)$/i.test(entry.name))
    .map(async entry=>{
      const name=entry.name;
      const optimized=path.join(directory,'weboptimiert',`${path.parse(name).name}.webp`);
      try {
        await fs.access(optimized);
        return {src:`./public/images/figuren/weboptimiert/${encodeURIComponent(path.parse(name).name)}.webp`};
      } catch(error) {
        if(error.code!=='ENOENT')throw error;
        return {src:`./public/images/figuren/${encodeURIComponent(name)}`};
      }
    }));
  return {figures};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await figureCatalog(path.resolve(process.argv[2] || '.')),null,2));
}
