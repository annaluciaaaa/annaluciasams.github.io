/* Einführung in die Programmierung (Java) – Inhalte nach den Folien Teil I (Naderlinger/Resmerita, Folien: Hagenauer), WS 2026/27
   Java 25 mit kompakter Syntax: void main() { … } und IO.println(…) */
window.FACH = window.FACH || {};
FACH.java = {
  name: "Programmieren in Java",
  kurz: "Java",
  sub: "Einführung in die Programmierung – Teil I (Kapitel 1–4)",
  hinweis: "Die Vorlesung verwendet Java 25 mit kompakter Syntax: Ein Programm beginnt mit void main() { … } und gibt mit IO.println(…) aus. Klassen kommen erst später.",
  themen: [

  /* ---------------------------------------------------------- */
  { id: "erstes", name: "Erstes Programm", quelle: "Folien Kap. 1 (S. 3–11)",
    terms: [
      ["void main()", "Startpunkt jedes einfachen Programms (main-Methode). Darin stehen Deklarationen und Anweisungen.", "void main() { IO.println(\"Hallo\"); }"],
      ["Quellcode, .java-Datei", "Der Programmtext wird mit einem Editor geschrieben und als Datei mit Endung .java gespeichert. Programmname = Dateiname.", "Kreis.java"],
      ["Programm ausführen", "Im Verzeichnis der Datei: java Kreis.java – startet die Java-Umgebung und übergibt ihr die Programmdatei."],
      ["Compiler", "Spezielles Programm, das Quellcode (.java) in Bytecode (.class) übersetzt (kompiliert)."],
      ["Bytecode", "Maschinencode für einen „virtuellen“ Prozessor, gespeichert in .class-Dateien."],
      ["JVM (Java Virtual Machine)", "Virtuelle Maschine (ein spezielles Programm), die auf dem realen Prozessor läuft und den Bytecode ausführt."],
      ["Anweisung und ;", "Deklarationen und Anweisungen werden jeweils mit ; abgeschlossen."],
      ["Block { … }", "Blöcke werden in Java mit geschweiften Klammern gekennzeichnet."],
      ["Bezeichner (Namen, identifier)", "Benennen Variablen, Konstanten, Methoden, … Bestehen aus Buchstaben, Ziffern, _ und $. Das erste Zeichen darf keine Ziffer sein. Groß-/Kleinschreibung wird unterschieden!", "erlaubt: radius, m2n, all_Numbers – nicht erlaubt: 5ter, my prog, sbg-wien, private"],
      ["Schlüsselwörter (reservierte Wörter)", "Fest definierte Bezeichner, die man nicht als eigene Namen verwenden darf.", "void, final, if, while, private"],
      ["Zahlen im Programm", "Ganze Zahlen (5, 815) und Gleitkommazahlen mit Dezimalpunkt (3.14, 0.35)."],
      ["Zeilenkommentar //", "Reicht bis zum Ende der Zeile."],
      ["Blockkommentar /* … */", "Kann sich über mehrere Zeilen erstrecken."],
      ["Kommentare allgemein", "Fügen Erläuterungen hinzu, haben keine Auswirkung auf den Programmablauf."]
    ],
    quiz: [
      {q:"Welche Bezeichner sind in Java erlaubt?", o:["radius","5ter","all_Numbers","sbg-wien","m2n","private"], c:[0,2,4],
       e:"Bezeichner bestehen aus Buchstaben, Ziffern, _ und $, beginnen nicht mit einer Ziffer und sind keine Schlüsselwörter. 5ter beginnt mit einer Ziffer, sbg-wien enthält ein Minus, private ist reserviert."},
      {q:"Sind min und Min derselbe Bezeichner?", o:["Nein, Java unterscheidet Groß- und Kleinschreibung","Ja","Nur bei Variablen","Nur bei Konstanten"], c:[0],
       e:"Java ist case-sensitive: min, Min und MIN sind drei verschiedene Namen."},
      {q:"Was erzeugt der Java-Compiler?", o:["Bytecode in einer .class-Datei","Eine .java-Datei","Maschinencode nur für Windows","Den Quellcode"], c:[0],
       e:"Editor → Kreis.java (Quellcode) → Compiler → Kreis.class (Bytecode) → JVM führt ihn auf dem realen Prozessor aus."},
      {q:"Was ist die JVM?", o:["Eine virtuelle Maschine, die Bytecode auf dem realen Prozessor ausführt","Ein Editor","Der Compiler","Eine Programmiersprache"], c:[0],
       e:"JVM = Java Virtual Machine: ein spezielles Programm, Input ist die class-Datei, Output sind die Ergebnisse."},
      {q:"Womit beginnt ein einfaches Java-Programm in der Vorlesung?", o:["void main() { … }","main();","start() { … }","program Kreis;"], c:[0],
       e:"Jedes einfache Programm hat eine main-Methode als Startpunkt. Mit der kompakten Syntax (Java 25) reicht void main()."},
      {q:"Welche sind gültige Kommentare in Java?", o:["// bis Zeilenende","/* über mehrere Zeilen */","# Kommentar","<!-- Kommentar -->"], c:[0,1],
       e:"Java hat Zeilenkommentare (//) und Blockkommentare (/* … */). # und <!-- --> gibt es in anderen Sprachen."},
      {q:"Womit werden Anweisungen in Java abgeschlossen?", o:["Mit ;","Mit einem Zeilenumbruch","Mit .","Mit }"], c:[0],
       e:"Jede Deklaration und Anweisung endet mit einem Strichpunkt. Ein fehlendes ; ist ein typischer Syntaxfehler."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "variablen", name: "Variablen, Zuweisungen & Konstanten", quelle: "Folien Kap. 2 (S. 12–26)",
    terms: [
      ["Variable", "„Behälter“ mit Namen und Typ zum Speichern von Daten. Kann immer nur einen Wert des vereinbarten Typs speichern."],
      ["Deklaration", "Legt Typ und Namen fest und reserviert Speicher. Muss vor der ersten Verwendung passieren.", "double radius;  int k, n;"],
      ["Typ", "Bestimmt, welche Werte gespeichert werden können (Wertebereich) – „keine Addition von Äpfeln und Birnen“. Java prüft das."],
      ["int, long, double", "int: ganze Zahlen, 4 Byte (−2³¹ … 2³¹−1). long: ganze Zahlen, 8 Byte. double: Gleitkommazahlen, 8 Byte."],
      ["Numerale für ganze Zahlen", "Ziffernfolge ohne Leerzeichen, optional mit + oder −.", "4711, −25343"],
      ["Numerale für Gleitkommazahlen", "Mit Dezimalpunkt (verpflichtend!) oder wissenschaftlicher Notation mit e/E.", "1.0, −25.47, 2.5E4, 1e-3"],
      ["18 vs. 18.0", "Mathematisch gleich, aber verschiedene Typen (int bzw. double)."],
      ["Zuweisung", "variable = expression; – zuerst wird die rechte Seite ausgewertet, dann der Wert links gespeichert. Der alte Wert wird überschrieben. Das ist KEINE mathematische Gleichung!", "n = n + 1;"],
      ["Zuweisungskompatibilität", "Erlaubt, wenn beide Typen gleich sind oder der Typ rechts in dieser Liste weiter links steht: byte → short → int → long → float → double.", "double x = 5; ✓   int n = 4.27; ✗"],
      ["Initialisierung", "Deklaration mit Anfangswert. Variablen dürfen erst gelesen werden, wenn sie einen Wert haben – guter Stil: immer initialisieren.", "int sum = 0;"],
      ["Konstante (final)", "final type NAME = expression; – initialisierte Variable, deren Wert sich nicht mehr ändern lässt. Namen laut Konvention in Großbuchstaben.", "final double PI = 3.14159;"],
      ["Syntax", "Regelwerk für den korrekten Aufbau von Programmen. Die Menge aller Syntaxregeln heißt Grammatik."],
      ["Semantik", "Die Bedeutung (Wirkung bei der Ausführung) von syntaktisch korrekten Programmteilen."]
    ],
    quiz: [
      {q:"int n; double x; Welche Zuweisungen sind erlaubt?", o:["n = 11;","n = 4.27;","x = 2 * n + 1;","n = x - 0.5;"], c:[0,2],
       e:"int → double ist erlaubt (int steht in der Liste weiter links). double → int ist NICHT erlaubt, weil Nachkommastellen verloren gehen würden – auch nicht bei 4.27."},
      {q:"Welchen Wert hat n am Ende?", code:"int n;\nn = 11;\nn = n + 1;\nn = n * n + 5;", o:["149","126","12","121"], c:[0],
       e:"n = 11, dann 12, dann 12·12 + 5 = 149. Jede Zuweisung rechnet mit dem aktuellen Wert und überschreibt ihn."},
      {q:"Welchen Wert hat x am Ende?", code:"double x = 15.1;\nx = x * 1.8 + 32.0;", o:["59.18","15.1","47.1","27.18"], c:[0],
       e:"15.1 · 1.8 = 27.18, plus 32.0 = 59.18 (Celsius → Fahrenheit)."},
      {q:"Was passiert hier?", code:"final double PI = 3.14159;\nPI = 3.0;", o:["Compilerfehler – eine final-Konstante kann nicht geändert werden","PI hat danach den Wert 3.0","Laufzeitfehler","PI hat danach den Wert 3.14159, die Zeile wird ignoriert"], c:[0],
       e:"final bedeutet: Der Wert wird einmal festgelegt und ist danach unveränderlich. Der Compiler meldet den Fehler."},
      {q:"Welche Zuweisungen sind laut Zuweisungskompatibilität erlaubt?", o:["long l = 5;","double d = 7;","float f = 2.5;","int i = 5L;"], c:[0,1],
       e:"5 (int) → long ✓, 7 (int) → double ✓. 2.5 ist ein double-Numeral, und double steht RECHTS von float → nicht erlaubt. 5L ist ein long → int nicht erlaubt."},
      {q:"Welchen Wert und Typ hat das Numeral 2e3?", o:["2000.0 (double)","2000 (int)","6 (int)","8.0 (double)"], c:[0],
       e:"2e3 = 2 · 10³ in wissenschaftlicher Notation – das ist immer ein Gleitkomma-Numeral (double)."},
      {q:"Was beschreibt die Semantik einer Zuweisung?", o:["Berechne den Ausdruck rechts und weise das Ergebnis der Variablen links zu","Dass links eine Variable, dann =, dann ein Ausdruck stehen muss","Dass beide Seiten gleich sein müssen","Dass ein ; am Ende steht"], c:[0],
       e:"Semantik = Bedeutung/Wirkung. Die Form „variable = expression;“ ist dagegen die Syntax."},
      {q:"Welche Variablen sind nach dieser Zeile initialisiert?", code:"int eins = 2, zwei;", o:["Nur eins","eins und zwei","Nur zwei","Keine"], c:[0],
       e:"Nur eins bekommt einen Anfangswert. zwei ist deklariert, darf aber noch nicht gelesen werden."},
      {q:"Welche Werte haben a und b am Ende?", code:"int a = 1, b = 2;\na = b;\nb = a;", o:["a = 2, b = 2","a = 2, b = 1","a = 1, b = 2","a = 1, b = 1"], c:[0],
       e:"Nach a = b ist a = 2 – der alte Wert 1 ist überschrieben. b = a setzt b auf 2. Zum Tauschen braucht man eine Hilfsvariable (siehe Programm WertTausch): int h = a; a = b; b = h;"}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "ausdruecke", name: "Arithmetische Ausdrücke", quelle: "Folien Kap. 2 (S. 18–20)",
    terms: [
      ["Arithmetischer Ausdruck", "Berechnet mit Operatoren einen Zahlenwert aus Variablen und Konstanten."],
      ["Binäre Operatoren + − * /", "Es gilt Punkt- vor Strichrechnung (*, / vor +, −). Nur runde Klammern heben das auf."],
      ["Links-assoziativ", "Gleichrangige Operatoren werden von links nach rechts ausgewertet.", "3 − 5 + 2 − 4 = −4"],
      ["Unäre Operatoren + −", "Vorzeichen, beziehen sich auf einen Operanden und binden stärker als die binären Operatoren.", "5 + −2 = 3, −(5 + 2) = −7"],
      ["Ganzzahlige Division", "Wenn beide Operanden ganzzahlig sind, ist das Ergebnis ganzzahlig: Nachkommastellen werden abgeschnitten – NICHT gerundet!", "5 / 3 = 1, 23 / 5 = 4, 5 / 10 = 0, −7 / 3 = −2"],
      ["Modulus-Operator %", "Rest bei der Division, gleiche Priorität wie * und /. Es gilt a % b = a − (a / b) * b.", "5 % 3 = 2, 12 % 2 = 0, −5 % 3 = −2"]
    ],
    quiz: [
      {q:"Was ergibt 3 - 5 + 2 - 4?", o:["−4","−8","0","4"], c:[0],
       e:"Links-assoziativ: (((3 − 5) + 2) − 4) = (−2 + 2) − 4 = −4."},
      {q:"Was ergibt 3 - (5 + (2 - 4))?", o:["0","−4","−8","6"], c:[0],
       e:"Innen beginnen: 2 − 4 = −2, 5 + (−2) = 3, 3 − 3 = 0."},
      {q:"Was ergibt 3 + 5 * 2?", o:["13","16","10","11"], c:[0],
       e:"Punkt vor Strich: 5 * 2 = 10, dann 3 + 10 = 13. (3 + 5) * 2 wäre 16."},
      {q:"Was ergibt 23 / 5 (beide int)?", o:["4","4.6","5","3"], c:[0],
       e:"Ganzzahlige Division: 4.6 wird abgeschnitten → 4. Es wird nicht auf 5 gerundet."},
      {q:"Was ergibt -7 / 3?", o:["−2","−3","−2.33","2"], c:[0],
       e:"−7 / 3 = −2.33…, abgeschnitten (Richtung 0) → −2. Nicht −3!"},
      {q:"Was ergibt -5 % 3?", o:["−2","1","2","−1"], c:[0],
       e:"a % b = a − (a / b) * b = −5 − (−1) * 3 = −5 + 3 = −2. Das Vorzeichen des Rests folgt dem linken Operanden."},
      {q:"Was ergibt 7 - 15 % 4?", o:["4","−2","0","3"], c:[0],
       e:"% hat die gleiche Priorität wie * und / – also zuerst 15 % 4 = 3, dann 7 − 3 = 4."},
      {q:"Was ergibt 5 / 10 (beide int)?", o:["0","0.5","1","Fehler"], c:[0],
       e:"0.5 wird abgeschnitten → 0. Ein typischer Fallstrick!"},
      {q:"Was ergibt 5 + -2?", o:["3","7","−3","Compilerfehler"], c:[0],
       e:"Das unäre − bindet stärker: 5 + (−2) = 3. Das ist erlaubter Java-Code."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "io", name: "Ein-/Ausgabe & Algorithmen", quelle: "Folien Kap. 2 (S. 27–33)",
    terms: [
      ["IO.println(argument)", "Ausgabe MIT Zeilenumbruch danach."],
      ["IO.print(argument)", "Ausgabe OHNE Zeilenumbruch."],
      ["IO.println()", "Nur ein Zeilenumbruch."],
      ["String-Literal \"…\"", "Zeichenketten werden in doppelte Hochkommas geschrieben."],
      ["Konkatenation mit +", "Verknüpft Strings und Variablenwerte. Der Wert einer Variablen wird dabei in einen String umgewandelt.", "IO.println(\"Umfang = \" + umfang);"],
      ["IO.readln()", "Liest eine Zeile ein und liefert einen String. Mit IO.readln(\"Text\") wird gleichzeitig eine Eingabeaufforderung ausgegeben."],
      ["Integer.parseInt / Double.parseDouble", "Wandelt einen eingelesenen String in eine Zahl um.", "int a = Integer.parseInt(eingabe);"],
      ["System.out.println", "Die klassische Standardausgabe von Java – macht dasselbe wie IO.println."],
      ["Algorithmus", "Schrittweises, präzises Verfahren zur Lösung eines Problems: eine eindeutige und vollständige Folge von (elementaren) Operationen."],
      ["Darstellungsformen", "Natürliche Sprache (Kochrezept), grafisch (Möbelanleitung), Pseudocode, Mischformen."],
      ["Schrittweise Verfeinerung", "Präzise Algorithmen entstehen, indem man immer mehr Details beachtet."],
      ["Problem → Programm", "Problem → Spezifikation (was wird gesucht?) → Algorithmus (Lösungsverfahren) → Programmierung → Programm."],
      ["Fallbeispiel Wechselgeld", "Betrag in Cent als int speichern (exakt, schneller). Mit / die Anzahl der größten Münze berechnen, mit % den Restbetrag, dann zur nächstkleineren Münze."]
    ],
    quiz: [
      {q:"Was liefert IO.readln()?", o:["Einen String","Einen int","Einen double","Nichts"], c:[0],
       e:"Es wird immer eine Zeichenkette gelesen. Für Zahlen muss man umwandeln, z. B. mit Integer.parseInt."},
      {q:"Wie wandelt man den eingelesenen String eingabe in eine ganze Zahl um?", o:["Integer.parseInt(eingabe)","(int) eingabe","Double.parseDouble(eingabe)","eingabe.toInt()"], c:[0],
       e:"Integer.parseInt liefert einen int-Wert. Double.parseDouble liefert einen double. Ein Cast (int) funktioniert bei Strings nicht."},
      {q:"Was wird ausgegeben?", code:"IO.print(\"a\");\nIO.println(\"b\");\nIO.print(\"c\");", o:["ab, Zeilenumbruch, c","a, Zeilenumbruch, b, Zeilenumbruch, c","abc","a, Zeilenumbruch, bc"], c:[0],
       e:"print gibt ohne Zeilenumbruch aus, println mit Zeilenumbruch NACH der Ausgabe. Also „ab“, dann neue Zeile, dann „c“."},
      {q:"Wechselgeld: Welche Werte haben zweiE und betragCent danach?", code:"int betragCent = 375;\nint zweiE = betragCent / 200;\nbetragCent = betragCent % 200;", o:["zweiE = 1, betragCent = 175","zweiE = 1.875, betragCent = 0","zweiE = 2, betragCent = 0","zweiE = 1, betragCent = 375"], c:[0],
       e:"375 / 200 = 1 (ganzzahlig), 375 % 200 = 175 Cent bleiben für die kleineren Münzen übrig."},
      {q:"Warum wird beim Wechselgeld-Beispiel in Cent (int) statt in Euro (double) gerechnet?", o:["Ganzzahlige Rechnung ist exakt und meist schneller","Weil double keine Kommazahlen kann","Weil IO.println keine double-Werte ausgeben kann","Weil es weniger Variablen braucht"], c:[0],
       e:"Gleitkommazahlen haben Rundungsfehler (vgl. 0.1 im Binärsystem). Mit ganzen Cent-Beträgen sind alle Ergebnisse exakt."},
      {q:"Was ist ein Algorithmus laut Vorlesung?", o:["Ein schrittweises, präzises Verfahren zur Lösung eines Problems","Ein Java-Programm","Eine Programmiersprache","Eine Fehlermeldung des Compilers"], c:[0],
       e:"Ein Algorithmus legt eine eindeutige und vollständige Folge von Operationen fest. Ein Programm ist die Umsetzung eines Algorithmus in einer Programmiersprache."},
      {q:"In welcher Reihenfolge entsteht ein Programm?", o:["Problem → Spezifikation → Algorithmus → Programm","Programm → Algorithmus → Spezifikation → Problem","Problem → Programm → Algorithmus → Spezifikation","Spezifikation → Problem → Programm → Algorithmus"], c:[0],
       e:"Zuerst das Problem genau beschreiben (Spezifikation), dann ein Lösungsverfahren entwickeln (Algorithmus), dann programmieren."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "ifwhile", name: "if-Anweisung & while-Schleife", quelle: "Folien Kap. 3–4 (S. 34–41, 61–64)",
    terms: [
      ["if-Anweisung (Verzweigung)", "if (boolean_expression) statement_1 else statement_2 – ist die Bedingung true, wird statement_1 ausgeführt, sonst statement_2. Der else-Zweig kann fehlen."],
      ["Anweisungsblock", "Statt einer einzelnen Anweisung kann ein Block {…} stehen. Einrücken verbessert die Lesbarkeit."],
      ["Vergleichsoperatoren", "== gleich, != ungleich, >, >=, <, <=. Ergebnis ist true oder false. Sie binden schwächer als arithmetische Operatoren."],
      ["= vs. ==", "= ist eine Zuweisung, == ein Vergleich.", "if (a = 0) … ist ein Compilerfehler!"],
      ["Flussdiagramm", "Grafische Darstellung des Ablaufs mit Bedingungen und Anweisungen."],
      ["Geschachtelte if-Anweisungen", "Die Teile einer if-Anweisung können selbst wieder if-Anweisungen sein.", "Maximum von 3 Zahlen"],
      ["Dangling else", "Regel: Ein else gehört immer zum textuell letzten freien if im selben Block. Soll es zum äußeren if gehören, braucht man { }."],
      ["if-Kaskade / else if", "Mehrfachverzweigung: Es wird die erste erfüllte Bedingung ausgeführt.", "if (punkte > 21) note = 1; else if (punkte > 18) note = 2; …"],
      ["Schleife (loop)", "Wiederholt Anweisungen, bis eine Bedingung nicht mehr gilt."],
      ["while-Schleife", "while (boolean_expression) body – solange die Schleifenbedingung true ist, wird der Schleifenrumpf (body) ausgeführt."],
      ["Iteration", "Ein einzelner Durchlauf des Schleifenrumpfs."],
      ["Abweisende Schleife", "Die while-Schleife kann 0-mal durchlaufen werden (Bedingung wird VOR jedem Durchlauf geprüft). Nach der Schleife gilt die Bedingung nicht mehr."],
      ["ggT – Differenzalgorithmus", "Die kleinere von der größeren Zahl abziehen, bis beide gleich sind – das ist der ggT."]
    ],
    quiz: [
      {q:"Welchen Wert hat erg danach (a = 1, b = 2, erg vorher 0)?", code:"if (a >= b)\n  if (a > 0)\n    erg = a;\nelse\n  erg = b;", o:["0 (unverändert)","2","1","Compilerfehler"], c:[0],
       e:"Dangling else: Das else gehört zum LETZTEN freien if, also zu if (a > 0) – egal wie es eingerückt ist. Da a >= b falsch ist, wird gar nichts ausgeführt. Damit else zum ersten if gehört, braucht man { } um das innere if."},
      {q:"Was passiert bei if (a = 0) a = a + 1; (a ist int)?", o:["Compilerfehler","a wird 1","Die Bedingung ist immer false","Laufzeitfehler"], c:[0],
       e:"= ist eine Zuweisung und liefert keinen boolean-Wert. Für den Vergleich braucht man ==."},
      {q:"Welchen Wert hat sum am Ende (n = 4)?", code:"int sum = 0;\nint i = 1;\nwhile (i <= n) {\n  sum = sum + i;\n  i = i + 1;\n}", o:["10","6","15","4"], c:[0],
       e:"sum = 1 + 2 + 3 + 4 = 10. Danach ist i = 5 und die Bedingung i <= 4 ist false."},
      {q:"ggT nach dem Differenzalgorithmus: Welchen Wert liefert ggt(12, 18)?", code:"int ggt(int a, int b){\n  while (a != b)\n    if (a > b)\n      a = a - b;\n    else\n      b = b - a;\n  return a;\n}", o:["6","3","12","2"], c:[0],
       e:"(12, 18) → b = 18 − 12 = 6 → (12, 6) → a = 12 − 6 = 6 → (6, 6) → Ende, ggT = 6."},
      {q:"Welche Note ergibt sich für punkte = 19?", code:"if (punkte > 21) note = 1;\nelse if (punkte > 18) note = 2;\nelse if (punkte > 15) note = 3;\nelse if (punkte >= 12) note = 4;\nelse note = 5;", o:["2","1","3","4"], c:[0],
       e:"19 > 21? nein. 19 > 18? ja → note = 2. Die weiteren Bedingungen werden nicht mehr geprüft."},
      {q:"Wie oft kann der Rumpf einer while-Schleife mindestens ausgeführt werden?", o:["0-mal","1-mal","2-mal","Unendlich oft"], c:[0],
       e:"Die Bedingung wird VOR jedem Durchlauf geprüft. Ist sie gleich am Anfang false, wird der Rumpf nie ausgeführt – deshalb „abweisende Schleife“."},
      {q:"int a = 3, b = 5; Welche Ausdrücke sind true?", o:["b != a + 1","a >= b - 2","b < 5","b <= 2 * a"], c:[0,1,3],
       e:"Arithmetik wird zuerst ausgerechnet: 5 != 4 ✓, 3 >= 3 ✓, 5 < 5 ✗, 5 <= 6 ✓."},
      {q:"Was gilt garantiert direkt nach dem Ende einer while-Schleife?", o:["Die Schleifenbedingung ist false","Die Schleife lief mindestens einmal","Alle Variablen sind 0","Die Bedingung ist true"], c:[0],
       e:"Die Schleife endet genau dann, wenn die Bedingung nicht mehr gilt."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "methoden", name: "Methoden", quelle: "Folien Kap. 3 (S. 42–48)",
    terms: [
      ["Methode", "Eine benannte Anweisungsfolge für eine logisch zusammengehörige Teilaufgabe. Kann beliebig oft aufgerufen werden – wichtig zur Strukturierung."],
      ["Methodenkopf / Methodenrumpf", "Kopf: Rückgabetyp (oder void), Name, Parameter in Klammern. Rumpf: Deklarationen und Anweisungen in { }.", "void printHeader() { … }"],
      ["void", "Die Methode liefert keinen Rückgabewert."],
      ["Deklaration & Aufruf", "Methoden werden außerhalb der main-Methode deklariert und über ihren Namen aufgerufen (in main oder in anderen Methoden).", "printHeader();"],
      ["Ablauf eines Aufrufs", "1. Aufruf erreicht, 2. Sprung zur ersten Anweisung der Methode, 3. Abarbeitung, 4. Rückkehr an die Aufrufstelle, 5. Fortsetzung mit der nächsten Anweisung."],
      ["Parameter", "Werden im Methodenkopf deklariert (wie Variablen, mit Komma getrennt). Beim Aufruf wird der übergebene Wert in den Parameter KOPIERT – Reihenfolge wichtig, Typ muss zuweisungskompatibel sein.", "void printSeparator(int anz)"],
      ["Rückgabewert & return", "Statt void steht der Rückgabetyp im Kopf. Der Rumpf braucht mindestens eine return-Anweisung.", "int ggt(int a, int b) { … return a; }"],
      ["Zwei Arten von Aufrufen", "Ohne Rückgabewert: als eigene Anweisung mit ;. Mit Rückgabewert: überall, wo ein Wert dieses Typs stehen darf.", "erg = (2 * ggt(x, 12)) % 3;"],
      ["Lokale Variable", "Innerhalb einer Methode deklariert (auch die Parameter). Nur dort verwendbar, existiert bis zum Ende der Methode."],
      ["Globale Variable", "Außerhalb von Methoden deklariert. In allen Methoden der Datei verwendbar, existiert so lange das Programm läuft."]
    ],
    quiz: [
      {q:"Was gibt printSeparator(3) aus?", code:"void printSeparator(int anz){\n  int i = 1;\n  IO.print(\">\");\n  while (i <= anz){\n    IO.print(\"-\");\n    i = i + 1;\n  }\n  IO.println(\"<\");\n}", o:[">---<",">--<","---",">----<"], c:[0],
       e:"Erst „>“, dann für i = 1, 2, 3 je ein „-“, dann „<“ mit Zeilenumbruch."},
      {q:"double d = 2.0; Was passiert bei printSeparator(d) (Parameter ist int)?", o:["Compilerfehler – double ist nicht zuweisungskompatibel zu int","Es werden 2 Striche ausgegeben","d wird automatisch gerundet","Laufzeitfehler"], c:[0],
       e:"Der übergebene Wert wird in den Parameter kopiert und muss zuweisungskompatibel sein. double → int geht nicht automatisch."},
      {q:"Was liefert ggt(12, 8) mit dem Differenzalgorithmus?", o:["4","8","2","12"], c:[0],
       e:"(12, 8) → a = 4 → (4, 8) → b = 4 → (4, 4) → return 4."},
      {q:"Welchen Wert hat erg?", code:"int erg = (2 * ggt(6, 4)) % 3;", o:["1","4","2","0"], c:[0],
       e:"ggt(6, 4) = 2 (6−4 = 2, 4−2 = 2). 2 * 2 = 4, 4 % 3 = 1. Ein Aufruf mit Rückgabewert kann mitten in einem Ausdruck stehen."},
      {q:"Was muss der Rumpf einer Methode mit Rückgabetyp int enthalten?", o:["Mindestens eine return-Anweisung","Das Wort void","Eine while-Schleife","Einen Aufruf von IO.println"], c:[0],
       e:"return liefert den Ergebniswert an die aufrufende Stelle zurück."},
      {q:"Wo werden Methoden deklariert?", o:["Außerhalb der main-Methode","Innerhalb der main-Methode","In einer eigenen Datei","Nach dem Wort return"], c:[0],
       e:"Methoden stehen neben main (nicht darin) und können von main oder anderen Methoden aufgerufen werden."},
      {q:"Wie lange existiert eine lokale Variable?", o:["Bis die Methode, in der sie deklariert ist, beendet ist","So lange das Programm läuft","Für immer","Bis zum nächsten IO.println"], c:[0],
       e:"Lokale Variablen (auch Parameter) leben nur während der Ausführung ihrer Methode. Globale Variablen existieren, solange das Programm läuft."},
      {q:"Wo wird nach dem Ende einer aufgerufenen Methode weitergemacht?", o:["Direkt nach der Aufrufstelle","Am Anfang von main","Am Ende des Programms","In der nächsten Methode der Datei"], c:[0],
       e:"Nach Beendigung kehrt das Programm an die Stelle des Aufrufs zurück und macht mit der unmittelbar nächsten Anweisung weiter."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "fehler", name: "Fehler & Programmierstil", quelle: "Folien Kap. 3 (S. 49–54)",
    terms: [
      ["Syntaxfehler (syntax error)", "Verstoß gegen die Sprachregeln. Der Compiler erkennt ihn und meldet einen compile-time error. Immer den ERSTEN Fehler zuerst beheben – die weiteren hängen oft davon ab.", "fehlendes ;, fehlende Klammer, falscher Typ bei Zuweisung"],
      ["Laufzeitfehler (run-time error)", "Tritt während des Programmlaufs auf; das Programm wird mit (oft schwer verständlicher) Fehlermeldung abgebrochen.", "Speicher erschöpft, Eingabe nicht interpretierbar, Datei fehlt, Division durch 0"],
      ["Logischer Fehler (logical error)", "Fehler im Algorithmus oder falsche Umsetzung – syntaktisch korrekt, keine Fehlermeldung, aber falsche Ergebnisse. Schwer zu finden: logische Analyse und Tests nötig.", "/ statt % verwendet, falsche Variable ausgegeben"],
      ["Programmierstil", "Ein Programm in einer einzigen Zeile kann korrekt sein, ist aber kaum lesbar. Guter Stil erleichtert Lesbarkeit und Wartbarkeit."],
      ["Namen: Variablen & Methoden", "Beginnen mit Kleinbuchstaben; zusammengesetzte Wörter mit Großbuchstaben.", "radius, betragEuro, printHeader()"],
      ["Namen: Konstanten", "Nur Großbuchstaben (evtl. mit _).", "PI, MIN_TIME, MAX"],
      ["Namen: Klassen", "Beginnen mit Großbuchstaben.", "Kreis, WechselGeld"],
      ["Sprache der Namen", "Englisch oder Deutsch – aber einheitlich!"],
      ["Einrücken", "2 bis 4 Leerzeichen, auf jeden Fall einheitlich. In der Regel eine Anweisung pro Zeile."],
      ["Kommentare (Stil)", "Sollen Informationen ergänzen, die nicht aus dem Code erkennbar sind. Sparsam, aber gezielt einsetzen.", "//Muenzanzahlen berechnen"]
    ],
    quiz: [
      {q:"Ordne zu: Welche Fehler sind Syntaxfehler?", o:["Fehlender Strichpunkt am Ende einer Anweisung","Fehlende schließende Klammer","/ statt % verwendet (Programm läuft, Ergebnis falsch)","Eingabe „abc“ statt einer Zahl"], c:[0,1],
       e:"Syntaxfehler findet der Compiler. / statt % ist ein logischer Fehler (läuft, aber falsch). Eine nicht interpretierbare Eingabe führt zu einem Laufzeitfehler."},
      {q:"Das Programm verwendet versehentlich / statt %. Es läuft ohne Fehlermeldung, gibt aber falsche Werte aus. Welche Fehlerart ist das?", o:["Logischer Fehler","Syntaxfehler","Laufzeitfehler","Gar kein Fehler"], c:[0],
       e:"Syntaktisch korrekt und ohne Absturz, aber falsch → logischer Fehler. Den findet man nur durch Analyse und Testen."},
      {q:"Integer.parseInt(\"abc\") wird während der Ausführung aufgerufen. Was passiert?", o:["Laufzeitfehler – das Programm bricht ab","Syntaxfehler","Das Ergebnis ist 0","Logischer Fehler ohne Meldung"], c:[0],
       e:"Der Code ist syntaktisch korrekt, aber die Eingabe ist nicht als Zahl interpretierbar → Fehlermeldung zur Laufzeit und Abbruch."},
      {q:"Welche Namen folgen den Java-Konventionen aus der Vorlesung?", o:["betragEuro (Variable)","MAX_VERSUCHE (Konstante)","WechselGeld (Klasse)","PrintHeader() (Methode)"], c:[0,1,2],
       e:"Variablen und Methoden beginnen klein (printHeader), Konstanten sind GROSS, Klassen beginnen groß."},
      {q:"Der Compiler meldet 12 Fehler. Was ist die beste Strategie?", o:["Den ersten Fehler beheben und neu kompilieren","Beim letzten Fehler anfangen","Alle Zeilen mit Fehlern löschen","Die Meldungen ignorieren, das Programm läuft trotzdem"], c:[0],
       e:"Die weiteren Fehler sind oft Folgefehler des ersten. Außerdem ist die Fehlerbeschreibung nur eine Vermutung des Compilers."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "typen", name: "Primitive Typen & Typkonversion", quelle: "Folien Kap. 4 (S. 56–60)",
    terms: [
      ["Primitive Typen vs. Klassentypen", "Primitive Typen speichern einfache Werte (Zahlen, Zeichen, Wahrheitswerte). Klassentypen kommen später (z. B. String)."],
      ["byte", "1 Byte, −2⁷ … 2⁷−1 (−128 … 127)"],
      ["short", "2 Byte, −2¹⁵ … 2¹⁵−1 (−32768 … 32767)"],
      ["int", "4 Byte, −2³¹ … 2³¹−1 (−2147483648 … 2147483647)"],
      ["long", "8 Byte, −2⁶³ … 2⁶³−1 (≈ ±9·10¹⁸)"],
      ["float", "4 Byte Gleitkommazahl, bis ±3.4·10³⁸"],
      ["double", "8 Byte Gleitkommazahl, bis ±1.8·10³⁰⁸"],
      ["char", "2 Byte, alle Unicode-Zeichen"],
      ["boolean", "Wahrheitswerte true und false (1 Bit)"],
      ["Typ von Numeralen", "Ganzzahlige Numerale haben den Typ int, Gleitkomma-Numerale den Typ double."],
      ["Implizite Typkonversion", "Bei verschiedenen Operandentypen wird der weiter links stehende Typ (byte → short → int → long → float → double) in den anderen umgewandelt. Ergebnis ist mindestens int.", "2 + 1.0 ist double, b + b (byte) ist int"],
      ["Explizite Typkonversion (Cast)", "(type) expression – der Ausdruck wird berechnet und dann umgewandelt. Gleiche Priorität wie Vorzeichen. Bei double → int werden Nachkommastellen abgeschnitten. Kann der Zieltyp den Wert nicht darstellen, entsteht ein falscher Wert! Nur wenn nötig verwenden.", "(byte) 128 ergibt −128 (Überlauf)"]
    ],
    quiz: [
      {q:"Welchen Wertebereich hat byte?", o:["−128 … 127","0 … 255","−127 … 127","−256 … 255"], c:[0],
       e:"1 Byte im Zweierkomplement: −2⁷ … 2⁷−1 = −128 … 127 (vgl. Digitale Rechenanlagen!)."},
      {q:"byte b; Welchen Typ hat der Ausdruck b + b?", o:["int","byte","short","long"], c:[0],
       e:"Ein arithmetischer Ausdruck hat mindestens den Typ int – auch wenn beide Operanden byte sind."},
      {q:"float f; int i; Welchen Typ hat f + i?", o:["float","int","double","long"], c:[0],
       e:"int steht in der Liste weiter links und wird in float umgewandelt. Ergebnis: float."},
      {q:"int i = 4; double d; Welchen Wert hat d nach d = i / 10;?", o:["0.0","0.4","0","Compilerfehler"], c:[0],
       e:"i / 10 ist eine ganzzahlige Division (beide int) = 0. Erst danach wird 0 in den double 0.0 umgewandelt."},
      {q:"int i = 4; Welchen Wert hat (double) i / 10?", o:["0.4","0.0","0","4.0"], c:[0],
       e:"Der Cast bindet stärker als /: zuerst wird i zu 4.0, dann 4.0 / 10 = 0.4 (Gleitkommadivision)."},
      {q:"double d = 0.4; Welche Aussagen stimmen?", o:["(int)(d) * 4 ergibt 0","(int)(d * 4) ergibt 1","(int)(d) * 4 ergibt 1","(int)(d * 4) ergibt 2"], c:[0,1],
       e:"(int)(d) = (int) 0.4 = 0, mal 4 = 0. (int)(d * 4) = (int) 1.6 = 1 – abgeschnitten, nicht gerundet. Die Klammern entscheiden, wann gecastet wird."},
      {q:"Was ergibt (byte) 128?", o:["−128","128","127","0"], c:[0],
       e:"128 passt nicht in byte (max. 127). Beim Cast werden die Bits übernommen: 10000000 im Zweierkomplement = −128. Laut Folie: „Überlauf!!!“."},
      {q:"double d = 4.6; int i; Ist i = d * 4; erlaubt?", o:["Nein, double → int braucht einen expliziten Cast","Ja, i wird 18","Ja, i wird 18.4","Ja, i wird 19"], c:[0],
       e:"d * 4 ist double, und double → int ist nicht zuweisungskompatibel. Man müsste i = (int)(d * 4); schreiben (ergibt 18)."},
      {q:"Wie viel Speicher braucht ein char?", o:["2 Byte","1 Byte","4 Byte","1 Bit"], c:[0],
       e:"char speichert Unicode-Zeichen mit 2 Byte (65536 mögliche Zeichen)."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "boolean", name: "boolean & logische Operatoren", quelle: "Folien Kap. 4 (S. 65–70)",
    terms: [
      ["boolean", "Primitiver Typ mit den zwei Werten true und false (vordefinierte Literale). Benannt nach George Boole. NICHT kompatibel mit Zahlentypen."],
      ["Vergleich liefert boolean", "Das Ergebnis eines Vergleichs ist vom Typ boolean.", "boolean q = a < 0;"],
      ["&& (logisches Und)", "true nur, wenn beide Operanden true sind."],
      ["|| (logisches Oder)", "true, wenn mindestens ein Operand true ist."],
      ["! (Negation)", "Kehrt den Wahrheitswert um. Gleiche Priorität wie Vorzeichen + −. Wenn möglich vermeiden (besser direkt umformulieren)."],
      ["Vorrang", "! bindet stärker als &&, && bindet stärker als ||. Klammern heben die Regeln auf."],
      ["Bereichstest", "Mit && zwei Vergleiche verbinden.", "if (temp >= 20 && temp <= 24) …"],
      ["boolean-Variable als Bedingung", "Eine boolean-Variable kann direkt als Bedingung verwendet werden.", "klimaEin = temp < 20 || temp > 24; if (klimaEin) …"],
      ["Kurzschlussauswertung (short-circuit)", "Bei && und || wird abgebrochen, sobald das Ergebnis feststeht. Bei false && … und true || … wird der rechte Teil nicht mehr ausgewertet.", "if ((n != 0) && (sum / n > 70)) – keine Division durch 0"],
      ["Welches Programm ist besser?", "Kriterien: Kürze, Effizienz (Anzahl Vergleiche/Zuweisungen), Lesbarkeit, Erweiterbarkeit."]
    ],
    quiz: [
      {q:"Welchen Wert hat p am Ende?", code:"boolean p, q;\nint a = -3;\np = false;\nq = a < 0;\np = p && q;", o:["false","true","Compilerfehler","-3"], c:[0],
       e:"q = (−3 < 0) = true. p = false && true = false."},
      {q:"Was ergibt !(true && false) || false?", o:["true","false","Compilerfehler","null"], c:[0],
       e:"true && false = false → !false = true → true || false = true."},
      {q:"Was ergibt true || false && false?", o:["true","false","Compilerfehler","Hängt von der Reihenfolge der Auswertung ab"], c:[0],
       e:"&& bindet stärker als ||: true || (false && false) = true || false = true."},
      {q:"int n = 0, sum = 100; Was passiert bei if ((n != 0) && (sum / n > 70)) erg = 1;?", o:["Nichts – kein Fehler, die Bedingung ist false","Laufzeitfehler wegen Division durch 0","erg wird 1","Compilerfehler"], c:[0],
       e:"n != 0 ist false → das Ergebnis von && steht fest, sum / n wird gar nicht ausgewertet (Kurzschlussauswertung). Genau das ist der klassische Anwendungsfall."},
      {q:"Wie testet man in Java, ob temp zwischen 20 und 24 liegt (inklusive)?", o:["temp >= 20 && temp <= 24","20 <= temp <= 24","temp >= 20 || temp <= 24","temp > 20 && temp < 24"], c:[0],
       e:"Man braucht zwei Vergleiche, verbunden mit &&. 20 <= temp <= 24 ist ein Compilerfehler (boolean <= int). Mit || wäre die Bedingung immer true. Option 4 schließt 20 und 24 aus."},
      {q:"Was passiert bei boolean b = 1;?", o:["Compilerfehler – boolean ist nicht kompatibel mit Zahlen","b wird true","b wird false","Laufzeitfehler"], c:[0],
       e:"In Java gibt es keine Umwandlung zwischen boolean und Zahlentypen. Nur true und false sind erlaubt."},
      {q:"int n = 0; Was ergibt (n == 0) || (sum / n < 50)?", o:["true, ohne Fehler","Laufzeitfehler","false","Compilerfehler"], c:[0],
       e:"n == 0 ist true → bei || steht das Ergebnis true schon fest, die Division wird nicht ausgeführt."},
      {q:"Was ist laut Vorlesung besser lesbar?", o:["if (temp < 20) klimaEin = true;","if (!(temp >= 20)) klimaEin = true;"], c:[0],
       e:"Beide sind gleichwertig, aber ! sollte man wenn möglich vermeiden – die direkte Formulierung ist leichter zu lesen."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "strings", name: "char & Strings", quelle: "Folien Kap. 4 (S. 71–78)",
    terms: [
      ["char", "Primitiver Typ für einzelne Zeichen. Literale in einfachen Hochkommas.", "char c = 'p';"],
      ["ASCII", "7 Bit für Zeichen → 128 Zeichen, z. B. keine Umlaute."],
      ["Unicode", "2 Byte pro Zeichen → 65536 Zeichen (Umlaute, griechische Buchstaben, …). ASCII ist eine Teilmenge."],
      ["Escape-Sequenzen", "Beginnen mit Backslash: \\n Zeilenvorschub, \\\\ Backslash, \\\" doppeltes Hochkomma, \\' einfaches Hochkomma."],
      ["char → int", "Ein char kann einer int-Variablen zugewiesen werden – der Wert ist der Unicode-Wert. Umgekehrt (int → char) geht es nicht automatisch.", "char c = '8'; int a = c; // a: 56"],
      ["char-Vergleiche", "Geordnet nach Unicode-Wert: Ziffern < Großbuchstaben < Kleinbuchstaben, innerhalb einer Gruppe in üblicher Reihenfolge.", "istZiffer = ('0' <= c) && (c <= '9');"],
      ["char-Arithmetik", "Mit + − usw. möglich, aber das Ergebnis ist im Allgemeinen int!", "c + c ist int"],
      ["String", "Vordefinierter Typ (Klasse) für Zeichenketten aus char-Elementen. Literale in doppelten Hochkommas.", "String s1 = \"Hallo\";"],
      ["Leerer String vs. Leerzeichen", "\"\" ist der leere String, \" \" besteht aus einem Leerzeichen."],
      ["String als Referenz", "String-Variablen sind Zeiger (Referenzen) auf String-Objekte – im Gegensatz zu primitiven Typen. Nach s2 = s1; zeigen beide auf dasselbe Objekt."],
      ["Unveränderlich", "String-Objekte sind unveränderlich; bei Manipulation entsteht ein neues Objekt."],
      ["Konkatenation +", "Hängt Strings zusammen. Mit primitiven Typen wird der Wert automatisch in einen String umgewandelt.", "\"4\" + \"2\" ergibt \"42\""],
      ["== bei Strings", "Vergleicht die Zeiger, nicht die Inhalte! (Achtung: gleiche Literale werden als nur ein Objekt gespeichert – das kann verwirren.)"],
      ["equals", "s1.equals(s2) vergleicht die Inhalte – für String-Vergleiche immer verwenden."],
      ["length()", "Anzahl der Zeichen (int).", "\"Jetzt neu\".length() ist 9"],
      ["charAt(i)", "Zeichen an Position i (char). Zählung beginnt bei 0!", "\"Jetzt neu\".charAt(3) ist 'z'"],
      ["compareTo", "Lexikographischer Vergleich, Ergebnis int: < 0 wenn s1 kleiner, 0 wenn gleich, > 0 wenn größer."]
    ],
    quiz: [
      {q:"Welchen Wert hat a?", code:"char c = '8';\nint a;\na = c;", o:["56","8","'8'","Compilerfehler"], c:[0],
       e:"Bei der Zuweisung char → int wird der Unicode-Wert gespeichert. Das Zeichen '8' hat den Code 56 – nicht die Zahl 8!"},
      {q:"char c = '8'; Welchen Wert hat a nach int a = c + c;?", o:["112","16","88","Compilerfehler"], c:[0],
       e:"char-Arithmetik ergibt int: 56 + 56 = 112."},
      {q:"char c = '8'; Was passiert bei c = c + c;?", o:["Compilerfehler – c + c ist int und kann nicht ohne Cast in char gespeichert werden","c wird '6'","c wird 112","Laufzeitfehler"], c:[0],
       e:"Das Ergebnis von c + c ist int, und int → char ist nicht zuweisungskompatibel."},
      {q:"Welchen Wert hat s1 am Ende?", code:"int a = 7;\nString s1;\ns1 = a + \"5\";\ns1 = 1 + s1;", o:["\"175\"","\"13\"","\"85\"","\"75\""], c:[0],
       e:"7 + \"5\" = \"75\" (Zahl + String = Verkettung). Dann 1 + \"75\" = \"175\"."},
      {q:"Was ergibt (3 == 3) + \"wahr\"?", o:["\"truewahr\"","\"3wahr\"","true","Compilerfehler"], c:[0],
       e:"(3 == 3) ist der boolean true. Mit einem String verkettet wird er zu \"true\" umgewandelt."},
      {q:"String s1 = \"Jetzt neu\"; Welche Aussagen stimmen?", o:["s1.length() ist 9","s1.charAt(3) ist 'z'","s1.charAt(0) ist 'e'","s1.length() ist 8"], c:[0,1],
       e:"J-e-t-z-t-Leerzeichen-n-e-u = 9 Zeichen (das Leerzeichen zählt mit). charAt zählt ab 0: J(0) e(1) t(2) z(3)."},
      {q:"Wie vergleicht man die INHALTE zweier Strings s1 und s2?", o:["s1.equals(s2)","s1 == s2","s1 = s2","s1.compareTo(s2) == true"], c:[0],
       e:"== vergleicht nur die Zeiger. Ein eingelesenes \"Hallo\" ist ein anderes Objekt als das Literal \"Hallo\" → == liefert false. compareTo liefert einen int, keinen boolean."},
      {q:"Welche Reihenfolge gilt bei char-Vergleichen?", o:["Ziffern < Großbuchstaben < Kleinbuchstaben","Kleinbuchstaben < Großbuchstaben < Ziffern","Großbuchstaben < Kleinbuchstaben < Ziffern","Alle Zeichen sind gleich groß"], c:[0],
       e:"Laut Unicode-Tabelle: '0' (48) < 'A' (65) < 'a' (97)."},
      {q:"Wie schreibt man einen Zeilenumbruch in einem String?", o:["\\n","/n","\\newline","<br>"], c:[0],
       e:"Escape-Sequenzen beginnen mit Backslash: \\n = newline. Weitere: \\\\ für Backslash, \\\" für doppeltes Hochkomma."},
      {q:"Was ergibt \"4\" + \"2\"?", o:["\"42\"","6","\"6\"","Compilerfehler"], c:[0],
       e:"Zwei Strings werden verkettet, nicht addiert."}
    ]
  },

  /* ---------------------------------------------------------- */
  { id: "switch", name: "switch-Anweisung", quelle: "Folien Kap. 4 (S. 79–80)",
    terms: [
      ["switch-Anweisung", "Mehrwegverzweigung (die if-Anweisung ist eine Zweiwegverzweigung)."],
      ["Ablauf", "1. switch-Ausdruck berechnen. 2. Zum passenden case-Label springen. Passt keines → zu default. Gibt es kein default → ans Ende der switch-Anweisung."],
      ["switch-Ausdruck", "Muss int oder char sein (auch String ist erlaubt)."],
      ["case-Label", "Muss eine Konstante sein, zum Typ des switch-Ausdrucks passen, und alle Labels müssen verschieden sein."],
      ["default-Label", "Höchstens einmal, dann am Ende."],
      ["break", "Springt ans Ende der switch-Anweisung."],
      ["Fall through", "Fehlt ein break, werden die Anweisungen des nächsten case-Labels ebenfalls ausgeführt – häufige Fehlerursache."],
      ["Mehrere Labels", "Mehrere case-Labels können eine gemeinsame Anweisungsfolge haben.", "case 4: case 6: case 9: case 11: tage = 30; break;"]
    ],
    quiz: [
      {q:"Was wird ausgegeben?", code:"int k = 1;\nswitch (k) {\n  case 1: IO.print(\"A\");\n  case 2: IO.print(\"B\");\n          break;\n  case 3: IO.print(\"C\");\n}", o:["AB","A","ABC","Nichts"], c:[0],
       e:"case 1 passt → „A“. Da kein break folgt, läuft die Ausführung in case 2 weiter (fall through) → „B“. Dann break → Ende."},
      {q:"Was wird für note = 5 ausgegeben?", code:"switch(note){\n  case 1:\n    IO.println(\"mit Erfolg teilgenommen\");\n    break;\n  case 0:\n    IO.println(\"ohne Erfolg teilgenommen\");\n    break;\n  default:\n    IO.println(\"ungueltig\");\n    break;\n}", o:["ungueltig","mit Erfolg teilgenommen","Nichts","Compilerfehler"], c:[0],
       e:"Kein case passt zu 5 → es wird zu default gesprungen."},
      {q:"Was passiert, wenn kein case passt und es KEIN default gibt?", o:["Es wird ans Ende der switch-Anweisung gesprungen – nichts passiert","Laufzeitfehler","Der erste case wird ausgeführt","Compilerfehler"], c:[0],
       e:"Ohne passendes Label und ohne default wird die switch-Anweisung einfach übersprungen."},
      {q:"Welche Typen sind für den switch-Ausdruck laut Folie erlaubt?", o:["int","char","String","double","boolean"], c:[0,1,2],
       e:"Laut Folie: int oder char, auch String ist erlaubt. Gleitkommazahlen und boolean nicht."},
      {q:"Welche Regeln gelten für case-Labels?", o:["Sie müssen Konstanten sein","Sie müssen alle verschieden sein","Ihr Typ muss zum switch-Ausdruck passen","Sie dürfen Variablen sein"], c:[0,1,2],
       e:"case-Labels sind konstant, eindeutig und typpassend. Variablen sind als Label nicht erlaubt."},
      {q:"Welchen Wert hat tage für monat = 6?", code:"switch (monat) {\n  case 4: case 6: case 9: case 11:\n    tage = 30;\n    break;\n  case 2:\n    tage = 28;\n    break;\n  default:\n    tage = 31;\n}", o:["30","31","28","Compilerfehler"], c:[0],
       e:"Mehrere case-Labels teilen sich eine Anweisungsfolge. 6 passt zu case 6 → tage = 30."}
    ]
  }
  ],

  /* ---------------------------------------------------------- */
  zeichen: [
    { g: "Programmaufbau", rows: [
      ["void main() { … }", "main-Methode", "Startpunkt des Programms", ""],
      [";", "Strichpunkt", "schließt jede Anweisung/Deklaration ab", "int x = 5;"],
      ["{ }", "Block", "fasst Anweisungen zusammen", ""],
      ["( )", "runde Klammern", "Bedingungen, Parameter, Vorrang in Ausdrücken", "if (a > b)"],
      ["//", "Zeilenkommentar", "bis Zeilenende", ""],
      ["/* … */", "Blockkommentar", "über mehrere Zeilen", ""],
      [".java / .class", "Dateiendungen", "Quellcode / Bytecode", ""]
    ]},
    { g: "Variablen & Typen", rows: [
      ["=", "Zuweisung", "rechts auswerten, links speichern", "n = n + 1;"],
      ["final", "Konstante", "Wert unveränderlich", "final int MAX = 3;"],
      ["int, long, double …", "Typen", "byte, short, int, long, float, double, char, boolean", ""],
      ["(type)", "expliziter Cast", "Wert in anderen Typ umwandeln", "(int) 3.9 → 3"],
      ["e / E", "Exponent", "wissenschaftliche Notation", "2.5E4 = 25000.0"],
      ["true, false", "boolean-Literale", "", ""],
      ["'a'", "char-Literal", "einfache Hochkommas", ""],
      ["\"Text\"", "String-Literal", "doppelte Hochkommas", ""]
    ]},
    { g: "Operatoren", rows: [
      ["+  −  *  /", "Grundrechenarten", "Punkt vor Strich; / bei int ganzzahlig", "7 / 2 → 3"],
      ["%", "Modulus", "Rest der Division", "7 % 3 → 1"],
      ["− (unär)", "Vorzeichen", "bindet stärker als binäre Operatoren", "-(5 + 2)"],
      ["==  !=", "gleich / ungleich", "Vergleich, Ergebnis boolean", ""],
      ["<  <=  >  >=", "Größenvergleich", "", ""],
      ["&&", "logisches Und", "mit Kurzschlussauswertung", ""],
      ["||", "logisches Oder", "mit Kurzschlussauswertung", ""],
      ["!", "Negation", "nicht", "!(a > b)"],
      ["+ (bei Strings)", "Konkatenation", "Strings verketten", "\"a\" + 1 → \"a1\""]
    ]},
    { g: "Escape-Sequenzen", rows: [
      ["\\n", "Zeilenvorschub", "neue Zeile", ""],
      ["\\\\", "Backslash", "ein \\ als Zeichen", ""],
      ["\\\"", "doppeltes Hochkomma", "\" im String", ""],
      ["\\'", "einfaches Hochkomma", "' als char", "'\\''"]
    ]},
    { g: "Kontrollstrukturen & Methoden", rows: [
      ["if (…) … else …", "Verzweigung", "", ""],
      ["while (…) …", "Schleife", "solange Bedingung true", ""],
      ["switch / case / default", "Mehrwegverzweigung", "", ""],
      ["break", "Abbruch", "springt ans Ende der switch-Anweisung", ""],
      ["void", "kein Rückgabewert", "", "void printHeader()"],
      ["return", "Rückgabe", "liefert Ergebnis an Aufrufer", "return a;"]
    ]},
    { g: "Vordefinierte Methoden", rows: [
      ["IO.println(x)", "Ausgabe", "mit Zeilenumbruch", ""],
      ["IO.print(x)", "Ausgabe", "ohne Zeilenumbruch", ""],
      ["IO.readln()", "Eingabe", "liest eine Zeile als String", ""],
      ["Integer.parseInt(s)", "String → int", "", ""],
      ["Double.parseDouble(s)", "String → double", "", ""],
      ["s.length()", "Länge", "Anzahl Zeichen", ""],
      ["s.charAt(i)", "Zeichen an Position i", "Zählung ab 0", ""],
      ["s1.equals(s2)", "Inhaltsvergleich", "true/false", ""],
      ["s1.compareTo(s2)", "lexikographischer Vergleich", "< 0, 0 oder > 0", ""]
    ]}
  ]
};
