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

var G=[["g1","Ausgabe, Variablen, Eingabe","println, Variablen, Rechnen, Integer.parseInt"],
       ["g2","Vergleiche und Bedingungen","Einzelne Ausdrücke mit <, >, ==, !=, &&, ||, ! schreiben"],
       ["g3","if, else und switch","Entscheidungen treffen"],
       ["g4","Schleifen","while, for, verschachtelt"],
       ["g5","Methoden","Eigene Methoden mit Parametern und return"]];
function fill(t,set){return t.replace(/\{(\w+)\}/g,function(m,k){return set&&Object.prototype.hasOwnProperty.call(set,k)?set[k]:m})}
function assemble(x,code,test){
  var set=test&&test.set, vor=x.vor?fill(x.vor,set):"", nach=x.nach?fill(x.nach,set):"";
  var head=vor?vor+"\n":"", start=head?head.split("\n").length:1;
  var body=x.inline?x.inline[0]+code.replace(/\s*\n\s*/g," ")+x.inline[1]:code;
  return {src:head+body+(nach?"\n"+nach:""), start:start, n:body.split("\n").length};
}
window.UEBUNG={aufgaben:X, gruppen:G, assemble:assemble, fill:fill};
})();
