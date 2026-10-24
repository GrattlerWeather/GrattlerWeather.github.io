import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const labels = new Map(Object.entries({
  Sonne: 'sonnig', Regen: 'regen', Schnee: 'schnee', Hagel: 'hagel',
  Gewitter: 'gewitter', Wind: 'windig', 'Starke Böen': 'starke-boeen',
  Kälte: 'kalt', Frost: 'frostig', Hitze: 'heiss', Nebel: 'nebel',
}));

function section(body, heading) {
  const marker = `### ${heading}\n`;
  const start = body.indexOf(marker);
  if (start < 0) return '';
  const rest = body.slice(start + marker.length);
  const end = rest.indexOf('\n### ');
  const value = (end < 0 ? rest : rest.slice(0, end)).trim();
  return value === '_No response_' ? '' : value;
}

const normalizedText = text => text.normalize('NFKC').replace(/\s+/gu, ' ').trim().toLocaleLowerCase('de');

export function suggestionKind(issue) {
  if(typeof issue?.body!=='string')throw new Error('Die Issue-Datei benötigt ein body-Feld.');
  const kind=section(issue.body.replace(/\r\n/g,'\n'),'Vorschlagsart');
  if(!kind || kind==='Grattlerrat')return 'recommendation';
  if(kind==='Liveticker')return 'ticker';
  throw new Error(`Unbekannte Vorschlagsart: ${kind}`);
}

export function prepareEntry(issue, collection) {
  if (!issue || typeof issue.body !== 'string') throw new Error('Die Issue-Datei benötigt ein body-Feld.');
  if (!/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/\d+$/.test(issue.url ?? '')) {
    throw new Error('Die Issue-Datei benötigt eine gültige GitHub-Issue-URL im Feld url.');
  }
  if (collection.version !== 1 || !Array.isArray(collection.entries)) throw new Error('Unbekanntes Format der Spruchsammlung.');
  const body = issue.body.replace(/\r\n/g, '\n');
  const kind = suggestionKind(issue);
  const text = section(body, 'Spruch');
  if (!text || [...text].length > 280) throw new Error('Der Spruch muss 1 bis 280 Zeichen enthalten.');
  const selected = kind==='ticker' ? [] : section(body, 'Wetterlage').split(',').map(s => s.trim()).filter(Boolean);
  if (kind!=='ticker' && (!selected.length || selected.includes('Noch offen'))) throw new Error('Vor der Übernahme bitte eine konkrete Wetterlage im Issue auswählen.');
  const tags = [...new Set(selected.map(label => {
    if (!labels.has(label)) throw new Error(`Unbekannte Wetterlage: ${label}`);
    return labels.get(label);
  }))];
  if (tags.includes('heiss') && tags.some(t => ['kalt', 'frostig'].includes(t))) {
    throw new Error('Hitze und Kälte/Frost passen nicht als gleichzeitige Bedingungen.');
  }
  const duplicate = collection.entries.find(e => normalizedText(e.text) === normalizedText(text));
  if (duplicate) throw new Error(`Dieser Text ist bereits vorhanden: ${duplicate.id}`);
  if (collection.entries.some(e => e.provenance?.sourceUrl === issue.url)) throw new Error('Dieses Issue wurde bereits übernommen.');
  const number = issue.url.split('/').at(-1);
  const repo = issue.url.split('/').slice(3, 5).join('-').toLowerCase();
  const id = `community-${repo}-${number}`;
  if (collection.entries.some(e => e.id === id)) throw new Error(`Die ID ${id} ist bereits vergeben.`);
  const priority = tags.includes('hagel') || tags.includes('gewitter') ? 100
    : tags.includes('starke-boeen') ? 90 : tags.length > 1 ? 60 : 40;
  const sourceNotes = section(body, 'Quelle und Einordnung');
  if (sourceNotes.length > 4000) throw new Error('Die Quellenangabe ist zu lang (maximal 4000 Zeichen).');
  const excluded = tags.includes('hagel') ? [] : tags.includes('gewitter') ? ['hagel']
    : tags.includes('starke-boeen') ? ['hagel', 'gewitter'] : ['hagel', 'gewitter', 'starke-boeen'];
  return {
    id, enabled: true,
    ...(kind==='ticker' ? {} : {period:'remaining-day',when:{all:tags,any:[],none:excluded},priority,figureId:null}),
    text,
    provenance: {
      kind: 'community-submission', sourceUrl: issue.url,
      sourceLabel: 'Community-Vorschlag über GitHub Issues',
      ...(sourceNotes ? { submissionNotes: sourceNotes } : {}),
      note: 'Lokal redaktionell übernommen. Quellen- und Sprecherangaben der Einreichung sind keine unabhängig verifizierten Originalzitate.',
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--hilfe') || !args.length) {
    console.log('Vorschau: node scripts/uebernehmen.mjs --datei vorschlag.json\nÜbernehmen: denselben Befehl mit --anwenden ausführen.');
    return;
  }
  const index = args.indexOf('--datei');
  const filename = args[index + 1];
  if (index < 0 || !filename || filename.startsWith('--')) throw new Error('--datei benötigt eine JSON-Datei.');
  const allowed = new Set(['--datei', '--anwenden', filename]);
  if (args.some(arg => !allowed.has(arg))) throw new Error('Unbekannte Argumente. Siehe --hilfe.');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const readJson = name => JSON.parse(fs.readFileSync(name, 'utf8').replace(/^\uFEFF/, ''));
  const issue = readJson(path.resolve(filename));
  const target = path.join(root, 'content', suggestionKind(issue)==='ticker' ? 'ticker.json' : 'sprueche.json');
  const collection = readJson(target);
  const entry = prepareEntry(issue, collection);
  console.log(`Zieldatei: ${path.basename(target)}`);
  console.log(JSON.stringify(entry, null, 2));
  if (!args.includes('--anwenden')) {
    console.log('\nNur Vorschau. Mit --anwenden lokal in die Spruchsammlung übernehmen.');
    return;
  }
  // Exclusively create a backup before replacing the local collection.
  const backup = `${target}.${Date.now()}.bak`;
  fs.copyFileSync(target, backup, fs.constants.COPYFILE_EXCL);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify({ ...collection, entries: [...collection.entries, entry] }, null, 2)}\n`, { flag: 'wx' });
    fs.renameSync(temporary, target);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  console.log(`\nLokal übernommen: ${entry.id}\nSicherung: ${backup}\nNoch nicht veröffentlicht; keine GitHub-Änderung ausgeführt.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
