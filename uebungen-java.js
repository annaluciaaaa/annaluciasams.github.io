/* Code-Trainer: Übungsaufgaben zum Selberschreiben.
   Jede Aufgabe: Vorlage (vor/nach, mit {platzhaltern} für Testwerte), entweder ein Editor-Block oder eine einzelne Zeile (inline),
   Tests (Eingaben und/oder Platzhalter-Werte), Musterlösung, Tipp, optionale Anforderungen (muss/verboten).
   Die erwartete Ausgabe wird aus der Musterlösung berechnet (geprüft mit echtem Java 25). */
(function(){
var MAIN_A="void main() {", MAIN_E="}";
var X=[];

/* ===== 1. Ausgabe, Variablen, Eingabe ===== */
X.push({id:"hallo", gruppe:"g1", titel:"Hallo Welt",
aufgabe:"Schreib dein erstes Programm. Es soll genau diesen Text ausgeben:\n`Hallo Welt!`",
start:"void main() {\n  \n}",
tests:[{}],
tipp:"Ausgaben macht man mit `IO.println(\"…\");`. Text steht in doppelten Anführungszeichen, am Ende der Zeile kommt ein Strichpunkt.",
loesung:"void main() {\n  IO.println(\"Hallo Welt!\");\n}"});

X.push({id:"zweizeilen", gruppe:"g1", titel:"Zwei Zeilen",
aufgabe:"Gib genau diese zwei Zeilen aus:\n`Ich lerne`\n`Java!`",
start:"void main() {\n  \n}",
tests:[{}],
tipp:"Jedes `IO.println(…)` beginnt danach eine neue Zeile. Du brauchst also zwei davon.",
loesung:"void main() {\n  IO.println(\"Ich lerne\");\n  IO.println(\"Java!\");\n}"});

X.push({id:"variablen", gruppe:"g1", titel:"Variablen benutzen",
aufgabe:"Lege eine Variable `name` (Typ String) mit dem Wert \"Anna\" an und eine Variable `alter` (Typ int) mit dem Wert 20.\nGib dann mit diesen Variablen aus:\n`Anna ist 20 Jahre alt.`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{}],
muss:[[/\bString\s+name\s*=/,"Lege die Variable mit `String name = …;` an."],[/\bint\s+alter\s*=/,"Lege die Variable mit `int alter = …;` an."],[/\+\s*alter\b|\balter\s*\+/,"Verwende die Variable `alter` in der Ausgabe (mit `+` anhängen), statt die 20 abzuschreiben."],[/\+\s*name\b|\bname\s*\+/,"Verwende die Variable `name` in der Ausgabe (mit `+`)."]],
tipp:"Text und Variablen verbindet man mit `+`: `IO.println(name + \" ist \" + …);`. Achte auf die Leerzeichen innerhalb der Anführungszeichen!",
loesung:"  String name = \"Anna\";\n  int alter = 20;\n  IO.println(name + \" ist \" + alter + \" Jahre alt.\");"});

X.push({id:"summe2", gruppe:"g1", titel:"Zwei Zahlen addieren",
aufgabe:"Lies zwei ganze Zahlen ein (jede mit eigenem `IO.readln()`) und gib ihre Summe aus.\nBeispiel: Eingabe 3 und 4 → Ausgabe `Summe: 7`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["3","4"]},{in:["10","-2"]},{in:["0","0"]}],
tipp:"`IO.readln()` liefert Text. Mit `Integer.parseInt(IO.readln())` bekommst du eine Zahl: `int a = Integer.parseInt(IO.readln());`",
loesung:"  int a = Integer.parseInt(IO.readln());\n  int b = Integer.parseInt(IO.readln());\n  IO.println(\"Summe: \" + (a + b));"});

X.push({id:"rechteck", gruppe:"g1", titel:"Rechteck",
aufgabe:"Lies Breite und Höhe eines Rechtecks ein (ganze Zahlen) und gib Fläche und Umfang aus.\nBeispiel: 3 und 5 →\n`Fläche: 15`\n`Umfang: 16`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["3","5"]},{in:["10","10"]},{in:["1","7"]}],
tipp:"Fläche = Breite · Höhe, Umfang = 2 · (Breite + Höhe). Achtung: In `\"Umfang: \" + 2 * (b + h)` wird zuerst gerechnet, weil `*` stärker bindet als `+`.",
loesung:"  int breite = Integer.parseInt(IO.readln());\n  int hoehe = Integer.parseInt(IO.readln());\n  IO.println(\"Fläche: \" + breite * hoehe);\n  IO.println(\"Umfang: \" + 2 * (breite + hoehe));"});

X.push({id:"minuten", gruppe:"g1", titel:"Minuten umrechnen (/ und %)",
aufgabe:"Lies eine Anzahl Minuten ein und gib sie als Stunden und Minuten aus.\nBeispiel: 135 → `2 h 15 min`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["135"]},{in:["59"]},{in:["600"]},{in:["61"]}],
tipp:"Bei ganzen Zahlen ist `/` die Ganzzahldivision (135 / 60 = 2) und `%` der Rest (135 % 60 = 15).",
loesung:"  int minuten = Integer.parseInt(IO.readln());\n  IO.println(minuten / 60 + \" h \" + minuten % 60 + \" min\");"});

X.push({id:"celsius", gruppe:"g1", titel:"Celsius → Fahrenheit (double)",
aufgabe:"Lies eine Temperatur in Grad Celsius ein (Kommazahl, z. B. 37.5) und gib sie in Fahrenheit aus.\nFormel: F = C · 9 / 5 + 32\nBeispiel: 20 → `Fahrenheit: 68.0`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["20"]},{in:["37.5"]},{in:["-40"]},{in:["0"]}],
tipp:"Für Kommazahlen: `double c = Double.parseDouble(IO.readln());`. Vorsicht: `9 / 5` allein wäre eine Ganzzahldivision (= 1)! Wenn du `c * 9 / 5` schreibst, ist das kein Problem, weil `c` schon double ist.",
loesung:"  double c = Double.parseDouble(IO.readln());\n  double f = c * 9 / 5 + 32;\n  IO.println(\"Fahrenheit: \" + f);"});

X.push({id:"durchschnitt", gruppe:"g1", titel:"Durchschnitt (Falle: Ganzzahldivision)",
aufgabe:"Lies drei ganze Zahlen ein und gib ihren Durchschnitt als Kommazahl aus.\nBeispiel: 1, 2, 2 → `Durchschnitt: 1.6666666666666667`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["1","2","3"]},{in:["1","2","2"]},{in:["10","0","5"]}],
tipp:"`(a + b + c) / 3` rechnet mit ganzen Zahlen und schneidet ab! Teile durch `3.0` oder caste: `(double)(a + b + c) / 3`.",
loesung:"  int a = Integer.parseInt(IO.readln());\n  int b = Integer.parseInt(IO.readln());\n  int c = Integer.parseInt(IO.readln());\n  IO.println(\"Durchschnitt: \" + (a + b + c) / 3.0);"});

/* ===== 2. Vergleichsoperatoren und Bedingungen ===== */
var B_VOR="void main() {\n  int x = {x};", B_NACH="  IO.println(ergebnis);\n}", B_IN=["  boolean ergebnis = ",";"];
function bool(id,titel,aufgabe,loes,xs,tipp,extra){
  var o={id:id,gruppe:"g2",titel:titel,aufgabe:aufgabe+"\nDein Ausdruck wird mit verschiedenen Werten für `x` getestet.",vor:B_VOR,nach:B_NACH,inline:B_IN,tests:xs.map(function(v){return {set:{x:String(v)}}}),tipp:tipp,loesung:loes};
  if(extra) for(var k in extra) o[k]=extra[k];
  X.push(o);
}
bool("positiv","x ist positiv","Schreib einen Ausdruck, der `true` ist, wenn `x` größer als 0 ist.","x > 0",[5,0,-3,1],"Vergleichsoperatoren: `<`, `>`, `<=`, `>=`, `==` (gleich), `!=` (ungleich). Das Ergebnis ist `true` oder `false`.");
bool("gerade","x ist gerade","`true`, wenn `x` eine gerade Zahl ist.","x % 2 == 0",[4,7,0,-6,-3],"Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Den Rest liefert `%`. Vergleichen mit `==` (zwei Gleichheitszeichen!).");
bool("zwischen","x liegt zwischen 1 und 10","`true`, wenn `x` zwischen 1 und 10 liegt (1 und 10 zählen mit).","x >= 1 && x <= 10",[1,10,0,11,5,-5],"`1 <= x <= 10` wie in Mathe geht in Java nicht! Zwei Vergleiche mit `&&` (und) verbinden: `x >= 1 && x <= 10`.");
bool("ausserhalb","x liegt außerhalb von 0 bis 100","`true`, wenn `x` kleiner als 0 **oder** größer als 100 ist.","x < 0 || x > 100",[-1,0,50,100,101],"„oder“ heißt in Java `||`. Es ist `true`, wenn mindestens eine Seite `true` ist.");
bool("teilbar35","durch 3 oder 5 teilbar","`true`, wenn `x` durch 3 oder durch 5 teilbar ist (oder durch beide).","x % 3 == 0 || x % 5 == 0",[9,10,15,7,1,0],"„durch 3 teilbar“ heißt: `x % 3 == 0`.");
X.push({id:"gleich", gruppe:"g2", titel:"a und b gleich, aber nicht 0",
aufgabe:"`true`, wenn `a` und `b` gleich sind **und** `a` nicht 0 ist.\nDein Ausdruck wird mit verschiedenen Werten für `a` und `b` getestet.",
vor:"void main() {\n  int a = {a};\n  int b = {b};", nach:B_NACH, inline:B_IN,
tests:[{set:{a:"3",b:"3"}},{set:{a:"3",b:"4"}},{set:{a:"0",b:"0"}},{set:{a:"-2",b:"-2"}}],
tipp:"„gleich“ ist `==`, „ungleich“ ist `!=`, „und“ ist `&&`.",
loesung:"a == b && a != 0"});
X.push({id:"schaltjahr", gruppe:"g2", titel:"Schaltjahr",
aufgabe:"`true`, wenn `jahr` ein Schaltjahr ist. Regel: durch 4 teilbar, aber nicht durch 100 – außer es ist durch 400 teilbar.\n(2024 ja, 1900 nein, 2000 ja)",
vor:"void main() {\n  int jahr = {j};", nach:B_NACH, inline:B_IN,
tests:[{set:{j:"2024"}},{set:{j:"2023"}},{set:{j:"1900"}},{set:{j:"2000"}},{set:{j:"2100"}}],
tipp:"Zerlege es: `(jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0`. Klammern machen klar, was zusammengehört.",
loesung:"(jahr % 4 == 0 && jahr % 100 != 0) || jahr % 400 == 0"});
X.push({id:"ja", gruppe:"g2", titel:"Text vergleichen (equals!)",
aufgabe:"Die Antwort wird eingelesen. Schreib einen Ausdruck, der `true` ist, wenn genau \"ja\" eingegeben wurde.",
vor:"void main() {\n  String antwort = IO.readln();", nach:B_NACH, inline:B_IN,
tests:[{in:["ja"]},{in:["Ja"]},{in:["nein"]}],
tipp:"Strings vergleicht man **nicht** mit `==`, denn das prüft nur, ob es dasselbe Objekt ist. Richtig ist: `antwort.equals(\"ja\")`.",
loesung:"antwort.equals(\"ja\")"});
X.push({id:"ziffer", gruppe:"g2", titel:"Zeichen ist eine Ziffer",
aufgabe:"`true`, wenn das Zeichen `c` eine Ziffer ist ('0' bis '9').",
vor:"void main() {\n  char c = '{c}';", nach:B_NACH, inline:B_IN,
tests:[{set:{c:"7"}},{set:{c:"a"}},{set:{c:"0"}},{set:{c:"9"}},{set:{c:"/"}},{set:{c:":"}}],
tipp:"Zeichen kann man wie Zahlen vergleichen (über ihre Nummer): `c >= '0' && c <= '9'`. Achtung: `'0'` (Zeichen) ist nicht `0` (Zahl)!",
loesung:"c >= '0' && c <= '9'"});
X.push({id:"spazieren", gruppe:"g2", titel:"Spazieren gehen (boolean-Variablen)",
aufgabe:"Man geht spazieren, wenn es **nicht** regnet oder wenn man einen Schirm hat. Schreib den Ausdruck mit den boolean-Variablen `regen` und `schirm`.",
vor:"void main() {\n  boolean regen = {r};\n  boolean schirm = {s};", nach:B_NACH, inline:B_IN,
tests:[{set:{r:"false",s:"false"}},{set:{r:"true",s:"false"}},{set:{r:"true",s:"true"}},{set:{r:"false",s:"true"}}],
tipp:"`!` heißt „nicht“: `!regen` ist true, wenn regen false ist. Bei boolean-Variablen braucht man kein `== true`.",
loesung:"!regen || schirm"});

/* ===== 3. if / else / switch ===== */
function ein(n,typ){ typ=typ||"int"; return typ==="int"?"  int "+n+" = Integer.parseInt(IO.readln());":"  double "+n+" = Double.parseDouble(IO.readln());" }
X.push({id:"bestanden", gruppe:"g3", titel:"Bestanden?",
aufgabe:"Die Punkte werden schon eingelesen. Gib `bestanden` aus, wenn es mindestens 50 Punkte sind, sonst `nicht bestanden`.",
vor:MAIN_A+"\n"+ein("punkte"), nach:MAIN_E, start:"  ",
tests:[{in:["72"]},{in:["50"]},{in:["49"]},{in:["0"]}],
tipp:"`if (bedingung) { … } else { … }` – „mindestens 50“ heißt `>= 50`.",
loesung:"  if (punkte >= 50) {\n    IO.println(\"bestanden\");\n  } else {\n    IO.println(\"nicht bestanden\");\n  }"});
X.push({id:"maximum", gruppe:"g3", titel:"Die größere Zahl",
aufgabe:"Zwei Zahlen werden eingelesen. Gib die größere aus, z. B. `Maximum: 7`. Wenn beide gleich sind, ist das eben diese Zahl.\nLöse es mit if/else (ohne Math.max).",
vor:MAIN_A+"\n"+ein("a")+"\n"+ein("b"), nach:MAIN_E, start:"  ",
tests:[{in:["3","7"]},{in:["9","2"]},{in:["5","5"]},{in:["-1","-8"]}],
verboten:[[/Math\s*\.\s*max/,"Löse es diesmal mit if/else, ohne Math.max."]],
tipp:"Entweder `if (a > b) IO.println(\"Maximum: \" + a); else …` oder zuerst eine Variable `max` mit if/else befüllen und am Ende einmal ausgeben.",
loesung:"  int max;\n  if (a >= b) {\n    max = a;\n  } else {\n    max = b;\n  }\n  IO.println(\"Maximum: \" + max);"});
X.push({id:"vorzeichen", gruppe:"g3", titel:"Positiv, negativ oder null",
aufgabe:"Gib für die eingelesene Zahl `positiv`, `negativ` oder `null` aus.",
vor:MAIN_A+"\n"+ein("x"), nach:MAIN_E, start:"  ",
tests:[{in:["5"]},{in:["-2"]},{in:["0"]}],
tipp:"Drei Fälle → `if (…) { … } else if (…) { … } else { … }`. Der letzte else-Zweig fängt alles ab, was übrig bleibt.",
loesung:"  if (x > 0) {\n    IO.println(\"positiv\");\n  } else if (x < 0) {\n    IO.println(\"negativ\");\n  } else {\n    IO.println(\"null\");\n  }"});
X.push({id:"geradeungerade", gruppe:"g3", titel:"Gerade oder ungerade",
aufgabe:"Gib für die eingelesene Zahl aus: `Die Zahl 4 ist gerade.` bzw. `Die Zahl 7 ist ungerade.`",
vor:MAIN_A+"\n"+ein("x"), nach:MAIN_E, start:"  ",
tests:[{in:["4"]},{in:["7"]},{in:["-3"]},{in:["0"]}],
tipp:"Gerade heißt `x % 2 == 0`. Achtung bei negativen Zahlen: −3 % 2 ist −1, nicht 1! Prüfe also besser auf `== 0` als auf `== 1`.",
loesung:"  if (x % 2 == 0) {\n    IO.println(\"Die Zahl \" + x + \" ist gerade.\");\n  } else {\n    IO.println(\"Die Zahl \" + x + \" ist ungerade.\");\n  }"});
X.push({id:"note", gruppe:"g3", titel:"Punkte → Note",
aufgabe:"Gib für die Punkte (0–100) die Note aus:\nab 90: `Sehr gut` · ab 80: `Gut` · ab 65: `Befriedigend` · ab 50: `Genügend` · sonst: `Nicht genügend`",
vor:MAIN_A+"\n"+ein("punkte"), nach:MAIN_E, start:"  ",
tests:[{in:["95"]},{in:["90"]},{in:["89"]},{in:["80"]},{in:["65"]},{in:["64"]},{in:["50"]},{in:["49"]},{in:["0"]}],
tipp:"Mit einer if-else-if-Kette von oben nach unten: Die erste passende Bedingung gewinnt. Wenn du mit `>= 90` beginnst, reicht danach `>= 80` – die 90er sind ja schon weg.",
loesung:"  if (punkte >= 90) {\n    IO.println(\"Sehr gut\");\n  } else if (punkte >= 80) {\n    IO.println(\"Gut\");\n  } else if (punkte >= 65) {\n    IO.println(\"Befriedigend\");\n  } else if (punkte >= 50) {\n    IO.println(\"Genügend\");\n  } else {\n    IO.println(\"Nicht genügend\");\n  }"});
X.push({id:"eintritt", gruppe:"g3", titel:"Eintrittspreis",
aufgabe:"Gib den Eintrittspreis für das eingelesene Alter aus:\nunter 6: `gratis` · 6 bis 17: `5 Euro` · 18 bis 64: `10 Euro` · ab 65: `7 Euro`",
vor:MAIN_A+"\n"+ein("alter"), nach:MAIN_E, start:"  ",
tests:[{in:["3"]},{in:["6"]},{in:["17"]},{in:["18"]},{in:["64"]},{in:["65"]},{in:["80"]}],
tipp:"Achte genau auf die Grenzen: „unter 6“ ist `< 6`, „ab 65“ ist `>= 65`.",
loesung:"  if (alter < 6) {\n    IO.println(\"gratis\");\n  } else if (alter < 18) {\n    IO.println(\"5 Euro\");\n  } else if (alter < 65) {\n    IO.println(\"10 Euro\");\n  } else {\n    IO.println(\"7 Euro\");\n  }"});
X.push({id:"minimum3", gruppe:"g3", titel:"Kleinste von drei Zahlen",
aufgabe:"Drei Zahlen werden eingelesen. Gib die kleinste aus, z. B. `Minimum: 2`. Ohne Math.min.",
vor:MAIN_A+"\n"+ein("a")+"\n"+ein("b")+"\n"+ein("c"), nach:MAIN_E, start:"  ",
tests:[{in:["5","2","9"]},{in:["1","8","3"]},{in:["7","6","4"]},{in:["3","3","3"]},{in:["-5","0","-9"]}],
verboten:[[/Math\s*\.\s*min/,"Löse es diesmal ohne Math.min."]],
tipp:"Trick: Nimm zuerst an, `a` ist das Minimum (`int min = a;`). Dann: Wenn `b` kleiner ist, wird `min = b`. Dasselbe für `c`.",
loesung:"  int min = a;\n  if (b < min) {\n    min = b;\n  }\n  if (c < min) {\n    min = c;\n  }\n  IO.println(\"Minimum: \" + min);"});
X.push({id:"wochentag", gruppe:"g3", titel:"Wochentag mit switch",
aufgabe:"Gib für die Zahl 1–7 den Wochentag aus (1 = `Montag`, …, 7 = `Sonntag`). Bei jeder anderen Zahl: `ungültig`.\nVerwende `switch`.",
vor:MAIN_A+"\n"+ein("tag"), nach:MAIN_E, start:"  ",
tests:[{in:["1"]},{in:["3"]},{in:["6"]},{in:["7"]},{in:["0"]},{in:["8"]}],
muss:[[/\bswitch\b/,"Verwende diesmal switch."]],
tipp:"Neue Form: `switch (tag) { case 1 -> IO.println(\"Montag\"); … default -> IO.println(\"ungültig\"); }` – oder alte Form mit `case 1:` … `break;`. Vergiss dort das break nicht!",
loesung:"  switch (tag) {\n    case 1 -> IO.println(\"Montag\");\n    case 2 -> IO.println(\"Dienstag\");\n    case 3 -> IO.println(\"Mittwoch\");\n    case 4 -> IO.println(\"Donnerstag\");\n    case 5 -> IO.println(\"Freitag\");\n    case 6 -> IO.println(\"Samstag\");\n    case 7 -> IO.println(\"Sonntag\");\n    default -> IO.println(\"ungültig\");\n  }"});

/* ===== 4. Schleifen ===== */
X.push({id:"zaehlen", gruppe:"g4", titel:"Von 1 bis n zählen",
aufgabe:"Gib die Zahlen von 1 bis n aus, jede in einer eigenen Zeile. (Bei n = 0 wird nichts ausgegeben.)",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["5"]},{in:["1"]},{in:["0"]}],
muss:[[/\b(for|while)\b/,"Verwende eine Schleife (for oder while)."]],
tipp:"`for (int i = 1; i <= n; i++) { IO.println(i); }` – Start, Bedingung, Schritt.",
loesung:"  for (int i = 1; i <= n; i++) {\n    IO.println(i);\n  }"});
X.push({id:"countdown", gruppe:"g4", titel:"Countdown",
aufgabe:"Zähle von n rückwärts bis 1 (jede Zahl in eine Zeile) und gib danach `Start!` aus.",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["3"]},{in:["1"]},{in:["0"]}],
muss:[[/\b(for|while)\b/,"Verwende eine Schleife."]],
tipp:"Rückwärts: Start bei n, Bedingung `i >= 1`, Schritt `i--`. Das `Start!` steht **nach** der Schleife.",
loesung:"  for (int i = n; i >= 1; i--) {\n    IO.println(i);\n  }\n  IO.println(\"Start!\");"});
X.push({id:"summen", gruppe:"g4", titel:"Summe 1 bis n",
aufgabe:"Berechne mit einer Schleife 1 + 2 + … + n und gib aus: `Summe: 10` (für n = 4).",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["4"]},{in:["10"]},{in:["1"]},{in:["0"]}],
muss:[[/\b(for|while)\b/,"Verwende eine Schleife (ohne die Gauß-Formel)."]],
tipp:"Eine Variable `summe` startet bei 0 (vor der Schleife!). In der Schleife: `summe = summe + i;` oder kurz `summe += i;`.",
loesung:"  int summe = 0;\n  for (int i = 1; i <= n; i++) {\n    summe += i;\n  }\n  IO.println(\"Summe: \" + summe);"});
X.push({id:"einmaleins", gruppe:"g4", titel:"Einmaleins-Reihe",
aufgabe:"Gib die Einmaleins-Reihe von n aus (1 bis 10), z. B. für 7:\n`7 x 1 = 7`\n`7 x 2 = 14`\n…\n`7 x 10 = 70`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["7"]},{in:["3"]}],
tipp:"In der Ausgabe `n + \" x \" + i + \" = \" + n * i` wird `n * i` zuerst gerechnet (Punkt vor Strich gilt auch hier).",
loesung:"  for (int i = 1; i <= 10; i++) {\n    IO.println(n + \" x \" + i + \" = \" + n * i);\n  }"});
X.push({id:"teiler", gruppe:"g4", titel:"Alle Teiler",
aufgabe:"Gib alle Teiler der Zahl n (n ≥ 1) in **einer** Zeile aus, durch Leerzeichen getrennt.\nBeispiel: 12 → `1 2 3 4 6 12`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["12"]},{in:["7"]},{in:["1"]},{in:["36"]}],
tipp:"Probiere alle i von 1 bis n durch: Wenn `n % i == 0`, ist i ein Teiler → mit `IO.print(i + \" \")` ausgeben (ohne Zeilenumbruch). Ein Leerzeichen am Zeilenende ist egal.",
loesung:"  for (int i = 1; i <= n; i++) {\n    if (n % i == 0) {\n      IO.print(i + \" \");\n    }\n  }\n  IO.println();"});
X.push({id:"fakultaet", gruppe:"g4", titel:"Fakultät (long!)",
aufgabe:"Berechne n! = 1 · 2 · 3 · … · n für n von 0 bis 20 und gib aus: `5! = 120`. (0! ist 1.)",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["5"]},{in:["0"]},{in:["1"]},{in:["13"]},{in:["20"]}],
tipp:"Das Produkt startet bei 1 (nicht 0!). Ab 13! passt das Ergebnis nicht mehr in ein int (Überlauf) – nimm `long ergebnis = 1;`.",
loesung:"  long ergebnis = 1;\n  for (int i = 2; i <= n; i++) {\n    ergebnis *= i;\n  }\n  IO.println(n + \"! = \" + ergebnis);"});
X.push({id:"ziffernsumme", gruppe:"g4", titel:"Ziffernsumme",
aufgabe:"Berechne die Summe der Ziffern von n (n ≥ 0). Beispiel: 1234 → `Ziffernsumme: 10`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["1234"]},{in:["0"]},{in:["9"]},{in:["1000"]},{in:["98765"]}],
tipp:"`n % 10` ist die letzte Ziffer, `n / 10` streicht sie weg. Das in einer Schleife, solange `n > 0`.",
loesung:"  int summe = 0;\n  while (n > 0) {\n    summe += n % 10;\n    n = n / 10;\n  }\n  IO.println(\"Ziffernsumme: \" + summe);"});
X.push({id:"dreieck", gruppe:"g4", titel:"Sternchen-Dreieck",
aufgabe:"Gib ein Dreieck aus n Zeilen aus: Zeile 1 hat einen `*`, Zeile 2 zwei usw.\nBeispiel n = 3:\n`*`\n`**`\n`***`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["3"]},{in:["1"]},{in:["5"]}],
tipp:"Zwei Schleifen ineinander: Die äußere zählt die Zeilen (`zeile` von 1 bis n), die innere gibt `zeile`-mal `*` mit `IO.print` aus. Danach kommt `IO.println()` für den Zeilenumbruch.",
loesung:"  for (int zeile = 1; zeile <= n; zeile++) {\n    for (int s = 1; s <= zeile; s++) {\n      IO.print(\"*\");\n    }\n    IO.println();\n  }"});
X.push({id:"bisnull", gruppe:"g4", titel:"Einlesen bis 0",
aufgabe:"Lies so lange Zahlen ein, bis eine 0 kommt. Gib dann die Summe und die Anzahl der Zahlen aus (die 0 zählt nicht mit):\n`Summe: 8`\n`Anzahl: 2`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["5","3","0"]},{in:["0"]},{in:["-2","10","7","0"]}],
tipp:"Erste Zahl vor der Schleife einlesen, dann `while (zahl != 0) { …; zahl = Integer.parseInt(IO.readln()); }`, also am Ende der Schleife die nächste Zahl lesen.",
loesung:"  int summe = 0;\n  int anzahl = 0;\n  int zahl = Integer.parseInt(IO.readln());\n  while (zahl != 0) {\n    summe += zahl;\n    anzahl++;\n    zahl = Integer.parseInt(IO.readln());\n  }\n  IO.println(\"Summe: \" + summe);\n  IO.println(\"Anzahl: \" + anzahl);"});
X.push({id:"primzahl", gruppe:"g4", titel:"Primzahl?",
aufgabe:"Prüfe, ob n (n ≥ 2) eine Primzahl ist (nur durch 1 und sich selbst teilbar).\nAusgabe: `7 ist eine Primzahl` bzw. `9 ist keine Primzahl`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["2"]},{in:["7"]},{in:["9"]},{in:["15"]},{in:["97"]},{in:["91"]}],
tipp:"Merke dir in `boolean prim = true;`, ob schon ein Teiler gefunden wurde. Probiere alle i von 2 bis n − 1: Wenn `n % i == 0`, dann `prim = false;`. Nach der Schleife entscheidest du mit if, was ausgegeben wird.",
loesung:"  boolean prim = true;\n  for (int i = 2; i < n; i++) {\n    if (n % i == 0) {\n      prim = false;\n    }\n  }\n  if (prim) {\n    IO.println(n + \" ist eine Primzahl\");\n  } else {\n    IO.println(n + \" ist keine Primzahl\");\n  }"});
X.push({id:"potenz", gruppe:"g4", titel:"Potenz mit Schleife",
aufgabe:"Berechne basis hoch exponent (exponent ≥ 0) mit einer Schleife, ohne Math.pow. Ausgabe z. B. `2^10 = 1024`",
vor:MAIN_A+"\n"+ein("basis")+"\n"+ein("exponent"), nach:MAIN_E, start:"  ",
tests:[{in:["2","10"]},{in:["3","0"]},{in:["5","3"]},{in:["-2","3"]},{in:["10","9"]}],
verboten:[[/Math\s*\.\s*pow/,"Löse es mit einer Schleife, ohne Math.pow."]],
tipp:"`ergebnis` startet bei 1 und wird `exponent`-mal mit `basis` multipliziert. Achtung: `\"^\"` gehört in Anführungszeichen – als Operator ist `^` in Java nicht „hoch“.",
loesung:"  int ergebnis = 1;\n  for (int i = 0; i < exponent; i++) {\n    ergebnis *= basis;\n  }\n  IO.println(basis + \"^\" + exponent + \" = \" + ergebnis);"});

/* ===== 5. Methoden ===== */
X.push({id:"quadrat", gruppe:"g5", titel:"Methode quadrat",
aufgabe:"Schreib eine Methode `quadrat`, die eine ganze Zahl bekommt und ihr Quadrat zurückgibt.\nmain (unten) ruft sie auf und gibt das Ergebnis aus.",
vor:"", nach:"\nvoid main() {\n  IO.println(quadrat({x}));\n}", start:"int quadrat(int x) {\n  \n}",
tests:[{set:{x:"3"}},{set:{x:"-4"}},{set:{x:"0"}},{set:{x:"12"}}],
tipp:"Mit `return` gibt die Methode einen Wert zurück: `return x * x;`",
loesung:"int quadrat(int x) {\n  return x * x;\n}"});
X.push({id:"istgerade", gruppe:"g5", titel:"Methode istGerade",
aufgabe:"Schreib eine Methode `boolean istGerade(int n)`, die `true` liefert, wenn n gerade ist.",
vor:"", nach:"\nvoid main() {\n  IO.println(istGerade({n}));\n}", start:"boolean istGerade(int n) {\n  \n}",
tests:[{set:{n:"4"}},{set:{n:"7"}},{set:{n:"0"}},{set:{n:"-2"}},{set:{n:"-5"}}],
tipp:"Man kann den Vergleich direkt zurückgeben: `return n % 2 == 0;`. Ein if ist gar nicht nötig.",
loesung:"boolean istGerade(int n) {\n  return n % 2 == 0;\n}"});
X.push({id:"max3", gruppe:"g5", titel:"Methode max3",
aufgabe:"Schreib eine Methode `int max3(int a, int b, int c)`, die die größte der drei Zahlen zurückgibt.",
vor:"", nach:"\nvoid main() {\n  IO.println(max3({a}, {b}, {c}));\n}", start:"int max3(int a, int b, int c) {\n  \n}",
tests:[{set:{a:"1",b:"2",c:"3"}},{set:{a:"9",b:"5",c:"2"}},{set:{a:"4",b:"8",c:"6"}},{set:{a:"-1",b:"-1",c:"-3"}}],
tipp:"Wie bei „Kleinste von drei“: `int max = a;`, dann mit zwei ifs verbessern, am Ende `return max;`. Jede Methode mit Rückgabetyp braucht ein return.",
loesung:"int max3(int a, int b, int c) {\n  int max = a;\n  if (b > max) {\n    max = b;\n  }\n  if (c > max) {\n    max = c;\n  }\n  return max;\n}"});
X.push({id:"linie", gruppe:"g5", titel:"void-Methode linie",
aufgabe:"Schreib eine Methode `void linie(int n, char zeichen)`, die das Zeichen n-mal in einer Zeile ausgibt und danach einen Zeilenumbruch macht.\nBeispiel: `linie(5, '*')` → `*****`",
vor:"", nach:"\nvoid main() {\n  linie({n}, '{z}');\n  IO.println(\"Ende\");\n}", start:"void linie(int n, char zeichen) {\n  \n}",
tests:[{set:{n:"5",z:"*"}},{set:{n:"3",z:"-"}},{set:{n:"0",z:"#"}}],
tipp:"void-Methoden geben nichts zurück, also kein return mit Wert. Schleife mit `IO.print(zeichen);`, danach `IO.println();`.",
loesung:"void linie(int n, char zeichen) {\n  for (int i = 0; i < n; i++) {\n    IO.print(zeichen);\n  }\n  IO.println();\n}"});
X.push({id:"ggt", gruppe:"g5", titel:"Methode ggt",
aufgabe:"Schreib eine Methode `int ggt(int a, int b)`, die den größten gemeinsamen Teiler zweier positiver Zahlen zurückgibt (z. B. ggt(12, 18) = 6).",
vor:"", nach:"\nvoid main() {\n  IO.println(ggt({a}, {b}));\n}", start:"int ggt(int a, int b) {\n  \n}",
tests:[{set:{a:"12",b:"18"}},{set:{a:"7",b:"21"}},{set:{a:"17",b:"5"}},{set:{a:"100",b:"75"}},{set:{a:"9",b:"9"}}],
tipp:"Differenzalgorithmus aus der VO: Solange `a != b`: die kleinere von der größeren abziehen. Am Ende `return a;`. Parameter darf man in der Methode verändern.",
loesung:"int ggt(int a, int b) {\n  while (a != b) {\n    if (a > b) {\n      a = a - b;\n    } else {\n      b = b - a;\n    }\n  }\n  return a;\n}"});
X.push({id:"notemethode", gruppe:"g5", titel:"Methode mit String-Rückgabe",
aufgabe:"Schreib eine Methode `String bewertung(int punkte)`, die `\"bestanden\"` zurückgibt, wenn punkte ≥ 50, sonst `\"durchgefallen\"`. Die Methode soll **nichts ausgeben**, sondern den Text zurückgeben.",
vor:"", nach:"\nvoid main() {\n  String b = bewertung({p});\n  IO.println(\"Ergebnis: \" + b);\n}", start:"String bewertung(int punkte) {\n  \n}",
tests:[{set:{p:"50"}},{set:{p:"49"}},{set:{p:"100"}}],
verboten:[[/IO\s*\.\s*print/,"Die Methode soll den Text mit return zurückgeben, nicht selbst ausgeben."]],
tipp:"`if (punkte >= 50) { return \"bestanden\"; } return \"durchgefallen\";` – nach einem return ist die Methode sofort fertig.",
loesung:"String bewertung(int punkte) {\n  if (punkte >= 50) {\n    return \"bestanden\";\n  }\n  return \"durchgefallen\";\n}"});

/* ===== 6. Strings und Zeichen ===== */
var LIES_WORT="  String wort = IO.readln();";
X.push({id:"laenge", gruppe:"g6", titel:"Wie lang ist das Wort?",
aufgabe:"Das Wort wird schon eingelesen. Gib aus: `Das Wort hat 4 Buchstaben.` (für \"Java\")",
vor:MAIN_A+"\n"+LIES_WORT, nach:MAIN_E, start:"  ",
tests:[{in:["Java"]},{in:["Informatik"]},{in:["a"]}],
tipp:"Die Länge eines Strings liefert `wort.length()`, mit Klammern, weil es eine Methode ist.",
loesung:String.raw`  IO.println("Das Wort hat " + wort.length() + " Buchstaben.");`});
X.push({id:"ersterletzter", gruppe:"g6", titel:"Erster und letzter Buchstabe",
aufgabe:"Gib den ersten und den letzten Buchstaben des Worts aus, z. B. für \"Java\":\n`Erster: J, Letzter: a`",
vor:MAIN_A+"\n"+LIES_WORT, nach:MAIN_E, start:"  ",
tests:[{in:["Java"]},{in:["Salzburg"]},{in:["X"]}],
tipp:"`wort.charAt(0)` ist das erste Zeichen. Die Positionen beginnen bei 0, also ist das letzte Zeichen bei `wort.length() - 1`.",
loesung:String.raw`  IO.println("Erster: " + wort.charAt(0) + ", Letzter: " + wort.charAt(wort.length() - 1));`});
X.push({id:"vokale", gruppe:"g6", titel:"Vokale zählen",
aufgabe:"Zähle, wie viele Vokale (a, e, i, o, u – klein oder groß) im Text vorkommen. Ausgabe z. B. `Vokale: 4` für \"Informatik\".",
vor:MAIN_A+"\n  String text = IO.readln();", nach:MAIN_E, start:"  ",
tests:[{in:["Informatik"]},{in:["xyz"]},{in:["AEIOU aeiou"]},{in:["Hallo Welt"]}],
tipp:"Schleife über alle Positionen: `for (int i = 0; i < text.length(); i++) { char c = text.charAt(i); … }`. Tipp: Mit `Character.toLowerCase(c)` musst du nur noch auf Kleinbuchstaben prüfen.",
loesung:String.raw`  int anzahl = 0;
  for (int i = 0; i < text.length(); i++) {
    char c = Character.toLowerCase(text.charAt(i));
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
      anzahl++;
    }
  }
  IO.println("Vokale: " + anzahl);`});
X.push({id:"umdrehen", gruppe:"g6", titel:"Wort umdrehen",
aufgabe:"Gib das Wort rückwärts aus. Beispiel: \"Java\" → `avaJ`",
vor:MAIN_A+"\n"+LIES_WORT, nach:MAIN_E, start:"  ",
tests:[{in:["Java"]},{in:["a"]},{in:["Otto"]},{in:["Salzburg"]}],
tipp:"Baue einen neuen String auf: `String rueckwaerts = \"\";`, dann eine Schleife von hinten (`i = wort.length() - 1` bis `i >= 0`) und jedes Zeichen anhängen: `rueckwaerts = rueckwaerts + wort.charAt(i);`",
loesung:String.raw`  String rueckwaerts = "";
  for (int i = wort.length() - 1; i >= 0; i--) {
    rueckwaerts = rueckwaerts + wort.charAt(i);
  }
  IO.println(rueckwaerts);`});
X.push({id:"palindrom", gruppe:"g6", titel:"Palindrom?",
aufgabe:"Ein Palindrom liest sich vorwärts und rückwärts gleich (Groß-/Kleinschreibung egal). Ausgabe:\n`Otto ist ein Palindrom` bzw. `Java ist kein Palindrom`",
vor:MAIN_A+"\n"+LIES_WORT, nach:MAIN_E, start:"  ",
tests:[{in:["Otto"]},{in:["Anna"]},{in:["Java"]},{in:["a"]},{in:["Rentner"]},{in:["ab"]}],
tipp:"Erst `String klein = wort.toLowerCase();`, dann umdrehen wie in der vorigen Aufgabe und mit `.equals(…)` vergleichen.",
loesung:String.raw`  String klein = wort.toLowerCase();
  String rueck = "";
  for (int i = klein.length() - 1; i >= 0; i--) {
    rueck = rueck + klein.charAt(i);
  }
  if (klein.equals(rueck)) {
    IO.println(wort + " ist ein Palindrom");
  } else {
    IO.println(wort + " ist kein Palindrom");
  }`});
X.push({id:"zeichenzaehlen", gruppe:"g6", titel:"Ein Zeichen zählen",
aufgabe:"Zuerst wird ein Text eingelesen, dann ein Zeichen. Gib aus, wie oft das Zeichen im Text vorkommt, z. B. für \"Banana\" und a:\n`'a' kommt 3-mal vor.`",
vor:MAIN_A+"\n  String text = IO.readln();\n  char z = IO.readln().charAt(0);", nach:MAIN_E, start:"  ",
tests:[{in:["Banana","a"]},{in:["Hallo","x"]},{in:["Mississippi","s"]}],
tipp:"Zeichen vergleicht man mit `==` (char ist ein primitiver Typ, kein String): `if (text.charAt(i) == z)`. In der Ausgabe stehen die einfachen Anführungszeichen im Text: `\"'\" + z + \"' kommt …\"`.",
loesung:String.raw`  int anzahl = 0;
  for (int i = 0; i < text.length(); i++) {
    if (text.charAt(i) == z) {
      anzahl++;
    }
  }
  IO.println("'" + z + "' kommt " + anzahl + "-mal vor.");`});
X.push({id:"initialen", gruppe:"g6", titel:"Initialen",
aufgabe:"Vor- und Nachname werden eingelesen. Gib die Initialen groß mit Punkt aus, z. B. „ada“ und „Lovelace“ → `A. L.`",
vor:MAIN_A+"\n  String vorname = IO.readln();\n  String nachname = IO.readln();", nach:MAIN_E, start:"  ",
tests:[{in:["Ada","Lovelace"]},{in:["alan","turing"]},{in:["Grace","hopper"]}],
tipp:"`Character.toUpperCase(vorname.charAt(0))` liefert den ersten Buchstaben groß. Achtung: char + char wäre eine Zahl. Fang deshalb mit einem String an: `\"\" + …` bzw. so: `IO.println(a + \". \" + b + \".\");`",
loesung:String.raw`  char a = Character.toUpperCase(vorname.charAt(0));
  char b = Character.toUpperCase(nachname.charAt(0));
  IO.println(a + ". " + b + ".");`});
X.push({id:"grossbuchstaben", gruppe:"g6", titel:"Großbuchstaben zählen",
aufgabe:"Zähle die Großbuchstaben im Text. Ausgabe z. B. `Großbuchstaben: 2` für \"Hallo Welt\".",
vor:MAIN_A+"\n  String text = IO.readln();", nach:MAIN_E, start:"  ",
tests:[{in:["Hallo Welt"]},{in:["java"]},{in:["ABC def G"]}],
tipp:"Entweder `Character.isUpperCase(c)` oder selbst prüfen: `c >= 'A' && c <= 'Z'`.",
loesung:String.raw`  int anzahl = 0;
  for (int i = 0; i < text.length(); i++) {
    if (Character.isUpperCase(text.charAt(i))) {
      anzahl++;
    }
  }
  IO.println("Großbuchstaben: " + anzahl);`});

/* ===== 7. Mini-Projekte ===== */
X.push({id:"fizzbuzz", gruppe:"g7", titel:"FizzBuzz",
aufgabe:"Gib die Zahlen von 1 bis n aus (jede in einer Zeile), aber:\nVielfache von 3 → `Fizz`, Vielfache von 5 → `Buzz`, Vielfache von 3 und 5 → `FizzBuzz`.",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["15"]},{in:["5"]}],
tipp:"Die Reihenfolge der Bedingungen ist wichtig: Prüfe **zuerst** „durch 3 und 5 teilbar“ (also durch 15), sonst wird bei 15 schon „Fizz“ ausgegeben.",
loesung:String.raw`  for (int i = 1; i <= n; i++) {
    if (i % 15 == 0) {
      IO.println("FizzBuzz");
    } else if (i % 3 == 0) {
      IO.println("Fizz");
    } else if (i % 5 == 0) {
      IO.println("Buzz");
    } else {
      IO.println(i);
    }
  }`});
X.push({id:"collatz", gruppe:"g7", titel:"Collatz-Folge",
aufgabe:"Starte bei n (n ≥ 1). Solange n nicht 1 ist: Ist n gerade, halbiere es, sonst rechne 3·n + 1.\nGib alle Zahlen in einer Zeile mit Leerzeichen aus und danach die Anzahl der Schritte, z. B. für 6:\n`6 3 10 5 16 8 4 2 1`\n`Schritte: 8`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["6"]},{in:["1"]},{in:["7"]}],
tipp:"Gib zuerst n aus. Dann `while (n != 1) { … n neu berechnen …; IO.print(\" \" + n); schritte++; }`. Danach `IO.println();` und die Schritte.",
loesung:String.raw`  int schritte = 0;
  IO.print(n);
  while (n != 1) {
    if (n % 2 == 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }
    IO.print(" " + n);
    schritte++;
  }
  IO.println();
  IO.println("Schritte: " + schritte);`});
X.push({id:"rechner", gruppe:"g7", titel:"Taschenrechner",
aufgabe:"Eingelesen werden: eine Zahl, ein Rechenzeichen (+ - * /) und noch eine Zahl. Gib die Rechnung aus, z. B. `6 * 7 = 42`.\nBei Division durch 0: `Division durch 0!` · Bei einem anderen Zeichen: `Unbekannter Operator`\n(Division ist Ganzzahldivision: 7 / 2 = 3)",
vor:MAIN_A+"\n"+ein("a")+"\n  String op = IO.readln();\n"+ein("b"), nach:MAIN_E, start:"  ",
tests:[{in:["3","+","4"]},{in:["10","-","15"]},{in:["6","*","7"]},{in:["7","/","2"]},{in:["5","/","0"]},{in:["2","%","3"]}],
tipp:"Mit `switch (op) { case \"+\" -> … }` geht es auf Strings, alternativ `if (op.equals(\"+\"))`. Die Division durch 0 musst du **vor** dem Rechnen abfangen.",
loesung:String.raw`  switch (op) {
    case "+" -> IO.println(a + " + " + b + " = " + (a + b));
    case "-" -> IO.println(a + " - " + b + " = " + (a - b));
    case "*" -> IO.println(a + " * " + b + " = " + (a * b));
    case "/" -> {
      if (b == 0) {
        IO.println("Division durch 0!");
      } else {
        IO.println(a + " / " + b + " = " + (a / b));
      }
    }
    default -> IO.println("Unbekannter Operator");
  }`});
X.push({id:"zahlenraten", gruppe:"g7", titel:"Zahlenraten",
aufgabe:"Die geheime Zahl ist 42 (Konstante GEHEIM). Lies so lange Tipps ein, bis die Zahl erraten ist. Nach jedem falschen Tipp: `zu klein` oder `zu groß`. Am Ende: `Richtig nach 3 Versuchen!`",
vor:"final int GEHEIM = 42;\n\n"+MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["50","25","42"]},{in:["42"]},{in:["1","100","41","43","42"]}],
tipp:"Eine Schleife, die läuft, solange der Tipp falsch ist. Am einfachsten: ersten Tipp vor der Schleife lesen, `versuche = 1`, dann `while (tipp != GEHEIM) { … Hinweis ausgeben, nächsten Tipp lesen, versuche++ }`.",
loesung:String.raw`  int tipp = Integer.parseInt(IO.readln());
  int versuche = 1;
  while (tipp != GEHEIM) {
    if (tipp < GEHEIM) {
      IO.println("zu klein");
    } else {
      IO.println("zu groß");
    }
    tipp = Integer.parseInt(IO.readln());
    versuche++;
  }
  IO.println("Richtig nach " + versuche + " Versuchen!");`});
X.push({id:"muenzen", gruppe:"g7", titel:"Wechselgeld in Münzen",
aufgabe:"Ein Betrag in Cent wird eingelesen. Gib aus, welche Münzen man braucht (immer zuerst die größte: 200, 100, 50, 20, 10, 5, 2, 1). Nur Münzen, die man wirklich braucht, z. B. für 388:\n`1 x 200 Cent`\n`1 x 100 Cent`\n`1 x 50 Cent`\n`1 x 20 Cent`\n`1 x 10 Cent`\n`1 x 5 Cent`\n`1 x 2 Cent`\n`1 x 1 Cent`",
vor:MAIN_A+"\n"+ein("betrag"), nach:MAIN_E, start:"  ",
tests:[{in:["388"]},{in:["5"]},{in:["460"]},{in:["0"]}],
tipp:"Für jede Münze: `anzahl = betrag / muenze; betrag = betrag % muenze;` und nur ausgeben, wenn `anzahl > 0`. Du kannst das einfach 8-mal hintereinander schreiben – oder schlauer: eine Schleife, in der die Variable `muenze` nacheinander 200, 100, 50, … annimmt.",
loesung:String.raw`  int muenze = 200;
  while (muenze > 0) {
    int anzahl = betrag / muenze;
    if (anzahl > 0) {
      IO.println(anzahl + " x " + muenze + " Cent");
    }
    betrag = betrag % muenze;
    muenze = switch (muenze) {
      case 200 -> 100;
      case 100 -> 50;
      case 50 -> 20;
      case 20 -> 10;
      case 10 -> 5;
      case 5 -> 2;
      case 2 -> 1;
      default -> 0;
    };
  }`});
X.push({id:"einmaleinsTabelle", gruppe:"g7", titel:"Einmaleins-Tabelle",
aufgabe:"Gib eine Tabelle n × n aus. In Zeile i stehen i·1, i·2, …, i·n, getrennt durch je ein Tabulatorzeichen `\\t`. Beispiel n = 3:\n`1\t2\t3`\n`2\t4\t6`\n`3\t6\t9`",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E, start:"  ",
tests:[{in:["3"]},{in:["1"]},{in:["5"]}],
tipp:"Zwei verschachtelte Schleifen. Gib `i * j + \"\\t\"` mit `IO.print` aus und am Zeilenende `IO.println()`. Ein Tab am Zeilenende ist egal.",
loesung:String.raw`  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
      IO.print(i * j + "\t");
    }
    IO.println();
  }`});
X.push({id:"notenschnitt", gruppe:"g7", titel:"Notenschnitt",
aufgabe:"Lies Noten (1–5) ein, bis eine 0 kommt. Gib dann den Schnitt aus und ob bestanden ist (keine 5 dabei):\n`Schnitt: 2.0`\n`Bestanden`\nbzw. `Nicht bestanden`. Wurde gar keine Note eingegeben (gleich 0): `Keine Noten`",
vor:MAIN_A, nach:MAIN_E, start:"  ",
tests:[{in:["1","2","3","0"]},{in:["2","5","0"]},{in:["0"]},{in:["4","4","3","0"]}],
tipp:"Du brauchst drei Variablen: `summe`, `anzahl` und `boolean fuenfer = false;`. Für den Schnitt: `(double) summe / anzahl`. Den Fall `anzahl == 0` zuerst prüfen (sonst Division durch 0).",
loesung:String.raw`  int summe = 0;
  int anzahl = 0;
  boolean fuenfer = false;
  int note = Integer.parseInt(IO.readln());
  while (note != 0) {
    summe += note;
    anzahl++;
    if (note == 5) {
      fuenfer = true;
    }
    note = Integer.parseInt(IO.readln());
  }
  if (anzahl == 0) {
    IO.println("Keine Noten");
  } else {
    IO.println("Schnitt: " + (double) summe / anzahl);
    if (fuenfer) {
      IO.println("Nicht bestanden");
    } else {
      IO.println("Bestanden");
    }
  }`});

/* ===== 8. Fehler finden ===== */
function fehler(o){ o.gruppe="g8"; o.aufgabe=o.aufgabe+"\n**Im Code "+(o.n===1?"steckt 1 Fehler":"stecken "+o.n+" Fehler")+".** Finde und behebe "+(o.n===1?"ihn":"sie")+" – zuerst „Prüfen“ klicken und die Meldungen lesen!"; X.push(o); }
fehler({id:"f_semi", titel:"Fehler: Summe", n:3,
aufgabe:"Das Programm soll `Summe: 12` ausgeben.",
start:String.raw`void main() {
  int a = 5
  int b = 7;
  io.println("Summe: " + a + b);
}`,
tests:[{}],
tipp:"1) Am Ende einer Anweisung fehlt etwas. 2) Groß-/Kleinschreibung bei IO. 3) Text + a + b hängt die Zahlen nur als Text an („57“) – Klammern um die Rechnung!",
loesung:String.raw`void main() {
  int a = 5;
  int b = 7;
  IO.println("Summe: " + (a + b));
}`});
fehler({id:"f_if", titel:"Fehler: Vorzeichen", n:2,
aufgabe:"Das Programm soll für die eingelesene Zahl `null`, `positiv` oder `negativ` ausgeben.",
vor:MAIN_A+"\n"+ein("zahl"), nach:MAIN_E,
start:String.raw`  if (zahl = 0) {
    IO.println("null");
  } else if (zahl > 0); {
    IO.println("positiv");
  } else {
    IO.println("negativ");
  }`,
tests:[{in:["0"]},{in:["5"]},{in:["-3"]}],
tipp:"1) Vergleichen geht mit `==`. 2) Ein `;` direkt nach der Bedingung beendet das if. Danach passt das else nicht mehr.",
loesung:String.raw`  if (zahl == 0) {
    IO.println("null");
  } else if (zahl > 0) {
    IO.println("positiv");
  } else {
    IO.println("negativ");
  }`});
fehler({id:"f_endlos", titel:"Fehler: Endlosschleife", n:1,
aufgabe:"Das Programm soll 1 + 2 + … + n berechnen und `Summe: …` ausgeben. Es hört aber nie auf.",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E,
start:String.raw`  int i = 1;
  int summe = 0;
  while (i <= n) {
    summe = summe + i;
  }
  IO.println("Summe: " + summe);`,
tests:[{in:["4"]},{in:["10"]},{in:["0"]}],
tipp:"Schau dir mit „Schritt für Schritt“ an, wie sich `i` verändert … gar nicht! Die Bedingung `i <= n` bleibt immer true.",
loesung:String.raw`  int i = 1;
  int summe = 0;
  while (i <= n) {
    summe = summe + i;
    i++;
  }
  IO.println("Summe: " + summe);`});
fehler({id:"f_grenze", titel:"Fehler: Zählen um eins daneben", n:2,
aufgabe:"Das Programm soll die Zahlen 1 bis n ausgeben (jede in einer Zeile).",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E,
start:String.raw`  for (int i = 0; i < n; i++) {
    IO.println(i);
  }`,
tests:[{in:["3"]},{in:["5"]},{in:["1"]}],
tipp:"Das ist der häufigste Schleifenfehler („off by one“): Wo fängt i an, und ist n selbst noch dabei?",
loesung:String.raw`  for (int i = 1; i <= n; i++) {
    IO.println(i);
  }`});
fehler({id:"f_string", titel:"Fehler: Text vergleichen", n:1,
aufgabe:"Bei der Eingabe „ja“ soll `Super!` kommen, sonst `Schade.` – aber es kommt immer `Schade.`",
vor:MAIN_A+"\n  String antwort = IO.readln();", nach:MAIN_E,
start:String.raw`  if (antwort == "ja") {
    IO.println("Super!");
  } else {
    IO.println("Schade.");
  }`,
tests:[{in:["ja"]},{in:["nein"]},{in:["Ja"]}],
tipp:"`==` vergleicht bei Strings nur, ob es dasselbe Objekt ist. Den Inhalt vergleicht `.equals(…)`.",
loesung:String.raw`  if (antwort.equals("ja")) {
    IO.println("Super!");
  } else {
    IO.println("Schade.");
  }`});
fehler({id:"f_scope", titel:"Fehler: Variable nicht gefunden", n:1,
aufgabe:"Das Programm soll die Quadrate von 1 bis n berechnen und am Ende `Letztes Quadrat: …` ausgeben (für n = 4: 16).",
vor:MAIN_A+"\n"+ein("n"), nach:MAIN_E,
start:String.raw`  for (int i = 1; i <= n; i++) {
    int quadrat = i * i;
  }
  IO.println("Letztes Quadrat: " + quadrat);`,
tests:[{in:["4"]},{in:["1"]},{in:["10"]}],
tipp:"Eine Variable gilt nur in dem `{ }`-Block, in dem sie deklariert wurde. Deklariere `quadrat` vor der Schleife (mit Startwert) und weise in der Schleife nur noch zu.",
loesung:String.raw`  int quadrat = 0;
  for (int i = 1; i <= n; i++) {
    quadrat = i * i;
  }
  IO.println("Letztes Quadrat: " + quadrat);`});
fehler({id:"f_schnitt", titel:"Fehler: falscher Durchschnitt", n:1,
aufgabe:"Das Programm soll den Durchschnitt von zwei Zahlen ausgeben, z. B. 3 und 4 → `Schnitt: 3.5`. Es kommt aber `3.0` heraus.",
vor:MAIN_A+"\n"+ein("a")+"\n"+ein("b"), nach:MAIN_E,
start:String.raw`  int summe = a + b;
  int anzahl = 2;
  double schnitt = summe / anzahl;
  IO.println("Schnitt: " + schnitt);`,
tests:[{in:["3","4"]},{in:["10","5"]},{in:["2","2"]}],
tipp:"`summe / anzahl` sind zwei ints, also wird ganzzahlig geteilt, **bevor** das Ergebnis im double landet. Ein Cast `(double)` vor `summe` hilft.",
loesung:String.raw`  int summe = a + b;
  int anzahl = 2;
  double schnitt = (double) summe / anzahl;
  IO.println("Schnitt: " + schnitt);`});
fehler({id:"f_methode", titel:"Fehler: Methode ohne Ergebnis", n:2,
aufgabe:"Das Programm soll die eingelesene Zahl verdoppeln und `Doppelt: …` ausgeben (für 5: `Doppelt: 10`).",
start:String.raw`int doppelt(int x) {
  int ergebnis = x * 2;
}

void main() {
  int zahl = Integer.parseInt(IO.readln());
  doppelt(zahl);
  IO.println("Doppelt: " + zahl);
}`,
tests:[{in:["5"]},{in:["0"]},{in:["-7"]}],
tipp:"1) Eine int-Methode muss ihr Ergebnis mit `return` zurückgeben. 2) Der zurückgegebene Wert muss in main auch verwendet werden (z. B. in einer Variablen speichern). Die Methode verändert `zahl` nicht!",
loesung:String.raw`int doppelt(int x) {
  int ergebnis = x * 2;
  return ergebnis;
}

void main() {
  int zahl = Integer.parseInt(IO.readln());
  int d = doppelt(zahl);
  IO.println("Doppelt: " + d);
}`});
fehler({id:"f_switch", titel:"Fehler: switch gibt zu viel aus", n:1,
aufgabe:"Für die Note 1, 2 oder 3 soll genau ein Wort kommen (`Sehr gut`, `Gut`, `Befriedigend`), sonst `Andere Note`. Bei 1 kommen aber alle vier Zeilen.",
vor:MAIN_A+"\n"+ein("note"), nach:MAIN_E,
start:String.raw`  switch (note) {
    case 1: IO.println("Sehr gut");
    case 2: IO.println("Gut");
    case 3: IO.println("Befriedigend");
    default: IO.println("Andere Note");
  }`,
tests:[{in:["1"]},{in:["2"]},{in:["3"]},{in:["5"]}],
tipp:"Beim alten switch (mit `:`) läuft Java nach dem passenden case einfach weiter in die nächsten („Durchfallen“), bis ein `break;` kommt. Oder du nimmst die neue Schreibweise mit `->`.",
loesung:String.raw`  switch (note) {
    case 1: IO.println("Sehr gut"); break;
    case 2: IO.println("Gut"); break;
    case 3: IO.println("Befriedigend"); break;
    default: IO.println("Andere Note");
  }`});
fehler({id:"f_typen", titel:"Fehler: Typen", n:3,
aufgabe:"Ein Artikel kostet 2.50 Euro. Die Menge wird eingelesen, ausgegeben wird der Gesamtpreis, z. B. für 3: `Gesamt: 7.5 Euro`.",
vor:MAIN_A, nach:MAIN_E,
start:String.raw`  int preis = 2.50;
  int menge = IO.readln();
  int gesamt = preis * menge;
  IO.println("Gesamt: " + gesamt + " Euro");`,
tests:[{in:["3"]},{in:["4"]},{in:["0"]}],
tipp:"Kommazahlen brauchen `double`. Die Eingabe ist ein String und muss mit `Integer.parseInt(…)` umgewandelt werden. Und was ist der Typ von double · int?",
loesung:String.raw`  double preis = 2.50;
  int menge = Integer.parseInt(IO.readln());
  double gesamt = preis * menge;
  IO.println("Gesamt: " + gesamt + " Euro");`});

/* ===== 9. Ausgabe vorhersagen ===== */
function vor(o){ o.gruppe="g9"; o.typ="vorhersage"; o.aufgabe="Was gibt dieses Programm aus? Schreib die Ausgabe genau so auf, wie sie in der Konsole erscheinen würde – jede Ausgabezeile in eine eigene Zeile."; o.tests=[{}]; X.push(o); }
vor({id:"v_div", titel:"/ und %", kurz:"Ganzzahldivision, Rest, Kommazahl",
code:String.raw`void main() {
  int a = 7;
  int b = 2;
  IO.println(a / b);
  IO.println(a % b);
  IO.println(a / 2.0);
}`,
erkl:"`7 / 2` sind zwei ints → Ganzzahldivision, der Rest wird weggeworfen: **3**. `7 % 2` ist der Rest: **1**. `7 / 2.0`: Eine Seite ist double, also wird mit Kommazahlen gerechnet: **3.5**.",
tipp:"Zwei ganze Zahlen geteilt ergibt wieder eine ganze Zahl."});
vor({id:"v_konkat", titel:"Plus mit Text", kurz:"Wann wird gerechnet, wann angehängt?",
code:String.raw`void main() {
  IO.println(1 + 2 + "3");
  IO.println("1" + 2 + 3);
  IO.println("1" + (2 + 3));
  IO.println('a' + 1);
}`,
erkl:"Java rechnet **von links nach rechts**: `1 + 2` = 3, dann 3 + \"3\" → **\"33\"**. Bei `\"1\" + 2` ist schon links ein String, ab da wird nur angehängt: **\"123\"**. Klammern werden zuerst gerechnet: 2 + 3 = 5 → **\"15\"**. `'a' + 1`: char + int ist eine Zahl ('a' = 97) → **98**.",
tipp:"Sobald links vom + ein String steht, wird nicht mehr gerechnet, sondern angehängt."});
vor({id:"v_inc", titel:"x++ und ++x", kurz:"Inkrement vorher/nachher",
code:String.raw`void main() {
  int x = 5;
  int y = x++;
  int z = ++x;
  IO.println(x + " " + y + " " + z);
}`,
erkl:"`y = x++`: **zuerst** wird der alte Wert (5) in y gespeichert, **dann** wird x erhöht (x = 6). `z = ++x`: **zuerst** wird x erhöht (7), dann wird der neue Wert in z gespeichert. → **7 5 7**",
tipp:"x++ liefert den alten Wert, ++x den neuen."});
vor({id:"v_char", titel:"Rechnen mit char", kurz:"Zeichen sind intern Zahlen",
code:String.raw`void main() {
  char c = 'A';
  c++;
  IO.println(c);
  IO.println(c + 1);
  IO.println((char) (c + 1));
}`,
erkl:"`c++` macht aus 'A' (65) das nächste Zeichen 'B'. `c + 1` ist char + int, das Ergebnis ist ein **int**: 66 + 1 = **67**. Mit dem Cast `(char)` wird daraus wieder ein Zeichen: **C**.",
tipp:"'A' hat die Nummer 65."});
vor({id:"v_for", titel:"for mit Schrittweite 3", kurz:"Schleife rückwärts",
code:String.raw`void main() {
  for (int i = 10; i > 0; i -= 3) {
    IO.print(i + " ");
  }
  IO.println();
  IO.println("fertig");
}`,
erkl:"i = 10, 7, 4, 1 (alle > 0, werden ausgegeben), dann −2 → Bedingung false. Alles steht in **einer** Zeile, weil `print` keinen Zeilenumbruch macht: **10 7 4 1** – danach kommt `fertig` in der nächsten Zeile.",
tipp:"Schreib dir eine Tabelle: Welchen Wert hat i in jeder Runde?"});
vor({id:"v_while", titel:"while mit Multiplikation", kurz:"Wann endet die Schleife?",
code:String.raw`void main() {
  int n = 1;
  int runden = 0;
  while (n < 50) {
    n = n * 3;
    runden++;
  }
  IO.println(n);
  IO.println(runden);
}`,
erkl:"n: 1 → 3 → 9 → 27 → 81. Bei 81 ist `n < 50` false. Das waren **4** Runden. Ausgegeben wird **81** und **4**. n ist am Ende größer als 50: Die Bedingung wird erst geprüft, **nachdem** n schon verändert wurde.",
tipp:"Die Bedingung wird immer nur am Anfang einer Runde geprüft."});
vor({id:"v_nested", titel:"Verschachtelte Schleifen", kurz:"Schleife in Schleife",
code:String.raw`void main() {
  for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= i; j++) {
      IO.print(j);
    }
    IO.println();
  }
}`,
erkl:"Die innere Schleife läuft von 1 bis i. Bei i = 1: „1“, bei i = 2: „12“, bei i = 3: „123“. Nach jeder inneren Schleife kommt ein Zeilenumbruch.",
tipp:"Geh die äußere Schleife Runde für Runde durch."});
vor({id:"v_switch", titel:"switch ohne break", kurz:"Durchfallen (fall-through)",
code:String.raw`void main() {
  int x = 2;
  switch (x) {
    case 1: IO.print("A");
    case 2: IO.print("B");
    case 3: IO.print("C");
      break;
    case 4: IO.print("D");
  }
  IO.println("!");
}`,
erkl:"Java springt zu `case 2` und gibt B aus. Da kein break folgt, läuft es in case 3 weiter (C), dann kommt das break. D wird nicht erreicht. Danach `!` → **BC!**",
tipp:"Ohne break läuft der alte switch in die nächsten cases weiter."});
vor({id:"v_ifkette", titel:"if-else-if-Reihenfolge", kurz:"Die erste passende Bedingung gewinnt",
code:String.raw`void main() {
  int p = 75;
  if (p >= 50) {
    IO.println("Genügend");
  } else if (p >= 70) {
    IO.println("Befriedigend");
  } else if (p >= 90) {
    IO.println("Sehr gut");
  }
  IO.println("Ende");
}`,
erkl:"75 >= 50 ist gleich die erste Bedingung, und die ist true → **Genügend**. Die anderen werden gar nicht mehr geprüft – obwohl 75 >= 70 auch stimmt. Darum muss man bei solchen Ketten mit der **strengsten** Bedingung anfangen.",
tipp:"Bei else if wird nur weitergeprüft, solange noch nichts gepasst hat."});
vor({id:"v_param", titel:"Parameter sind Kopien", kurz:"Methode verändert die Variable nicht",
code:String.raw`void verdopple(int x) {
  x = x * 2;
  IO.println("innen: " + x);
}

void main() {
  int x = 5;
  verdopple(x);
  IO.println("außen: " + x);
}`,
erkl:"Beim Aufruf wird der **Wert** 5 in den Parameter x der Methode kopiert. Das x in verdopple ist eine eigene Variable: Sie wird 10 (**innen: 10**). Das x in main bleibt **5**, auch wenn es gleich heißt.",
tipp:"Jede Methode hat ihre eigenen Variablen."});
vor({id:"v_string", titel:"String-Methoden", kurz:"length, charAt, substring, indexOf",
code:String.raw`void main() {
  String s = "Informatik";
  IO.println(s.length());
  IO.println(s.charAt(2));
  IO.println(s.substring(2, 5));
  IO.println(s.indexOf("a"));
}`,
erkl:"Positionen zählen ab **0**: I=0, n=1, f=2, o=3, r=4, m=5, a=6 … `length()` = **10** Zeichen. `charAt(2)` = **f**. `substring(2, 5)` geht von Position 2 bis **vor** 5 → **for**. `indexOf(\"a\")` = Position des ersten a = **6**.",
tipp:"Schreib die Positionen unter die Buchstaben – beginnend bei 0."});
vor({id:"v_cast", titel:"Casts", kurz:"(int) schneidet ab, Klammern zählen",
code:String.raw`void main() {
  double d = 9.99;
  IO.println((int) d);
  IO.println((int) -2.7);
  IO.println((double) 7 / 2);
  IO.println((double) (7 / 2));
}`,
erkl:"`(int)` schneidet die Nachkommastellen **ab** (rundet nicht): **9** und **−2**. `(double) 7 / 2`: Der Cast wirkt nur auf die 7 → 7.0 / 2 = **3.5**. `(double) (7 / 2)`: Zuerst die Klammer, also Ganzzahldivision 3, dann wird daraus **3.0**.",
tipp:"Ein Cast wirkt nur auf das, was direkt dahinter steht."});
vor({id:"v_dangling", titel:"Wohin gehört das else?", kurz:"Einrückung täuscht",
code:String.raw`void main() {
  int x = 5;
  if (x > 10)
    if (x > 20)
      IO.println("A");
  else
    IO.println("B");
  IO.println("C");
}`,
erkl:"Das else gehört **immer zum nächsten (inneren) if**, egal wie eingerückt ist. Das äußere if (x > 10) ist false, also wird der ganze innere Teil, inklusive else, übersprungen. Ausgegeben wird nur **C**.",
tipp:"Java ignoriert Einrückungen."});
vor({id:"v_dowhile", titel:"do-while", kurz:"Läuft mindestens einmal",
code:String.raw`void main() {
  int k = 10;
  do {
    IO.println(k);
    k++;
  } while (k < 5);
  IO.println("k = " + k);
}`,
erkl:"Bei do-while wird die Bedingung erst **am Ende** geprüft. Deshalb läuft der Block einmal, obwohl 10 < 5 false ist: Ausgabe **10**, dann k = 11. Danach ist die Bedingung false → Ende. Zum Schluss: **k = 11**.",
tipp:"Erst ausführen, dann prüfen."});
vor({id:"v_kurz", titel:"&& und || (Kurzschluss)", kurz:"Rechts wird manchmal nicht ausgewertet",
code:String.raw`void main() {
  int a = 0;
  boolean b = a != 0 && 10 / a > 1;
  IO.println(b);
  IO.println(true || false && false);
  IO.println(!(a > 0) == true);
}`,
erkl:"`a != 0` ist false, und bei `&&` steht dann schon fest, dass alles false ist. Die rechte Seite (10 / a, also Division durch 0!) wird **gar nicht ausgerechnet** → **false**, kein Absturz. `&&` bindet stärker als `||`: true || (false && false) = **true**. `!(a > 0)` = !false = true, true == true → **true**.",
tipp:"&& kommt vor ||, so wie Punkt vor Strich."});

var G=[["g1","Ausgabe, Variablen, Eingabe","println, Variablen, Rechnen, Integer.parseInt"],
       ["g2","Vergleiche und Bedingungen","Einzelne Ausdrücke mit <, >, ==, !=, &&, ||, ! schreiben"],
       ["g3","if, else und switch","Entscheidungen treffen"],
       ["g4","Schleifen","while, for, verschachtelt"],
       ["g5","Methoden","Eigene Methoden mit Parametern und return"],
       ["g6","Strings und Zeichen","length, charAt, Schleifen über Texte, equals"],
       ["g7","Mini-Projekte","Kleine Programme, bei denen alles zusammenkommt"],
       ["g8","Fehler finden","Kaputten Code reparieren – Compilerfehler und Denkfehler"],
       ["g9","Ausgabe vorhersagen","Code lesen und sagen, was herauskommt (mit Erklärung) – typisch für Prüfungen"]];
function fill(t,set){return t.replace(/\{(\w+)\}/g,function(m,k){return set&&Object.prototype.hasOwnProperty.call(set,k)?set[k]:m})}
function assemble(x,code,test){
  var set=test&&test.set, vor=x.vor?fill(x.vor,set):"", nach=x.nach?fill(x.nach,set):"";
  var head=vor?vor+"\n":"", start=head?head.split("\n").length:1;
  var body=x.inline?x.inline[0]+code.replace(/\s*\n\s*/g," ")+x.inline[1]:code;
  return {src:head+body+(nach?"\n"+nach:""), start:start, n:body.split("\n").length};
}
window.UEBUNG={aufgaben:X, gruppen:G, assemble:assemble, fill:fill};
})();
