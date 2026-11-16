/* Livetest 1: Hausübungen Bsp01–Bsp03 (Teil 1) + ähnliche Aufgaben im PS-Stil.
   Stoff: Eingabe, Rechnen, if/else (auch geschachtelt), Vergleichs- und logische Operatoren – keine Schleifen.
   Erwartete Ausgaben werden aus der Musterlösung berechnet (geprüft mit echtem Java 25). */
(function(){
if(!window.UEBUNG) return;
var X=[], G="lt1", LEER="// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  \n}";
var PS="\n\n**Wie im PS:** Halte dich exakt an das Ein-/Ausgabeformat. Prompts gehören in `IO.readln(\"? …: \")`, die Eingabe steht dann in derselben Zeile. Hier im Trainer wird die Eingabe nicht mit ausgegeben (wie bei den automatischen Tests).";
function lt(o){ o.gruppe=G; if(!o.typ) o.aufgabe+=PS; X.push(o); }

lt({id:"lt_diesel", titel:"Bsp01 · Diesel vs. Strom", kurz:"Hausübung 1: Kosten pro 100 km und Verhältnis",
aufgabe:"Berechne die Treibstoffkosten auf 100 km für ein Dieselfahrzeug und danach für ein Elektrofahrzeug, und gib das Verhältnis Strom/Diesel aus. Nicht runden.\nBeispiel:\n`? Verbrauch 100km[l]: 6.0`\n`? Dieselpreis pro Liter[Euro]: 1.99`\n`Kosten pro 100km[Euro] = 11.94`\n` `\n`? Verbrauch 100km[kWh]: 15.0`\n`? Strompreis pro kWh[Euro]: 0.267`\n`Kosten pro 100km[Euro] = 4.005`\n` `\n`Verhaeltnis S/D = 0.33542713567839194`",
start:LEER,
tests:[{in:["6.0","1.99","15.0","0.267"]},{in:["5.5","1.8","20.0","0.3"]},{in:["8","2","18","0.25"]}],
muss:[[/Double\s*\.\s*parseDouble/,"Kommazahlen liest man mit Double.parseDouble(IO.readln(…)) ein."]],
tipp:"Deine Abgabe hatte zwei Formatfehler: ` = ` statt `: ` in den Prompts und die fehlenden Leerzeilen. Eine Leerzeile gibst du mit `IO.println();` aus.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  double verbrauchD = Double.parseDouble(IO.readln(\"? Verbrauch 100km[l]: \"));\n  double dieselpreis = Double.parseDouble(IO.readln(\"? Dieselpreis pro Liter[Euro]: \"));\n  double kostenD = verbrauchD * dieselpreis;\n  IO.println(\"Kosten pro 100km[Euro] = \" + kostenD);\n  IO.println();\n\n  double verbrauchS = Double.parseDouble(IO.readln(\"? Verbrauch 100km[kWh]: \"));\n  double strompreis = Double.parseDouble(IO.readln(\"? Strompreis pro kWh[Euro]: \"));\n  double kostenS = verbrauchS * strompreis;\n  IO.println(\"Kosten pro 100km[Euro] = \" + kostenS);\n  IO.println();\n\n  IO.println(\"Verhaeltnis S/D = \" + kostenS / kostenD);\n}"});

lt({id:"lt_tempo", titel:"Bsp02 · Tempolimit & Raser", kurz:"Hausübung 2: 10 % Toleranz, nach unten runden, Raserfall",
aufgabe:"Lies Tempolimit und gemessene Geschwindigkeit ein (ganze Zahlen). Mit 10 % Toleranz: Gib die Übertretung als ganze Zahl (abgerundet) aus. Ist die Übertretung größer als 70, ist es ein Raserfall.\nBeispiel:\n`? Tempolimit (km/h): 70`\n`? Geschwindigkeit (km/h): 156`\n`Geschwindigkeitsuebertretung um 79 km/h`\n`Achtung Raser!`\nSonst: `keine Geschwindigkeitsuebertretung` bzw. `kein Raser!`",
start:LEER,
tests:[{in:["50","52"]},{in:["50","57"]},{in:["50","56"]},{in:["125","143"]},{in:["70","130"]},{in:["70","156"]},{in:["130","135"]},{in:["30","110"]}],
tipp:"**Falle:** `(int)(geschwindigkeit - tempolimit * 1.1)` liefert bei 50/57 nur 1 statt 2, weil 50 · 1.1 als double 55.00000000000001 ist! Rechne mit ganzen Zahlen: Die Übertretung ist `(10 * geschwindigkeit - 11 * tempolimit) / 10`, also alles mal 10, dann ganzzahlig teilen.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int tempolimit = Integer.parseInt(IO.readln(\"? Tempolimit (km/h): \"));\n  int geschwindigkeit = Integer.parseInt(IO.readln(\"? Geschwindigkeit (km/h): \"));\n  int ueber = (10 * geschwindigkeit - 11 * tempolimit) / 10;\n\n  if (ueber > 0) {\n    IO.println(\"Geschwindigkeitsuebertretung um \" + ueber + \" km/h\");\n  } else {\n    IO.println(\"keine Geschwindigkeitsuebertretung\");\n  }\n  if (ueber > 70) {\n    IO.println(\"Achtung Raser!\");\n  } else {\n    IO.println(\"kein Raser!\");\n  }\n}"});

lt({id:"lt_schritte", titel:"Bsp03 · Schrittziel (Teil 1)", kurz:"Hausübung 3: Konstanten mit final, Altersreduktion",
aufgabe:"Konstanten (mit `final`): Mindestalter 18, Schrittziel 10000. Gib beide aus, lies Name, Alter und Schritte ein. Ist die Person jünger als das Mindestalter, sinkt das Ziel pro fehlendem Jahr um 5 % des ursprünglichen Ziels (gesamte Reduktion abrunden). In if-Bedingungen nur die Konstanten verwenden, keine 18/10000!\nBeispiel:\n`Mindestalter für das Trainingsziel: 18`\n`Schrittziel: 10000`\n`? Name: LT`\n`? Alter: 16`\n`? Schritte: 8000`\n`Schrittziel aufgrund des Alters um 1000 auf 9000 adaptiert.`\n`Schrittziel mit 8000 Schritten ohne zusätzliches Training nicht erreicht.`\n(Bei genug Schritten: `… erreicht.`)",
start:LEER,
tests:[{in:["DK","18","9000"]},{in:["SR","24","12345"]},{in:["AN","13","8000"]},{in:["LT","16","8000"]},{in:["XY","1","1500"]},{in:["MK","17","9500"]}],
muss:[[/\bfinal\s+int\b/,"Deklariere die Konstanten mit `final int …`."]],
verboten:[[/if\s*\([^)]*\b(18|10000)\b/,"In if-Bedingungen nur die Konstanten verwenden, nicht 18 oder 10000."]],
tipp:"Reduktion = `SCHRITTZIEL * 5 * fehlendeJahre / 100`. Erst multiplizieren, dann teilen, so wird nur einmal am Ende abgerundet. „mindestens erreicht“ heißt `>=`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  final int MINDESTALTER = 18;\n  final int SCHRITTZIEL = 10000;\n\n  IO.println(\"Mindestalter für das Trainingsziel: \" + MINDESTALTER);\n  IO.println(\"Schrittziel: \" + SCHRITTZIEL);\n\n  String name = IO.readln(\"? Name: \");\n  int alter = Integer.parseInt(IO.readln(\"? Alter: \"));\n  int schritte = Integer.parseInt(IO.readln(\"? Schritte: \"));\n\n  int ziel = SCHRITTZIEL;\n  if (alter < MINDESTALTER) {\n    int fehlendeJahre = MINDESTALTER - alter;\n    int reduktion = SCHRITTZIEL * 5 * fehlendeJahre / 100;\n    ziel = SCHRITTZIEL - reduktion;\n    IO.println(\"Schrittziel aufgrund des Alters um \" + reduktion + \" auf \" + ziel + \" adaptiert.\");\n  }\n\n  if (schritte >= ziel) {\n    IO.println(\"Schrittziel mit \" + schritte + \" Schritten ohne zusätzliches Training erreicht.\");\n  } else {\n    IO.println(\"Schrittziel mit \" + schritte + \" Schritten ohne zusätzliches Training nicht erreicht.\");\n  }\n}"});

lt({id:"lt_fehler", titel:"Fehler finden · Tempolimit", kurz:"3 Formatfehler – genau die, die im Test Punkte kosten",
aufgabe:"Das Programm rechnet richtig, besteht aber den automatischen Test nicht. Gewünschtes Format:\n`? Tempolimit (km/h): 50`\n`? Geschwindigkeit (km/h): 57`\n`Geschwindigkeitsuebertretung um 2 km/h`\n**Im Code stecken 3 Fehler.** Vergleiche deine Ausgabe Zeichen für Zeichen mit der erwarteten.",
start:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  IO.println(\"? Tempolimit (km/h): \");\n  int tempolimit = Integer.parseInt(IO.readln());\n  int geschwindigkeit = Integer.parseInt(IO.readln(\"? Geschwindigkeit (km/h) = \"));\n  int ueber = (10 * geschwindigkeit - 11 * tempolimit) / 10;\n  if (ueber > 0) {\n    IO.println(\"Geschwindigkeitsuebertretung um \" + ueber + \"km/h\");\n  } else {\n    IO.println(\"keine Geschwindigkeitsuebertretung\");\n  }\n}",
tests:[{in:["50","57"]},{in:["50","52"]},{in:["125","143"]}],
tipp:"1) Prompt mit `println` → Zeilenumbruch vor der Eingabe. 2) ` = ` statt `: `. 3) Vor `km/h` fehlt ein Leerzeichen.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int tempolimit = Integer.parseInt(IO.readln(\"? Tempolimit (km/h): \"));\n  int geschwindigkeit = Integer.parseInt(IO.readln(\"? Geschwindigkeit (km/h): \"));\n  int ueber = (10 * geschwindigkeit - 11 * tempolimit) / 10;\n  if (ueber > 0) {\n    IO.println(\"Geschwindigkeitsuebertretung um \" + ueber + \" km/h\");\n  } else {\n    IO.println(\"keine Geschwindigkeitsuebertretung\");\n  }\n}"});

lt({id:"lt_parken", titel:"Parkgarage", kurz:"Ganzzahl-Rechnen, Konstanten, geschachteltes if",
aufgabe:"Konstanten: 15 Freiminuten, 2 Euro pro **angefangene** Stunde, Tagesmaximum 12 Euro.\nLies die Parkdauer in Minuten ein.\n• negativ → `Ungueltige Eingabe!`\n• bis inkl. 15 Minuten → `Parken gratis.`\n• sonst: angefangene Stunden und Kosten ausgeben; liegen die Kosten über dem Maximum, wird das Maximum verrechnet und davor `Tagesmaximum erreicht.` ausgegeben.\nBeispiel:\n`? Parkdauer[min]: 125`\n`Angefangene Stunden: 3`\n`Kosten[Euro] = 6`\nBeispiel:\n`? Parkdauer[min]: 500`\n`Angefangene Stunden: 9`\n`Tagesmaximum erreicht.`\n`Kosten[Euro] = 12`",
start:LEER,
tests:[{in:["125"]},{in:["500"]},{in:["15"]},{in:["16"]},{in:["60"]},{in:["61"]},{in:["0"]},{in:["-5"]},{in:["360"]}],
muss:[[/\bfinal\s+int\b/,"Deklariere die Konstanten mit `final int …`."]],
tipp:"Angefangene Stunden ohne Schleife und ohne double: `(minuten + 59) / 60`. Prüfe: 60 → 1, 61 → 2. Der Ungültig-Fall kommt zuerst, damit danach nichts mehr ausgegeben wird.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  final int FREIMINUTEN = 15;\n  final int PREIS_PRO_STUNDE = 2;\n  final int TAGESMAXIMUM = 12;\n\n  int minuten = Integer.parseInt(IO.readln(\"? Parkdauer[min]: \"));\n\n  if (minuten < 0) {\n    IO.println(\"Ungueltige Eingabe!\");\n  } else if (minuten <= FREIMINUTEN) {\n    IO.println(\"Parken gratis.\");\n  } else {\n    int stunden = (minuten + 59) / 60;\n    int kosten = stunden * PREIS_PRO_STUNDE;\n    IO.println(\"Angefangene Stunden: \" + stunden);\n    if (kosten > TAGESMAXIMUM) {\n      IO.println(\"Tagesmaximum erreicht.\");\n      kosten = TAGESMAXIMUM;\n    }\n    IO.println(\"Kosten[Euro] = \" + kosten);\n  }\n}"});

lt({id:"lt_schaltjahr", titel:"Schaltjahr", kurz:"Logische Operatoren && und ||",
aufgabe:"Lies ein Jahr ein. Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, aber nicht durch 100, **außer** es ist durch 400 teilbar.\nBeispiel:\n`? Jahr: 2024`\n`2024 ist ein Schaltjahr.`\nBeispiel:\n`? Jahr: 1900`\n`1900 ist kein Schaltjahr.`",
start:LEER,
tests:[{in:["2024"]},{in:["2023"]},{in:["1900"]},{in:["2000"]},{in:["2100"]},{in:["2400"]}],
tipp:"In einer Bedingung: `(jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0`. Die Klammern machen klar, was zusammengehört (&& bindet ohnehin stärker als ||).",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int jahr = Integer.parseInt(IO.readln(\"? Jahr: \"));\n  if ((jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0) {\n    IO.println(jahr + \" ist ein Schaltjahr.\");\n  } else {\n    IO.println(jahr + \" ist kein Schaltjahr.\");\n  }\n}"});

lt({id:"lt_dreieck", titel:"Dreieck bestimmen", kurz:"Geschachtelte ifs mit && und ||",
aufgabe:"Lies drei Seitenlängen (ganze Zahlen) ein: `? Seite a: `, `? Seite b: `, `? Seite c: `.\n• Ist eine Seite ≤ 0 → `Ungueltige Seitenlaenge!`\n• Ist eine Seite mindestens so lang wie die beiden anderen zusammen → `Kein Dreieck!`\n• sonst: `Gleichseitiges Dreieck`, `Gleichschenkliges Dreieck` oder `Allgemeines Dreieck`, und zusätzlich in einer zweiten Zeile `rechtwinklig`, wenn a²+b²=c² (in irgendeiner Reihenfolge der Seiten).\nBeispiel:\n`? Seite a: 3`\n`? Seite b: 4`\n`? Seite c: 5`\n`Allgemeines Dreieck`\n`rechtwinklig`",
start:LEER,
tests:[{in:["3","4","5"]},{in:["5","3","4"]},{in:["2","2","2"]},{in:["2","2","3"]},{in:["3","2","3"]},{in:["4","5","6"]},{in:["1","2","3"]},{in:["0","4","5"]},{in:["7","3","-1"]},{in:["10","2","3"]}],
tipp:"Reihenfolge: zuerst ungültig, dann kein Dreieck, dann die Art. Gleichschenklig: `a == b || b == c || a == c` (gleichseitig vorher prüfen!). Rechtwinklig ist ein eigenes if innerhalb des Dreieck-Zweigs.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int a = Integer.parseInt(IO.readln(\"? Seite a: \"));\n  int b = Integer.parseInt(IO.readln(\"? Seite b: \"));\n  int c = Integer.parseInt(IO.readln(\"? Seite c: \"));\n\n  if (a <= 0 || b <= 0 || c <= 0) {\n    IO.println(\"Ungueltige Seitenlaenge!\");\n  } else if (a >= b + c || b >= a + c || c >= a + b) {\n    IO.println(\"Kein Dreieck!\");\n  } else {\n    if (a == b && b == c) {\n      IO.println(\"Gleichseitiges Dreieck\");\n    } else if (a == b || b == c || a == c) {\n      IO.println(\"Gleichschenkliges Dreieck\");\n    } else {\n      IO.println(\"Allgemeines Dreieck\");\n    }\n    if (a * a + b * b == c * c || a * a + c * c == b * b || b * b + c * c == a * a) {\n      IO.println(\"rechtwinklig\");\n    }\n  }\n}"});

lt({id:"lt_pruefung", titel:"Prüfungsnote aus zwei Teilen", kurz:"Mindestpunkte pro Teil, Notenschlüssel",
aufgabe:"Konstanten: max. 50 Punkte pro Teil, mind. 10 Punkte pro Teil.\nLies `? Punkte Teil 1: ` und `? Punkte Teil 2: ` ein.\n• Liegt ein Wert unter 0 oder über dem Maximum → `Ungueltige Punkte!` (sonst nichts)\n• Sonst `Gesamt: 73 von 100` ausgeben, dann:\n – hat ein Teil weniger als die Mindestpunkte → `Note: Nicht genuegend (Mindestpunkte verfehlt)`\n – sonst nach Gesamtpunkten: ab 88 `Sehr gut`, ab 75 `Gut`, ab 63 `Befriedigend`, ab 50 `Genuegend`, sonst `Nicht genuegend`, ausgegeben als `Note: Gut`",
start:LEER,
tests:[{in:["40","33"]},{in:["50","50"]},{in:["44","44"]},{in:["9","50"]},{in:["30","20"]},{in:["25","24"]},{in:["38","25"]},{in:["51","10"]},{in:["20","-1"]}],
muss:[[/\bfinal\s+int\b/,"Deklariere die Konstanten mit `final int …`."]],
tipp:"Äußeres if: ungültig ja/nein. Darin: zuerst die Mindestpunkte prüfen (`teil1 < MIN || teil2 < MIN`), erst dann die Notenkette von oben (88) nach unten.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  final int MAX_TEIL = 50;\n  final int MIN_TEIL = 10;\n\n  int teil1 = Integer.parseInt(IO.readln(\"? Punkte Teil 1: \"));\n  int teil2 = Integer.parseInt(IO.readln(\"? Punkte Teil 2: \"));\n\n  if (teil1 < 0 || teil1 > MAX_TEIL || teil2 < 0 || teil2 > MAX_TEIL) {\n    IO.println(\"Ungueltige Punkte!\");\n  } else {\n    int gesamt = teil1 + teil2;\n    IO.println(\"Gesamt: \" + gesamt + \" von \" + 2 * MAX_TEIL);\n    if (teil1 < MIN_TEIL || teil2 < MIN_TEIL) {\n      IO.println(\"Note: Nicht genuegend (Mindestpunkte verfehlt)\");\n    } else if (gesamt >= 88) {\n      IO.println(\"Note: Sehr gut\");\n    } else if (gesamt >= 75) {\n      IO.println(\"Note: Gut\");\n    } else if (gesamt >= 63) {\n      IO.println(\"Note: Befriedigend\");\n    } else if (gesamt >= 50) {\n      IO.println(\"Note: Genuegend\");\n    } else {\n      IO.println(\"Note: Nicht genuegend\");\n    }\n  }\n}"});

lt({id:"lt_taxi", titel:"Taxifahrt", kurz:"double, Mindestpreis, Nachtzuschlag mit ||",
aufgabe:"Konstanten (double): Grundgebühr 4.0, pro km 1.5, Mindestpreis 8.0, Nachtzuschlag 3.0.\nLies `? Strecke[km]: ` (Kommazahl) und `? Uhrzeit[h]: ` (ganze Zahl) ein.\n• Uhrzeit nicht zwischen 0 und 23 → `Ungueltige Uhrzeit!` (sonst nichts)\n• Preis = Grundgebühr + km · Preis pro km. Ist er kleiner als der Mindestpreis → Mindestpreis verrechnen und `Mindestpreis verrechnet.` ausgeben.\n• Ab 22 Uhr oder vor 6 Uhr → Nachtzuschlag dazu und `Nachtzuschlag: 3.0` ausgeben.\n• Zum Schluss `Fahrpreis[Euro] = …` (nicht runden).\nBeispiel:\n`? Strecke[km]: 2.0`\n`? Uhrzeit[h]: 23`\n`Mindestpreis verrechnet.`\n`Nachtzuschlag: 3.0`\n`Fahrpreis[Euro] = 11.0`",
start:LEER,
tests:[{in:["2.0","23"]},{in:["10.0","14"]},{in:["12.5","5"]},{in:["1.0","6"]},{in:["3.0","22"]},{in:["7.3","21"]},{in:["5","24"]},{in:["5","-1"]}],
muss:[[/\bfinal\s+double\b/,"Deklariere die Konstanten mit `final double …`."]],
tipp:"„ab 22 oder vor 6“ → `stunde >= 22 || stunde < 6`. Ungültig: `stunde < 0 || stunde > 23`. Rechne den Preis genau als `GRUNDGEBUEHR + km * PREIS_PRO_KM`, sonst können die Nachkommastellen anders aussehen.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  final double GRUNDGEBUEHR = 4.0;\n  final double PREIS_PRO_KM = 1.5;\n  final double MINDESTPREIS = 8.0;\n  final double NACHTZUSCHLAG = 3.0;\n\n  double km = Double.parseDouble(IO.readln(\"? Strecke[km]: \"));\n  int stunde = Integer.parseInt(IO.readln(\"? Uhrzeit[h]: \"));\n\n  if (stunde < 0 || stunde > 23) {\n    IO.println(\"Ungueltige Uhrzeit!\");\n  } else {\n    double preis = GRUNDGEBUEHR + km * PREIS_PRO_KM;\n    if (preis < MINDESTPREIS) {\n      preis = MINDESTPREIS;\n      IO.println(\"Mindestpreis verrechnet.\");\n    }\n    if (stunde >= 22 || stunde < 6) {\n      preis = preis + NACHTZUSCHLAG;\n      IO.println(\"Nachtzuschlag: \" + NACHTZUSCHLAG);\n    }\n    IO.println(\"Fahrpreis[Euro] = \" + preis);\n  }\n}"});

function vor(o){ o.gruppe=G; o.typ="vorhersage"; o.aufgabe="Was gibt dieses Programm aus? Schreib die Ausgabe genau so auf, wie sie in der Konsole erscheinen würde – jede Ausgabezeile in eine eigene Zeile."; o.tests=[{}]; X.push(o); }
vor({id:"lt_v_if", titel:"Vorhersage · if-Fallen", kurz:"Dangling else, Kurzschluss, !",
code:String.raw`void main() {
  int a = 7;
  int b = 3;
  if (a > 5)
    if (b > 5)
      IO.println("A");
  else
    IO.println("B");
  if (a > 5 || b / 0 > 1) {
    IO.println("C");
  }
  if (!(a % 2 == 0) && b != 3) {
    IO.println("D");
  } else {
    IO.println("E");
  }
}`,
erkl:"Das `else` gehört **immer zum nächsten if ohne else**, also zu `if (b > 5)`, egal wie es eingerückt ist. a > 5 ist true, b > 5 false → **B**. Bei `||` ist die linke Seite schon true, also wird `b / 0` gar nicht ausgerechnet → kein Absturz, **C**. `a % 2 == 0` ist false, `!false` = true, aber `b != 3` ist false → true && false = false → **E**.",
tipp:"Einrückung ist Java egal. Und || hört auf, sobald links true steht."});
vor({id:"lt_v_typen", titel:"Vorhersage · int, double, Vergleiche", kurz:"Ganzzahldivision, Cast, double-Vergleich",
code:String.raw`void main() {
  int x = 10;
  double y = x / 4;
  IO.println(y);
  IO.println(x / 4.0);
  IO.println(x > 5 && x < 10);
  IO.println(x >= 10 || x < 0);
  IO.println(0.1 + 0.2 == 0.3);
  IO.println((int) 9.99 + 1);
}`,
erkl:"`x / 4`: zwei ints → **2**, erst danach wird es in double umgewandelt → **2.0**. `x / 4.0` → **2.5**. `x < 10` ist false → **false**. `x >= 10` ist true → **true**. `0.1 + 0.2` ist als double 0.30000000000000004 → **false** (darum Kommazahlen nie mit == vergleichen). `(int) 9.99` schneidet ab → 9, + 1 = **10**.",
tipp:"Der Cast (int) rundet nicht, er schneidet ab."});

Array.prototype.push.apply(UEBUNG.aufgaben, X);
UEBUNG.gruppen.unshift([G,"Livetest 1 (PS-Stil)","Hausübungen Bsp01–03 und ähnliche Aufgaben: Eingabe, Rechnen, if/else, && und || – keine Schleifen"]);
})();
