/* Themen zu Aufgabe 06 (Vektoren): Arrays, Arrays & Methoden, Vektor-Operationen. Eigene Texte, Codeausgaben mit Java 25 geprüft. */
(function(){
var R=String.raw;
var T=[
{ id:"arrays", name:"Arrays – Grundlagen", quelle:"Grundlage für PS-Aufgabe 06",
terms:[
["Array","Eine Reihe von Werten gleichen Typs unter einem Namen. Jeder Wert hat eine Nummer (Index), und die erste Nummer ist 0.","Schließfächer: Fach 0, Fach 1, Fach 2 …",R`double[] v = new double[]{1.0, 2.0, 3.0};
IO.println(v[0]);   // 1.0
IO.println(v[2]);   // 3.0`],
["Array deklarieren und erzeugen","Links steht der Typ mit [], rechts erzeugt new das eigentliche Array. Drei Schreibweisen:","Die Kurzform nur mit { … } geht nur direkt bei der Deklaration – nicht nach return und nicht bei einer späteren Zuweisung.",R`double[] a = new double[3];               // 3 Plätze, alle 0.0
double[] b = new double[]{1.0, 2.0, 3.0};  // mit Werten
double[] c = {1.0, 2.0, 3.0};              // Kurzform`],
["Standardwerte","Nach new typ[n] ist das Array schon gefüllt: int → 0, double → 0.0, boolean → false, String und andere Referenztypen → null.","",R`double[] w = new double[2];   // [0.0, 0.0]
String[] s = new String[2];   // [null, null]`],
["Länge: v.length","Anzahl der Elemente. Bei Arrays ohne Klammern, bei Strings mit: s.length(). Die Länge steht beim Erzeugen fest und ändert sich nie.","Im Bsp06 gibt es zusätzlich eine eigene Methode length(v) – die rechnet die geometrische Länge aus und hat mit v.length nichts zu tun!"],
["Gültige Indizes","0 bis v.length - 1. Alles andere stürzt beim Ausführen ab: ArrayIndexOutOfBoundsException.","Länge 3 → Indizes 0, 1, 2. v[3] gibt es nicht. v[-1] auch nicht."],
["for-Schleife über ein Array","Das Standardmuster – auswendig können! i = 0, solange i < v.length, i++.","Wenn du <= statt < schreibst, läuft die Schleife einmal zu weit und stürzt ab.",R`for (int i = 0; i < v.length; i++) {
  IO.println(v[i]);
}`],
["for-each-Schleife","Holt der Reihe nach jeden Wert. Kürzer, aber ohne Index: zum Lesen gut, zum Ändern ungeeignet.","Brauchst du i (z. B. für w[i] = v1[i] + v2[i]), nimm die normale for-Schleife.",R`double summe = 0.0;
for (double x : v) {
  summe += x;
}`],
["Leeres Array","new double[0] ist ein echtes Array mit Länge 0. Schleifen darüber laufen einfach 0-mal. Es ist nicht dasselbe wie null.","Deshalb gibt print(new double[0]) nur [] aus – ganz ohne Sonderfall."],
["Array ausgeben","IO.println(v) zeigt nur etwas wie [D@1b6d3586 (Typ und Hashcode). Den Inhalt bekommst du mit einer Schleife oder mit Arrays.toString(v).","Ist die Variable null, gibt IO.println(v) ganz normal null aus. Genau das nutzt die main von Bsp06."]
],
quiz:[
{q:"Welche Indizes hat `double[] v = new double[4];`?",o:["0 bis 3","1 bis 4","0 bis 4","1 bis 3"],c:[0],e:"Gezählt wird ab 0, der letzte Index ist `v.length - 1`."},
{q:"Wie bekommt man die Anzahl der Elemente eines Arrays `v`?",o:["`v.length`","`v.length()`","`v.size()`","`length(v)`"],c:[0],e:"Bei Arrays ohne Klammern. `s.length()` mit Klammern gehört zu Strings. `length(v)` ist im Bsp06 deine eigene Methode (Wurzel der Quadratsumme)."},
{q:"Was gibt das aus?",code:"double[] v = new double[2];\nIO.println(v[1]);",o:["`0.0`","`0`","`null`","Laufzeitfehler"],c:[0],run:1,e:"double-Arrays werden mit 0.0 gefüllt; Index 1 ist der zweite und letzte Platz."},
{q:"Was passiert hier?",code:"double[] v = {1.0, 2.0, 3.0};\nfor (int i = 0; i <= v.length; i++) {\n  IO.println(v[i]);\n}",o:["Gibt 1.0, 2.0, 3.0 aus und stürzt dann ab","Gibt 1.0, 2.0, 3.0 aus und endet normal","Compilerfehler","Gibt nur 1.0 und 2.0 aus"],c:[0],e:"Bei i = 3 ist `3 <= 3` noch true, aber v[3] existiert nicht → ArrayIndexOutOfBoundsException."},
{q:"Was gibt das aus?",code:"int[] a = {3, 5, 7};\nIO.println(a[a.length - 1]);",o:["`7`","`5`","`3`","Laufzeitfehler"],c:[0],run:1,e:"Länge 3, also a[2] – so greift man auf das letzte Element zu."},
{q:"Was gibt das aus?",code:"double[] v = new double[0];\nfor (int i = 0; i < v.length; i++) {\n  IO.print(v[i]);\n}\nIO.println(\"fertig\");",o:["`fertig`","`0.0fertig`","`nullfertig`","Laufzeitfehler"],c:[0],run:1,e:"Länge 0: `0 < 0` ist sofort false, die Schleife läuft gar nicht."},
{q:"Welche Zeilen kompilieren nicht?",o:["`double[3] v;`","`return {1.0, 2.0};`","`double[] v = {1.0, 2.0};`","`return new double[]{1.0, 2.0};`"],c:[0,1],e:"Die Größe gehört nicht zum Typ, und die Kurzform { … } ist nur bei der Deklaration erlaubt. Nach return braucht es `new double[]{…}`."},
{q:"Was bewirkt `x = x * 2;` in dieser Schleife?",code:"double[] v = {1.0, 2.0};\nfor (double x : v) {\n  x = x * 2;\n}\nIO.println(v[0]);",o:["`1.0`","`2.0`","`4.0`","Compilerfehler"],c:[0],run:1,e:"x ist nur eine Kopie des Werts. Das Array bleibt, wie es ist."},
{q:"Was gibt das aus?",code:"int[] a = new int[]{4, 1, 3};\na[1] = a[0] + a[2];\nIO.println(a[1]);",o:["`7`","`5`","`1`","`4`"],c:[0],run:1,e:"a[0] + a[2] = 4 + 3 = 7 wird auf Platz 1 gespeichert."},
{q:"Kann man ein Array mit 3 Plätzen nachträglich auf 4 verlängern?",o:["Nein, man muss ein neues Array anlegen und kopieren","Ja, mit `v.length = 4`","Ja, mit `v[3] = …`","Ja, mit `v.add(…)`"],c:[0],e:"Die Länge steht ab dem Erzeugen fest. `v.length = 4` ist sogar ein Compilerfehler (length ist final)."}
]},
{ id:"arraymethoden", name:"Arrays & Methoden: Referenzen, null, neues Array", quelle:"Grundlage für PS-Aufgabe 06",
terms:[
["Referenz","Eine Array-Variable enthält nicht die Werte, sondern einen Verweis auf das Array.","Wie ein Zettel mit der Adresse eines Hauses. Zwei Zettel können dieselbe Adresse tragen."],
["b = a kopiert nur die Referenz","Danach zeigen beide Variablen auf dasselbe Array. Änderst du b[0], ändert sich auch a[0].","",R`double[] a = {1.0, 2.0};
double[] b = a;
b[0] = 9.0;
IO.println(a[0]);   // 9.0`],
["„Parameter nicht verändern“","Auch beim Aufruf wird nur die Referenz kopiert. v[i] = … in der Methode ändert also das Original beim Aufrufer! Im Bsp06 ist das verboten.","Regel: Auf der linken Seite von = steht immer w[…], nie v[…]."],
["Muster „neues Array zurückgeben“","Neues Array w in der passenden Länge anlegen, in der Schleife füllen, return w nach der Schleife.","So sind add, sub, mul, normalize und shift alle gebaut.",R`double[] mul(double[] v, double s) {
  double[] w = new double[v.length];
  for (int i = 0; i < w.length; i++) {
    w[i] = v[i] * s;
  }
  return w;
}`],
["Muster „aufsummieren“","Summe mit 0 vor der Schleife anlegen, in der Schleife dazuzählen, danach zurückgeben.","Baut dot (und darüber lengthSq und length).",R`double sum = 0.0;
for (int i = 0; i < v.length; i++) {
  sum += v[i];
}
return sum;`],
["null","„Zeigt auf kein Array.“ Erlaubt für Referenztypen (Arrays, Strings, Objekte), aber nicht für int, double, boolean.","Deshalb gibt add bei falscher Dimension null zurück, dot aber 0 – double kann nicht null sein."],
["NullPointerException","Passiert, wenn man null wie ein Array benutzt: v.length oder v[0], wenn v == null ist.","print(add(a, c)) würde im Bsp06 abstürzen, wenn add null liefert. Deshalb steht dort IO.println(add(a, c))."],
["null ist nicht leer","null = kein Array. new double[0] = ein Array ohne Elemente. v == null prüft auf null, v.length == 0 auf leer.","Zuerst auf null prüfen, dann erst .length: v == null || v.length == 0"],
["Guard Clause (Sonderfall zuerst)","Am Anfang der Methode prüfen und sofort mit return aussteigen. Danach kann man sich auf gültige Werte verlassen.","",R`if (!sameDimension(v1, v2)) {
  return null;
}
// ab hier: gleiche Länge`],
["Arrays vergleichen","== vergleicht nur, ob es dasselbe Array ist. Den Inhalt vergleicht man elementweise: erst Länge, dann alle Elemente.","Fertig heißt die Methode Arrays.equals(a, b)."],
["Methoden wiederverwenden","Was es schon gibt, nochmal aufrufen statt neu schreiben.","lengthSq(v) = dot(v, v), length(v) = Math.sqrt(lengthSq(v)), normalize benutzt length."],
["iff","„if and only if“ = genau dann, wenn. „return true iff n == m“ heißt: true, wenn gleich, und sonst false.","Also einfach return v1.length == v2.length; – kein if nötig."],
["Javadoc: @param und @return","Der Kommentar /** … */ beschreibt eine Methode. @param erklärt einen Parameter, @return das Ergebnis. Er enthält alle Sonderfälle!","Lies das „otherwise“ in @return zuerst: Das ist deine Guard Clause."]
],
quiz:[
{q:"Was gibt das aus?",code:"double[] a = {1.0, 2.0};\ndouble[] b = a;\nb[1] = 7.0;\nIO.println(a[1]);",o:["`7.0`","`2.0`","`1.0`","Compilerfehler"],c:[0],run:1,e:"a und b verweisen auf dasselbe Array."},
{q:"Was gibt das aus?",code:"double[] a = {1.0, 2.0};\ndouble[] b = {1.0, 2.0};\nIO.println(a == b);",o:["`false`","`true`","`[1.0, 2.0]`","Compilerfehler"],c:[0],run:1,e:"Zwei verschiedene Arrays mit zufällig gleichem Inhalt. == vergleicht nur die Referenzen."},
{q:"Was ist falsch an dieser mul-Methode?",code:"double[] mul(double[] v, double s) {\n  for (int i = 0; i < v.length; i++) {\n    v[i] = v[i] * s;\n  }\n  return v;\n}",o:["Sie verändert den übergebenen Vektor","Sie kompiliert nicht","Sie liefert falsche Werte zurück","Die Schleife läuft zu weit"],c:[0],e:"Die zurückgegebenen Werte stimmen, aber das Original des Aufrufers ist verändert. Es fehlt `double[] w = new double[v.length];`."},
{q:"Reicht `double[] w = v;`, um das Original zu schützen?",o:["Nein, w und v sind dann dasselbe Array","Ja, w ist eine Kopie","Ja, aber nur bei double","Nur, wenn v final ist"],c:[0],e:"Ohne `new` (oder Arrays.copyOf) entsteht kein neues Array."},
{q:"Warum gibt `dot` bei verschiedenen Dimensionen 0 und nicht null zurück?",o:["Der Rückgabetyp double kann nicht null sein","null ist in Java verboten","0 ist schneller","Weil dot void ist"],c:[0],e:"Nur Referenztypen können null sein. `return null;` in einer double-Methode ist ein Compilerfehler."},
{q:"`add(a, c)` liefert null. Was passiert bei `print(add(a, c))`?",o:["NullPointerException bei `v.length`","Ausgabe `null`","Ausgabe `[]`","Compilerfehler"],c:[0],e:"print greift auf v.length zu, und v ist null. `IO.println(add(a, c))` gibt dagegen null aus."},
{q:"Welche Bedingung ist sicher, auch wenn v null sein kann?",o:["`v == null || v.length == 0`","`v.length == 0 || v == null`","`v.length == null`","`v.equals(null)`"],c:[0],e:"Kurzschluss: Ist v == null schon true, wird v.length gar nicht mehr ausgewertet."},
{q:"Was bedeutet „@return true iff dimensions n == m“?",o:["true genau dann, wenn n == m, sonst false","true, wenn n == m, sonst beliebig","true, außer n == m","Tippfehler für if"],c:[0],e:"iff = if and only if."},
{q:"Was gibt `test()` zurück?",code:"double test() {\n  double[] v = {1.0, 2.0, 3.0};\n  double sum = 0.0;\n  for (int i = 0; i < v.length; i++) {\n    sum = sum + v[i];\n    return sum;\n  }\n  return sum;\n}",o:["1.0","6.0","0.0","Compilerfehler"],c:[0],e:"Das return steht in der Schleife und beendet die Methode schon nach dem ersten Durchgang."},
{q:"Was gibt das Programm aus?",code:"void aendern(double[] v, double x) {\n  v[0] = 5.0;\n  x = 5.0;\n}\nvoid main() {\n  double[] a = {1.0};\n  double b = 1.0;\n  aendern(a, b);\n  IO.println(a[0] + \" \" + b);\n}",o:["`5.0 1.0`","`5.0 5.0`","`1.0 1.0`","`1.0 5.0`"],c:[0],run:2,e:"Das Array wird über die Referenz verändert, der double nur in der Kopie."},
{q:"Was gibt das Programm aus?",code:"void ersetzen(double[] v) {\n  v = new double[]{9.0};\n}\nvoid main() {\n  double[] a = {1.0};\n  ersetzen(a);\n  IO.println(a[0]);\n}",o:["`1.0`","`9.0`","`0.0`","`null`"],c:[0],run:2,e:"v zeigt danach auf ein neues Array – nur die lokale Variable ändert sich. a zeigt weiter auf das alte."},
{q:"Welche Schritte gehören zum Muster „neues Array zurückgeben“?",o:["`double[] w = new double[v.length];`","In der Schleife `w[i] = …`","`return w;` nach der Schleife","In der Schleife `v[i] = …`"],c:[0,1,2],e:"v wird nur gelesen, geschrieben wird ausschließlich in w."}
]},
{ id:"vektoren", name:"Vektoren (Bsp06): alle Methoden erklärt", quelle:"PS-Aufgabe 06",
terms:[
["print – Komma nur dazwischen","Trick: das Komma vor jedem Element außer dem ersten ausgeben (if (i > 0)). Dann braucht das leere Array keinen Sonderfall.","IO.print ohne Zeilenumbruch, erst die letzte Klammer mit IO.println.",R`void print(double[] v) {
  IO.print("[");
  for (int i = 0; i < v.length; i++) {
    if (i > 0) {
      IO.print(", ");
    }
    IO.print(v[i]);
  }
  IO.println("]");
}`],
["sameDimension","Vergleicht nur die Längen. Der Vergleich ist schon ein boolean – direkt zurückgeben.","",R`return v1.length == v2.length;`],
["add / sub / mul","Elementweise: gleicher Index mit gleichem Index. add und sub brauchen die Guard Clause, mul nicht (nur ein Vektor).","[1, 2, 3] + [4, 5, 6] = [5, 7, 9]",R`w[i] = v1[i] + v2[i];
w[i] = v1[i] - v2[i];
w[i] = v[i] * s;`],
["dot – Skalarprodukt","Paarweise multiplizieren und alles addieren. Ergebnis ist eine Zahl, kein Vektor.","[1,2,3] · [4,5,6] = 1·4 + 2·5 + 3·6 = 32. Ergibt es 0, stehen die Vektoren senkrecht aufeinander (wenn keiner der Nullvektor ist).",R`double sum = 0.0;
for (int i = 0; i < v1.length; i++) {
  sum += v1[i] * v2[i];
}
return sum;`],
["cross – Kreuzprodukt","Nur für Dimension 3, sonst null. Ergebnis steht senkrecht auf beiden Vektoren.","Merkhilfe: Bei w[i] kommt Index i rechts nie vor. Die Indizes laufen im Kreis 0→1→2→0: w[0] nimmt 1 und 2, w[1] nimmt 2 und 0, w[2] nimmt 0 und 1. Immer „vorwärts minus rückwärts“.",R`w[0] = v1[1] * v2[2] - v1[2] * v2[1];
w[1] = v1[2] * v2[0] - v1[0] * v2[2];
w[2] = v1[0] * v2[1] - v1[1] * v2[0];`],
["lengthSq und length","Quadrierte Länge = Summe der Quadrate = dot(v, v). Länge = Wurzel daraus (Pythagoras).","[3, 0, 4]: 9 + 0 + 16 = 25 → Länge 5. Das leere Array ergibt automatisch 0.",R`double lengthSq(double[] v) {
  return dot(v, v);
}
double length(double[] v) {
  return Math.sqrt(lengthSq(v));
}`],
["normalize – Einheitsvektor","Jedes Element durch die Länge teilen. Nicht möglich bei Länge 0 → null.","Länge einmal vor der Schleife in einer Variable speichern. Sonst wird sie in jedem Durchgang neu berechnet (ineffizient).",R`double len = length(v);
if (len == 0.0) {
  return null;
}`],
["Warum die Prüfung auf 0 nötig ist","0.0 / 0.0 stürzt bei double nicht ab, sondern ergibt NaN („keine Zahl“). Der Fehler fällt also nicht auf.","Nur bei int gibt Division durch 0 eine ArithmeticException."],
["shift – verschieben mit Umrunden","Element i landet auf Platz (i + offset) % n. Das % n sorgt fürs Umrunden am Ende.","n = 3, Verschiebung 1: 0→1, 1→2, 2→(3 % 3) = 0.",R`int offset = (amount % n + n) % n;
for (int i = 0; i < n; i++) {
  w[(i + offset) % n] = v[i];
}`],
["% bei negativen Zahlen","In Java hat das Ergebnis von % das Vorzeichen der linken Zahl: -1 % 3 ist -1 und kein gültiger Index!","Immer in den Bereich 0 … n-1 bringen: (x % n + n) % n. Beispiel: (-1 % 3 + 3) % 3 = 2. Schritt 1: zu groß/klein weg, Schritt 2: negativ weg, Schritt 3: falls jetzt genau n, zurück auf 0."],
["% n bei n = 0","amount % 0 ist eine ganzzahlige Division durch 0 → ArithmeticException. Darum muss das leere Array vorher abgefangen werden.","",R`if (n == 0) {
  return w;   // new double[0]
}`],
["Bsp06 in drei Mustern","Neues Array füllen: add, sub, mul, normalize, shift, cross. Aufsummieren: dot. Anderes aufrufen: lengthSq, length.","Plus print (Komma-Trick) und sameDimension (ein Vergleich). Mehr ist es nicht!"],
["Checkliste vor der Abgabe","1. Zeile: // Vorname Nachname, Matrikelnummer. Datei Bsp06.java. Konstanten mit final. Parameter nie verändert. Genau die verlangten Methodennamen und Typen.","Dein Bsp06-Code ist inhaltlich richtig – nur die Kommentarzeile oben darf nicht fehlen!"]
],
quiz:[
{q:"Skalarprodukt von [1, 2, 3] und [2, 0, 1]?",o:["5.0","[2, 0, 3]","6.0","[3, 2, 4]"],c:[0],e:"1·2 + 2·0 + 3·1 = 5. Das Ergebnis ist eine Zahl."},
{q:"Was gibt das aus?",code:"IO.println(-1 % 3);",o:["`-1`","`2`","`1`","`0`"],c:[0],run:1,e:"Java übernimmt das Vorzeichen der linken Zahl."},
{q:"Was gibt das aus?",code:"IO.println((-4 % 3 + 3) % 3);",o:["`2`","`-1`","`1`","`0`"],c:[0],run:1,e:"-4 % 3 = -1, +3 = 2, 2 % 3 = 2."},
{q:"Warum steht in `(amount % n + n) % n` ganz hinten nochmal `% n`?",o:["Damit aus n (z. B. bei amount = 0) wieder 0 wird","Damit negative Zahlen positiv werden","Wegen Division durch 0","Es ist überflüssig"],c:[0],e:"amount = 0: 0 % 3 + 3 = 3, erst % 3 macht daraus 0. Negativ → positiv erledigt schon das + n."},
{q:"shift([1, 2, 3, 4], 1) ergibt …",o:["[4, 1, 2, 3]","[2, 3, 4, 1]","[1, 2, 3, 4]","[4, 3, 2, 1]"],c:[0],e:"Positiv = nach rechts; die letzte Zahl wandert nach vorne."},
{q:"shift([1, 2, 3, 4], -5) ist gleich wie …",o:["shift(v, -1)","shift(v, 3)","shift(v, 1)","shift(v, 5)"],c:[0,1],e:"-5 % 4 = -1, und einmal nach links ist bei Länge 4 dasselbe wie dreimal nach rechts."},
{q:"Was passiert bei shift mit leerem Array, wenn die Prüfung `n == 0` fehlt?",o:["ArithmeticException wegen `amount % 0`","Es kommt [] heraus","NullPointerException","NaN"],c:[0],e:"Bei int ist % 0 ein Laufzeitfehler."},
{q:"Was gibt das aus?",code:"double len = 0.0;\nIO.println(0.0 / len);",o:["`NaN`","`0.0`","`Infinity`","Laufzeitfehler"],c:[0],run:1,e:"0.0 / 0.0 ist „Not a Number“ – kein Absturz. Deshalb prüft normalize vorher."},
{q:"Was gibt das aus?",code:"IO.println(5.0 / 0);",o:["`Infinity`","`NaN`","`0.0`","Laufzeitfehler"],c:[0],run:1,e:"Die 0 wird zu 0.0; eine positive Zahl durch 0.0 ist Infinity. Nur int / int mit 0 stürzt ab."},
{q:"Beim Kreuzprodukt ist w[1] = …",o:["`v1[2] * v2[0] - v1[0] * v2[2]`","`v1[0] * v2[2] - v1[2] * v2[0]`","`v1[1] * v2[1]`","`v1[1] * v2[2] - v1[2] * v2[1]`"],c:[0],e:"Index 1 kommt rechts nicht vor, und im Kreis folgt auf 1 die 2, dann die 0: 2·0 − 0·2."},
{q:"Was ist an dieser Schleife ineffizient?",code:"for (int i = 0; i < w.length; i++) {\n  w[i] = v[i] / length(v);\n}",o:["length(v) wird in jedem Durchgang neu berechnet","Die Schleife läuft zu oft","w sollte v sein","Nichts"],c:[0],e:"length(v) läuft selbst durch das ganze Array. Besser einmal vorher: `double len = length(v);`."},
{q:"Was gibt `print` aus, wenn das Komma mit `if (i > 0)` vor dem Element kommt und v = [5.0] ist?",o:["`[5.0]`","`[, 5.0]`","`[5.0, ]`","`5.0`"],c:[0],e:"Bei i = 0 kommt kein Komma, und mehr Elemente gibt es nicht."},
{q:"Welche Methoden kommen ohne eigene Schleife aus?",o:["lengthSq","length","cross","normalize"],c:[0,1,2],e:"lengthSq ruft dot auf, length ruft lengthSq auf, cross besteht aus drei festen Formeln. normalize muss jedes Element teilen."},
{q:"Was liefert cross([1, 2], [1, 2])?",o:["null","0","[0, 0]","Laufzeitfehler"],c:[0],e:"Gleich lang, aber nicht Dimension 3. Es müssen beide Bedingungen stimmen (n == m == 3)."},
{q:"Wann gibt normalize null zurück?",o:["Beim leeren Vektor","Bei [0.0, 0.0]","Bei [0.0, 1.0]","Bei Vektoren mit negativen Werten"],c:[0,1],e:"In beiden Fällen ist die Länge 0. [0.0, 1.0] hat Länge 1 und bleibt gleich."}
]}
];
/* Zusatzhinweise (2. Text) in die Erklärung ziehen – die Anzeige würde sonst „Beispiel:“ davorschreiben */
T.forEach(function(t){t.terms.forEach(function(x){ if(x[2]){ x[1]+="\n→ "+x[2]; x[2]=""; } })});
var L=FACH.java.themen, at=L.length;
L.forEach(function(t,i){ if(t.id==="beispiele") at=i; });
L.splice.apply(L,[at,0].concat(T));
FACH.java.zeichen.push({g:"Arrays",rows:[
["double[] v","Array-Variable","Referenz auf ein Array",""],
["new double[n]","neues Array","n Plätze, alle 0.0",""],
["new double[]{1.0, 2.0}","neues Array mit Werten","",""],
["v[i]","Element","Index 0 bis v.length - 1",""],
["v.length","Länge","ohne Klammern!",""],
["null","kein Objekt","nur für Referenztypen","return null;"],
["(x % n + n) % n","Umrunden","immer 0 bis n-1","(-1 % 3 + 3) % 3 → 2"],
["Math.sqrt(x)","Wurzel","liefert double","Math.sqrt(9.0) → 3.0"]]});
FACH.java.hinweis+=" Neu zu Aufgabe 06: „Arrays – Grundlagen“, „Arrays & Methoden“ und „Vektoren (Bsp06)“. Passende Schreibaufgaben findest du unter „Üben“, die Programme unter „Verstehen“.";
})();
