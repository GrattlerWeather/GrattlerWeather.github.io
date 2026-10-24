# Spruch oder Tickermeldung vorschlagen

[Zur README](README.md) · [Vorhandene Sprüche und Tickermeldungen](SPRUECHE-UND-TICKER.md)

Du hast einen Spruch für den Grattlerrat oder eine kurze satirische Tickermeldung? Schau zuerst in die Übersicht, ob dein Text bereits dabei ist.

## Über die Website

1. Öffne [Grattlerweather](https://grattlerweather.github.io/) und klicke auf **„Spruch vorschlagen“**.
2. Wähle **Grattlerrat** oder **Liveticker** und trage deinen Text ein (höchstens 280 Zeichen).
3. Wähle beim Grattlerrat eine passende Wetterlage. Der Liveticker benötigt keine Wetterbedingung.
4. Klicke auf **„Auf GitHub vorschlagen“**. Das öffnet ein vorausgefülltes Formular; dein Vorschlag ist damit noch nicht eingereicht.
5. Prüfe das GitHub-Formular, ergänze gegebenenfalls Wetterlagen und Quellenangaben, bestätige die Verwendung und sende das Issue ab.

## Direkt auf GitHub

Öffne das [Vorschlagsformular](https://github.com/GrattlerWeather/GrattlerWeather.github.io/issues/new?template=spruch-vorschlagen.yml). Dafür brauchst du ein GitHub-Konto.

| Feld | Was gehört hinein? |
| --- | --- |
| Vorschlagsart | **Grattlerrat** für einen wetterabhängigen Spruch, **Liveticker** für eine wetterunabhängige Scherzmeldung. |
| Spruch | Der vollständige Text, höchstens 280 Zeichen. |
| Wetterlage | Beim Grattlerrat eine oder mehrere passende Bedingungen wählen. Mehrere Bedingungen müssen gemeinsam auftreten, etwa Regen **und** Wind. Beim Liveticker leer lassen. „Noch offen“ muss vor einer Übernahme geklärt werden. |
| Quelle und Einordnung | Bei eigenen Texten „selbst ausgedacht“. Bei übernommenen Formulierungen möglichst Fundstellen-Link, Sprecher und Zeitstempel nennen. Bearbeitungen und unsichere Zuschreibungen klar kennzeichnen. Besondere Wünsche wie eine Temperaturschwelle ebenfalls hier erläutern. |
| Verwendung | Die Erklärung zur Verwendung und Bearbeitung eigener Texte beziehungsweise zur Herkunft übernommener Texte bestätigen. |

Beispiel Grattlerrat: „Der Schirm macht heute Überstunden.“ – Wetterlage **Regen**, Quelle **selbst ausgedacht**.

Beispiel Liveticker: „Die Wetterküche bleibt heute wegen Überwürzung geschlossen.“ – **keine Wetterlage**, Quelle **selbst ausgedacht**.

## Ohne GitHub-Konto

Schreib an [GrattlerWeather@proton.me](mailto:GrattlerWeather@proton.me). Nenne Vorschlagsart, Text, beim Grattlerrat die passende Wetterlage und gegebenenfalls die Quelle. Teile bei einem eigenen Text auch mit, ob er verwendet und bearbeitet werden darf.

## Was passiert danach?

GitHub-Issues und das GitHub-Profil der einreichenden Person sind öffentlich sichtbar. Bitte keine privaten Daten in Vorschläge schreiben. E-Mail-Vorschläge werden nicht automatisch als öffentliche Issues eingestellt.

Vorschläge werden redaktionell auf Inhalt, passende Bedingungen, Dubletten und Herkunft geprüft. Eine Einreichung wird nicht automatisch auf der Website veröffentlicht. Übernahme, mögliche Bearbeitung und Veröffentlichung erfolgen durch die Projektpflege. Unsichere Zuschreibungen werden nicht zu verifizierten Zitaten erklärt.

Die Inhaltsdateien sind [content/sprueche.json](content/sprueche.json) und [content/ticker.json](content/ticker.json). Die lesbare Übersicht wird beim Release-Build daraus neu erzeugt.

Die Projektpflege kann geprüfte Issues mit **angenommen** markieren. GitHub erstellt dann einen Pull Request zur Übernahme; erst das manuelle Zusammenführen veröffentlicht den Text. Die JSON-Dateien enthalten den aktuellen Stand, die lesbare Übersicht den Stand des letzten lokalen Release-Builds.
