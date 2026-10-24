import { finite, rounded, description, classify, recommendation, validateWeather, dailyDate } from './weather.mjs';
const $ = id => document.getElementById(id);
const defaults = { name:'Schönsee', region:'Oberpfalz · Deutschland', latitude:49.5103, longitude:12.5476 };
let place = defaults, entries = [], figures = [], randomFigure, data, request = 0, controller, searchController;
let lastSaying;
try { lastSaying = localStorage.getItem('grattler-last-saying'); } catch {}
try { const saved = JSON.parse(localStorage.getItem('grattler-place')); if (saved && finite(saved.latitude) && finite(saved.longitude) && typeof saved.name === 'string') place = saved; } catch {}
const status = (text, error = false) => { $('status').textContent = text; $('status').classList.toggle('error',error); };
const format = (time, options = {}) => new Intl.DateTimeFormat('de-DE', { timeZone:data?.timezone || 'Europe/Berlin', ...options }).format(new Date(time*1000));
try {
  for(const key of Object.keys(localStorage))if(key.startsWith('grattler-weather-'))localStorage.removeItem(key);
} catch {}
function icon(code, day = true) {
  const sun = '<circle cx="32" cy="30" r="12" fill="currentColor" fill-opacity=".3"/><path d="M32 8v5m0 34v5M10 30h5m34 0h5M16 14l4 4m24 24 4 4m0-32-4 4M20 42l-4 4"/>';
  const cloud = '<path d="M16 42a10 10 0 0 1-1-20 15 15 0 0 1 29-1 11 11 0 1 1 4 21Z" fill="var(--paper)"/>';
  const drops = '<path d="m22 48-3 6m15-6-3 6m15-6-3 6"/>';
  let drawing = [0,1].includes(code) ? day ? sun : '<path d="M41 9a23 23 0 1 0 14 33A24 24 0 0 1 41 9Z" fill="currentColor" fill-opacity=".2"/>' : code === 2 && day ? sun + cloud : cloud;
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) drawing += drops;
  if ([71,73,75,77,85,86].includes(code)) drawing += '<path d="M21 48v9m-4-5h8m12-4v9m-4-5h8"/>';
  if ([95,96,99].includes(code)) drawing += '<path d="m34 40-9 12h9l-5 10 16-16H34l6-6" fill="#cfab64"/>';
  if ([45,48].includes(code)) drawing += '<path d="M9 49h47M17 56h31"/>';
  return `<svg viewBox="0 0 64 66" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
}
function add(parent, tag, text, className) { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className=className; parent.append(e); return e; }
async function loadTicker() {
  try {
    const response=await fetch('./content/ticker.json');if(!response.ok)throw new Error();
    const catalog=await response.json();
    const texts=catalog.entries.filter(e=>e.enabled&&typeof e.text==='string'&&e.text.trim()&&[...e.text].length<=280);
    if(!texts.length)return;
    const track=$('ticker-track');track.replaceChildren();
    for(let copy=0;copy<2;copy++){
      const group=add(track,'div',undefined,'ticker-copy');if(copy)group.setAttribute('aria-hidden','true');
      texts.forEach(e=>add(group,'span',e.text,'ticker-item'));
    }
    track.style.setProperty('--ticker-duration',`${Math.max(40,texts.reduce((sum,e)=>sum+e.text.length,0)*.15)}s`);
    let savedMotion;try{savedMotion=localStorage.getItem('grattler-ticker-motion');}catch{}
    $('satire-ticker').classList.add('motion-enabled');
    const paused=savedMotion==='paused';$('satire-ticker').classList.toggle('is-paused',paused);
    $('ticker-pause').setAttribute('aria-pressed',String(paused));$('ticker-pause').textContent=paused?'▶':'Ⅱ';$('ticker-pause').setAttribute('aria-label',paused?'Ticker fortsetzen':'Ticker anhalten');
    $('satire-ticker').hidden=false;
  } catch { $('satire-ticker').hidden=true; }
}
$('ticker-pause').addEventListener('click',()=>{
  const paused=$('satire-ticker').classList.toggle('is-paused');
  $('ticker-pause').setAttribute('aria-pressed',String(paused));$('ticker-pause').setAttribute('aria-label',paused?'Ticker fortsetzen':'Ticker anhalten');$('ticker-pause').textContent=paused?'▶':'Ⅱ';
  try{localStorage.setItem('grattler-ticker-motion',paused?'paused':'running');}catch{}
});
loadTicker();
function renderFigure(preferredId) {
  const scene=document.querySelector('.scene');
  const figure=figures.find(f=>f.id===preferredId) || randomFigure;
  if(!figure)return;
  scene.replaceChildren();scene.removeAttribute('aria-hidden');scene.classList.add('character-scene');
  const image=add(scene,'img');image.src=figure.src;image.alt=figure.alt;image.className=`character character-${figure.id}`;
  image.addEventListener('error',()=>{scene.replaceChildren();add(scene,'span','Die Figur macht gerade Pause.','character-note');},{once:true});
}
function render() {
  const c = data.current;
  $('place').textContent = place.name; $('region').textContent = place.region || '';
  $('date').textContent = format(Date.now()/1000,{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).toLocaleUpperCase('de');
  $('temperature').textContent = rounded(c.temperature_2m);
  const nowTags = classify({code:c.weather_code, feels:c.apparent_temperature, wind:c.wind_speed_10m,gusts:c.wind_gusts_10m,day:!!c.is_day});
  $('condition').textContent = nowTags.includes('windig') && !nowTags.includes('gewitter') ? 'Windig. Halt dich fest.' : description(c.weather_code, !!c.is_day);
  $('feels').textContent = `Gefühlt ${rounded(c.apparent_temperature)}° · ${finite(c.precipitation) ? c.precipitation.toLocaleString('de-DE') + ' mm Niederschlag' : 'Niederschlag unbekannt'}`;
  $('wind').textContent = `${rounded(c.wind_speed_10m)} km/h`;
  $('gusts').textContent = `${rounded(c.wind_gusts_10m)} km/h`;
  $('range').textContent = `${rounded(data.daily.temperature_2m_min[0])}° / ${rounded(data.daily.temperature_2m_max[0])}°`;
  $('weather-art').innerHTML = icon(c.weather_code,!!c.is_day);
  $('updated').textContent = `Datenstand ${format(c.time,{hour:'2-digit',minute:'2-digit'})} Uhr`;
  const advice = recommendation(data, entries, `${place.latitude},${place.longitude}|${Math.random()}`, Date.now()/1000, lastSaying);
  const expired = Date.now()/1000 - c.time > 3*3600;
  if (!expired && advice.entry) {
    lastSaying = advice.entry.id;
    try { localStorage.setItem('grattler-last-saying', lastSaying); } catch {}
  }
  $('quote').textContent = expired ? 'Der Wetterzettel ist von gestern. Na ja, fast.' : advice.entry?.text || 'Erst aus dem Fenster schauen. Dann große Pläne machen.';
  $('advice-period').textContent = advice.night ? 'FÜR HEUTE NACHT' : 'FÜR HEUTE';
  const tags = [...new Set(advice.contexts.flat())];
  const names = {hagel:'Hagel',gewitter:'Gewitter', 'starke-boeen':'starke Böen',regen:'Regen',schnee:'Schnee',windig:'Wind',kalt:'kühle Luft',frostig:'Frost',heiss:'Hitze',nebel:'Nebel',sonnig:'Sonnenschein'};
  const relevant = advice.entry?.when.all.length ? advice.entry.when.all : tags.slice(0,2);
  $('reason').textContent = expired ? 'Für eine aktuelle Empfehlung bitte neue Wetterdaten laden.' : `Für ${advice.night ? 'die Nacht' : 'die verbleibende Tageszeit'}${relevant.length ? ': '+relevant.map(t=>names[t] || t).join(' und ') : ' – die Lage bleibt überschaubar'}.`;
  if(!expired && advice.entry?.when.currentTemperatureAbove !== undefined) $('reason').textContent=`Aktuell ${c.temperature_2m.toLocaleString('de-DE')} °C draußen.`;
  const provenance = !expired && advice.entry?.provenance;
  renderFigure(advice.entry?.figureId);
  $('source-text').textContent = provenance ? [provenance.sourceLabel,provenance.attribution,provenance.note].filter(Boolean).join(' · ') : 'Ein redaktioneller Wettertext aus unserer Spruchsammlung. Keine amtliche Handlungsempfehlung.';
  $('source-link').hidden = true;
  if (provenance?.sourceUrl) { try { const url=new URL(provenance.sourceUrl); if(url.protocol==='https:') { $('source-link').href=url.href; $('source-link').hidden=false; } } catch {} }
  $('hours').replaceChildren();
  const start = data.hourly.time.findIndex(t => t >= Date.now()/1000-1800);
  if (start < 0) add($('hours'),'p','Kein aktueller Stundenausblick verfügbar.','muted');
  else data.hourly.time.slice(start,start+12).forEach((time,j) => {
    const i = start+j, card = add($('hours'),'div',undefined,'hour');
    const t = add(card,'time',format(time,{hour:'2-digit',minute:'2-digit'})); t.dateTime=new Date(time*1000).toISOString();
    const image=add(card,'span',undefined,'weather-icon'); image.innerHTML=icon(data.hourly.weather_code[i],!!data.hourly.is_day[i]); image.setAttribute('aria-label',description(data.hourly.weather_code[i],!!data.hourly.is_day[i]));
    add(card,'strong',rounded(data.hourly.temperature_2m[i])+'°'); add(card,'small',rounded(data.hourly.precipitation_probability[i])+' %');
  });
  $('days').replaceChildren();
  data.daily.time.slice(0,5).forEach((time,i)=>{
    const card=add($('days'),'article',undefined,'day'), name=add(card,'div',undefined,'day-name');
    add(name,'span',i===0?'Heute':dailyDate(time,data.timezone,{weekday:'long'})); add(name,'span',dailyDate(time,data.timezone,{day:'2-digit',month:'2-digit'}),'day-date');
    const weather=add(card,'div',undefined,'day-weather'), image=add(weather,'span',undefined,'weather-icon'); image.innerHTML=icon(data.daily.weather_code[i]); image.setAttribute('aria-label',description(data.daily.weather_code[i]));
    const temps=add(weather,'div',undefined,'day-temps'); add(temps,'strong',rounded(data.daily.temperature_2m_max[i])+'°'); add(temps,'span',rounded(data.daily.temperature_2m_min[i])+'°');
    add(card,'p',rounded(data.daily.precipitation_probability_max[i])+' % Niederschlagsrisiko');
  });
}
async function load(next = place) {
  const generation=++request; controller?.abort(); const activeController=new AbortController();controller=activeController;
  status(`Wetter für ${next.name} wird geholt …`); $('refresh').disabled=true;
  try {
    const query=new URLSearchParams({latitude:next.latitude,longitude:next.longitude,current:'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,precipitation,is_day',hourly:'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,rain,is_day,precipitation_probability',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:'auto',timeformat:'unixtime',forecast_days:'5'});
    const timer=setTimeout(()=>activeController.abort(),15000);
    let response; try { response=await fetch(`https://api.open-meteo.com/v1/forecast?${query}`,{signal:activeController.signal,cache:'no-store'}); } finally{clearTimeout(timer);}
    if(!response.ok)throw new Error('Wetterabruf fehlgeschlagen');
    const result=validateWeather(await response.json()); if(generation!==request)return;
    data=result;place=next;try{localStorage.setItem('grattler-place',JSON.stringify(place));}catch{}render();
    status('Frisch abgerufen. Die Lebenshilfe gibt’s gratis dazu.');
  } catch(error) {
    if(generation!==request)return;
    data=undefined;place=next;
    $('place').textContent=next.name;$('region').textContent=next.region || '';
    for(const id of ['temperature','wind','gusts','range'])$(id).textContent='—';
    for(const id of ['weather-art','hours','days'])$(id).replaceChildren();
    $('condition').textContent='Keine aktuellen Wetterdaten.';$('feels').textContent='Bitte erneut laden oder einen anderen Ort wählen.';
    $('updated').textContent='Kein aktueller Datenstand verfügbar.';
    $('quote').textContent='Ohne Wetterdaten keine großen Sprüche.';$('reason').textContent='Die Verbindung zum Wetterdienst klappt gerade nicht.';
    $('advice-period').textContent='WETTER FEHLT';$('source-text').textContent='';$('source-link').hidden=true;
    status('Wetterdienst gerade nicht erreichbar. Bitte erneut versuchen.',true);
  } finally{if(generation===request)$('refresh').disabled=false;}
}
$('search-toggle').addEventListener('click',()=>{const opened=$('search-panel').hidden;$('search-panel').hidden=!opened;$('search-toggle').setAttribute('aria-expanded',String(opened));if(opened)$('search').focus();});
$('search-form').addEventListener('submit',async event=>{
  event.preventDefault(); searchController?.abort();searchController=new AbortController();const signal=searchController.signal;
  $('search-results').textContent='Orte werden gesucht …';
  try{
    const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({name:$('search').value.trim(),count:'6',language:'de',format:'json'})}`,{signal});
    if(!response.ok)throw new Error();const result=await response.json();if(signal.aborted)return;$('search-results').replaceChildren();
    if(!result.results?.length)$('search-results').textContent='Kein Ort gefunden. Versuch einen anderen Namen.';
    for(const item of result.results || []){const region=[item.admin1,item.country].filter(Boolean).join(' · ');const button=add($('search-results'),'button',`${item.name} · ${region}`,'result');button.type='button';button.addEventListener('click',()=>{$('search-panel').hidden=true;$('search-toggle').setAttribute('aria-expanded','false');load({name:item.name,region,latitude:item.latitude,longitude:item.longitude});});}
  }catch(error){if(error.name!=='AbortError')$('search-results').textContent='Ortssuche gerade nicht erreichbar. Bitte später erneut versuchen.';}
});
$('locate').addEventListener('click',()=>{
  if(!navigator.geolocation){status('Standort ist hier nicht verfügbar. Bitte die Ortssuche nutzen.',true);return;}
  status('Warte auf deine Standortfreigabe …');
  navigator.geolocation.getCurrentPosition(position=>load({name:'Dein Standort',region:'Wetter an deiner Position',latitude:position.coords.latitude,longitude:position.coords.longitude}),()=>status('Standort nicht verfügbar oder nicht freigegeben. Die Ortssuche funktioniert weiterhin.',true),{timeout:12000,maximumAge:300000});
});
$('refresh').addEventListener('click',()=>load());
$('suggest').addEventListener('click',()=>{$('suggest-dialog').showModal();$('suggest-heading').focus({preventScroll:true});});$('close-dialog').addEventListener('click',()=>$('suggest-dialog').close());
$('suggest-kind').addEventListener('change',()=>{const ticker=$('suggest-kind').value==='ticker';$('suggest-weather').hidden=ticker;$('suggest-weather').disabled=ticker;$('suggest-weather-label').hidden=ticker;});
$('suggest-form').addEventListener('submit',event=>{
  event.preventDefault();
  const kind=$('suggest-kind').value, text=$('suggest-text').value.trim();
  if(!text)return;
  const url=new URL('https://github.com/GrattlerWeather/GrattlerWeather.github.io/issues/new');
  url.searchParams.set('template','spruch-vorschlagen.yml');
  url.searchParams.set('vorschlagsart',kind==='ticker'?'Liveticker':'Grattlerrat');
  url.searchParams.set('spruch',text);
  if(kind!=='ticker')url.searchParams.set('wetter',$('suggest-weather').value);
  window.open(url.href,'_blank','noopener,noreferrer');
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
setInterval(()=>{if(!document.hidden)load();},15*60*1000);
try {
  const [response,figureResponse]=await Promise.all([fetch('./content/sprueche.json'),fetch('./content/figuren.json')]);
  if(!response.ok)throw new Error();entries=(await response.json()).entries;
  if(figureResponse.ok){const catalog=await figureResponse.json();figures=catalog.figures;randomFigure=figures[Math.floor(Math.random()*figures.length)];}
  await load();
}catch{status('Die Spruchsammlung konnte nicht geladen werden. Bitte die Seite neu laden.',true);}
