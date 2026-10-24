# Sprüche des Tages und Ticker

[Zur README](README.md) · [Neue Texte vorschlagen](MITMACHEN.md)

Diese Übersicht wird bei jedem Release-Build automatisch aus den Inhaltsdateien erzeugt. Der Wortlaut bleibt erhalten. Auch deaktivierte Einträge sind mit ihrem Status aufgeführt.

## Sprüche des Tages · Grattlerrat

17 Einträge. Die vollständigen Quellenangaben und Zuschreibungen stehen in [content/sprueche.json](content/sprueche.json). Nutzerbeitrag, redaktionelle Bearbeitung und Fundstück sind unterschiedliche Einordnungen; ein Fundstück ist kein verifiziertes Originalzitat.

| Spruch | Wetterbedingung | Zeitraum | Priorität | Status | Einordnung |
| --- | --- | --- | ---: | --- | --- |
| Heute ist ein guter Tag um nichts zu tun. | Ohne besondere Wetterbedingung (Rückfalltext) | Restlicher Tag | 0 | Aktiv | Nutzerbeitrag |
| Bei dem Wetter wirds unterm Dach stickig. | Nicht bei: Hagel, Gewitter, Starke Böen; Aktuelle Außentemperatur strikt über 25 °C | Restlicher Tag | 50 | Aktiv | Nutzerbeitrag |
| Wer Haid sät, wird Sturm ernten. | Gemeinsam: Wind; Nicht bei: Hagel, Gewitter, Starke Böen | Restlicher Tag | 40 | Aktiv | Nutzerbeitrag |
| heute hagelts lügen und anzeigen wie ein Balkenbieg | Gemeinsam: Hagel | Restlicher Tag | 100 | Aktiv | Nutzerbeitrag |
| Bei dem Regen wird die Sperrmüllcouch zum Logenplatz. | Gemeinsam: Regen; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 45 | Aktiv | Redaktionell bearbeitet |
| ES IST GENUG JETZT, ES REICHT JETZT | Gemeinsam: Regen; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 45 | Aktiv | Fundstück von Dritten; Zuschreibung ungeprüft |
| Halbe Hemden sollten für den Wocheneinkauf einen Anker mitnehmen. | Gemeinsam: Wind; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 40 | Aktiv | Keine Herkunft hinterlegt |
| Schal um den Mund – es könnte am zahnlosen Zahnfleisch ziepen. | Gemeinsam: Kälte; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 30 | Aktiv | Keine Herkunft hinterlegt |
| Heute ist’s kälter als in Leons Bierkühlschrank. | Gemeinsam: Kälte; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 30 | Aktiv | Nutzerbeitrag |
| Schal ums Maul und Anker in die Tasche. Heute zieht's an beiden Enden. | Gemeinsam: Kälte + Wind; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 60 | Aktiv | Keine Herkunft hinterlegt |
| Die Frisur hält heute nur, wenn du sie daheim lässt. | Gemeinsam: Regen; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 45 | Aktiv | Keine Herkunft hinterlegt |
| Pisswetter. Heute ist der perfekte Zeitpunkt, um einen Müllfilm zu produzieren. | Gemeinsam: Regen + Wind; Nicht bei: Gewitter, Starke Böen | Restlicher Tag | 65 | Aktiv | Nutzerbeitrag |
| Heute schwitzt sogar der Schatten. Such dir einen und bleib ihm treu. | Gemeinsam: Hitze; Nicht bei: Gewitter, Starke Böen, Regen | Restlicher Tag | 40 | Aktiv | Keine Herkunft hinterlegt |
| Heute darfst du vom Sofa aus behaupten, du wärst sonst rausgegangen. | Gemeinsam: Gewitter | Restlicher Tag | 100 | Aktiv | Keine Herkunft hinterlegt |
| Amtliche Warnung für halbe Hemden: Verwehungsgefahr. Du bleibst besser drin. | Gemeinsam: Starke Böen; Nicht bei: Gewitter | Restlicher Tag | 90 | Aktiv | Nutzerbeitrag |
| Erst aus dem Fenster schauen. Dann große Pläne machen. | Ohne besondere Wetterbedingung (Rückfalltext) | Restlicher Tag | 0 | Aktiv | Keine Herkunft hinterlegt |
| Die Nacht hat geöffnet. Die großen Pläne können bis morgen warten. | Ohne besondere Wetterbedingung (Rückfalltext) | Nacht | 0 | Aktiv | Keine Herkunft hinterlegt |

### So wird ausgewählt

- Tag: 06–22 Uhr; Nacht: 22–06 Uhr, jeweils in der Zeitzone des Wetterorts. Betrachtet werden die verbleibenden Prognosestunden des Tages beziehungsweise der Nacht.
- Kombinierte Bedingungen müssen in derselben Prognosestunde vorkommen. Kälte, Frost und Hitze müssen außerdem in einer benachbarten Stunde bestätigt werden.
- Hagel hat Vorrang vor Gewitter, Gewitter vor starken Böen. Bei solchen Lagen werden zunächst die dafür vorgesehenen Texte berücksichtigt. Falls kein Hageltext passt, werden Gewittertexte versucht; danach kommen gegebenenfalls Texte ohne Wetterbedingung zum Zug.
- Unter passenden Texten gewinnt die höchste Priorität. Bei Gleichstand wird variiert und der zuletzt angezeigte Spruch nach Möglichkeit vermieden. Deshalb ist dies kein fester Tageskalender.
- Die zusätzliche Bedingung zur aktuellen Außentemperatur bezieht sich auf den jetzigen Mess-/Modellwert, nicht auf die gefühlte Temperatur oder eine spätere Prognosestunde.

### Wetterbedingungen im Klartext

| Bedingung | Regel |
| --- | --- |
| Kälte | Gefühlte Temperatur unter 10 °C |
| Frost | Gefühlte Temperatur unter 0 °C |
| Hitze | Gefühlte Temperatur ab 28 °C |
| Wind | Wind ab 25 km/h oder Böen ab 45 km/h |
| Starke Böen | Böen ab 65 km/h |
| Regen | Wettercode für Nieselregen/Regen oder Regenmenge ab 0,2 mm in der Prognosestunde |
| Schnee | Wettercode für Schnee oder Schneeschauer |
| Gewitter | Wettercode 95, 96 oder 99 |
| Hagel | Wettercode 96 oder 99; zählt zugleich als Gewitter |
| Nebel | Wettercode 45 oder 48 |
| Sonne | Wettercode 0 oder 1 und Tageslicht |

Die Auswahlregeln sind in [src/weather.mjs](src/weather.mjs) implementiert. Es handelt sich um satirische Empfehlungen, nicht um amtliche Warnungen.

## Ticker

17 Einträge aus [content/ticker.json](content/ticker.json). Der Ticker zeigt Scherzmeldungen und hängt nicht vom tatsächlichen Wetter ab – auch wenn im Text Regen oder Hagel vorkommt.

| Meldung | Wetterbedingung | Status | Einordnung |
| --- | --- | --- | --- |
| Heute hagelts 100 Anzeigen. Für morgen ist bereits ein Nachschub an Aktenordnern angekündigt. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Regen ohne Einwilligung: Die erste Pfütze wurde vorsorglich angezeigt. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Frühsport im Grattlerland: erst die Beine strecken, dann die Paragraphen dehnen. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Das Recht ist kein Gummiband. Im Grattlerland läuft trotzdem der Belastungstest. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Wolke zieht schief vorbei. Vorladung ist raus. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Thermometer zeigt fünf Grad. Gegen diese Darstellung wurde Widerspruch eingelegt. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Die Anzeige wurde angezeigt. Das Aktenzeichen braucht inzwischen ein eigenes Aktenzeichen. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Spaß-Wettquote Leon gegen Gerd: Leon 3:1, Gerd 3:1, der Papierkram 1:100. Keine Einsätze – nur große Worte. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Leon oder Gerd – wer gewinnt? Zwischenstand: unentschieden. Der Drucker führt nach Punkten. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Menü des Tages: Buchstabensuppe. Bissige Kommentare werden separat serviert. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Gerdiboys Karaoke-Prognose: vereinzelte Töne, örtlich starke Abweichungen. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Im Grattlerelektronix-Krieg herrscht Waffenruhe: Beide Seiten suchen die Fernbedienung. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Beschwerde gegen den Wind eingereicht. Er soll sich endlich in eine andere Richtung drehen. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Die Gerüchteküche serviert aufgewärmten Quatsch. Heute zum Lutschen, nicht zum Kauen. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Karaoke unterm Dach: Das Mikrofon beantragt vorsorglich eine Regenpause. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Zugluft zwischen den Zähnen? Heute ist die Lücke der größte Wetterfühler. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
| Recht haben bleibt trocken. Für alle anderen zieht eine kleine Diskussion auf. | Keine; wetterunabhängig | Aktiv | Redaktionelle Satire |
