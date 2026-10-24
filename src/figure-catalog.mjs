// Shared by the local preview, release build and GitHub Pages publication.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function figureCatalog(root) {
  const directory=path.join(root,'public/images/figuren');
  const figures=new Map();
  // The deployed build contains only optimized files; discover these directly.
  for(const subdirectory of ['', 'weboptimiert']) {
    let entries;
    try { entries=await fs.readdir(path.join(directory,subdirectory),{withFileTypes:true}); }
    catch(error) { if(error.code==='ENOENT')continue; throw error; }
    for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
      if(!entry.isFile() || entry.name.startsWith('.') || !/\.(png|jpe?g|webp)$/i.test(entry.name))continue;
      const prefix=subdirectory ? `${subdirectory}/` : '';
      figures.set(path.parse(entry.name).name,{src:`./public/images/figuren/${prefix}${encodeURIComponent(entry.name)}`});
    }
  }
  return {figures:[...figures.entries()].sort(([a],[b])=>a.localeCompare(b,'en')).map(([,figure])=>figure)};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await figureCatalog(path.resolve(process.argv[2] || '.')),null,2));
}
