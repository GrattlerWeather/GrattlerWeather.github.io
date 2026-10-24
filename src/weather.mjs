export const finite = value => typeof value === 'number' && Number.isFinite(value);
export const rounded = value => finite(value) ? String(Math.round(value)) : '—';
export function description(code, day = true) {
  if (code === 0) return day ? 'Sonnig. Läuft bei dir.' : 'Klare Nacht.';
  if (code === 1) return 'Überwiegend klar.';
  if (code === 2) return day ? 'Sonne mit Gesellschaft.' : 'Wolkenlücken in der Nacht.';
  if (code === 3) return 'Wolken haben übernommen.';
  if ([45, 48].includes(code)) return 'Nebel. Sicht ist Ansichtssache.';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Nieselregen. Auch das noch.';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Regen. Von oben persönlich.';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Schnee. Alles schön zugedeckt.';
  if ([96, 99].includes(code)) return 'Gewitter mit Hagel.';
  if (code === 95) return 'Gewitter. Da kommt was.';
  return 'Wechselhaftes Wetter.';
}
export function classify({ code, feels, wind, gusts, rain, day = true }) {
  const tags = [];
  if (finite(feels) && feels < 10) tags.push('kalt');
  if (finite(feels) && feels < 0) tags.push('frostig');
  if (finite(feels) && feels >= 28) tags.push('heiss');
  if ((finite(wind) && wind >= 25) || (finite(gusts) && gusts >= 45)) tags.push('windig');
  if (finite(gusts) && gusts >= 65) tags.push('starke-boeen');
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code) || (finite(rain) && rain >= .2)) tags.push('regen');
  if ([71,73,75,77,85,86].includes(code)) tags.push('schnee');
  if ([95,96,99].includes(code)) tags.push('gewitter');
  if ([96,99].includes(code)) tags.push('hagel');
  if ([45,48].includes(code)) tags.push('nebel');
  if ([0,1].includes(code) && day) tags.push('sonnig');
  return tags;
}
export function matches(rule, tags) {
  return rule.all.every(t => tags.includes(t)) && (!rule.any.length || rule.any.some(t => tags.includes(t))) && !rule.none.some(t => tags.includes(t));
}
export function choose(entries, contexts, period, seed, currentTemperature) {
  const available = entries.filter(e => e.enabled && e.period === period
    && (e.when.currentTemperatureAbove === undefined || (finite(currentTemperature) && currentTemperature > e.when.currentTemperatureAbove)));
  const severe = ['hagel','gewitter','starke-boeen'].find(tag => contexts.some(c => c.includes(tag)));
  let candidates = available.filter(e => (!severe || e.when.all.includes(severe)) && contexts.some(tags => matches(e.when, tags)));
  if (!candidates.length && severe === 'hagel') candidates = available.filter(e => e.when.all.includes('gewitter') && contexts.some(tags => matches(e.when, tags)));
  if (!candidates.length) candidates = available.filter(e => e.when.all.length === 0 && e.when.any.length === 0 && e.when.none.length === 0);
  if (!candidates.length) return null;
  const priority = Math.max(...candidates.map(e => e.priority));
  candidates = candidates.filter(e => e.priority === priority).sort((a,b) => a.id.localeCompare(b.id));
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return candidates[hash % candidates.length];
}
export function localParts(time, zone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zone, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23' }).formatToParts(new Date(time * 1000)).map(p => [p.type,p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}
// Daily Unix timestamps use the provider's fixed offset across the forecast.
// Read the calendar day around noon to avoid a date shift at a DST change.
export function dailyDate(time, zone, options) {
  return new Intl.DateTimeFormat('de-DE', {timeZone:zone, ...options}).format(new Date((time+43200)*1000));
}
export function recommendation(data, entries, seed, now = Date.now() / 1000) {
  const zone = data.timezone;
  const current = localParts(now, zone);
  const night = current.hour >= 22 || current.hour < 6;
  const period = night ? 'tonight' : 'remaining-day';
  const h = data.hourly;
  const contexts = [];
  for (let i = 0; i < h.time.length; i++) {
    if (h.time[i] < now - 1800) continue;
    const local = localParts(h.time[i], zone);
    if ((!night && (local.date !== current.date || local.hour >= 22)) || (night && ((current.hour < 6 && (local.date !== current.date || local.hour >= 6)) || (current.hour >= 22 && local.date !== current.date && local.hour >= 6)))) break;
    const at = index => classify({ code:h.weather_code[index], feels:h.apparent_temperature[index], wind:h.wind_speed_10m[index], gusts:h.wind_gusts_10m[index], rain:h.rain[index], day:!!h.is_day[index] });
    const tags = at(i).filter(tag => !['kalt','frostig','heiss'].includes(tag) || (i > 0 && at(i-1).includes(tag)) || (i+1 < h.time.length && at(i+1).includes(tag)));
    contexts.push(tags);
  }
  return { entry:choose(entries, contexts, period, `${seed}|${current.date}|${period}`, data.current?.temperature_2m), night, contexts };
}
export function validateWeather(data) {
  if (!data || !finite(data.current?.temperature_2m) || !finite(data.current?.time) || !data.timezone || !Array.isArray(data.hourly?.time) || !Array.isArray(data.daily?.time)) throw new Error('Die Wetterantwort ist unvollständig.');
  new Intl.DateTimeFormat('de', {timeZone:data.timezone});
  for (const key of ['temperature_2m','apparent_temperature','weather_code','wind_speed_10m','wind_gusts_10m','rain','is_day','precipitation_probability']) {
    if (!Array.isArray(data.hourly[key]) || data.hourly[key].length !== data.hourly.time.length) throw new Error('Stündliche Wetterdaten fehlen.');
  }
  for (const key of ['weather_code','temperature_2m_max','temperature_2m_min','precipitation_probability_max']) {
    if (!Array.isArray(data.daily[key]) || data.daily[key].length !== data.daily.time.length) throw new Error('Tägliche Wetterdaten fehlen.');
  }
  return data;
}
