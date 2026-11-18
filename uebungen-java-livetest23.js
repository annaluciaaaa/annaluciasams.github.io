/* Livetest 2 (bis inkl. Arrays: alle Schleifenarten, Methoden, Strings/char, ein- und zweidimensionale Arrays)
   und Livetest 3 (bis inkl. Objektorientierung: Klassen, Objekte, Konstruktoren, Methoden, Vererbung, Polymorphismus).
   Aufgaben im PS-Stil: ganze Programme, exaktes Ein-/Ausgabeformat. Erwartete Ausgaben werden aus der Musterlösung berechnet
   (alle Musterlösungen mit echtem Java 25 geprüft). */
(function(){
if(!window.UEBUNG) return;
var X=[], LEER="// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  \n}";
var PS="\n\n**Wie im PS:** Halte dich exakt an das Ein-/Ausgabeformat. Prompts gehören in `IO.readln(\"? …: \")`, die Eingabe steht dann in derselben Zeile. Hier im Trainer wird die Eingabe nicht mit ausgegeben (wie bei den automatischen Tests).";
function add(g,o){ o.gruppe=g; if(!o.typ) o.aufgabe+=PS; X.push(o); }
function vor(g,o){ o.gruppe=g; o.typ="vorhersage"; o.aufgabe="Was gibt dieses Programm aus? Schreib die Ausgabe genau so auf, wie sie in der Konsole erscheinen würde – jede Ausgabezeile in eine eigene Zeile."; o.tests=[{}]; X.push(o); }
function fehler(g,o){ o.aufgabe+="\n**Im Code stecken "+o.n+" Fehler.** Zuerst „Prüfen“ klicken und die Meldungen lesen!"; add(g,o); }

/* ======================= LIVETEST 2 ======================= */
var L2="lt2";

/* --- Hausübungen Bsp04 (Mäxchen) und Bsp05 (Passwort), Angaben aus dem PS --- */
var M_CODE1=String.raw`// Vorname Nachname, Matrikelnummer

final String PROMPT = "? Dice roll: ";

int getValue(int d1, int d2) {
  return 10 * Math.max(d1, d2) + Math.min(d1, d2);
}

boolean isNumericDice(char c) {
  return c >= '1' && c <= '6';
}

int parseNumericDice(char c) {
  return c - '0';
}

int readDiceRoll() {
  String input = IO.readln(PROMPT);
  while (input.length() != 1 || !isNumericDice(input.charAt(0))) {
    IO.println("Invalid dice roll!");
    input = IO.readln(PROMPT);
  }
  return parseNumericDice(input.charAt(0));
}

int readPlayerRoll() {
  int d1 = readDiceRoll();
  int d2 = readDiceRoll();
  return getValue(d1, d2);
}
`;
var M_MAIN1=String.raw`
void main() {
  IO.println("Wert: " + readPlayerRoll());
}`;
var M_TEIL2=String.raw`
boolean isMaexchen(int roll) {
  return roll == MAEXCHEN;
}

boolean isPair(int roll) {
  return roll / 10 == roll % 10;
}

int rank(int roll) {
  if (isMaexchen(roll)) {
    return 1000;
  } else if (isPair(roll)) {
    return 100 + roll;
  }
  return roll;
}

int compareRolls(int roll1, int roll2) {
  return rank(roll2) - rank(roll1);
}

int playRound() {
  IO.println("Player 1:");
  int roll1 = readPlayerRoll();
  IO.println("Player 2:");
  int roll2 = readPlayerRoll();
  IO.println("Rolls: " + roll1 + " vs. " + roll2);
  int result = compareRolls(roll1, roll2);
  if (result < 0) {
    IO.println("Player 1 wins!");
  } else if (result > 0) {
    IO.println("Player 2 wins!");
  } else {
    IO.println("Tie!");
  }
  return result;
}

void playMatch(int rounds) {
  IO.println("Best of " + rounds);
  int needed = rounds / 2 + 1;
  int wins1 = 0;
  int wins2 = 0;
  int round = 1;
  while (round <= rounds && wins1 < needed && wins2 < needed) {
    IO.println("=== Round " + round + " ===");
    int result = playRound();
    while (result == 0) {
      IO.println("Round is repeated...");
      result = playRound();
    }
    if (result < 0) {
      wins1++;
    } else {
      wins2++;
    }
    round++;
  }
  IO.println("=== End of match ===");
  if (wins1 > wins2) {
    IO.println("Player 1 has won the match!");
  } else if (wins2 > wins1) {
    IO.println("Player 2 has won the match!");
  } else {
    IO.println("Match is a Tie!");
  }
}

void main() {
  int rounds = Integer.parseInt(IO.readln());
  playMatch(rounds);
}`;
var M_TAB="Wurf = zwei Augenzahlen (1–6). Gleiche Zahlen = Paar (z. B. `4er-Paar` = 44). Sonst ist die größere Zahl die Zehnerstelle: 6 und 2 → 62, 2 und 6 → 62. Der kleinste Wert 21 heißt **Maexchen**.\n";

add(L2,{id:"lt2_bsp04_1", titel:"Bsp04 · Mäxchen (Teil 1)", kurz:"Hausübung 4: Methoden, Eingabe prüfen und wiederholen",
aufgabe:M_TAB+"Schreib die Methoden:\n• `int getValue(int d1, int d2)` – interpretierter Wert (getValue(1, 4) → 41, getValue(6, 6) → 66)\n• `boolean isNumericDice(char c)` – ist c eine gültige Augenzahl `'1'`–`'6'`?\n• `int parseNumericDice(char c)` – wandelt das Zeichen in die Zahl um\n• `int readDiceRoll()` – liest mit `? Dice roll: ` eine Augenzahl ein. Ist die Eingabe nicht **genau eine** Ziffer 1–6 → `Invalid dice roll!` und erneut einlesen.\n• `int readPlayerRoll()` – liest zwei Augenzahlen mit readDiceRoll() und gibt getValue(…) zurück\nNur zum Testen hier: main gibt `Wert: ` + readPlayerRoll() aus.\nBeispiel:\n`? Dice roll: a`\n`Invalid dice roll!`\n`? Dice roll: 2`\n`? Dice roll: 0`\n`Invalid dice roll!`\n`? Dice roll: 2`\n`Wert: 22`",
start:"// Vorname Nachname, Matrikelnummer\n\n// deine Methoden\n"+M_MAIN1,
tests:[{in:["2","3"]},{in:["a","2","0","2"]},{in:["7","a","0","1","2"]},{in:["23","","6","6"]},{in:["1","4"]},{in:["5","1"]}],
muss:[[/int\s+getValue\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/,"Schreib die Methode int getValue(int d1, int d2)."],[/boolean\s+isNumericDice\s*\(\s*char\s+\w+\s*\)/,"Schreib die Methode boolean isNumericDice(char c)."],[/int\s+parseNumericDice\s*\(\s*char\s+\w+\s*\)/,"Schreib die Methode int parseNumericDice(char c)."],[/int\s+readDiceRoll\s*\(\s*\)/,"Schreib die Methode int readDiceRoll()."],[/int\s+readPlayerRoll\s*\(\s*\)/,"Schreib die Methode int readPlayerRoll()."],[/IO\.readln\s*\(\s*\w|IO\.readln\s*\(\s*"\? Dice roll: "/,"Der Prompt gehört in IO.readln(\"? Dice roll: \") – nicht in IO.println. Dann steht die Eingabe in derselben Zeile."]],
tipp:"`'7' - '0'` ergibt 7 (char-Arithmetik). „Genau eine Ziffer“: zuerst `input.length() == 1` prüfen, erst dann `input.charAt(0)` – sonst stürzt die leere Eingabe ab. readDiceRoll: einlesen, `while (ungültig) { Fehlermeldung; neu einlesen }`, dann zurückgeben.",
loesung:M_CODE1+M_MAIN1});

add(L2,{id:"lt2_bsp04_2", titel:"Bsp04 · Mäxchen (Teil 2)", kurz:"Hausübung 4: Best-of-X, Runde wiederholen, vorzeitiges Ende",
aufgabe:M_TAB+"Baut auf Teil 1 auf (getValue, isNumericDice, parseNumericDice, readDiceRoll, readPlayerRoll – übernimm sie). Rangfolge (bester zuerst): **Maexchen**, 6er-Paar … 1er-Paar, 65, 64 … 61, 54 … 31.\nNeue Methoden:\n• `boolean isMaexchen(int roll)`, `boolean isPair(int roll)`\n• `int compareRolls(int roll1, int roll2)` – < 0, wenn roll1 besser ist; > 0, wenn roll2 besser ist; 0 bei Gleichstand\n• `int playRound()` – beide Spieler werfen, Ausgabe `Rolls: 53 vs. 66` und `Player 1 wins!` / `Player 2 wins!` / `Tie!`; Rückgabe wie compareRolls\n• `void playMatch(int rounds)` – `Best of 3`, dann je Runde `=== Round 1 ===`. Bei Gleichstand `Round is repeated...` und die Runde nochmal. Hat jemand schon die Mehrheit, wird **nicht** weitergespielt. Am Ende `=== End of match ===` und `Player 1 has won the match!` / `Player 2 has won the match!` / `Match is a Tie!`\nmain liest die Rundenanzahl (ohne Prompt) und ruft playMatch auf.\nBeispiel (playMatch(2), gekürzt):\n`Best of 2`\n`=== Round 1 ===`\n`Player 1:`\n`? Dice roll: 3`\n`? Dice roll: 3`\n`Player 2:`\n`? Dice roll: 3`\n`? Dice roll: 3`\n`Rolls: 33 vs. 33`\n`Tie!`\n`Round is repeated...`\n`Player 1:` …",
start:LEER,
tests:[{in:["3","2","2","2","1","6","5","1","3","1","1","3","4"]},{in:["2","3","3","3","3","2","2","4","4","3","2","3","1"]},{in:["1","2","a","1","2","1","2","2","2","a","3"]},{in:["3","1","2","6","6","6","5","6","4"]},{in:["1","3","1","4","1"]},{in:["5","6","6","5","5","1","2","1","1","6","4","6","5","4","4","4","4","3","3","4","4","2","1","3","1"]}],
muss:[[/boolean\s+isMaexchen\s*\(\s*int\s+\w+\s*\)/,"Schreib die Methode boolean isMaexchen(int roll)."],[/boolean\s+isPair\s*\(\s*int\s+\w+\s*\)/,"Schreib die Methode boolean isPair(int roll)."],[/int\s+compareRolls\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/,"Schreib die Methode int compareRolls(int roll1, int roll2)."],[/int\s+playRound\s*\(\s*\)/,"Schreib die Methode int playRound()."],[/void\s+playMatch\s*\(\s*int\s+\w+\s*\)/,"Schreib die Methode void playMatch(int rounds)."],[/\bfinal\b/,"Konstanten (z. B. der Wert 21 fürs Maexchen) mit final anlegen."]],
tipp:"Trick für compareRolls: Gib jedem Wurf einen Rang – Maexchen 1000, Paar 100 + Wert (111…166), sonst der Wert selbst (31…65). Dann ist `rang(roll2) - rang(roll1)` genau die geforderte Konvention. Für das vorzeitige Ende: Siege nötig = `rounds / 2 + 1`, und das in die Schleifenbedingung.",
loesung:M_CODE1.replace('final String PROMPT = "? Dice roll: ";','final String PROMPT = "? Dice roll: ";\nfinal int MAEXCHEN = 21;')+M_TEIL2});

var P_KONST=String.raw`// Vorname Nachname, Matrikelnummer

final String PROMPT_PASSWORT = "? Passwort eingeben (STOP für Abbruch):";
final String PROMPT_WIEDERHOLEN = "? Passwort wiederholen:";
final String STOP = "STOP";
final int MIN_LAENGE = 10;
`;
var P_CREATE=String.raw`
String createPassword() {
  while (true) {
    String pwd = IO.readln(PROMPT_PASSWORT);
    if (pwd.equals(STOP)) {
      return "";
    }
    if (!pwd.isEmpty()) {
      String confirm = IO.readln(PROMPT_WIEDERHOLEN);
      if (pwd.equals(confirm)) {
        IO.println("Ident!");
        return pwd;
      }
      IO.println(pwd + " != " + confirm);
      IO.println("Neuer Versuch");
    }
  }
}

boolean minLength(String pwd, int min) {
  return pwd.length() >= min;
}

boolean containsDigit(String pwd) {
  return minDigits(pwd, 1);
}

boolean minDigits(String pwd, int amount) {
  int count = 0;
  for (int i = 0; i < pwd.length(); i++) {
    char c = pwd.charAt(i);
    if (c >= '0' && c <= '9') {
      count++;
    }
  }
  return count >= amount;
}
`;
var P_MAIN1=String.raw`
void main() {
  String pwd = createPassword();
  if (pwd.isEmpty()) {
    IO.println("Eingabe abgebrochen!");
  } else {
    if (!minLength(pwd, MIN_LAENGE)) {
      IO.println("Zu kurz!");
    }
    if (!containsDigit(pwd)) {
      IO.println("Ziffer in Passwort fehlt!");
    }
  }
}`;
var P_TEIL2=String.raw`
boolean minUppercaseLetters(String pwd, int amount) {
  int count = 0;
  for (int i = 0; i < pwd.length(); i++) {
    char c = pwd.charAt(i);
    if (c >= 'A' && c <= 'Z') {
      count++;
    }
  }
  return count >= amount;
}

int calculateCharacterSum(String pwd) {
  int sum = 0;
  for (int i = 0; i < pwd.length(); i++) {
    sum += pwd.charAt(i);
  }
  return sum;
}

boolean minSpecial(String pwd, int amount) {
  int count = 0;
  for (int i = 0; i < pwd.length(); i++) {
    if (SONDERZEICHEN.indexOf(pwd.charAt(i)) >= 0) {
      count++;
    }
  }
  return count >= amount;
}

int calculatePasswordScore(String pwd) {
  if (!minLength(pwd, MIN_LAENGE) || !containsDigit(pwd)) {
    return 0;
  }
  int score = 0;
  if (minDigits(pwd, 3)) {
    score += 2;
  }
  if (minUppercaseLetters(pwd, 2)) {
    score += 1;
  }
  if (calculateCharacterSum(pwd) >= MIN_SUMME) {
    score += 1;
  }
  if (minSpecial(pwd, 2)) {
    score += 3;
  }
  return score;
}

void main() {
  String pwd = createPassword();
  if (pwd.isEmpty()) {
    IO.println("Eingabe abgebrochen!");
    return;
  }
  if (!minLength(pwd, MIN_LAENGE)) {
    IO.println("Zu kurz!");
  }
  if (!containsDigit(pwd)) {
    IO.println("Ziffer in Passwort fehlt!");
  }
  int score = calculatePasswordScore(pwd);
  IO.println();
  if (score == 0) {
    IO.println("Sehr schwaches Passwort!");
  } else if (score <= 2) {
    IO.println("Schwaches Passwort!");
  } else if (score <= 4) {
    IO.println("Mittelstarkes Passwort!");
  } else if (score == 5) {
    IO.println("Starkes Passwort!");
  } else {
    IO.println("Sehr starkes Passwort!");
  }
  IO.println("Passwortbewertung: " + score);
}`;
var P_PS="\n**Achtung:** Hier steht nach dem Doppelpunkt im Prompt **kein** Leerzeichen: `? Passwort eingeben (STOP für Abbruch):` und `? Passwort wiederholen:`.";

add(L2,{id:"lt2_bsp05_1", titel:"Bsp05 · Passwort (Teil 1)", kurz:"Hausübung 5: Eingabe + Bestätigung wiederholen, STOP, Methoden",
aufgabe:"Schreib `String createPassword()`: Passwort einlesen, dann zur Bestätigung nochmal. Sind beide gleich → `Ident!` und das Passwort zurückgeben. Sonst `<eingabe 1> != <eingabe 2>` und `Neuer Versuch`, dann **beide** Eingaben von vorn. Ist die erste Eingabe leer, wird nur die erste nochmal gefragt. `STOP` bei der ersten Eingabe bricht ab → Rückgabe `\"\"`.\nDazu `boolean minLength(String pwd, int min)` und `boolean containsDigit(String pwd)`.\nmain: bei Abbruch nur `Eingabe abgebrochen!`, sonst falls nötig `Zu kurz!` (unter 10 Zeichen) und/oder `Ziffer in Passwort fehlt!`.\nBeispiel:\n`? Passwort eingeben (STOP für Abbruch):passwort`\n`? Passwort wiederholen:pass`\n`passwort != pass`\n`Neuer Versuch`\n`? Passwort eingeben (STOP für Abbruch):pass`\n`? Passwort wiederholen:pass`\n`Ident!`\n`Zu kurz!`\n`Ziffer in Passwort fehlt!`"+P_PS,
start:LEER,
tests:[{in:["passwort","passwort"]},{in:["passwort","pass","pass","pass"]},{in:["passworte1","passworte1"]},{in:["1pa","1pa"]},{in:["STOP"]},{in:["pass","STOP","passwor1","pas1","STOP"]},{in:["","","","a","","a","a"]}],
muss:[[/String\s+createPassword\s*\(\s*\)/,"Schreib die Methode String createPassword()."],[/boolean\s+minLength\s*\(\s*String\s+\w+\s*,\s*int\s+\w+\s*\)/,"Schreib die Methode boolean minLength(String pwd, int min)."],[/boolean\s+containsDigit\s*\(\s*String\s+\w+\s*\)/,"Schreib die Methode boolean containsDigit(String pwd)."],[/\bfinal\b/,"Konstanten (Mindestlänge, STOP, Prompts) mit final anlegen."]],
verboten:[[/==\s*"|"\s*==/,"Strings nie mit == vergleichen – nimm .equals(…)."]],
tipp:"`while (true)` mit `return` drinnen passt hier gut: STOP → `return \"\"`, gleich → `return pwd`. Bei leerer Eingabe einfach nichts tun – die Schleife fragt automatisch wieder.",
loesung:P_KONST+P_CREATE+P_MAIN1});

add(L2,{id:"lt2_bsp05_2", titel:"Bsp05 · Passwort (Teil 2)", kurz:"Hausübung 5: Passwortstärke 0–7, Zeichen zählen, Unicode-Summe",
aufgabe:"Baut auf Teil 1 auf (createPassword, minLength, containsDigit – übernimm sie). Punkte für die Stärke:\n• mind. 3 Ziffern → 2 Punkte\n• mind. 2 Großbuchstaben A–Z (keine Umlaute) → 1 Punkt\n• Summe der Unicode-Werte aller Zeichen mind. 600 → 1 Punkt\n• mind. 2 Sonderzeichen aus `!?#%&'()*+,-./@` → 3 Punkte\nErfüllt das Passwort Teil 1 nicht (zu kurz oder ohne Ziffer), ist der Score immer 0.\nMethoden: `boolean minDigits(String pwd, int amount)`, `boolean minUppercaseLetters(String pwd, int amount)`, `int calculateCharacterSum(String pwd)`, `boolean minSpecial(String pwd, int amount)`, `int calculatePasswordScore(String pwd)`.\nmain wie Teil 1, danach eine **Leerzeile**, die Bewertung und `Passwortbewertung: <score>`:\n0 → `Sehr schwaches Passwort!`, 1–2 → `Schwaches Passwort!`, 3–4 → `Mittelstarkes Passwort!`, 5 → `Starkes Passwort!`, ab 6 → `Sehr starkes Passwort!`\nBeispiel:\n`? Passwort eingeben (STOP für Abbruch):PRogr4mm!1(!`\n`? Passwort wiederholen:PRogr4mm!1(!`\n`Ident!`\n``\n`Starkes Passwort!`\n`Passwortbewertung: 5`"+P_PS,
start:LEER,
tests:[{in:["PRogr4mm!1(!","PRogr4mm!1(!"]},{in:["passwort","passwort"]},{in:["l33+5P3aK","l33+5P3aK"]},{in:["vULN3r4(3L3!","vULN3r4(3L3!"]},{in:["l337","pass","123()PASSW","123()PASSW"]},{in:["STOP"]},{in:["abcdefghi1","abcdefghi1"]},{in:["ABCDEFGHIJ123","ABCDEFGHIJ123"]}],
muss:[[/boolean\s+minDigits\s*\(/,"Schreib die Methode boolean minDigits(String pwd, int amount)."],[/boolean\s+minUppercaseLetters\s*\(/,"Schreib die Methode boolean minUppercaseLetters(String pwd, int amount)."],[/int\s+calculateCharacterSum\s*\(/,"Schreib die Methode int calculateCharacterSum(String pwd)."],[/boolean\s+minSpecial\s*\(/,"Schreib die Methode boolean minSpecial(String pwd, int amount)."],[/int\s+calculatePasswordScore\s*\(/,"Schreib die Methode int calculatePasswordScore(String pwd)."],[/\bfinal\b/,"Konstanten mit final anlegen."]],
verboten:[[/==\s*"|"\s*==/,"Strings nie mit == vergleichen – nimm .equals(…)."]],
tipp:"`sum += pwd.charAt(i);` addiert den Unicode-Wert direkt (char wird zu int). Sonderzeichen: `SONDERZEICHEN.indexOf(c) >= 0` prüft, ob c in der Zeichenkette vorkommt – spart die zweite Schleife. Leerzeile: `IO.println();`.",
loesung:P_KONST+"final int MIN_SUMME = 600;\nfinal String SONDERZEICHEN = \"!?#%&'()*+,-./@\";\n"+P_CREATE+P_TEIL2});


add(L2,{id:"lt2_noten", titel:"Notenstatistik", kurz:"Array füllen, do-while zur Eingabeprüfung, Durchschnitt",
aufgabe:"Lies zuerst die Anzahl der Noten ein. Ist sie kleiner als 1 → `Ungueltige Anzahl!` (sonst nichts).\nDann liest du die Noten der Reihe nach in ein `int`-Array ein (`? Note 1: `, `? Note 2: ` …). Ist eine Note nicht zwischen 1 und 5, gib `Ungueltige Note!` aus und frag **dieselbe** Note noch einmal.\nZum Schluss:\n`Noten: [1, 3, 5, 2]` (mit Arrays.toString)\n`Durchschnitt: 2.75` (nicht runden)\n`Beste Note: 1`\n`Nicht genuegend: 1` (Anzahl der Fünfer)\nBeispiel:\n`? Anzahl Noten: 4`\n`? Note 1: 1`\n`? Note 2: 3`\n`? Note 3: 7`\n`Ungueltige Note!`\n`? Note 3: 5`\n`? Note 4: 2`\n`Noten: [1, 3, 5, 2]` …",
start:LEER,
tests:[{in:["4","1","3","7","5","2"]},{in:["3","2","0","2","4"]},{in:["1","5"]},{in:["0"]},{in:["-2"]},{in:["5","1","1","2","6","-1","1","3"]}],
muss:[[/new\s+int\s*\[/,"Speichere die Noten in einem Array: int[] noten = new int[anzahl];"],[/\bdo\b/,"Nimm für die Eingabeprüfung eine do-while-Schleife."]],
tipp:"Gerüst: `for (int i = 0; i < anzahl; i++) { int note; do { note = …; if (note < 1 || note > 5) IO.println(\"Ungueltige Note!\"); } while (note < 1 || note > 5); noten[i] = note; }`. Im Prompt steht `i + 1`, weil der Index bei 0 anfängt. Für den Durchschnitt `(double) summe / anzahl`, sonst Ganzzahldivision!",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int anzahl = Integer.parseInt(IO.readln(\"? Anzahl Noten: \"));\n  if (anzahl < 1) {\n    IO.println(\"Ungueltige Anzahl!\");\n    return;\n  }\n  int[] noten = new int[anzahl];\n  for (int i = 0; i < anzahl; i++) {\n    int note;\n    do {\n      note = Integer.parseInt(IO.readln(\"? Note \" + (i + 1) + \": \"));\n      if (note < 1 || note > 5) {\n        IO.println(\"Ungueltige Note!\");\n      }\n    } while (note < 1 || note > 5);\n    noten[i] = note;\n  }\n\n  int summe = 0;\n  int beste = 5;\n  int fuenfer = 0;\n  for (int n : noten) {\n    summe += n;\n    if (n < beste) {\n      beste = n;\n    }\n    if (n == 5) {\n      fuenfer++;\n    }\n  }\n  IO.println(\"Noten: \" + Arrays.toString(noten));\n  IO.println(\"Durchschnitt: \" + (double) summe / anzahl);\n  IO.println(\"Beste Note: \" + beste);\n  IO.println(\"Nicht genuegend: \" + fuenfer);\n}"});

add(L2,{id:"lt2_wuerfel", titel:"Würfelstatistik", kurz:"while bis 0, Zähl-Array, Balken mit Sternen",
aufgabe:"Lies Würfe ein (`? Wurf (0 = Ende): `), bis 0 eingegeben wird. Werte von 1 bis 6 werden gezählt, alles andere → `Ungueltiger Wurf!` (nicht zählen).\nGab es keinen gültigen Wurf → nur `Keine Wuerfe.` ausgeben.\nSonst für jede Augenzahl eine Zeile mit so vielen `*` wie Würfen und der Anzahl in Klammern, danach die Gesamtzahl und die häufigste Augenzahl (bei Gleichstand die kleinere):\n`1: ** (2)`\n`2:  (0)`\n`3: * (1)`\n`4:  (0)`\n`5:  (0)`\n`6: *** (3)`\n`Wuerfe gesamt: 6`\n`Am haeufigsten: 6`",
start:LEER,
tests:[{in:["1","6","3","6","1","6","0"]},{in:["0"]},{in:["7","-1","0"]},{in:["2","2","5","5","0"]},{in:["4","9","4","0"]}],
muss:[[/new\s+int\s*\[\s*7\s*\]|new\s+int\s*\[\s*6\s*\]/,"Zähle mit einem Array: int[] anzahl = new int[7]; (Index = Augenzahl, Index 0 bleibt leer)."]],
tipp:"Mit `int[] anzahl = new int[7];` kannst du direkt `anzahl[wurf]++;` schreiben. Die Sterne: innere for-Schleife mit `IO.print(\"*\")`. Achtung: Zwischen `:` und den Sternen steht immer ein Leerzeichen, und vor `(` auch – bei 0 Würfen also zwei Leerzeichen.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int[] anzahl = new int[7];\n  int gesamt = 0;\n  int wurf = Integer.parseInt(IO.readln(\"? Wurf (0 = Ende): \"));\n  while (wurf != 0) {\n    if (wurf >= 1 && wurf <= 6) {\n      anzahl[wurf]++;\n      gesamt++;\n    } else {\n      IO.println(\"Ungueltiger Wurf!\");\n    }\n    wurf = Integer.parseInt(IO.readln(\"? Wurf (0 = Ende): \"));\n  }\n\n  if (gesamt == 0) {\n    IO.println(\"Keine Wuerfe.\");\n    return;\n  }\n  int haeufigste = 1;\n  for (int augen = 1; augen <= 6; augen++) {\n    IO.print(augen + \": \");\n    for (int k = 0; k < anzahl[augen]; k++) {\n      IO.print(\"*\");\n    }\n    IO.println(\" (\" + anzahl[augen] + \")\");\n    if (anzahl[augen] > anzahl[haeufigste]) {\n      haeufigste = augen;\n    }\n  }\n  IO.println(\"Wuerfe gesamt: \" + gesamt);\n  IO.println(\"Am haeufigsten: \" + haeufigste);\n}"});

add(L2,{id:"lt2_pyramide", titel:"Zahlendreieck & Pyramide", kurz:"Geschachtelte for-Schleifen, keine Leerzeichen am Zeilenende",
aufgabe:"Lies eine Höhe n ein (`? Hoehe: `). Ist sie nicht zwischen 1 und 9 → `Ungueltige Hoehe!`.\nSonst gib zuerst ein Zahlendreieck aus (Zahlen mit **einem** Leerzeichen getrennt, **kein** Leerzeichen am Zeilenende), dann eine Leerzeile, dann eine Pyramide aus `*`.\nBeispiel für n = 3:\n`1`\n`1 2`\n`1 2 3`\n` `\n`  *`\n` ***`\n`*****`",
start:LEER,
tests:[{in:["3"]},{in:["1"]},{in:["5"]},{in:["0"]},{in:["10"]}],
muss:[[/for\s*\([^)]*\)[\s\S]*for\s*\(/,"Hier brauchst du geschachtelte for-Schleifen (eine für die Zeilen, eine innen für die Zeichen)."]],
tipp:"Zeile i der Pyramide (i = 1 … n): zuerst `n - i` Leerzeichen, dann `2 * i - 1` Sterne. Beim Zahlendreieck die 1 zuerst ausgeben und danach immer `\" \" + j` – so entsteht kein Leerzeichen am Ende.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Hoehe: \"));\n  if (n < 1 || n > 9) {\n    IO.println(\"Ungueltige Hoehe!\");\n    return;\n  }\n  for (int i = 1; i <= n; i++) {\n    IO.print(1);\n    for (int j = 2; j <= i; j++) {\n      IO.print(\" \" + j);\n    }\n    IO.println();\n  }\n  IO.println();\n  for (int i = 1; i <= n; i++) {\n    for (int k = 0; k < n - i; k++) {\n      IO.print(\" \");\n    }\n    for (int k = 0; k < 2 * i - 1; k++) {\n      IO.print(\"*\");\n    }\n    IO.println();\n  }\n}"});

add(L2,{id:"lt2_prim", titel:"Primzahlen mit Methoden", kurz:"boolean-Methode, Schleife mit Abbruch, Liste ohne Leerzeichen am Ende",
aufgabe:"Schreib eine Methode `boolean istPrim(int n)` (true, wenn n eine Primzahl ist; Zahlen < 2 sind keine) und eine Methode `int naechstePrim(int n)` (die kleinste Primzahl, die **größer** als n ist).\nIn main: Lies die Obergrenze ein (`? Obergrenze: `). Ist sie kleiner als 2 → `Ungueltige Eingabe!`.\nSonst:\n`Primzahlen bis 10: 2 3 5 7`\n`Anzahl: 4`\n`Naechste Primzahl nach 10: 11`",
start:LEER,
tests:[{in:["10"]},{in:["2"]},{in:["1"]},{in:["30"]},{in:["13"]},{in:["-5"]}],
muss:[[/boolean\s+istPrim\s*\(\s*int\s+\w+\s*\)/,"Schreib die Methode boolean istPrim(int n)."],[/int\s+naechstePrim\s*\(\s*int\s+\w+\s*\)/,"Schreib die Methode int naechstePrim(int n)."]],
tipp:"istPrim: `for (int t = 2; t * t <= n; t++) if (n % t == 0) return false;` und danach `return true;`. naechstePrim: `int k = n + 1; while (!istPrim(k)) k++; return k;`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nboolean istPrim(int n) {\n  if (n < 2) {\n    return false;\n  }\n  for (int t = 2; t * t <= n; t++) {\n    if (n % t == 0) {\n      return false;\n    }\n  }\n  return true;\n}\n\nint naechstePrim(int n) {\n  int k = n + 1;\n  while (!istPrim(k)) {\n    k++;\n  }\n  return k;\n}\n\nvoid main() {\n  int grenze = Integer.parseInt(IO.readln(\"? Obergrenze: \"));\n  if (grenze < 2) {\n    IO.println(\"Ungueltige Eingabe!\");\n    return;\n  }\n  String liste = \"\";\n  int anzahl = 0;\n  for (int z = 2; z <= grenze; z++) {\n    if (istPrim(z)) {\n      if (anzahl > 0) {\n        liste += \" \";\n      }\n      liste += z;\n      anzahl++;\n    }\n  }\n  IO.println(\"Primzahlen bis \" + grenze + \": \" + liste);\n  IO.println(\"Anzahl: \" + anzahl);\n  IO.println(\"Naechste Primzahl nach \" + grenze + \": \" + naechstePrim(grenze));\n}"});

add(L2,{id:"lt2_ziffern", titel:"Ziffern zerlegen", kurz:"while mit % 10 und / 10, Methoden mit Rückgabewert",
aufgabe:"Schreib die Methoden `int quersumme(int n)`, `int umdrehen(int n)` (z. B. 1230 → 321) und `int anzahlZiffern(int n)` (0 hat 1 Ziffer).\nIn main: Lies eine ganze Zahl ein (`? Zahl: `). Ist sie negativ → `Ungueltige Eingabe!`.\nSonst:\n`Ziffern: 4`\n`Quersumme: 15`\n`Umgedreht: 8421`\n`Palindrom: false`\n(Palindrom: die Zahl ist umgedreht gleich, z. B. 1221.)",
start:LEER,
tests:[{in:["1248"]},{in:["1221"]},{in:["0"]},{in:["7"]},{in:["1230"]},{in:["-12"]},{in:["90009"]}],
muss:[[/int\s+quersumme\s*\(/,"Schreib die Methode int quersumme(int n)."],[/int\s+umdrehen\s*\(/,"Schreib die Methode int umdrehen(int n)."],[/int\s+anzahlZiffern\s*\(/,"Schreib die Methode int anzahlZiffern(int n)."]],
tipp:"Grundmuster: `while (n > 0) { int ziffer = n % 10; …; n = n / 10; }`. Umdrehen: `ergebnis = ergebnis * 10 + ziffer;`. Für anzahlZiffern passt do-while gut, weil auch 0 eine Ziffer hat.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nint quersumme(int n) {\n  int summe = 0;\n  while (n > 0) {\n    summe += n % 10;\n    n = n / 10;\n  }\n  return summe;\n}\n\nint umdrehen(int n) {\n  int erg = 0;\n  while (n > 0) {\n    erg = erg * 10 + n % 10;\n    n = n / 10;\n  }\n  return erg;\n}\n\nint anzahlZiffern(int n) {\n  int anzahl = 0;\n  do {\n    anzahl++;\n    n = n / 10;\n  } while (n > 0);\n  return anzahl;\n}\n\nvoid main() {\n  int zahl = Integer.parseInt(IO.readln(\"? Zahl: \"));\n  if (zahl < 0) {\n    IO.println(\"Ungueltige Eingabe!\");\n    return;\n  }\n  IO.println(\"Ziffern: \" + anzahlZiffern(zahl));\n  IO.println(\"Quersumme: \" + quersumme(zahl));\n  IO.println(\"Umgedreht: \" + umdrehen(zahl));\n  IO.println(\"Palindrom: \" + (umdrehen(zahl) == zahl));\n}"});

add(L2,{id:"lt2_temperatur", titel:"Wochentemperaturen", kurz:"double-Array als Parameter, Index des Maximums",
aufgabe:"Lies 7 Temperaturen (Kommazahlen) in ein `double`-Array: `? Temperatur Tag 1: ` … `? Temperatur Tag 7: `.\nSchreib die Methoden `double durchschnitt(double[] t)` und `int indexMax(double[] t)` (Index des ersten größten Werts).\nAusgabe:\n`Durchschnitt: 18.5`\n`Waermster Tag: 3 (24.5 Grad)` (Tage zählen ab 1!)\n`Ueber dem Durchschnitt: Tag 2 Tag 3 Tag 6` (Tage mit Temperatur **größer** als der Durchschnitt, getrennt mit einem Leerzeichen)",
start:LEER,
tests:[{in:["15","20","24.5","17","13","22","18"]},{in:["10","10","10","10","10","10","10"]},{in:["-3.5","0","2.5","-1","4","4","1"]},{in:["30.5","12","14","16","18","20","22"]}],
muss:[[/double\s+durchschnitt\s*\(\s*double\s*\[\s*\]/,"Schreib die Methode double durchschnitt(double[] t)."],[/int\s+indexMax\s*\(\s*double\s*\[\s*\]/,"Schreib die Methode int indexMax(double[] t)."]],
tipp:"Für „Ueber dem Durchschnitt:“ erst den Text ausgeben und dann in der Schleife `IO.print(\" Tag \" + (i + 1))` – zum Schluss `IO.println()`. Gibt es keinen Tag, steht dann nur `Ueber dem Durchschnitt:`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\ndouble durchschnitt(double[] t) {\n  double summe = 0;\n  for (double x : t) {\n    summe += x;\n  }\n  return summe / t.length;\n}\n\nint indexMax(double[] t) {\n  int idx = 0;\n  for (int i = 1; i < t.length; i++) {\n    if (t[i] > t[idx]) {\n      idx = i;\n    }\n  }\n  return idx;\n}\n\nvoid main() {\n  double[] temp = new double[7];\n  for (int i = 0; i < temp.length; i++) {\n    temp[i] = Double.parseDouble(IO.readln(\"? Temperatur Tag \" + (i + 1) + \": \"));\n  }\n  double schnitt = durchschnitt(temp);\n  int max = indexMax(temp);\n  IO.println(\"Durchschnitt: \" + schnitt);\n  IO.println(\"Waermster Tag: \" + (max + 1) + \" (\" + temp[max] + \" Grad)\");\n  IO.print(\"Ueber dem Durchschnitt:\");\n  for (int i = 0; i < temp.length; i++) {\n    if (temp[i] > schnitt) {\n      IO.print(\" Tag \" + (i + 1));\n    }\n  }\n  IO.println();\n}"});

add(L2,{id:"lt2_umdrehen", titel:"Array umdrehen & Palindrom", kurz:"Methode, die ein neues Array zurückgibt",
aufgabe:"Lies die Länge n ein (`? Anzahl: `, mindestens 1, sonst `Ungueltige Anzahl!`) und dann n ganze Zahlen (`? Zahl 1: ` …).\nSchreib die Methoden `int[] umgedreht(int[] a)` (liefert ein **neues** Array in umgekehrter Reihenfolge, das Original bleibt gleich) und `boolean istPalindrom(int[] a)`.\nAusgabe:\n`Original: [1, 2, 3]`\n`Umgedreht: [3, 2, 1]`\n`Palindrom: nein` (bzw. `ja`)",
start:LEER,
tests:[{in:["3","1","2","3"]},{in:["5","4","7","1","7","4"]},{in:["1","42"]},{in:["4","1","2","2","1"]},{in:["0"]},{in:["2","5","6"]}],
muss:[[/int\s*\[\s*\]\s+umgedreht\s*\(\s*int\s*\[\s*\]/,"Schreib die Methode int[] umgedreht(int[] a)."],[/boolean\s+istPalindrom\s*\(\s*int\s*\[\s*\]/,"Schreib die Methode boolean istPalindrom(int[] a)."]],
tipp:"Im neuen Array gilt: `neu[i] = a[a.length - 1 - i]`. Palindrom: Vergleiche `a[i]` mit `a[a.length - 1 - i]` nur bis zur Mitte; beim ersten Unterschied `return false`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nint[] umgedreht(int[] a) {\n  int[] neu = new int[a.length];\n  for (int i = 0; i < a.length; i++) {\n    neu[i] = a[a.length - 1 - i];\n  }\n  return neu;\n}\n\nboolean istPalindrom(int[] a) {\n  for (int i = 0; i < a.length / 2; i++) {\n    if (a[i] != a[a.length - 1 - i]) {\n      return false;\n    }\n  }\n  return true;\n}\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Anzahl: \"));\n  if (n < 1) {\n    IO.println(\"Ungueltige Anzahl!\");\n    return;\n  }\n  int[] zahlen = new int[n];\n  for (int i = 0; i < n; i++) {\n    zahlen[i] = Integer.parseInt(IO.readln(\"? Zahl \" + (i + 1) + \": \"));\n  }\n  int[] um = umgedreht(zahlen);\n  IO.println(\"Original: \" + Arrays.toString(zahlen));\n  IO.println(\"Umgedreht: \" + Arrays.toString(um));\n  IO.println(\"Palindrom: \" + (istPalindrom(zahlen) ? \"ja\" : \"nein\"));\n}"});

add(L2,{id:"lt2_einmaleins", titel:"Einmaleins-Tabelle (2D-Array)", kurz:"int[][] füllen, Zeilen- und Spaltensummen",
aufgabe:"Lies n ein (`? Groesse: `, 1 bis 9, sonst `Ungueltige Groesse!`). Fülle ein `int[n][n]`-Array mit `tabelle[i][j] = (i + 1) * (j + 1)` und gib es zeilenweise aus (Werte mit einem Leerzeichen getrennt, kein Leerzeichen am Ende).\nDanach:\n`Zeilensummen: [6, 12, 18]` (mit Arrays.toString)\n`Diagonale: 1 4 9`\nBeispiel für n = 3:\n`1 2 3`\n`2 4 6`\n`3 6 9`\n`Zeilensummen: [6, 12, 18]`\n`Diagonale: 1 4 9`",
start:LEER,
tests:[{in:["3"]},{in:["1"]},{in:["5"]},{in:["0"]},{in:["12"]}],
muss:[[/int\s*\[\s*\]\s*\[\s*\]/,"Nimm ein zweidimensionales Array: int[][] tabelle = new int[n][n];"]],
tipp:"`tabelle.length` ist die Anzahl der Zeilen, `tabelle[i].length` die Länge der Zeile i. Die Zeilensummen kommen in ein eigenes `int[] summen = new int[n];`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Groesse: \"));\n  if (n < 1 || n > 9) {\n    IO.println(\"Ungueltige Groesse!\");\n    return;\n  }\n  int[][] tabelle = new int[n][n];\n  for (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++) {\n      tabelle[i][j] = (i + 1) * (j + 1);\n    }\n  }\n  int[] summen = new int[n];\n  for (int i = 0; i < tabelle.length; i++) {\n    for (int j = 0; j < tabelle[i].length; j++) {\n      if (j > 0) {\n        IO.print(\" \");\n      }\n      IO.print(tabelle[i][j]);\n      summen[i] += tabelle[i][j];\n    }\n    IO.println();\n  }\n  IO.println(\"Zeilensummen: \" + Arrays.toString(summen));\n  IO.print(\"Diagonale:\");\n  for (int i = 0; i < n; i++) {\n    IO.print(\" \" + tabelle[i][i]);\n  }\n  IO.println();\n}"});

add(L2,{id:"lt2_text", titel:"Text analysieren", kurz:"charAt-Schleife, Character-Methoden, split",
aufgabe:"Lies einen Satz ein (`? Text: `). Gib aus:\n`Zeichen: 21` (Länge)\n`Vokale: 6` (a, e, i, o, u – groß oder klein)\n`Grossbuchstaben: 2`\n`Ziffern: 1`\n`Woerter: 4` (durch Leerzeichen getrennt, der Text enthält keine doppelten Leerzeichen)\n`Laengstes Wort: Montag` (bei Gleichstand das erste)\n`Rueckwaerts: …` (der ganze Text von hinten nach vorne)",
start:LEER,
tests:[{in:["Am Montag um 9 Uhr"]},{in:["Java"]},{in:["Informatik macht Spass"]},{in:["OOP ist ab Livetest 3 dran"]},{in:["a e i o u"]}],
muss:[[/charAt\s*\(/,"Geh die Zeichen mit einer Schleife und text.charAt(i) durch."]],
tipp:"Vokal-Test: `\"aeiouAEIOU\".indexOf(c) >= 0`. Für die Wörter: `String[] woerter = text.split(\" \");`. Rückwärts: `for (int i = text.length() - 1; i >= 0; i--) rueck += text.charAt(i);`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  String text = IO.readln(\"? Text: \");\n  int vokale = 0;\n  int gross = 0;\n  int ziffern = 0;\n  for (int i = 0; i < text.length(); i++) {\n    char c = text.charAt(i);\n    if (\"aeiouAEIOU\".indexOf(c) >= 0) {\n      vokale++;\n    }\n    if (Character.isUpperCase(c)) {\n      gross++;\n    }\n    if (Character.isDigit(c)) {\n      ziffern++;\n    }\n  }\n  String[] woerter = text.split(\" \");\n  String laengstes = woerter[0];\n  for (String w : woerter) {\n    if (w.length() > laengstes.length()) {\n      laengstes = w;\n    }\n  }\n  String rueck = \"\";\n  for (int i = text.length() - 1; i >= 0; i--) {\n    rueck += text.charAt(i);\n  }\n  IO.println(\"Zeichen: \" + text.length());\n  IO.println(\"Vokale: \" + vokale);\n  IO.println(\"Grossbuchstaben: \" + gross);\n  IO.println(\"Ziffern: \" + ziffern);\n  IO.println(\"Woerter: \" + woerter.length);\n  IO.println(\"Laengstes Wort: \" + laengstes);\n  IO.println(\"Rueckwaerts: \" + rueck);\n}"});

add(L2,{id:"lt2_passwort", titel:"Passwort prüfen (ähnlich Bsp05)", kurz:"Endlosschleife mit return, Methoden, String-Vergleich mit equals",
aufgabe:"Konstanten (mit `final`): Mindestlänge 10, Abbruchwort `STOP`.\nSchreib `boolean hatZiffer(String s)`, `boolean hatGrossbuchstaben(String s)` und `String erstellePasswort()`.\n`erstellePasswort` fragt so lange `? Passwort (STOP = Abbruch): `, bis ein gültiges Passwort eingegeben wurde, und gibt es zurück. Bei `STOP` wird `\"\"` zurückgegeben. Fehler werden in dieser Reihenfolge geprüft (nur der erste wird gemeldet):\n• zu kurz → `Zu kurz (mindestens 10 Zeichen)!`\n• keine Ziffer → `Mindestens eine Ziffer!`\n• kein Großbuchstabe → `Mindestens ein Grossbuchstabe!`\n• sonst `? Passwort wiederholen: ` – stimmt es nicht überein → `Passwoerter stimmen nicht ueberein!` und von vorne.\nIn main: Ist das Ergebnis leer → `Abgebrochen.`, sonst `Passwort gespeichert (12 Zeichen).`",
start:LEER,
tests:[{in:["kurz","langespasswort","langespasswort1","Langespasswort1","Langespasswort2","Langespasswort1","Langespasswort1"]},{in:["STOP"]},{in:["Geheim12345","Geheim12345"]},{in:["abc","STOP"]},{in:["ABCDEFGHIJ1","abcdefghij1","ABCDEFGHIJ1","ABCDEFGHIJ1"]}],
muss:[[/\bfinal\b/,"Lege Mindestlänge und Abbruchwort als Konstanten mit final an."],[/String\s+erstellePasswort\s*\(\s*\)/,"Schreib die Methode String erstellePasswort()."],[/\.equals\s*\(/,"Strings vergleicht man mit .equals(…)."]],
verboten:[[/==\s*"|"\s*==|==\s*STOP|STOP\s*==/,"Strings nie mit == vergleichen – nimm .equals(…)."]],
tipp:"Gerüst: `while (true) { String pw = IO.readln(…); if (pw.equals(STOP)) return \"\"; if (pw.length() < MIN_LAENGE) { IO.println(…); continue; } … return pw; }`. Mit `continue` springst du direkt zur nächsten Runde. Die Konstanten stehen außerhalb von main (ganz oben), damit alle Methoden sie sehen.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nfinal int MIN_LAENGE = 10;\nfinal String STOP = \"STOP\";\n\nboolean hatZiffer(String s) {\n  for (int i = 0; i < s.length(); i++) {\n    if (Character.isDigit(s.charAt(i))) {\n      return true;\n    }\n  }\n  return false;\n}\n\nboolean hatGrossbuchstaben(String s) {\n  for (int i = 0; i < s.length(); i++) {\n    if (Character.isUpperCase(s.charAt(i))) {\n      return true;\n    }\n  }\n  return false;\n}\n\nString erstellePasswort() {\n  while (true) {\n    String pw = IO.readln(\"? Passwort (STOP = Abbruch): \");\n    if (pw.equals(STOP)) {\n      return \"\";\n    }\n    if (pw.length() < MIN_LAENGE) {\n      IO.println(\"Zu kurz (mindestens \" + MIN_LAENGE + \" Zeichen)!\");\n      continue;\n    }\n    if (!hatZiffer(pw)) {\n      IO.println(\"Mindestens eine Ziffer!\");\n      continue;\n    }\n    if (!hatGrossbuchstaben(pw)) {\n      IO.println(\"Mindestens ein Grossbuchstabe!\");\n      continue;\n    }\n    String wdh = IO.readln(\"? Passwort wiederholen: \");\n    if (!wdh.equals(pw)) {\n      IO.println(\"Passwoerter stimmen nicht ueberein!\");\n      continue;\n    }\n    return pw;\n  }\n}\n\nvoid main() {\n  String pw = erstellePasswort();\n  if (pw.isEmpty()) {\n    IO.println(\"Abgebrochen.\");\n  } else {\n    IO.println(\"Passwort gespeichert (\" + pw.length() + \" Zeichen).\");\n  }\n}"});

fehler(L2,{id:"lt2_fehler_max", titel:"Fehler finden · Minimum, Maximum, Schnitt", kurz:"3 typische Array-Fehler: Index, Startwert, Division", n:3,
aufgabe:"Das Programm soll n ganze Zahlen einlesen und Minimum, Maximum und Durchschnitt ausgeben:\n`? Anzahl: 3`\n`? Zahl 1: -4`\n`? Zahl 2: -9`\n`? Zahl 3: -2`\n`Minimum: -9`\n`Maximum: -2`\n`Durchschnitt: -5.0`\nEs stürzt aber ab bzw. rechnet falsch.",
start:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Anzahl: \"));\n  int[] zahlen = new int[n];\n  for (int i = 0; i <= zahlen.length; i++) {\n    zahlen[i] = Integer.parseInt(IO.readln(\"? Zahl \" + (i + 1) + \": \"));\n  }\n  int min = zahlen[0];\n  int max = 0;\n  int summe = 0;\n  for (int z : zahlen) {\n    if (z < min) {\n      min = z;\n    }\n    if (z > max) {\n      max = z;\n    }\n    summe += z;\n  }\n  double schnitt = summe / n;\n  IO.println(\"Minimum: \" + min);\n  IO.println(\"Maximum: \" + max);\n  IO.println(\"Durchschnitt: \" + schnitt);\n}",
tests:[{in:["3","-4","-9","-2"]},{in:["4","3","8","1","5"]},{in:["1","7"]},{in:["2","1","2"]}],
tipp:"1) `i <= zahlen.length` läuft einmal zu weit (ArrayIndexOutOfBoundsException) → `<`. 2) `max = 0` ist falsch, wenn alle Zahlen negativ sind → mit `zahlen[0]` starten. 3) `summe / n` rechnet ganzzahlig, erst danach wird daraus double → `(double) summe / n`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Anzahl: \"));\n  int[] zahlen = new int[n];\n  for (int i = 0; i < zahlen.length; i++) {\n    zahlen[i] = Integer.parseInt(IO.readln(\"? Zahl \" + (i + 1) + \": \"));\n  }\n  int min = zahlen[0];\n  int max = zahlen[0];\n  int summe = 0;\n  for (int z : zahlen) {\n    if (z < min) {\n      min = z;\n    }\n    if (z > max) {\n      max = z;\n    }\n    summe += z;\n  }\n  double schnitt = (double) summe / n;\n  IO.println(\"Minimum: \" + min);\n  IO.println(\"Maximum: \" + max);\n  IO.println(\"Durchschnitt: \" + schnitt);\n}"});

fehler(L2,{id:"lt2_fehler_compile", titel:"Fehler finden · Compilerfehler", kurz:"Array-Deklaration, length, Strings vergleichen", n:4,
aufgabe:"Das Programm liest 3 Namen ein und zählt, wie oft `Anna` vorkommt. Gewünschte Ausgabe:\n`? Name 1: Anna`\n`? Name 2: Ben`\n`? Name 3: Anna`\n`Anna kommt 2-mal vor.`\n`Namen: [Anna, Ben, Anna]`",
start:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  String[3] namen;\n  for (int i = 0; i < namen.length(); i++) {\n    namen[i] = IO.readln(\"? Name \" + (i + 1) + \": \");\n  }\n  int anzahl = 0;\n  for (String n : namen) {\n    if (n == \"Anna\") {\n      anzahl++;\n    }\n  }\n  IO.println(\"Anna kommt \" + anzahl + \"-mal vor.\");\n  IO.println(\"Namen: \" + namen);\n}",
tests:[{in:["Anna","Ben","Anna"]},{in:["Lea","Max","Tom"]},{in:["Anna","Anna","Anna"]}],
tipp:"1) Ein Array legt man mit `String[] namen = new String[3];` an. 2) Bei Arrays ist `length` ein Feld: `namen.length` (ohne Klammern). 3) Strings mit `.equals(…)` vergleichen – `==` vergleicht nur die Adressen (bei eingelesenem Text ist das false!). 4) `\"…\" + namen` gibt nur `[Ljava.lang.String;@…` aus → `Arrays.toString(namen)`.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  String[] namen = new String[3];\n  for (int i = 0; i < namen.length; i++) {\n    namen[i] = IO.readln(\"? Name \" + (i + 1) + \": \");\n  }\n  int anzahl = 0;\n  for (String n : namen) {\n    if (n.equals(\"Anna\")) {\n      anzahl++;\n    }\n  }\n  IO.println(\"Anna kommt \" + anzahl + \"-mal vor.\");\n  IO.println(\"Namen: \" + Arrays.toString(namen));\n}"});

vor(L2,{id:"lt2_v_schleifen", titel:"Vorhersage · Schleifen-Fallen", kurz:"break, continue, do-while, Zähler nach der Schleife",
code:String.raw`void main() {
  int i = 0;
  while (i < 10) {
    i += 3;
    if (i == 6) continue;
    if (i > 8) break;
    IO.print(i + " ");
  }
  IO.println("| i = " + i);
  int s = 0;
  for (int k = 5; k > 0; k -= 2) {
    s += k;
  }
  IO.println(s);
  int n = 100;
  do {
    n = n / 3;
  } while (n > 50);
  IO.println(n);
  for (int a = 1; a <= 3; a++) {
    for (int b = a; b <= 3; b++) {
      IO.print(a * b + " ");
    }
  }
  IO.println();
}`,
erkl:"Erste Schleife: i = 3 → `3 ` ausgeben. i = 6 → `continue` (nichts ausgeben). i = 9 → `9 > 8` → `break`. Danach `| i = 9`, also **3 | i = 9**. Zweite Schleife: k = 5, 3, 1 → s = **9**. do-while: 100 / 3 = 33 (Ganzzahl), 33 > 50 ist false → Ende → **33**. Geschachtelt: a = 1: b = 1..3 → 1 2 3; a = 2: b = 2..3 → 4 6; a = 3: b = 3 → 9 → **1 2 3 4 6 9 ** (mit Leerzeichen am Ende).",
tipp:"continue überspringt nur den Rest der aktuellen Runde, break beendet die ganze Schleife."});

vor(L2,{id:"lt2_v_arrays", titel:"Vorhersage · Arrays sind Referenzen", kurz:"b = a, Methoden ändern Arrays, aber keine ints",
code:String.raw`void verdopple(int[] a, int x) {
  for (int i = 0; i < a.length; i++) {
    a[i] = a[i] * 2;
  }
  x = x * 2;
}

void main() {
  int[] a = {1, 2, 3};
  int[] b = a;
  b[0] = 10;
  int x = 5;
  verdopple(a, x);
  IO.println(Arrays.toString(a) + " " + x);
  int[] c = {20, 4, 6};
  IO.println(a == c);
  IO.println(Arrays.equals(a, c));
  int[][] m = new int[2][3];
  m[1][2] = 7;
  IO.println(m.length + " " + m[0].length + " " + m[1][2] + m[0][2]);
  String[] s = new String[2];
  double[] d = new double[2];
  IO.println(s[0] + " " + d[1]);
}`,
erkl:"`b = a` kopiert nur die **Referenz** – a und b sind dasselbe Array, also ist danach a = [10, 2, 3]. Die Methode bekommt eine Kopie der Referenz und ändert die Elemente des echten Arrays → [20, 4, 6]. `x` ist ein int: die Methode ändert nur ihre eigene Kopie → x bleibt **5**. Ausgabe **[20, 4, 6] 5**. `a == c`: zwei verschiedene Array-Objekte → **false**, obwohl der Inhalt gleich ist. `Arrays.equals` vergleicht den Inhalt → **true**. `m` hat 2 Zeilen (`m.length`) mit je 3 Spalten (`m[0].length`), m[1][2] = 7, m[0][2] = 0 (Standardwert). Der Ausdruck wird von links ausgewertet und ist schon ein String, also wird 7 und dann 0 **angehängt** (nicht addiert) → **2 3 70**. Ein neues String-Array enthält `null`, ein double-Array `0.0` → **null 0.0**.",
tipp:"Arrays werden nie kopiert, wenn man sie zuweist oder übergibt – nur die Adresse."});

vor(L2,{id:"lt2_v_methoden", titel:"Vorhersage · Methoden & Rückgabe", kurz:"return beendet sofort, Überladen, Rekursion",
code:String.raw`int f(int n) {
  if (n <= 1) return 1;
  return n * f(n - 1);
}

String f(String s) {
  return s + s;
}

int suche(int[] a, int wert) {
  for (int i = 0; i < a.length; i++) {
    if (a[i] == wert) return i;
  }
  return -1;
}

void main() {
  IO.println(f(4));
  IO.println(f("ab"));
  int[] z = {4, 8, 4, 2};
  IO.println(suche(z, 4) + " " + suche(z, 5));
  IO.println(f(3) + f(2) + "!" + f(1) + f(0));
}`,
erkl:"`f(4)` ruft sich selbst auf: 4 · 3 · 2 · f(1) = 4 · 3 · 2 · 1 = **24** (Fakultät). `f(\"ab\")`: Java wählt anhand des Argumenttyps die String-Variante (Überladen) → **abab**. `suche` liefert den **ersten** Treffer, weil return die Methode sofort beendet → 0, und -1, wenn nichts gefunden wird → **0 -1**. Letzte Zeile: von links: f(3) + f(2) = 6 + 2 = 8 (Zahlen!), dann `+ \"!\"` → \"8!\", danach wird angehängt: f(1) = 1, f(0) = 1 → **8!11**.",
tipp:"+ rechnet so lange, bis links ein String steht – ab dann wird nur noch angehängt."});

/* ======================= LIVETEST 3 ======================= */
var L3="lt3";
var KLASSE="// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  \n}\n\n// Deine Klasse(n) hier:\n";

add(L3,{id:"lt3_konto", titel:"Bankkonto", kurz:"Klasse mit private Feldern, Konstruktor, Methoden, toString, Menü-Schleife",
aufgabe:"Schreib eine Klasse `Konto` mit den **private** Feldern `inhaber` (String) und `stand` (double, startet bei 0), einem Konstruktor `Konto(String inhaber)` und den Methoden:\n• `boolean einzahlen(double betrag)` – nur Beträge > 0, sonst `false`\n• `boolean abheben(double betrag)` – nur, wenn 0 < betrag ≤ stand, sonst `false`\n• `public String toString()` → `Konto von Anna: 150.5 Euro`\nIn main: `? Inhaber: ` einlesen, dann wiederholt `? Aktion (e/a/s/x): `\n• `e` → `? Betrag: `, bei false `Ungueltiger Betrag!`\n• `a` → `? Betrag: `, bei false `Abhebung nicht moeglich!`\n• `s` → das Konto ausgeben (toString)\n• `x` → `Auf Wiedersehen!` und Ende\n• sonst → `Unbekannte Aktion!`",
start:KLASSE,
tests:[{in:["Anna","e","100","a","30.5","s","x"]},{in:["Ben","a","10","e","-5","e","20","q","s","x"]},{in:["Lea","x"]},{in:["Tom","e","50","a","50","s","a","0.5","x"]}],
muss:[[/class\s+Konto\b/,"Schreib eine Klasse Konto."],[/private\s+double\s+stand/,"Das Feld stand soll private sein: private double stand;"],[/public\s+String\s+toString\s*\(\s*\)/,"Überschreibe public String toString()."],[/new\s+Konto\s*\(/,"Erzeuge in main ein Objekt mit new Konto(…)."]],
tipp:"Menü mit `while (true)` und `switch (aktion)` oder if-else-Kette mit `aktion.equals(\"e\")`. Bei `x` mit `return` (oder break + Flag) raus. Im Konstruktor `this.inhaber = inhaber;` – `this.` unterscheidet das Feld vom Parameter.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  Konto k = new Konto(IO.readln(\"? Inhaber: \"));\n  while (true) {\n    String aktion = IO.readln(\"? Aktion (e/a/s/x): \");\n    switch (aktion) {\n      case \"e\" -> {\n        double b = Double.parseDouble(IO.readln(\"? Betrag: \"));\n        if (!k.einzahlen(b)) {\n          IO.println(\"Ungueltiger Betrag!\");\n        }\n      }\n      case \"a\" -> {\n        double b = Double.parseDouble(IO.readln(\"? Betrag: \"));\n        if (!k.abheben(b)) {\n          IO.println(\"Abhebung nicht moeglich!\");\n        }\n      }\n      case \"s\" -> IO.println(k);\n      case \"x\" -> {\n        IO.println(\"Auf Wiedersehen!\");\n        return;\n      }\n      default -> IO.println(\"Unbekannte Aktion!\");\n    }\n  }\n}\n\nclass Konto {\n  private String inhaber;\n  private double stand;\n\n  Konto(String inhaber) {\n    this.inhaber = inhaber;\n    this.stand = 0;\n  }\n\n  boolean einzahlen(double betrag) {\n    if (betrag <= 0) {\n      return false;\n    }\n    stand += betrag;\n    return true;\n  }\n\n  boolean abheben(double betrag) {\n    if (betrag <= 0 || betrag > stand) {\n      return false;\n    }\n    stand -= betrag;\n    return true;\n  }\n\n  public String toString() {\n    return \"Konto von \" + inhaber + \": \" + stand + \" Euro\";\n  }\n}"});

add(L3,{id:"lt3_bruch", titel:"Bruch-Klasse", kurz:"Objekte als Parameter und Rückgabewert, Kürzen mit ggT, static-Hilfsmethode",
aufgabe:"Schreib eine Klasse `Bruch` mit den private Feldern `zaehler` und `nenner` (int). Der Konstruktor `Bruch(int zaehler, int nenner)` kürzt sofort (mit einer `static int ggT(int a, int b)`) und sorgt dafür, dass der Nenner positiv ist (-1/-2 → 1/2, 1/-2 → -1/2).\nMethoden: `Bruch plus(Bruch b)`, `Bruch mal(Bruch b)` (liefern **neue** Brüche), `double wert()` und `public String toString()` → `3/4`, bei Nenner 1 nur `3`.\nIn main: `? Zaehler 1: `, `? Nenner 1: `, `? Zaehler 2: `, `? Nenner 2: ` einlesen. Ist ein Nenner 0 → `Nenner darf nicht 0 sein!`. Sonst:\n`1/2 + 1/3 = 5/6`\n`1/2 * 1/3 = 1/6`\n`Wert der Summe: 0.8333333333333334`",
start:KLASSE,
tests:[{in:["1","2","1","3"]},{in:["2","4","3","6"]},{in:["3","-4","1","4"]},{in:["5","1","0","7"]},{in:["1","0","1","2"]},{in:["-6","-8","9","12"]},{in:["7","3","2","3"]}],
muss:[[/class\s+Bruch\b/,"Schreib eine Klasse Bruch."],[/Bruch\s+plus\s*\(\s*Bruch\s+\w+\s*\)/,"Schreib die Methode Bruch plus(Bruch b)."],[/static\s+int\s+ggT\s*\(/,"Schreib eine static-Hilfsmethode int ggT(int a, int b)."]],
tipp:"ggT mit dem euklidischen Algorithmus: `while (b != 0) { int r = a % b; a = b; b = r; } return a;` – vorher mit `Math.abs` positiv machen. Bei Zähler 0 ist ggT(0, n) = n, dann wird 0/n zu 0/1. `plus`: `new Bruch(zaehler * b.nenner + b.zaehler * nenner, nenner * b.nenner)` – der Konstruktor kürzt dann. Innerhalb der Klasse darfst du auf `b.nenner` zugreifen, auch wenn es private ist.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int z1 = Integer.parseInt(IO.readln(\"? Zaehler 1: \"));\n  int n1 = Integer.parseInt(IO.readln(\"? Nenner 1: \"));\n  int z2 = Integer.parseInt(IO.readln(\"? Zaehler 2: \"));\n  int n2 = Integer.parseInt(IO.readln(\"? Nenner 2: \"));\n  if (n1 == 0 || n2 == 0) {\n    IO.println(\"Nenner darf nicht 0 sein!\");\n    return;\n  }\n  Bruch a = new Bruch(z1, n1);\n  Bruch b = new Bruch(z2, n2);\n  Bruch summe = a.plus(b);\n  IO.println(a + \" + \" + b + \" = \" + summe);\n  IO.println(a + \" * \" + b + \" = \" + a.mal(b));\n  IO.println(\"Wert der Summe: \" + summe.wert());\n}\n\nclass Bruch {\n  private int zaehler;\n  private int nenner;\n\n  Bruch(int zaehler, int nenner) {\n    int g = ggT(zaehler, nenner);\n    if (nenner < 0) {\n      g = -g;\n    }\n    this.zaehler = zaehler / g;\n    this.nenner = nenner / g;\n  }\n\n  static int ggT(int a, int b) {\n    a = Math.abs(a);\n    b = Math.abs(b);\n    while (b != 0) {\n      int r = a % b;\n      a = b;\n      b = r;\n    }\n    return a;\n  }\n\n  Bruch plus(Bruch b) {\n    return new Bruch(zaehler * b.nenner + b.zaehler * nenner, nenner * b.nenner);\n  }\n\n  Bruch mal(Bruch b) {\n    return new Bruch(zaehler * b.zaehler, nenner * b.nenner);\n  }\n\n  double wert() {\n    return (double) zaehler / nenner;\n  }\n\n  public String toString() {\n    if (nenner == 1) {\n      return \"\" + zaehler;\n    }\n    return zaehler + \"/\" + nenner;\n  }\n}"});

add(L3,{id:"lt3_tiere", titel:"Tierheim", kurz:"abstract class, extends, super(…), Polymorphismus, instanceof",
aufgabe:"Schreib eine **abstrakte** Klasse `Tier` mit den Feldern `name` (String) und `alter` (int) (beide `protected`), einem Konstruktor `Tier(String name, int alter)`, der abstrakten Methode `String laut()` und der Methode `String beschreibung()` → `Bello (3 Jahre) sagt Wuff`.\nUnterklassen: `Hund` (laut: `Wuff`), `Katze` (`Miau`), `Vogel` (`Piep`) – jeweils mit Konstruktor, der `super(…)` aufruft.\nIn main: `? Anzahl Tiere: ` (n ≥ 1, sonst `Ungueltige Anzahl!`), dann für jedes Tier `? Art (h/k/v): ` (bei anderer Eingabe `Unbekannte Art!` und nochmal fragen), `? Name: `, `? Alter: `. Speichere alle in einem `Tier[]`.\nDanach jede Beschreibung in einer Zeile, dann\n`Hunde: 1, Katzen: 1, Voegel: 0` (mit instanceof gezählt)\n`Aeltestes Tier: Rex` (bei Gleichstand das erste)",
start:KLASSE,
tests:[{in:["2","h","Bello","3","k","Mimi","5"]},{in:["3","v","Tweety","1","x","h","Rex","9","k","Luna","9"]},{in:["0"]},{in:["1","k","Garfield","12"]}],
muss:[[/abstract\s+class\s+Tier\b/,"Tier soll eine abstrakte Klasse sein: abstract class Tier"],[/abstract\s+String\s+laut\s*\(\s*\)\s*;/,"laut() soll in Tier abstrakt sein: abstract String laut();"],[/class\s+Hund\s+extends\s+Tier/,"Hund erbt von Tier: class Hund extends Tier"],[/super\s*\(/,"Die Unterklassen rufen im Konstruktor super(name, alter) auf."],[/instanceof/,"Zähle die Tierarten mit instanceof."]],
tipp:"`Tier[] tiere = new Tier[n];` – ein Array vom Typ der Oberklasse kann Hunde, Katzen und Vögel aufnehmen. `t.beschreibung()` ruft intern `laut()` auf, und Java nimmt automatisch die Version des echten Objekts (dynamisches Binden).",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Anzahl Tiere: \"));\n  if (n < 1) {\n    IO.println(\"Ungueltige Anzahl!\");\n    return;\n  }\n  Tier[] tiere = new Tier[n];\n  for (int i = 0; i < n; i++) {\n    String art = IO.readln(\"? Art (h/k/v): \");\n    while (!art.equals(\"h\") && !art.equals(\"k\") && !art.equals(\"v\")) {\n      IO.println(\"Unbekannte Art!\");\n      art = IO.readln(\"? Art (h/k/v): \");\n    }\n    String name = IO.readln(\"? Name: \");\n    int alter = Integer.parseInt(IO.readln(\"? Alter: \"));\n    if (art.equals(\"h\")) {\n      tiere[i] = new Hund(name, alter);\n    } else if (art.equals(\"k\")) {\n      tiere[i] = new Katze(name, alter);\n    } else {\n      tiere[i] = new Vogel(name, alter);\n    }\n  }\n\n  int hunde = 0, katzen = 0, voegel = 0;\n  Tier aeltestes = tiere[0];\n  for (Tier t : tiere) {\n    IO.println(t.beschreibung());\n    if (t instanceof Hund) {\n      hunde++;\n    } else if (t instanceof Katze) {\n      katzen++;\n    } else if (t instanceof Vogel) {\n      voegel++;\n    }\n    if (t.alter > aeltestes.alter) {\n      aeltestes = t;\n    }\n  }\n  IO.println(\"Hunde: \" + hunde + \", Katzen: \" + katzen + \", Voegel: \" + voegel);\n  IO.println(\"Aeltestes Tier: \" + aeltestes.name);\n}\n\nabstract class Tier {\n  protected String name;\n  protected int alter;\n\n  Tier(String name, int alter) {\n    this.name = name;\n    this.alter = alter;\n  }\n\n  abstract String laut();\n\n  String beschreibung() {\n    return name + \" (\" + alter + \" Jahre) sagt \" + laut();\n  }\n}\n\nclass Hund extends Tier {\n  Hund(String name, int alter) {\n    super(name, alter);\n  }\n\n  @Override\n  String laut() {\n    return \"Wuff\";\n  }\n}\n\nclass Katze extends Tier {\n  Katze(String name, int alter) {\n    super(name, alter);\n  }\n\n  @Override\n  String laut() {\n    return \"Miau\";\n  }\n}\n\nclass Vogel extends Tier {\n  Vogel(String name, int alter) {\n    super(name, alter);\n  }\n\n  @Override\n  String laut() {\n    return \"Piep\";\n  }\n}"});

add(L3,{id:"lt3_formen", titel:"Geometrische Formen", kurz:"Abstrakte Methoden, Quadrat extends Rechteck, toString in der Oberklasse",
aufgabe:"Abstrakte Klasse `Form` mit den abstrakten Methoden `double flaeche()`, `double umfang()`, `String name()` und `public String toString()` → `Rechteck: Flaeche = 6.0, Umfang = 10.0` (toString steht **nur** in Form!).\nUnterklassen: `Rechteck(double a, double b)`, `Quadrat(double s)` **extends Rechteck** (ruft `super(s, s)` auf, überschreibt nur `name()`), `Kreis(double r)` (mit `Math.PI`).\nIn main: wiederholt `? Form (r/q/k, x = Ende): `; bei `r` → `? a: `, `? b: `; bei `q` → `? Seite: `; bei `k` → `? Radius: `; sonst `Unbekannte Form!`. Maximal 10 Formen in einem `Form[]` (dann wird automatisch beendet).\nZum Schluss jede Form (toString), dann `Anzahl: 2`, `Gesamtflaeche: …` und `Groesste Flaeche: Kreis` – bei 0 Formen nur `Keine Formen.`",
start:KLASSE,
tests:[{in:["r","2","3","q","2","x"]},{in:["k","1","r","1.5","4","t","x"]},{in:["x"]},{in:["q","3","k","2","q","0.5","x"]}],
muss:[[/abstract\s+class\s+Form\b/,"Form soll abstrakt sein."],[/class\s+Quadrat\s+extends\s+Rechteck/,"Quadrat erbt von Rechteck: class Quadrat extends Rechteck"],[/super\s*\(\s*\w+\s*,\s*\w+\s*\)/,"Der Quadrat-Konstruktor ruft super(s, s) auf."],[/Math\.PI/,"Für den Kreis brauchst du Math.PI."]],
tipp:"`Form[] formen = new Form[10]; int anzahl = 0;` – beim Hinzufügen `formen[anzahl++] = …`. Die Schleife läuft `while (anzahl < formen.length)`. Weil toString in Form `name()`, `flaeche()` und `umfang()` aufruft, passt es automatisch für jede Unterklasse.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  Form[] formen = new Form[10];\n  int anzahl = 0;\n  while (anzahl < formen.length) {\n    String f = IO.readln(\"? Form (r/q/k, x = Ende): \");\n    if (f.equals(\"x\")) {\n      break;\n    } else if (f.equals(\"r\")) {\n      double a = Double.parseDouble(IO.readln(\"? a: \"));\n      double b = Double.parseDouble(IO.readln(\"? b: \"));\n      formen[anzahl++] = new Rechteck(a, b);\n    } else if (f.equals(\"q\")) {\n      formen[anzahl++] = new Quadrat(Double.parseDouble(IO.readln(\"? Seite: \")));\n    } else if (f.equals(\"k\")) {\n      formen[anzahl++] = new Kreis(Double.parseDouble(IO.readln(\"? Radius: \")));\n    } else {\n      IO.println(\"Unbekannte Form!\");\n    }\n  }\n  if (anzahl == 0) {\n    IO.println(\"Keine Formen.\");\n    return;\n  }\n  double gesamt = 0;\n  Form groesste = formen[0];\n  for (int i = 0; i < anzahl; i++) {\n    IO.println(formen[i]);\n    gesamt += formen[i].flaeche();\n    if (formen[i].flaeche() > groesste.flaeche()) {\n      groesste = formen[i];\n    }\n  }\n  IO.println(\"Anzahl: \" + anzahl);\n  IO.println(\"Gesamtflaeche: \" + gesamt);\n  IO.println(\"Groesste Flaeche: \" + groesste.name());\n}\n\nabstract class Form {\n  abstract double flaeche();\n  abstract double umfang();\n  abstract String name();\n\n  public String toString() {\n    return name() + \": Flaeche = \" + flaeche() + \", Umfang = \" + umfang();\n  }\n}\n\nclass Rechteck extends Form {\n  private double a;\n  private double b;\n\n  Rechteck(double a, double b) {\n    this.a = a;\n    this.b = b;\n  }\n\n  double flaeche() {\n    return a * b;\n  }\n\n  double umfang() {\n    return 2 * (a + b);\n  }\n\n  String name() {\n    return \"Rechteck\";\n  }\n}\n\nclass Quadrat extends Rechteck {\n  Quadrat(double s) {\n    super(s, s);\n  }\n\n  @Override\n  String name() {\n    return \"Quadrat\";\n  }\n}\n\nclass Kreis extends Form {\n  private double r;\n\n  Kreis(double r) {\n    this.r = r;\n  }\n\n  double flaeche() {\n    return Math.PI * r * r;\n  }\n\n  double umfang() {\n    return 2 * Math.PI * r;\n  }\n\n  String name() {\n    return \"Kreis\";\n  }\n}"});

add(L3,{id:"lt3_studenten", titel:"Studierende & Noten", kurz:"static-Zähler, final-Feld, Array als Feld, Objekt-Array durchsuchen",
aufgabe:"Klasse `Student`: private Felder `name`, `matrNr` (final int), `noten` (int-Array mit Platz für 10) und `anzahlNoten`; dazu ein **static** Zähler `anzahl`.\nDer Konstruktor `Student(String name)` erhöht den Zähler und vergibt `matrNr = 1000 + anzahl` (erster Student 1001).\nMethoden: `boolean noteHinzufuegen(int note)` (nur 1–5 und solange Platz ist), `double schnitt()` (0.0 ohne Noten), `String getName()`, `public String toString()` → `1001 Anna: [1, 2] Schnitt 1.5` und `static int getAnzahl()`.\nIn main: wiederholt `? Name (leer = Ende): `. Für jeden Namen Noten einlesen mit `? Note (0 = fertig): `; ungültige Noten → `Ungueltige Note!`. Höchstens 5 Studierende.\nAusgabe: jeden Studenten (toString), dann `Studierende: 2` (über getAnzahl) und `Bester Schnitt: Anna` (kleinster Schnitt unter denen mit mindestens einer Note; gibt es keinen → `Bester Schnitt: -`).",
start:KLASSE,
tests:[{in:["Anna","1","2","0","Ben","3","7","2","0",""]},{in:[""]},{in:["Lea","0","Max","5","0",""]},{in:["A","2","0","B","1","0","C","1","0","D","4","0","E","3","0"]}],
muss:[[/class\s+Student\b/,"Schreib eine Klasse Student."],[/static\s+int\s+anzahl/,"Der Zähler soll static sein: private static int anzahl = 0;"],[/final\s+int\s+matrNr/,"matrNr soll final sein."]],
tipp:"Die Noten-Liste im toString: Nur die ersten `anzahlNoten` Einträge ausgeben, z. B. `Arrays.toString(Arrays.copyOf(noten, anzahlNoten))`. Ein static-Feld gibt es **einmal für alle** Objekte – darum zählt es alle erzeugten Studenten.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  Student[] liste = new Student[5];\n  int n = 0;\n  while (n < liste.length) {\n    String name = IO.readln(\"? Name (leer = Ende): \");\n    if (name.isEmpty()) {\n      break;\n    }\n    Student s = new Student(name);\n    int note = Integer.parseInt(IO.readln(\"? Note (0 = fertig): \"));\n    while (note != 0) {\n      if (!s.noteHinzufuegen(note)) {\n        IO.println(\"Ungueltige Note!\");\n      }\n      note = Integer.parseInt(IO.readln(\"? Note (0 = fertig): \"));\n    }\n    liste[n] = s;\n    n++;\n  }\n  Student bester = null;\n  for (int i = 0; i < n; i++) {\n    IO.println(liste[i]);\n    if (liste[i].schnitt() > 0 && (bester == null || liste[i].schnitt() < bester.schnitt())) {\n      bester = liste[i];\n    }\n  }\n  IO.println(\"Studierende: \" + Student.getAnzahl());\n  IO.println(\"Bester Schnitt: \" + (bester == null ? \"-\" : bester.getName()));\n}\n\nclass Student {\n  private static int anzahl = 0;\n  private String name;\n  private final int matrNr;\n  private int[] noten = new int[10];\n  private int anzahlNoten = 0;\n\n  Student(String name) {\n    this.name = name;\n    anzahl++;\n    matrNr = 1000 + anzahl;\n  }\n\n  static int getAnzahl() {\n    return anzahl;\n  }\n\n  String getName() {\n    return name;\n  }\n\n  boolean noteHinzufuegen(int note) {\n    if (note < 1 || note > 5 || anzahlNoten == noten.length) {\n      return false;\n    }\n    noten[anzahlNoten] = note;\n    anzahlNoten++;\n    return true;\n  }\n\n  double schnitt() {\n    if (anzahlNoten == 0) {\n      return 0.0;\n    }\n    int summe = 0;\n    for (int i = 0; i < anzahlNoten; i++) {\n      summe += noten[i];\n    }\n    return (double) summe / anzahlNoten;\n  }\n\n  public String toString() {\n    return matrNr + \" \" + name + \": \" + Arrays.toString(Arrays.copyOf(noten, anzahlNoten)) + \" Schnitt \" + schnitt();\n  }\n}"});

add(L3,{id:"lt3_punkt", titel:"Punkte vergleichen", kurz:"equals(Object) überschreiben, == vs. equals, Methoden mit Objekt-Parameter",
aufgabe:"Klasse `Punkt` mit den Feldern `x` und `y` (int), Konstruktor, `double abstand(Punkt p)` (mit Math.sqrt), `Punkt verschiebe(int dx, int dy)` (liefert einen **neuen** Punkt), `public String toString()` → `(3, 4)` und **`public boolean equals(Object o)`** (gleich, wenn x und y gleich sind).\nIn main: `? x1: `, `? y1: `, `? x2: `, `? y2: ` einlesen und ausgeben:\n`P1 = (0, 0), P2 = (3, 4)`\n`P1 == P2: false`\n`P1.equals(P2): false`\n`Abstand: 5.0`\n`P1 verschoben um (3, 4): (3, 4)`\n`Gleich wie P2: true` (verschobener P1 mit equals verglichen)",
start:KLASSE,
tests:[{in:["0","0","3","4"]},{in:["1","2","1","2"]},{in:["-1","5","2","1"]},{in:["7","7","0","0"]}],
muss:[[/class\s+Punkt\b/,"Schreib eine Klasse Punkt."],[/public\s+boolean\s+equals\s*\(\s*Object\s+\w+\s*\)/,"Überschreibe public boolean equals(Object o) – der Parameter muss Object sein!"]],
tipp:"In equals zuerst prüfen: `if (!(o instanceof Punkt)) return false;`, dann casten: `Punkt p = (Punkt) o;` und `return x == p.x && y == p.y;`. Verschoben heißt um (x2, y2), also `p1.verschiebe(x2, y2)`. `==` vergleicht bei Objekten nur, ob es **dasselbe** Objekt ist.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int x1 = Integer.parseInt(IO.readln(\"? x1: \"));\n  int y1 = Integer.parseInt(IO.readln(\"? y1: \"));\n  int x2 = Integer.parseInt(IO.readln(\"? x2: \"));\n  int y2 = Integer.parseInt(IO.readln(\"? y2: \"));\n  Punkt p1 = new Punkt(x1, y1);\n  Punkt p2 = new Punkt(x2, y2);\n  IO.println(\"P1 = \" + p1 + \", P2 = \" + p2);\n  IO.println(\"P1 == P2: \" + (p1 == p2));\n  IO.println(\"P1.equals(P2): \" + p1.equals(p2));\n  IO.println(\"Abstand: \" + p1.abstand(p2));\n  Punkt v = p1.verschiebe(x2, y2);\n  IO.println(\"P1 verschoben um (\" + x2 + \", \" + y2 + \"): \" + v);\n  IO.println(\"Gleich wie P2: \" + v.equals(p2));\n}\n\nclass Punkt {\n  private int x;\n  private int y;\n\n  Punkt(int x, int y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  double abstand(Punkt p) {\n    int dx = x - p.x;\n    int dy = y - p.y;\n    return Math.sqrt(dx * dx + dy * dy);\n  }\n\n  Punkt verschiebe(int dx, int dy) {\n    return new Punkt(x + dx, y + dy);\n  }\n\n  @Override\n  public boolean equals(Object o) {\n    if (!(o instanceof Punkt)) {\n      return false;\n    }\n    Punkt p = (Punkt) o;\n    return x == p.x && y == p.y;\n  }\n\n  @Override\n  public String toString() {\n    return \"(\" + x + \", \" + y + \")\";\n  }\n}"});

add(L3,{id:"lt3_fahrzeuge", titel:"Fahrzeuge & Maut", kurz:"super.methode(), toString-Kette, Überschreiben mit Rückgriff auf die Oberklasse",
aufgabe:"Klasse `Fahrzeug` mit `protected String kennzeichen`, Konstruktor, `double maut(int km)` → `km * 0.1` und `public String toString()` → das Kennzeichen.\n`Auto extends Fahrzeug`: zusätzlich `boolean elektro`; Maut wie Fahrzeug, bei Elektro **die Hälfte** (mit `super.maut(km)`); toString → `Auto S-123 (Elektro)` bzw. `Auto S-123`.\n`Lkw extends Fahrzeug`: zusätzlich `int achsen`; Maut = `super.maut(km) * achsen`; toString → `LKW W-77 (4 Achsen)`. Beide toString verwenden `super.toString()`.\nIn main: `? Anzahl: ` (1–5, sonst `Ungueltige Anzahl!`), dann je Fahrzeug `? Typ (a/l): `, `? Kennzeichen: ` und `? Elektro (j/n): ` bzw. `? Achsen: `. Danach `? Strecke[km]: ` und für jedes Fahrzeug `Auto S-123: 5.0 Euro`, zum Schluss `Summe: … Euro`.\nBei einem anderen Typ als a/l: `Unbekannter Typ!` und die Frage wird wiederholt.",
start:KLASSE,
tests:[{in:["2","a","S-123","n","l","W-77","4","100"]},{in:["1","a","E-1","j","30"]},{in:["3","l","L-1","2","x","a","A-1","j","a","A-2","n","250"]},{in:["0"]},{in:["6"]}],
muss:[[/class\s+Auto\s+extends\s+Fahrzeug/,"Auto erbt von Fahrzeug."],[/class\s+Lkw\s+extends\s+Fahrzeug/,"Lkw erbt von Fahrzeug."],[/super\.maut\s*\(/,"Nutze in den Unterklassen super.maut(km)."],[/super\.toString\s*\(\s*\)/,"Nutze super.toString() für das Kennzeichen."]],
tipp:"`super.maut(km)` ruft die Version aus Fahrzeug auf – ohne `super.` würde sich die Methode selbst aufrufen (Endlosrekursion!). In main reicht `f.maut(km)` – Java nimmt automatisch die richtige Version.",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  int n = Integer.parseInt(IO.readln(\"? Anzahl: \"));\n  if (n < 1 || n > 5) {\n    IO.println(\"Ungueltige Anzahl!\");\n    return;\n  }\n  Fahrzeug[] flotte = new Fahrzeug[n];\n  for (int i = 0; i < n; i++) {\n    String typ = IO.readln(\"? Typ (a/l): \");\n    while (!typ.equals(\"a\") && !typ.equals(\"l\")) {\n      IO.println(\"Unbekannter Typ!\");\n      typ = IO.readln(\"? Typ (a/l): \");\n    }\n    String kz = IO.readln(\"? Kennzeichen: \");\n    if (typ.equals(\"a\")) {\n      boolean e = IO.readln(\"? Elektro (j/n): \").equals(\"j\");\n      flotte[i] = new Auto(kz, e);\n    } else {\n      int achsen = Integer.parseInt(IO.readln(\"? Achsen: \"));\n      flotte[i] = new Lkw(kz, achsen);\n    }\n  }\n  int km = Integer.parseInt(IO.readln(\"? Strecke[km]: \"));\n  double summe = 0;\n  for (Fahrzeug f : flotte) {\n    double m = f.maut(km);\n    IO.println(f + \": \" + m + \" Euro\");\n    summe += m;\n  }\n  IO.println(\"Summe: \" + summe + \" Euro\");\n}\n\nclass Fahrzeug {\n  protected String kennzeichen;\n\n  Fahrzeug(String kennzeichen) {\n    this.kennzeichen = kennzeichen;\n  }\n\n  double maut(int km) {\n    return km * 0.1;\n  }\n\n  public String toString() {\n    return kennzeichen;\n  }\n}\n\nclass Auto extends Fahrzeug {\n  private boolean elektro;\n\n  Auto(String kennzeichen, boolean elektro) {\n    super(kennzeichen);\n    this.elektro = elektro;\n  }\n\n  @Override\n  double maut(int km) {\n    if (elektro) {\n      return super.maut(km) / 2;\n    }\n    return super.maut(km);\n  }\n\n  @Override\n  public String toString() {\n    return \"Auto \" + super.toString() + (elektro ? \" (Elektro)\" : \"\");\n  }\n}\n\nclass Lkw extends Fahrzeug {\n  private int achsen;\n\n  Lkw(String kennzeichen, int achsen) {\n    super(kennzeichen);\n    this.achsen = achsen;\n  }\n\n  @Override\n  double maut(int km) {\n    return super.maut(km) * achsen;\n  }\n\n  @Override\n  public String toString() {\n    return \"LKW \" + super.toString() + \" (\" + achsen + \" Achsen)\";\n  }\n}"});

fehler(L3,{id:"lt3_fehler_vererbung", titel:"Fehler finden · Vererbung", kurz:"super(…), private in der Oberklasse, toString-Zugriff, @Override", n:4,
aufgabe:"Gewünschte Ausgabe:\n`Mitarbeiter Anna, Gehalt 3000.0`\n`Chefin Eva, Gehalt 5500.0 (Bonus 1500.0)`\n`Gesamt: 8500.0`",
start:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  Mitarbeiter[] team = { new Mitarbeiter(\"Anna\", 3000), new Chef(\"Eva\", 4000, 1500) };\n  double gesamt = 0;\n  for (Mitarbeiter m : team) {\n    IO.println(m);\n    gesamt += m.gehalt();\n  }\n  IO.println(\"Gesamt: \" + gesamt);\n}\n\nclass Mitarbeiter {\n  private String name;\n  protected double grundgehalt;\n\n  Mitarbeiter(String name, double grundgehalt) {\n    this.name = name;\n    this.grundgehalt = grundgehalt;\n  }\n\n  double gehalt() {\n    return grundgehalt;\n  }\n\n  String toString() {\n    return \"Mitarbeiter \" + name + \", Gehalt \" + gehalt();\n  }\n}\n\nclass Chef extends Mitarbeiter {\n  private double bonus;\n\n  Chef(String name, double grundgehalt, double bonus) {\n    this.bonus = bonus;\n  }\n\n  @Override\n  double Gehalt() {\n    return grundgehalt + bonus;\n  }\n\n  @Override\n  public String toString() {\n    return \"Chefin \" + name + \", Gehalt \" + gehalt() + \" (Bonus \" + bonus + \")\";\n  }\n}",
tests:[{}],
tipp:"1) `toString()` muss `public` sein (in Object ist es public, beim Überschreiben darf man nicht weniger erlauben). 2) Der Chef-Konstruktor muss als Erstes `super(name, grundgehalt);` aufrufen – Mitarbeiter hat keinen Konstruktor ohne Parameter. 3) `Gehalt` statt `gehalt` → @Override meldet, dass nichts überschrieben wird. 4) `name` ist in Mitarbeiter private → in Chef nicht sichtbar: `protected` machen (oder einen Getter verwenden).",
loesung:"// Vorname Nachname, Matrikelnummer\n\nvoid main() {\n  Mitarbeiter[] team = { new Mitarbeiter(\"Anna\", 3000), new Chef(\"Eva\", 4000, 1500) };\n  double gesamt = 0;\n  for (Mitarbeiter m : team) {\n    IO.println(m);\n    gesamt += m.gehalt();\n  }\n  IO.println(\"Gesamt: \" + gesamt);\n}\n\nclass Mitarbeiter {\n  protected String name;\n  protected double grundgehalt;\n\n  Mitarbeiter(String name, double grundgehalt) {\n    this.name = name;\n    this.grundgehalt = grundgehalt;\n  }\n\n  double gehalt() {\n    return grundgehalt;\n  }\n\n  public String toString() {\n    return \"Mitarbeiter \" + name + \", Gehalt \" + gehalt();\n  }\n}\n\nclass Chef extends Mitarbeiter {\n  private double bonus;\n\n  Chef(String name, double grundgehalt, double bonus) {\n    super(name, grundgehalt);\n    this.bonus = bonus;\n  }\n\n  @Override\n  double gehalt() {\n    return grundgehalt + bonus;\n  }\n\n  @Override\n  public String toString() {\n    return \"Chefin \" + name + \", Gehalt \" + gehalt() + \" (Bonus \" + bonus + \")\";\n  }\n}"});

vor(L3,{id:"lt3_v_poly", titel:"Vorhersage · Polymorphismus", kurz:"Dynamisches Binden vs. Überladen, super.methode()",
code:String.raw`void main() {
  Tier t = new Hund();
  Hund h = new Hund();
  IO.println(t.laut());
  IO.println(t.info());
  IO.println(beschreibe(t));
  IO.println(beschreibe(h));
  Tier[] alle = { new Tier(), h, new Welpe() };
  for (Tier x : alle) IO.print(x.laut() + " ");
  IO.println();
}

String beschreibe(Tier t) { return "ein Tier"; }
String beschreibe(Hund h) { return "ein Hund"; }

class Tier {
  String laut() { return "..."; }
  String info() { return "Ich sage " + laut(); }
}
class Hund extends Tier {
  @Override String laut() { return "Wuff"; }
}
class Welpe extends Hund {
  @Override String laut() { return super.laut() + "chen"; }
}`,
erkl:"`t` hat den Typ Tier, zeigt aber auf einen **Hund**. Bei überschriebenen Methoden entscheidet das echte Objekt (dynamisches Binden) → **Wuff**. Auch `info()` (nur in Tier) ruft intern `laut()` auf – wieder die Hund-Version → **Ich sage Wuff**. Beim **Überladen** (zwei Methoden `beschreibe`) entscheidet dagegen der **Variablentyp** beim Kompilieren: `beschreibe(t)` → t ist als Tier deklariert → **ein Tier**; `beschreibe(h)` → **ein Hund**. Im Array: Tier → `...`, Hund → `Wuff`, Welpe → `super.laut()` ist die Hund-Version, + \"chen\" → **... Wuff Wuffchen ** (mit Leerzeichen am Ende).",
tipp:"Überschreiben: das Objekt entscheidet (zur Laufzeit). Überladen: der Typ der Variablen entscheidet (beim Kompilieren)."});

vor(L3,{id:"lt3_v_konstruktor", titel:"Vorhersage · Konstruktor-Reihenfolge", kurz:"super() zuerst, this(…), static-Zähler",
code:String.raw`void main() {
  B b1 = new B();
  IO.println("---");
  B b2 = new B(7);
  IO.println("---");
  IO.println(A.zaehler + " " + b1.x + " " + b2.x);
}

class A {
  static int zaehler = 0;
  int x = 1;
  A() {
    zaehler++;
    IO.println("A() x=" + x);
  }
}
class B extends A {
  B() {
    this(2);
    IO.println("B()");
  }
  B(int x) {
    this.x = x * 10;
    IO.println("B(int) x=" + this.x);
  }
}`,
erkl:"`new B()` ruft zuerst `this(2)` auf, also den Konstruktor `B(int)`. Der hat kein super(…), also ruft Java automatisch **zuerst super()** auf: `A()` läuft, x ist dort noch 1 → **A() x=1**. Danach geht es in B(int) weiter: x = 20 → **B(int) x=20**, dann zurück in B() → **B()**. Bei `new B(7)`: wieder zuerst A() → **A() x=1**, dann **B(int) x=70** (B() läuft hier nicht!). `zaehler` ist static, also **einer für alle** Objekte → 2. Letzte Zeile: **2 20 70**.",
tipp:"Der Oberklassen-Konstruktor läuft immer zuerst – auch wenn kein super() dasteht."});

vor(L3,{id:"lt3_v_referenzen", titel:"Vorhersage · Objekte & Referenzen", kurz:"Zwei Variablen, ein Objekt; Objekte an Methoden übergeben",
code:String.raw`void main() {
  Zaehler a = new Zaehler();
  Zaehler b = a;
  b.erhoehe();
  a.erhoehe();
  IO.println(a.wert + " " + b.wert);
  Zaehler c = new Zaehler();
  aendere(c);
  IO.println(c.wert);
  ersetze(c);
  IO.println(c.wert);
  IO.println((a == b) + " " + (a == c));
  Zaehler[] z = new Zaehler[2];
  IO.println(z[0]);
  z[1] = c;
  z[1].erhoehe();
  IO.println(c.wert);
}

void aendere(Zaehler z) { z.wert = 100; }
void ersetze(Zaehler z) { z = new Zaehler(); z.wert = 5; }

class Zaehler {
  int wert = 0;
  void erhoehe() { wert++; }
}`,
erkl:"`b = a` kopiert nur die Referenz – a und b sind **dasselbe** Objekt. Es wird zweimal erhöht → **2 2**. `aendere(c)` bekommt eine Kopie der Referenz und ändert damit das echte Objekt → **100**. `ersetze(c)` lässt seine lokale Variable auf ein **neues** Objekt zeigen – c in main zeigt weiter auf das alte → **100**. `a == b` → true, `a == c` → false → **true false**. Ein neues Objekt-Array enthält nur `null` → **null**. `z[1]` und `c` zeigen auf dasselbe Objekt → **101**.",
tipp:"Java übergibt immer eine Kopie – bei Objekten eine Kopie der Adresse. Ändern übers Objekt wirkt, neu zuweisen nicht."});

Array.prototype.push.apply(UEBUNG.aufgaben, X);
var gi=0; UEBUNG.gruppen.forEach(function(g,i){ if(g[0]==="lt1") gi=i+1; });
UEBUNG.gruppen.splice(gi,0,
  [L2,"Livetest 2 (PS-Stil)","Bis inkl. Arrays: while, do-while, for, for-each, Methoden, Strings, ein- und zweidimensionale Arrays"],
  [L3,"Livetest 3 (PS-Stil)","Bis inkl. Objektorientierung: Klassen, Objekte, Konstruktoren, Vererbung, abstract, Polymorphismus, equals/toString"]);
})();
