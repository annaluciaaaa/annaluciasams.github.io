/* Kapitel 5 (Schleifen) und 6 (Arrays) nach den Folien Teil I, S. 81–112, dazu Wiederholungsfragen 43–64.
   run:1 (Anweisungen) / run:2 (ganzes Programm) = Ausgabe mit Java 25 geprüft. */
(function(){
var R=String.raw;
var W=[
["43. Wie lautet das Prinzip einer Schleife allgemein?","Eine Gruppe von Anweisungen (Schleifenrumpf) wird so lange wiederholt, bis die Schleifenbedingung nicht mehr gilt."],
["44. Kann ein Schleifenrumpf auch gar nicht (0-mal) ausgeführt werden?","Ja, bei while und for, wenn die Bedingung gleich am Anfang false ist (abweisende Schleife). Bei do-while nicht: Dort wird erst am Ende geprüft, der Rumpf läuft mindestens einmal."],
["45. Was ist ein Inkrement-Operator?","++ erhöht eine Variable um 1: n++; oder ++n; ist gleichbedeutend mit n = n + 1;"],
["46. Was bedeutet Endlosschleife und wie entsteht diese meistens?","Eine Schleife, die nicht terminiert. Meist ein Fehler: Die Bedingung ist falsch formuliert, oder der Rumpf ändert nichts, was sie false macht. Manchmal gewollt, z. B. beim Geldautomaten: while (true)."],
["47. Wie lauten die drei Teile des Schleifenkopfs einer for-Schleife und was sind ihre Aufgaben?","Initialisierungsteil: einmal vor der Schleife, gibt der Laufvariable den Startwert.\nSchleifenbedingung: wird vor jedem Durchlauf geprüft.\nAktualisierungsteil: läuft am Ende jedes Durchlaufs, verändert z. B. die Laufvariable."],
["48. Was unterscheidet eine for- von einer while-Schleife?","Nur die Schreibweise: for ist eine kompakte Form von while, weil Start, Bedingung und Aktualisierung im Kopf stehen. Passend, wenn ein Zähler die Schleife steuert und die Anzahl der Durchläufe meist vorher feststeht."],
["49. Wann wird von geschachtelten Schleifen gesprochen?","Wenn im Rumpf einer Schleife wieder eine Schleife steht. Die innere muss komplett innerhalb der äußeren liegen."],
["50. Was bewirkt eine break-Anweisung in einer Schleife?","Sie beendet die Schleife sofort; es geht nach der Schleife weiter. Möglichst vermeiden: Gibt es mehrere Abbruchgründe, weiß man danach nicht, welcher zugetroffen hat."],
["51. Was ist ein Array?","Eine „Tabelle“ von Elementen eines bestimmten Typs. Die einzelnen Elemente spricht man über ganzzahlige Indizes an."],
["52. Welche Angaben sind bei der Deklaration einer Array-Variablen nötig?","Elementtyp, [] und Name: int[] a; – die Länge gehört nicht dazu, sie wird erst bei der Erzeugung angegeben."],
["53. Wie wird ein Array erzeugt?","Mit new, Elementtyp und Länge: a = new int[7]; – oder mit Werten: new int[]{1, 3, 5} bzw. direkt bei der Deklaration int[] g = {1, 3, 5};"],
["54. Wozu dienen Indizes bei einem Array und wie lautet ihr Wertebereich?","Damit spricht man die einzelnen Elemente an. Bereich: 0 bis length - 1. Außerhalb gibt es einen Laufzeitfehler."],
["55. Wie kann die Anzahl der Arrayelemente abgefragt werden?","Mit dem Attribut length (ohne Klammern): a.length"],
["56. Ist die Anzahl der Arrayelemente für ein erstelltes Array änderbar?","Nein. Man kann nur ein neues Array erzeugen und die Werte kopieren."],
["57. Wie funktioniert das „Durchlaufen“ eines ganzen Arrays?","Mit einer for-Schleife von 0 bis a.length - 1 (oder for-each, wenn man nur liest).","",R`for (int i = 0; i < a.length; i++)
  IO.println(a[i]);`],
["58. Was ist der wesentliche Unterschied zwischen einer Array-Variablen und einer Variablen für einen primitiven Datentyp?","Die primitive Variable enthält den Wert selbst. Die Array-Variable enthält einen Zeiger (Referenz) auf das Array-Objekt – b = a kopiert daher nur den Zeiger."],
["59. Was ist ein zweidimensionales Array?","Ein Array von Arrays, wie eine Tabelle/Matrix: ein Array aus Zeilen, jede Zeile hat Spaltenelemente. int[][] a = new int[3][4];"],
["60. Sind auch Arrays mit mehr als zwei Dimensionen möglich?","Ja, analog: int[][][] h = new int[3][2][5]; – zum Durchlaufen braucht man pro Dimension eine Schleife."],
["61. Was ist eine for-each-Schleife und worauf ist bei deren Verwendung zu achten?","Sie durchläuft alle Elemente vom ersten an. Zu beachten: nur lesend (bei primitiven Elementen), nur ein Array gleichzeitig, kein Index, und der Typ der Variable muss zum Elementtyp passen.","",R`for (int el : a)
  IO.print(el + " ");`],
["62. Was ist die Idee des besprochenen Minimum-Sort-Algorithmus?","Suche das Minimum im ganzen Array und tausche es an Position 0. Dann das Minimum ab Position 1 an Position 1 usw. bis zum Ende."],
["63. Auf welchen wesentlichen (Teil-)Operationen beruht der MinimumSort?","Auf dem Vergleichen (Minimum im Restbereich suchen) und dem Vertauschen zweier Elemente."],
["64. Was ist ein Parameter in der Kommandozeile?","Ein Wert, den man beim Programmstart hinter dem Programmnamen angibt. Er landet als String im Array args von void main(String[] args)."]];
function kat(a,b){return W.slice(a-43,b-42).map(function(w){return w[0]})}
var MINSORT=R`for (int i = 0; i < werte.length - 1; i++) {
  int minPos = i;
  for (int j = i + 1; j < werte.length; j++)
    if (werte[j] < werte[minPos])
      minPos = j;
  int h = werte[i];
  werte[i] = werte[minPos];
  werte[minPos] = h;
}`;
var T=[
{id:"schleifen",name:"Schleifen: while, do-while, for",quelle:"Folien Kap. 5 (S. 81–93)",kat:kat(43,49),
terms:[
["Schleife (loop)","Wiederholt Anweisungen, solange eine Bedingung gilt. Bestandteile: Schleifenbedingung und Schleifenrumpf (loop body)."],
["Iteration","Eine einzelne Wiederholung des Schleifenrumpfs."],
["while-Schleife (abweisende Schleife)","Prüft die Bedingung vor jedem Durchlauf. Der Rumpf kann 0-, 1-, 2-, … mal laufen. Nach der Schleife gilt die Bedingung nicht mehr.","",R`int sum = 0;
int i = 1;
while (i <= n) {
  sum = sum + i;
  i = i + 1;
}`],
["do-while-Schleife (Durchlaufschleife)","Prüft die Bedingung am Ende jedes Durchlaufs, der Rumpf läuft also mindestens einmal. Achtung: Strichpunkt nach der Bedingung!","ZiffernSturz: 123 → 321",R`do {
  IO.print(n % 10);
  n = n / 10;
} while (n > 0);`],
["Inkrement ++ und Dekrement --","Erhöhen bzw. vermindern eine Variable um 1. Nur auf Variablen anwendbar, nicht auf Ausdrücke. Für numerische Typen, meistens ganzzahlig.","n++; ist dasselbe wie n = n + 1;"],
["n++ oder ++n in Ausdrücken","n++: zuerst den Wert lesen, dann erhöhen. ++n: zuerst erhöhen, dann lesen. Als eigene Anweisung kein Unterschied. Von der Verwendung in Ausdrücken wird abgeraten.","",R`n = 2;
erg = n++ * 3;   // erg: 6, n: 3
n = 2;
erg = ++n * 3;   // erg: 9, n: 3`],
["Operator mit Zuweisung: += -= *= /= %=","x += y; ist die Kurzform von x = x + y; (analog für die anderen). Nur kürzer, nicht schneller."],
["Endlosschleife (infinite loop)","Terminiert nicht. Entweder gewollt (Geldautomat, Alarmanlage) oder ein Fehler in Bedingung oder Rumpf.","Für ungerade n > 0 bleibt n % 2 immer 1:",R`while (n > 0) {
  n = n % 2;     // terminiert nicht für ungerade n
}
while (n > 0) {
  n = n / 2;     // terminiert immer
}`],
["for-Schleife (Zählschleife)","Initialisierung; Bedingung; Aktualisierung im Kopf. Sinnvoll, wenn ein Zähler (Laufvariable) steuert und die Anzahl der Durchläufe meist feststeht.","",R`int sum = 0;
for (int i = 1; i <= n; i++) {
  sum = sum + i;
}`],
["Ablauf der for-Schleife","1. Initialisierung (einmal) → 2. Bedingung prüfen → 3. Rumpf → 4. Aktualisierung → wieder 2. Bei false geht es hinter der Schleife weiter."],
["for als while","Die for-Schleife ist eine kompakte while-Schleife: Initialisierung davor, Aktualisierung als letzte Anweisung im Rumpf."],
["Mehrere oder leere Teile im for-Kopf","Initialisierung und Aktualisierung dürfen mehrere Anweisungen mit Komma enthalten (vermeiden!). Jeder Teil darf leer sein.","",R`for (i = 0, j = 6; i < j; i++, j--)
for ( ; i <= n; )
for (;;)          // Endlosschleife`],
["Gültigkeit der Laufvariable","Wird sie im Kopf deklariert (int i = 1), gibt es sie nur in der Schleife. Zugriff danach: Compilerfehler.",""],
["Falle: Strichpunkt nach dem for-Kopf","for (…); hat einen leeren Rumpf! Die Zeile darunter läuft nur einmal, nach der Schleife.","",R`int k, sum = 0, n = 3;
for (k = 1; k < n; k++);
  sum = sum + k;   // läuft nur 1-mal → sum: 3`],
["Geschachtelte Schleifen (nested loops)","Eine Schleife im Rumpf einer anderen. Die innere läuft bei jedem Durchlauf der äußeren komplett durch. Geht mit allen Schleifenarten.","Zeichentreppe: außen die Zeilen, innen die Zeichen",R`for (int zeile = 1; zeile <= hoch; zeile++) {
  for (int spalte = 1; spalte <= zeile; spalte++)
    IO.print(zeichen);
  IO.println();
}`]],
quiz:[
{q:"Welche Schleife läuft **mindestens einmal**?",o:["do-while","while","for","for-each"],c:[0],e:"Bei do-while wird die Bedingung erst am Ende geprüft."},
{q:"Was gibt das aus?",code:"int n = 2;\nint erg = n++ * 3;\nIO.println(erg + \" \" + n);",o:["`6 3`","`9 3`","`6 2`","`9 2`"],c:[0],run:1,e:"n++ liest zuerst (2 · 3 = 6) und erhöht danach."},
{q:"Was gibt das aus?",code:"int n = 2;\nint erg = ++n * 3;\nIO.println(erg + \" \" + n);",o:["`9 3`","`6 3`","`6 2`","`9 2`"],c:[0],run:1,e:"++n erhöht zuerst auf 3, dann 3 · 3."},
{q:"Was gibt das aus?",code:"int k, sum = 0, n = 3;\nfor (k = 1; k < n; k++);\n  sum = sum + k;\nIO.println(sum);",o:["`3`","`6`","`1`","`0`"],c:[0],run:1,e:"Der Strichpunkt macht den Rumpf leer. Nach der Schleife ist k = 3, und die Addition läuft einmal."},
{q:"Was passiert hier?",code:"int n = 3;\nfor (int i = 1; i <= n; i++) {\n  IO.println(i);\n}\nIO.println(\"danach - i: \" + i);",o:["Compilerfehler: i gibt es nach der Schleife nicht","Letzte Zeile: danach - i: 4","Letzte Zeile: danach - i: 3","Laufzeitfehler"],c:[0],e:"Im Kopf deklariert heißt: nur in der Schleife gültig."},
{q:"Für welche Startwerte endet diese Schleife **nicht**?",code:"while (n > 0) {\n  n = n % 2;\n}",o:["n = 7","n = 1","n = 8","n = 0"],c:[0,1],e:"Ungerade positive n: n % 2 ist 1, und 1 % 2 bleibt 1. Bei geraden wird n sofort 0; bei 0 läuft die Schleife gar nicht."},
{q:"Was gibt das aus?",code:"int i, j;\nfor (i = 0, j = 6; i < j; i++, j--);\nIO.println(i + \" \" + j);",o:["`3 3`","`2 4`","`4 2`","`6 0`"],c:[0],run:1,e:"0/6, 1/5, 2/4, 3/3 – bei 3 < 3 ist Schluss."},
{q:"Was ist gleichbedeutend mit `x *= y + 1;` (int-Variablen)?",o:["`x = x * (y + 1);`","`x = x * y + 1;`","`x = y * x + 1;`","`x * y = y + 1;`"],c:[0],e:"Die rechte Seite wird zuerst vollständig ausgerechnet."},
{q:"In welcher Reihenfolge läuft die for-Schleife ab?",o:["Initialisierung → Bedingung → Rumpf → Aktualisierung → Bedingung …","Initialisierung → Rumpf → Bedingung → Aktualisierung …","Bedingung → Initialisierung → Rumpf …","Initialisierung → Bedingung → Aktualisierung → Rumpf …"],c:[0],e:"Aktualisiert wird am Ende jedes Durchlaufs, dann wird wieder geprüft."},
{q:"Wie oft wird `*` ausgegeben?",code:"for (int i = 1; i <= 4; i++)\n  for (int j = 1; j <= i; j++)\n    IO.print(\"*\");",o:["10-mal","16-mal","4-mal","8-mal"],c:[0],e:"1 + 2 + 3 + 4 = 10."},
{q:"Was gibt das aus?",code:"int n = 0;\ndo {\n  IO.print(n % 10);\n  n = n / 10;\n} while (n > 0);\nIO.println();",o:["`0`","gar nichts","Endlosschleife","`00`"],c:[0],run:1,e:"Auch für n = 0 läuft der Rumpf einmal – genau deshalb ist do-while hier praktisch."},
{q:"Was gilt **nach** `while (i <= n) { … }` (ohne break) sicher?",o:["i > n","i == n","i <= n","Die Schleife lief mindestens einmal"],c:[0],e:"Nach der Schleife gilt die Bedingung nicht mehr."},
{q:"Welche Ausdrücke sind **nicht** erlaubt?",o:["`(a + b)++`","`5++`","`i++`","`--i`"],c:[0,1],e:"++ und -- gehen nur auf Variablen."},
{q:"Was bewirkt `for (;;) IO.println(\"x\");`?",o:["Endlosschleife","Compilerfehler","Keine Ausgabe","Eine Ausgabe"],c:[0],e:"Fehlt die Bedingung, gilt sie als true."}
]},
{id:"abbruch",name:"break & continue",quelle:"Folien Kap. 5 (S. 94–95)",kat:kat(50,50),
terms:[
["break in Schleifen","Beendet die Schleife mitten im Rumpf. Weiter geht es direkt nach der Schleife. Bei allen Schleifenarten möglich.","",R`while (wert >= 0) {
  sum = sum + wert;
  if (sum > MAX) {
    IO.print("Max.!");
    break;
  }
  wert = Integer.parseInt(IO.readln());
}`],
["Warum break vermeiden?","Bei mehreren Abbruchbedingungen kennt man den Zustand nach der Schleife nicht: Endete sie regulär oder durch break? Das ist schwerer zu verifizieren."],
["break ersetzen","Die Abbruchbedingung negiert mit && in die Schleifenbedingung nehmen, nach der Schleife mit if prüfen.","",R`while (wert >= 0 && sum <= MAX) {
  sum = sum + wert;
  wert = Integer.parseInt(IO.readln());
}
if (sum > MAX)
  IO.print("Max.!");`],
["continue","Beendet nur die aktuelle Iteration und springt zum nächsten Schleifendurchlauf. Möglichst nicht verwenden.","Bei for wird danach noch die Aktualisierung (i++) ausgeführt."],
["break bei geschachtelten Schleifen","Beendet nur die innerste Schleife, in der es steht. Die äußere läuft weiter."]],
quiz:[
{q:"Was gibt das aus?",code:"for (int i = 1; i <= 5; i++) {\n  if (i == 3)\n    break;\n  IO.print(i);\n}\nIO.println();",o:["`12`","`123`","`1245`","`12345`"],c:[0],run:1,e:"Bei i = 3 endet die ganze Schleife."},
{q:"Was gibt das aus?",code:"for (int i = 1; i <= 5; i++) {\n  if (i == 3)\n    continue;\n  IO.print(i);\n}\nIO.println();",o:["`1245`","`12`","`123`","`345`"],c:[0],run:1,e:"Nur die Iteration mit i = 3 wird abgebrochen."},
{q:"Warum soll break möglichst vermieden werden?",o:["Bei mehreren Abbruchbedingungen ist der Zustand am Ende nicht bekannt","break ist langsam","break geht nur in while","break beendet das Programm"],c:[0],e:"Das macht das Programm schwerer zu verifizieren."},
{q:"Welche Bedingung ersetzt das break?",code:"while (wert >= 0) {\n  sum = sum + wert;\n  if (sum > MAX) break;\n  wert = Integer.parseInt(IO.readln());\n}",o:["`wert >= 0 && sum <= MAX`","`wert >= 0 || sum <= MAX`","`wert >= 0 && sum > MAX`","`wert < 0 && sum <= MAX`"],c:[0],e:"Abbruch bei sum > MAX heißt: weiter, solange sum <= MAX, und beides muss gelten."},
{q:"Was gibt das aus?",code:"for (int i = 0; i < 2; i++) {\n  for (int j = 0; j < 3; j++) {\n    if (j == 1)\n      break;\n    IO.print(i + \"\" + j + \" \");\n  }\n}\nIO.println();",o:["`00 10`","`00`","`00 01 10 11`","`00 02 10 12`"],c:[0],e:"break beendet nur die innere Schleife; i läuft weiter."},
{q:"Was passiert bei diesem Code?",code:"int i = 0;\nwhile (i < 5) {\n  if (i == 2)\n    continue;\n  IO.println(i);\n  i++;\n}",o:["Gibt 0 und 1 aus, dann Endlosschleife","Gibt 0 1 3 4 aus","Gibt 0 und 1 aus und endet","Compilerfehler"],c:[0],e:"Bei i = 2 wird i++ übersprungen, i bleibt für immer 2."}
]},
{id:"arrayskap6",name:"Arrays: Deklaration, Zugriff, Zeiger",quelle:"Folien Kap. 6 (S. 96–106)",kat:kat(51,58),
terms:[
["Array (Reihung, Feld)","Tabelle von Elementen eines Typs, ansprechbar über ganzzahlige Indizes. Nötig, wenn viele Werte gespeichert werden müssen.","7 Temperaturen: erst Durchschnitt berechnen, danach jeden Wert damit vergleichen"],
["Deklaration","int[] a; – legt nur die Array-Variable an. Die Länge ist noch nicht festgelegt, es gibt noch kein Array."],
["Erzeugung","a = new int[7]; – erzeugt ein Array-Objekt und weist dessen Adresse der Variablen zu. Geht auch später als die Deklaration, aber nie vorher.","int[] a = new int[7];"],
["Zugriff auf Elemente","Ein Element verhält sich wie eine Variable. Der Index ist ein ganzzahliger Ausdruck.","",R`int i = 2;
a[5] = 815;
a[i+1] = a[i] * 2;`],
["Laufzeitfehler beim Index","Index < 0 oder Index >= Arraylänge. Der Compiler merkt das nicht!","int[7] und i = 6: a[i+1] ist a[7] → Fehler"],
["Array-Variable = Zeiger (Referenz)","Arrays sind spezielle Objekte. Die Variable enthält nur den Zeiger auf das Array-Objekt."],
["Vorbelegung","Elemente numerischer Typen werden mit 0 vorbelegt. Trotzdem wird dringend empfohlen, nur Elemente zu lesen, denen man selbst Werte gegeben hat."],
["Array-Zuweisung b = a","Es wird der Zeiger zugewiesen. Beide zeigen auf dasselbe Objekt, Änderungen sind über beide sichtbar.","",R`int[] a = new int[4];
int[] b = a;
a[2] = 7;   // auch b[2] ist 7
b[0] = 5;   // auch a[0] ist 5
a = new int[3];   // a zeigt auf ein neues Array, b auf das alte`],
["Garbage Collection","Automatische Speicherbereinigung: Objekte, auf die keine Variable mehr zeigt, werden freigegeben.","nach b = new int[2]; ist das alte Array nicht mehr greifbar"],
["Initialisierung mit Werten","Bei der Deklaration kurz mit { }, sonst mit new Typ[]{ }.","",R`int[] g = {2, 4, 6, 8, 10};
int[] u;
u = new int[]{1, 3, 5, 7};`],
["Array kopieren","Jedes Element einzeln in ein neues Array übertragen. kopie = a wäre nur der Zeiger!","",R`int[] kopie = new int[a.length];
for (int i = 0; i < a.length; i++)
  kopie[i] = a[i];`],
["Maximum suchen","Mit a[0] als vorläufigem Maximum beginnen, ab Index 1 alle prüfen.","",R`int max = a[0];
for (int i = 1; i < a.length; i++)
  if (a[i] > max) max = a[i];`],
["Wert suchen (von hinten)","Mit der letzten Position beginnen. Nach der Schleife: pos == -1 heißt nicht gefunden, sonst steht der Wert an pos.","",R`int pos = a.length - 1;
while (pos >= 0 && a[pos] != gesucht)
  pos--;`],
["Reihenfolge bei der Suche","pos >= 0 muss links von && stehen: Durch die Kurzschlussauswertung wird a[-1] dann nie gelesen."],
["Array als Nachschlagetabelle","Tage pro Monat stehen im Array, der Monat ist der Index. Effizienter als switch. Die 0 vorne sorgt dafür, dass Monat 1 auch Index 1 ist.","",R`int[] tageProMonat = {0, 31, 28, 31, 30, 31, 30,
                      31, 31, 30, 31, 30, 31};`]],
quiz:[
{q:"Was gibt das aus?",code:"int[] a = new int[4];\nint[] b = a;\na[2] = 7;\nb[0] = 5;\na = new int[3];\nIO.println(a[0] + \" \" + b[0] + \" \" + b[2]);",o:["`0 5 7`","`5 5 7`","`0 5 0`","`0 0 7`"],c:[0],run:1,e:"b zeigt weiter auf das alte Array mit 5 und 7; a zeigt auf ein neues mit lauter 0."},
{q:"Welche Zeilen sind gültig, wenn vorher `int[] u;` steht?",o:["`u = new int[]{1, 3};`","`u = new int[2];`","`u = {1, 3};`","`u = new int[];`"],c:[0,1],e:"{ } allein geht nur direkt bei der Deklaration. new int[] braucht Länge oder Werte."},
{q:"a hat 7 Elemente, `i = 6`. Was passiert bei `a[i] = a[i+1] / 2;`?",o:["Laufzeitfehler","Compilerfehler","a[6] wird 0","a[6] bleibt gleich"],c:[0],e:"a[7] gibt es nicht. Der Compiler prüft Indizes nicht."},
{q:"Was gibt das aus?",code:"int[] a = {4, 9, 2, 9, 1};\nint pos = a.length - 1;\nwhile (pos >= 0 && a[pos] != 9)\n  pos--;\nIO.println(pos);",o:["`3`","`1`","`9`","`-1`"],c:[0],run:1,e:"Von hinten: Index 4 (1) nein, Index 3 (9) ja."},
{q:"Was steht in pos, wenn der gesuchte Wert nicht vorkommt?",code:"int pos = a.length - 1;\nwhile (pos >= 0 && a[pos] != gesucht)\n  pos--;",o:["-1","0","a.length","Laufzeitfehler"],c:[0],e:"Die Schleife zählt bis -1 herunter; dann ist pos >= 0 false."},
{q:"Was passiert, wenn man in der Suche die Bedingungen vertauscht und der Wert nicht vorkommt?",code:"while (a[pos] != gesucht && pos >= 0)\n  pos--;",o:["Laufzeitfehler bei a[-1]","Kein Unterschied","Endlosschleife","Compilerfehler"],c:[0],e:"a[pos] wird mit pos = -1 gelesen, bevor pos >= 0 geprüft wird."},
{q:"Warum steht in `tageProMonat` vorne eine 0?",code:"int[] tageProMonat = {0, 31, 28, 31, 30, 31, 30,\n                      31, 31, 30, 31, 30, 31};",o:["Damit der Monat direkt als Index dient","Weil Arrays mit 0 beginnen müssen","Für Schaltjahre","Als Endemarkierung"],c:[0],e:"tageProMonat[1] ist der Jänner; Index 0 bleibt ungenutzt."},
{q:"Was bedeutet Garbage Collection?",o:["Nicht mehr referenzierte Objekte werden automatisch freigegeben","Nicht belegte Elemente werden gelöscht","Variablen werden auf 0 gesetzt","Der Programmierer muss Arrays löschen"],c:[0],e:"Ihr Speicherplatz steht dann für neue Objekte zur Verfügung."},
{q:"Warum beginnt die Maximumsuche mit `max = a[0]` statt `max = 0`?",o:["Bei lauter negativen Werten wäre 0 falsch","0 ist kein int","Es ist schneller","Weil Arrays mit 0 vorbelegt sind"],c:[0],e:"0 käme im Array vielleicht gar nicht vor."},
{q:"Was gibt das aus?",code:"int[] a = {2, 3, 5};\nint[] kopie = new int[a.length];\nfor (int i = 0; i < a.length; i++)\n  kopie[i] = a[i];\na[0] = 99;\nIO.println(kopie[0]);",o:["`2`","`99`","`0`","`3`"],c:[0],run:1,e:"Echte Kopie: zwei verschiedene Array-Objekte."},
{q:"Was ist nach `int[] a;` (lokale Variable) richtig?",o:["Es gibt noch kein Array-Objekt","a hat Länge 0","a[0] ist 0","Die Länge ist noch nicht festgelegt"],c:[0,3],e:"Deklariert ist nur die Variable. Erst new erzeugt das Array."}
]},
{id:"arrays2d",name:"2D-Arrays, for-each, MinSort, Kommandozeile",quelle:"Folien Kap. 6 (S. 107–112)",kat:kat(59,64),
terms:[
["Zweidimensionales Array","Array von Arrays (Matrix): a[zeile][spalte].","",R`int[][] a;
a = new int[3][4];   // 3 Zeilen, 4 Spalten
int m = a[2][1];     // Zeile 2, Spalte 1`],
["a.length und a[zeile].length","a.length ist die Anzahl der Zeilen, a[zeile].length die Länge dieser Zeile.","new int[3][4]: a.length ist 3, a[0].length ist 4"],
["2D-Array durchlaufen","Geschachtelte Schleifen: außen Zeilen, innen Spalten.","",R`for (int zeile = 0; zeile < a.length; zeile++)
  for (int spalte = 0; spalte < a[zeile].length; spalte++)
    a[zeile][spalte] = zeile + spalte;`],
["Zeilen mit unterschiedlicher Länge","Nur die Zeilenanzahl angeben und jede Zeile selbst erzeugen. Vorher ist die Zeile null.","",R`int[][] v = new int[2][];
v[0] = new int[5];
v[1] = new int[3];`],
["Mehr als zwei Dimensionen","Deklaration, Erzeugung und Zugriff analog.","int[][][] h = new int[3][2][5];"],
["for-each-Schleife (enhanced for)","Durchläuft alle Elemente vom ersten an. Nur lesend (bei primitiven Typen), nur ein Array gleichzeitig. Der Variablentyp muss zum Elementtyp passen.","",R`for (int el : a)
  IO.print(el + " ");`],
["Sortieren – Spezifikation","Elemente so umstellen, dass für alle i mit 0 <= i < werte.length - 1 gilt: werte[i] <= werte[i+1]. Mehrfache Werte sind erlaubt, kein zusätzliches Array nötig."],
["MinSort – Idee","Minimum ab Position i suchen und an Position i tauschen, für i = 0, 1, 2, … bis zum vorletzten Platz.","3 9 6 5 8 → 3 5 6 9 8 → 3 5 6 9 8 → 3 5 6 8 9",MINSORT],
["Tauschen mit Hilfsvariable","Drei Schritte, sonst geht ein Wert verloren.","",R`int h = werte[i];
werte[i] = werte[minPos];
werte[minPos] = h;`],
["Anzahl der Vergleiche bei MinSort","Bei n Elementen (n-1) + (n-2) + … + 1 = n·(n-1)/2. Doppelte Länge bedeutet ungefähr vierfacher Aufwand. (Die Folie stellt diese Frage nur; die Antwort ist ergänzt.)","n = 5: 4 + 3 + 2 + 1 = 10 Vergleiche"],
["Kommandozeilen-Parameter: String[] args","Werte hinter dem Programmnamen landen beim Start als Strings in args. Zahlen muss man umwandeln. Gut für „technische“ Zwecke, z. B. Dateinamen.","java KommandoZeile Wir 10 → args[0] ist \"Wir\", args[1] ist \"10\"",R`void main(String[] args) {
  String name = args[0];
  int n = Integer.parseInt(args[1]);
}`]],
quiz:[
{q:"Was gibt das aus?",code:"int[][] a = new int[3][4];\nIO.println(a.length + \" \" + a[0].length);",o:["`3 4`","`4 3`","`12 4`","`3 3`"],c:[0],run:1,e:"Erst Zeilen, dann Spalten."},
{q:"Was gibt das aus?",code:"int[][] a = new int[3][4];\nfor (int z = 0; z < a.length; z++)\n  for (int s = 0; s < a[z].length; s++)\n    a[z][s] = z + s;\nIO.println(a[2][3]);",o:["`5`","`6`","`0`","Laufzeitfehler"],c:[0],run:1,e:"2 + 3 = 5; a[2][3] ist das letzte Element."},
{q:"Was gibt das aus?",code:"int[][] v = new int[2][];\nv[0] = new int[5];\nIO.println(v[0].length + \" \" + v[1]);",o:["`5 null`","`5 0`","`5 []`","Compilerfehler"],c:[0],run:1,e:"Zeile 1 wurde noch nicht erzeugt, dort steht null."},
{q:"Was gibt das aus?",code:"int[] a = {1, 2, 3};\nfor (int el : a)\n  el = el * 10;\nIO.println(a[0]);",o:["`1`","`10`","`0`","Compilerfehler"],c:[0],run:1,e:"for-each ändert das Array bei primitiven Elementen nicht."},
{q:"Wofür ist for-each **ungeeignet**?",o:["Zwei Arrays parallel durchlaufen","Elemente auf 0 setzen","Summe berechnen","Alle Elemente ausgeben"],c:[0,1],e:"Es geht nur ein Array, und nur lesend."},
{q:"Wie sieht `{3, 9, 6, 5, 8}` nach dem Durchgang i = 1 von MinSort aus?",code:MINSORT,o:["3 5 6 9 8","3 6 9 5 8","3 5 6 8 9","3 5 9 6 8"],c:[0],e:"i = 0: Minimum 3 steht schon richtig. i = 1: Minimum 5 tauscht mit 9."},
{q:"Warum läuft die äußere Schleife von MinSort nur bis `werte.length - 1` (ausschließlich)?",code:MINSORT,o:["Das letzte Element steht dann automatisch richtig","Sonst gibt es immer einen Laufzeitfehler","Das letzte Element ist das Minimum","Weil der Index bei 1 beginnt"],c:[0],e:"Bleibt nur ein Element übrig, ist es das größte."},
{q:"Wie viele Vergleiche von Elementen macht MinSort bei 6 Elementen?",code:MINSORT,o:["15","36","6","30"],c:[0],e:"5 + 4 + 3 + 2 + 1 = 15."},
{q:"Start mit `java KommandoZeile Wir 10`. Was steht in `args[1]`?",o:["der String \"10\"","die Zahl 10","\"Wir\"","\"KommandoZeile\""],c:[0],e:"Alle Parameter sind Strings, und der Programmname zählt nicht mit."},
{q:"Start ohne Parameter: Was passiert bei `String name = args[0];`?",o:["Laufzeitfehler: Index außerhalb","name ist null","name ist leer","Compilerfehler"],c:[0],e:"args hat dann Länge 0."},
{q:"Was gilt nach dem aufsteigenden Sortieren?",o:["werte[i] <= werte[i+1] für alle gültigen i","werte[i] < werte[i+1] für alle gültigen i","Alle Werte sind verschieden","werte[0] ist das Minimum"],c:[0,3],e:"Wegen möglicher gleicher Werte <= und nicht <."}
]}];
T.forEach(function(t){t.quiz.forEach(function(q){q.q=q.q.replace(/\*\*/g,"")})});
var L=FACH.java.themen;
function pos(id){for(var i=0;i<L.length;i++) if(L[i].id===id) return i; return L.length}
L.splice.apply(L,[pos("switch")+1,0].concat(T));
/* Reihenfolge: Grundlagen-Themen nach Kap. 6, Bsp06 ganz ans Ende */
var v=L.splice(pos("vektoren"),1)[0];
L.splice(pos("wiederholung")+1,0,{id:"wiederholung2",name:"Wiederholungsfragen Kap. 5–6",quelle:"Wiederholungsfragen (PDF), Nr. 43–64",terms:W,
quiz:[
{q:"Kann ein Schleifenrumpf 0-mal ausgeführt werden?",o:["Ja, bei while und for","Ja, bei do-while","Nein, nie","Nur mit break"],c:[0],e:"Nur do-while läuft immer mindestens einmal."},
{q:"Welche Angaben gehören zur Deklaration einer Array-Variablen?",o:["Elementtyp","[]","Name","Länge"],c:[0,1,2],e:"Die Länge kommt erst bei der Erzeugung."},
{q:"Was enthält eine Array-Variable?",o:["einen Zeiger auf das Array-Objekt","alle Elemente","das erste Element","die Länge"],c:[0],e:"Das unterscheidet sie von primitiven Variablen."},
{q:"Auf welchen Teiloperationen beruht MinSort?",o:["Vergleichen bei der Minimumsuche","Vertauschen","Aufsummieren","Kopieren in ein zweites Array"],c:[0,1],e:"Sortiert wird im selben Array."},
{q:"Was ist ein Parameter in der Kommandozeile?",o:["Ein Wert, der beim Programmstart mitgegeben wird","Eine Eingabe mit IO.readln","Ein Parameter der Methode IO.println","Eine Konstante"],c:[0],e:"Er steht als String in args."},
{q:"Welcher Teil der for-Schleife wird nur einmal ausgeführt?",o:["Initialisierungsteil","Schleifenbedingung","Aktualisierungsteil","Schleifenrumpf"],c:[0],e:"Die anderen wiederholen sich."}]});
L.push(v);
/* Kleine Folien-Änderung (neue Fassung): char */
FACH.java.hinweis=FACH.java.hinweis.replace(/ Neu zu Aufgabe 06:[\s\S]*$/,"")+" Kapitel 5 (Schleifen) und 6 (Arrays) aus den neuen Folien (S. 81–112) sind eingebaut, samt Wiederholungsfragen 43–64. Bsp06 (Vektoren) steht ganz unten.";
FACH.java.zeichen.push({g:"Schleifen (Kap. 5)",rows:[
["n++ / ++n","Inkrement","n = n + 1","erst lesen / erst erhöhen"],["n-- / --n","Dekrement","n = n - 1",""],
["+= -= *= /= %=","Operator mit Zuweisung","x += y heißt x = x + y",""],
["do … while (…);","Durchlaufschleife","mindestens einmal",""],["for (…; …; …)","Zählschleife","Init; Bedingung; Aktualisierung",""],
["for (int el : a)","for-each-Schleife","alle Elemente, nur lesend",""],["break","Schleife beenden","",""],["continue","nächste Iteration","",""],["a[z][s]","2D-Array","Zeile z, Spalte s",""]]});
})();
