/* Aufgabe 06 (Vektoren): zuerst jede Methode einzeln, dann ähnliche Array-Methoden, dann Bsp06 komplett, Fehler finden, Vorhersagen.
   Alle Musterlösungen mit echtem Java 25 geprüft. */
(function(){
if(!window.UEBUNG) return;
var R=String.raw, X=[];
var M={
print:R`void print(double[] v) {
  IO.print("[");
  for (int i = 0; i < v.length; i++) {
    if (i > 0) {
      IO.print(", ");
    }
    IO.print(v[i]);
  }
  IO.println("]");
}`,
same:R`boolean sameDimension(double[] v1, double[] v2) {
  return v1.length == v2.length;
}`,
mul:R`double[] mul(double[] v, double s) {
  double[] w = new double[v.length];
  for (int i = 0; i < w.length; i++) {
    w[i] = v[i] * s;
  }
  return w;
}`,
dot:R`double dot(double[] v1, double[] v2) {
  if (!sameDimension(v1, v2)) {
    return 0.0;
  }
  double sum = 0.0;
  for (int i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }
  return sum;
}`,
cross:R`double[] cross(double[] v1, double[] v2) {
  final int DIM = 3;
  if (v1.length != DIM || v2.length != DIM) {
    return null;
  }
  double[] w = new double[DIM];
  w[0] = v1[1] * v2[2] - v1[2] * v2[1];
  w[1] = v1[2] * v2[0] - v1[0] * v2[2];
  w[2] = v1[0] * v2[1] - v1[1] * v2[0];
  return w;
}`,
lsq:R`double lengthSq(double[] v) {
  return dot(v, v);
}`,
len:R`double length(double[] v) {
  return Math.sqrt(lengthSq(v));
}`,
norm:R`double[] normalize(double[] v) {
  double len = length(v);
  if (len == 0.0) {
    return null;
  }
  double[] w = new double[v.length];
  for (int i = 0; i < w.length; i++) {
    w[i] = v[i] / len;
  }
  return w;
}`,
shift:R`double[] shift(double[] v, int amount) {
  int n = v.length;
  double[] w = new double[n];
  if (n == 0) {
    return w;
  }
  int offset = (amount % n + n) % n;
  for (int i = 0; i < n; i++) {
    w[(i + offset) % n] = v[i];
  }
  return w;
}`};
function addsub(n,op){return "double[] "+n+"(double[] v1, double[] v2) {\n  if (!sameDimension(v1, v2)) {\n    return null;\n  }\n  double[] w = new double[v1.length];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v1[i] "+op+" v2[i];\n  }\n  return w;\n}"}
M.add=addsub("add","+"); M.sub=addsub("sub","-");
/* Hilfsausgabe für die Tests: verträgt auch null */
var ZEIGE="void zeige(double[] x) {\n  if (x == null) {\n    IO.println(\"null\");\n  } else {\n    IO.println(Arrays.toString(x));\n  }\n}";
function h(){return Array.prototype.map.call(arguments,function(k){return k==="zeige"?ZEIGE:M[k]}).join("\n\n")+"\n\n"}
function A(){return Array.prototype.map.call(arguments,function(t){return {set:t}})}
var NEU="\n**Wichtig:** Die Parameter dürfen nicht verändert werden – der Test gibt sie danach nochmal aus.";
function ein(o){o.gruppe="vk1"; X.push(o)}
function aeh(o){o.gruppe="vk2"; X.push(o)}
function sig(s){return s+" {\n  \n}"}
var M1=R`void main() {
  double[] a = new double[]{{a}};
`, M2=M1+"  double[] b = new double[]{{b}};\n";

/* ---- 1. Methoden einzeln ---- */
ein({id:"vk_print",titel:"print",kurz:"Komma nur zwischen den Elementen",
aufgabe:"Gib den Vektor in diesem Format aus, mit Zeilenumbruch am Ende:\n`[1.0, 2.0, 3.0]`\nEin leerer Vektor wird zu `[]`.\nDie Methode `Arrays.toString` ist hier verboten.",
nach:M1+"  print(a);\n}",start:sig("void print(double[] v)"),loesung:M.print,
tests:A({a:"1.0, 2.0, 3.0"},{a:""},{a:"5.0"},{a:"-1.5, 0.0"}),
verboten:[[/Arrays\s*\./,"Hier bitte mit einer Schleife, ohne Arrays.toString."]],
tipp:"Erst `IO.print(\"[\")`, dann die Schleife. Vor jedem Element **außer dem ersten** kommt `\", \"`: `if (i > 0)`. Zum Schluss `IO.println(\"]\")`."});
ein({id:"vk_same",titel:"sameDimension",kurz:"boolean direkt zurückgeben",
aufgabe:"`boolean sameDimension(double[] v1, double[] v2)` – true genau dann, wenn beide Vektoren gleich viele Elemente haben. Geht in einer Zeile!",
nach:M2+"  IO.println(sameDimension(a, b));\n}",start:sig("boolean sameDimension(double[] v1, double[] v2)"),loesung:M.same,
tests:A({a:"1.0, 2.0",b:"3.0, 4.0"},{a:"1.0",b:"1.0, 2.0"},{a:"",b:""},{a:"",b:"0.0"}),
tipp:"`v1.length` (ohne Klammern) mit `==` vergleichen und das Ergebnis gleich mit return zurückgeben."});
[["add","Addition","+"],["sub","Subtraktion","-"]].forEach(function(d){
ein({id:"vk_"+d[0],titel:d[0],kurz:d[1]+", null bei verschiedener Dimension",
aufgabe:"`double[] "+d[0]+"(double[] v1, double[] v2)` gibt einen **neuen** Vektor mit `w[i] = v1[i] "+d[2]+" v2[i]` zurück. Bei verschiedenen Dimensionen: `null`.\n`sameDimension` ist schon da und darf benutzt werden."+NEU,
nach:h("same","zeige")+M2+"  zeige("+d[0]+"(a, b));\n  zeige(a);\n  zeige(b);\n}",start:sig("double[] "+d[0]+"(double[] v1, double[] v2)"),loesung:M[d[0]],
tests:A({a:"1.0, 2.0, 3.0",b:"4.0, 5.0, 6.0"},{a:"1.0, 2.0",b:"1.0"},{a:"",b:""},{a:"-1.5",b:"2.5"}),
tipp:"Reihenfolge: 1) Guard Clause mit return null, 2) `double[] w = new double[v1.length];`, 3) Schleife, 4) `return w;` **nach** der Schleife."})});
ein({id:"vk_mul",titel:"mul",kurz:"Jedes Element mal Skalar, neues Array",
aufgabe:"`double[] mul(double[] v, double s)` gibt einen neuen Vektor zurück, in dem jedes Element mit s multipliziert ist."+NEU,
nach:h("zeige")+M1+"  zeige(mul(a, {s}));\n  zeige(a);\n}",start:sig("double[] mul(double[] v, double s)"),loesung:M.mul,
tests:A({a:"1.0, 2.0, 3.0",s:"2.0"},{a:"",s:"5.0"},{a:"4.0, -2.0",s:"0.5"}),
tipp:"Wie add, nur ohne Guard Clause: `w[i] = v[i] * s;`."});
ein({id:"vk_dot",titel:"dot (Skalarprodukt)",kurz:"Aufsummieren, 0 bei verschiedener Dimension",
aufgabe:"`double dot(double[] v1, double[] v2)` – Skalarprodukt: v1[0]·v2[0] + v1[1]·v2[1] + … Bei verschiedenen Dimensionen 0. `sameDimension` ist schon da.\n[1, 2, 3] und [4, 5, 6] → `32.0`",
nach:h("same")+M2+"  IO.println(dot(a, b));\n}",start:sig("double dot(double[] v1, double[] v2)"),loesung:M.dot,
tests:A({a:"1.0, 2.0, 3.0",b:"4.0, 5.0, 6.0"},{a:"1.0, 2.0",b:"1.0"},{a:"",b:""},{a:"1.0, 0.0",b:"0.0, 1.0"}),
tipp:"`double sum = 0.0;` vor der Schleife, in der Schleife `sum += v1[i] * v2[i];`, danach `return sum;`."});
ein({id:"vk_cross",titel:"cross (Kreuzprodukt)",kurz:"Drei Formeln, Konstante mit final",
aufgabe:"`double[] cross(double[] v1, double[] v2)` – Kreuzprodukt, nur wenn **beide** Dimension 3 haben, sonst `null`. Lege die 3 als Konstante mit `final` an.\n[1, 2, 3] × [4, 5, 6] = `[-3.0, 6.0, -3.0]`"+NEU,
nach:h("zeige")+M2+"  zeige(cross(a, b));\n  zeige(a);\n}",start:sig("double[] cross(double[] v1, double[] v2)"),loesung:M.cross,
tests:A({a:"1.0, 2.0, 3.0",b:"4.0, 5.0, 6.0"},{a:"1.0, 2.0",b:"1.0, 2.0"},{a:"1.0, 2.0, 3.0",b:"1.0"},{a:"1.0, 0.0, 0.0",b:"0.0, 1.0, 0.0"}),
muss:[[/\bfinal\s+int\b/,"Lege die Dimension 3 als Konstante mit `final int` an."]],
tipp:"Kreis 0→1→2→0. w[0] benutzt 1 und 2: `v1[1] * v2[2] - v1[2] * v2[1]`. Für w[1] und w[2] alle Indizes um eins weiterdrehen."});
ein({id:"vk_length",titel:"lengthSq und length",kurz:"Vorhandene Methoden wiederverwenden",
aufgabe:"Schreib **beide** Methoden:\n• `double lengthSq(double[] v)` – Summe der Quadrate\n• `double length(double[] v)` – Wurzel daraus\n`dot` und `sameDimension` sind schon da. Schaffst du es ohne Schleife?",
nach:h("same","dot")+M1+"  IO.println(lengthSq(a));\n  IO.println(length(a));\n}",start:sig("double lengthSq(double[] v)")+"\n\n"+sig("double length(double[] v)"),loesung:M.lsq+"\n\n"+M.len,
tests:A({a:"1.0, 2.0, 3.0"},{a:"3.0, 0.0, 4.0"},{a:""},{a:"-2.0"}),
muss:[[/\bdot\s*\(/,"Benutze dot – das spart die Schleife."]],
tipp:"`dot(v, v)` ist genau die Summe der Quadrate. Wurzel: `Math.sqrt(…)`."});
ein({id:"vk_normalize",titel:"normalize (Einheitsvektor)",kurz:"Länge 0 abfangen, Länge nur einmal berechnen",
aufgabe:"`double[] normalize(double[] v)` – neuer Vektor: jedes Element geteilt durch die Länge. Ist der Vektor leer oder seine Länge 0 → `null`. `length` ist schon da."+NEU,
nach:h("same","dot","lsq","len","zeige")+M1+"  zeige(normalize(a));\n  zeige(a);\n}",start:sig("double[] normalize(double[] v)"),loesung:M.norm,
tests:A({a:"3.0, 0.0, 4.0"},{a:""},{a:"0.0, 0.0"},{a:"-5.0"},{a:"1.0, 1.0"}),
tipp:"`double len = length(v);` einmal vor der Schleife speichern. Beim leeren Vektor ist len automatisch 0 – eine Prüfung reicht."});
ein({id:"vk_wrap",titel:"Vorübung zu shift: Index umrunden",kurz:"% mit negativen Zahlen",
aufgabe:"`int wrap(int x, int n)` soll jede ganze Zahl x in den Bereich 0 … n-1 bringen (n > 0). Beispiele mit n = 3:\n`3` → 0, `4` → 1, `-1` → 2, `-3` → 0, `-4` → 2",
nach:"void main() {\n  IO.println(wrap({x}, {n}));\n}",start:sig("int wrap(int x, int n)"),loesung:"int wrap(int x, int n) {\n  return (x % n + n) % n;\n}",
tests:A({x:"3",n:"3"},{x:"4",n:"3"},{x:"-1",n:"3"},{x:"-3",n:"3"},{x:"-4",n:"3"},{x:"0",n:"5"},{x:"-101",n:"10"}),
verboten:[[/\b(while|for)\b/,"Das geht ohne Schleife, nur mit % und +."]],
tipp:"`-1 % 3` ist in Java -1. Also n dazuzählen. Und damit aus n wieder 0 wird, am Ende nochmal `% n`."});
ein({id:"vk_shift",titel:"shift",kurz:"Verschieben mit Umrunden",
aufgabe:"`double[] shift(double[] v, int amount)` verschiebt alle Elemente: positiv nach rechts, negativ nach links, mit Umrunden. Immer ein **neuer** Vektor, auch bei 0 und beim leeren Vektor.\n[1, 2, 3] um 1 → `[3.0, 1.0, 2.0]`, um -1 → `[2.0, 3.0, 1.0]`"+NEU,
nach:h("zeige")+M1+"  double[] w = shift(a, {k});\n  zeige(w);\n  zeige(a);\n  IO.println(w == a);\n}",start:sig("double[] shift(double[] v, int amount)"),loesung:M.shift,
tests:A({a:"1.0, 2.0, 3.0",k:"1"},{a:"1.0, 2.0, 3.0",k:"-1"},{a:"1.0, 2.0, 3.0",k:"-3"},{a:"1.0, 2.0, 3.0",k:"4"},{a:"1.0, 2.0, 3.0",k:"-4"},{a:"",k:"2"},{a:"7.0, 8.0",k:"0"}),
tipp:"Leeres Array zuerst abfangen (`% 0` stürzt ab). Dann `int offset = (amount % n + n) % n;` und `w[(i + offset) % n] = v[i];`."});

/* ---- 2. Ähnliche Methoden ---- */
function eins(id,t,k,s,auf,l,call,tests,tipp,two,extra){var o={id:id,titel:t,kurz:k,aufgabe:auf,nach:h("zeige")+(two?M2:M1)+call+"}",start:sig(s),loesung:l,tests:tests,tipp:tipp}; for(var q in extra||{}) o[q]=extra[q]; aeh(o)}
eins("vx_copy","Kopieren","Echte Kopie statt gleicher Referenz","double[] copy(double[] v)","`double[] copy(double[] v)` gibt ein neues Array mit denselben Werten zurück. Der Test verändert danach die Kopie – das Original muss gleich bleiben.",
"double[] copy(double[] v) {\n  double[] w = new double[v.length];\n  for (int i = 0; i < v.length; i++) {\n    w[i] = v[i];\n  }\n  return w;\n}","  double[] w = copy(a);\n  zeige(w);\n  if (w.length > 0) {\n    w[0] = 99.0;\n  }\n  zeige(a);\n  IO.println(w == a);\n",A({a:"1.0, 2.0"},{a:""},{a:"5.0"}),"`return v;` wäre dasselbe Array. Du brauchst `new`.");
eins("vx_equal","Inhalt vergleichen","Früh aussteigen mit return false","boolean equal(double[] v1, double[] v2)","`boolean equal(double[] v1, double[] v2)` – true genau dann, wenn beide gleich lang sind **und** an jeder Stelle denselben Wert haben. Ohne `Arrays.equals`.",
"boolean equal(double[] v1, double[] v2) {\n  if (v1.length != v2.length) {\n    return false;\n  }\n  for (int i = 0; i < v1.length; i++) {\n    if (v1[i] != v2[i]) {\n      return false;\n    }\n  }\n  return true;\n}","  IO.println(equal(a, b));\n",A({a:"1.0, 2.0",b:"1.0, 2.0"},{a:"1.0, 2.0",b:"1.0, 3.0"},{a:"1.0",b:"1.0, 2.0"},{a:"",b:""},{a:"2.0, 1.0",b:"1.0, 1.0"}),"Beim ersten Unterschied `return false`. `return true` erst **nach** der Schleife – nicht im else!",1,{verboten:[[/Arrays\s*\./,"Bitte ohne Arrays.equals."]]});
eins("vx_avg","Durchschnitt","Summe, leeres Array abfangen","double average(double[] v)","`double average(double[] v)` – Durchschnitt aller Elemente, beim leeren Array `0.0`.",
"double average(double[] v) {\n  if (v.length == 0) {\n    return 0.0;\n  }\n  double sum = 0.0;\n  for (double x : v) {\n    sum += x;\n  }\n  return sum / v.length;\n}","  IO.println(average(a));\n",A({a:"1.0, 2.0, 3.0"},{a:""},{a:"-4.0, 1.0"}),"Ohne Prüfung kommt beim leeren Array NaN heraus (0.0 / 0).");
eins("vx_max","Index des Maximums","Mit dem ersten Element beginnen","int indexOfMax(double[] v)","`int indexOfMax(double[] v)` – Index des **ersten** größten Elements, beim leeren Array `-1`.",
"int indexOfMax(double[] v) {\n  if (v.length == 0) {\n    return -1;\n  }\n  int idx = 0;\n  for (int i = 1; i < v.length; i++) {\n    if (v[i] > v[idx]) {\n      idx = i;\n    }\n  }\n  return idx;\n}","  IO.println(indexOfMax(a));\n",A({a:"1.0, 7.0, 3.0"},{a:""},{a:"-4.0, -1.0, -9.0"},{a:"2.0, 5.0, 5.0"}),"Merk dir den Index, nicht den Wert. Mit `>` (nicht `>=`) bleibt der erste gewinnen.");
eins("vx_reverse","Umdrehen","Index-Rechnung von hinten","double[] reverse(double[] v)","`double[] reverse(double[] v)` gibt einen neuen Vektor in umgekehrter Reihenfolge zurück."+NEU,
"double[] reverse(double[] v) {\n  double[] w = new double[v.length];\n  for (int i = 0; i < v.length; i++) {\n    w[i] = v[v.length - 1 - i];\n  }\n  return w;\n}","  zeige(reverse(a));\n  zeige(a);\n",A({a:"1.0, 2.0, 3.0"},{a:""},{a:"1.0, 2.0, 3.0, 4.0"}),"Zu i gehört von hinten der Index `v.length - 1 - i`.");
eins("vx_concat","Aneinanderhängen","Neue Länge, versetzter Index","double[] concat(double[] v1, double[] v2)","`double[] concat(double[] v1, double[] v2)` – neuer Vektor: erst alle Elemente von v1, dann alle von v2.",
"double[] concat(double[] v1, double[] v2) {\n  double[] w = new double[v1.length + v2.length];\n  for (int i = 0; i < v1.length; i++) {\n    w[i] = v1[i];\n  }\n  for (int i = 0; i < v2.length; i++) {\n    w[v1.length + i] = v2[i];\n  }\n  return w;\n}","  zeige(concat(a, b));\n  zeige(a);\n",A({a:"1.0, 2.0",b:"3.0"},{a:"",b:"4.0"},{a:"",b:""},{a:"1.0",b:"2.0, 3.0, 4.0"}),"Zwei Schleifen. In der zweiten: `w[v1.length + i]`.",1);
eins("vx_slice","Ausschnitt","Grenzen prüfen, null","double[] slice(double[] v, int from, int to)","`double[] slice(double[] v, int from, int to)` – neuer Vektor mit den Elementen from (inklusive) bis to (**exklusive**). `null`, wenn from < 0, to > Länge oder from > to.",
"double[] slice(double[] v, int from, int to) {\n  if (from < 0 || to > v.length || from > to) {\n    return null;\n  }\n  double[] w = new double[to - from];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v[from + i];\n  }\n  return w;\n}","  zeige(slice(a, {f}, {t}));\n",A({a:"1.0, 2.0, 3.0, 4.0",f:"1",t:"3"},{a:"1.0, 2.0",f:"0",t:"2"},{a:"1.0, 2.0",f:"1",t:"1"},{a:"1.0, 2.0",f:"-1",t:"1"},{a:"1.0",f:"0",t:"2"},{a:"1.0, 2.0",f:"2",t:"1"}),"Länge des Ergebnisses: `to - from`. Kopiert wird `w[i] = v[from + i]`.");
eins("vx_filter","Positive herausfiltern","Zuerst zählen, dann füllen","double[] positives(double[] v)","`double[] positives(double[] v)` – neuer Vektor nur mit den Elementen > 0, in gleicher Reihenfolge.",
"double[] positives(double[] v) {\n  int count = 0;\n  for (double x : v) {\n    if (x > 0) {\n      count++;\n    }\n  }\n  double[] w = new double[count];\n  int pos = 0;\n  for (double x : v) {\n    if (x > 0) {\n      w[pos] = x;\n      pos++;\n    }\n  }\n  return w;\n}","  zeige(positives(a));\n  zeige(a);\n",A({a:"1.0, -2.0, 3.0"},{a:"-1.0"},{a:""},{a:"0.0, 4.0"}),"Die Länge muss man vor dem new wissen: erste Schleife zählt, zweite füllt mit eigenem Index pos.");
eins("vx_dist","Abstand zweier Punkte","Pythagoras mit Differenzen","double distance(double[] v1, double[] v2)","`double distance(double[] v1, double[] v2)` – Länge des Differenzvektors: Wurzel aus der Summe der quadrierten Differenzen. Bei verschiedenen Dimensionen `-1.0`.",
"double distance(double[] v1, double[] v2) {\n  if (v1.length != v2.length) {\n    return -1.0;\n  }\n  double sum = 0.0;\n  for (int i = 0; i < v1.length; i++) {\n    double d = v1[i] - v2[i];\n    sum += d * d;\n  }\n  return Math.sqrt(sum);\n}","  IO.println(distance(a, b));\n",A({a:"1.0, 1.0",b:"4.0, 5.0"},{a:"1.0",b:"1.0, 2.0"},{a:"2.0, 3.0",b:"2.0, 3.0"}),"Differenz in eine Variable d speichern, dann `sum += d * d;`. Im Bsp06 wäre es `length(sub(v1, v2))`.",1);
eins("vx_shiftint","Text verschieben","Wie shift, aber mit String","String shiftText(String s, int amount)","Dasselbe wie shift, aber mit einem String: `shiftText(\"Java\", 1)` → `aJav`, mit -1 → `avaJ`. Leerer String → leerer String.",
"String shiftText(String s, int amount) {\n  int n = s.length();\n  if (n == 0) {\n    return \"\";\n  }\n  int offset = (amount % n + n) % n;\n  String result = \"\";\n  for (int i = 0; i < n; i++) {\n    result += s.charAt((i - offset + n) % n);\n  }\n  return result;\n}","",A({s:"Java",k:"1"},{s:"Java",k:"-1"},{s:"",k:"3"},{s:"abc",k:"-7"}),"Hier liest man umgekehrt: Auf Platz i kommt das Zeichen von Platz `(i - offset + n) % n`.",0,{nach:"void main() {\n  IO.println(\"[\" + shiftText(\"{s}\", {k}) + \"]\");\n}"});
eins("vx_matvec","Matrix mal Vektor","2D-Array, jede Zeile ein Skalarprodukt","double[] mulMatrix(double[][] m, double[] v)","Zum Weiterdenken: `double[] mulMatrix(double[][] m, double[] v)` – w[i] ist das Skalarprodukt von Zeile m[i] mit v. Die Matrix hat mindestens eine Zeile, alle Zeilen sind gleich lang. Passt die Zeilenlänge nicht zu v → `null`.",
"double[] mulMatrix(double[][] m, double[] v) {\n  if (m[0].length != v.length) {\n    return null;\n  }\n  double[] w = new double[m.length];\n  for (int i = 0; i < m.length; i++) {\n    double sum = 0.0;\n    for (int j = 0; j < v.length; j++) {\n      sum += m[i][j] * v[j];\n    }\n    w[i] = sum;\n  }\n  return w;\n}","  double[][] m = {{1.0, 2.0, 0.0}, {0.0, 1.0, -1.0}};\n  zeige(mulMatrix(m, a));\n",A({a:"1.0, 2.0, 3.0"},{a:"1.0, 2.0"},{a:"0.0, 0.0, 0.0"}),"sum muss in **jeder** Zeile neu bei 0.0 anfangen – also innerhalb der äußeren Schleife deklarieren.");

/* ---- 3. Bsp06 komplett ---- */
var KOPF="// Vorname Nachname, Matrikelnummer\n\n";
var DEC="void main() {\n  double[] a = new double[]{1.0, 2.0, 3.0};\n  double[] b = new double[]{4.0, 5.0, 6.0};\n  double[] c = new double[]{1.0, 2.0};\n  double[] empty = new double[0];\n\n";
var P1=DEC+R`  IO.println("=== Part 1 ===");
  print(a);
  print(empty);
  IO.println(sameDimension(a, b));
  IO.println(sameDimension(a, c));
  print(add(a, b));
  IO.println(add(a, c));
  print(sub(a, b));
  IO.println(sub(a, c));
  print(mul(a, 2.0));
  print(a);
}`;
var P2=DEC+R`  IO.println("=== Part 2 ===");
  IO.println(dot(a, b));
  IO.println(dot(a, c));
  print(cross(a, b));
  IO.println(cross(c, c));
  IO.println(length(a));
  IO.println(lengthSq(a));
  IO.println(length(empty));
  print(normalize(new double[]{3.0, 0.0, 4.0}));
  IO.println(normalize(empty));
  IO.println(normalize(new double[]{0.0, 0.0}));
  print(shift(a, 1));
  print(shift(a, -1));
  print(shift(a, -3));
  print(shift(a, 4));
  print(shift(a, -4));
  print(shift(empty, 2));
  print(a);
}`;
function J(ks){return ks.map(function(k){return M[k]}).join("\n\n")}
X.push({id:"vk_bsp06_1",gruppe:"vk3",titel:"Bsp06 · Vektoren (Teil 1)",kurz:"Alles aus dem Kopf: print, sameDimension, add, sub, mul",
aufgabe:"Schreib alle Methoden von Teil 1 **ohne Vorlage**. Nur die Signaturen:\n• `void print(double[] v)`\n• `boolean sameDimension(double[] v1, double[] v2)`\n• `double[] add(double[] v1, double[] v2)`\n• `double[] sub(double[] v1, double[] v2)`\n• `double[] mul(double[] v, double s)`\nadd und sub liefern bei verschiedenen Dimensionen null. Parameter nie verändern. Die main aus der Angabe ist schon da.",
nach:P1,start:KOPF,loesung:KOPF+J(["print","same","add","sub","mul"]),tests:[{}],
verboten:[[/Arrays\s*\./,"Im PS bitte ohne Arrays.toString."]],tipp:"Klappt etwas nicht? Geh zurück zu den einzelnen Methoden oben. Reihenfolge: print, sameDimension, dann add – sub und mul sind fast gleich."});
X.push({id:"vk_bsp06_2",gruppe:"vk3",titel:"Bsp06 · Vektoren (Teil 2)",kurz:"Alles aus dem Kopf: dot, cross, length, lengthSq, normalize, shift",
aufgabe:"Schreib die Methoden von Teil 2 **ohne Vorlage** (print und sameDimension sind schon da):\n• `double dot(double[] v1, double[] v2)` – 0 bei n ≠ m\n• `double[] cross(double[] v1, double[] v2)` – null, außer n == m == 3\n• `double length(double[] v)`, `double lengthSq(double[] v)`\n• `double[] normalize(double[] v)` – null bei Länge 0\n• `double[] shift(double[] v, int amount)`",
nach:h("print","same")+P2,start:KOPF,loesung:KOPF+J(["dot","cross","len","lsq","norm","shift"]),tests:[{}],
muss:[[/\bfinal\b/,"Die Dimension 3 als Konstante mit final anlegen."]],tipp:"Beginne mit dot, dann lengthSq und length (je eine Zeile). shift zum Schluss: leer abfangen, offset, Schleife."});

/* ---- Fehler finden ---- */
function feh(o){o.gruppe="vk4"; o.aufgabe+="\n**Im Code stecken "+o.n+" Fehler.** Zuerst „Prüfen“ klicken und die Meldungen lesen!"; X.push(o)}
feh({id:"vf_compile",n:4,titel:"Fehler finden · Compilerfehler",kurz:"length, return-Typ, new",
aufgabe:"Die Methoden sollen wie im Bsp06 funktionieren (verdoppeln = mul mit 2, erste Elemente = die ersten beiden).",
nach:h("zeige")+M1+"  zeige(verdoppeln(a));\n  IO.println(summe(a));\n  zeige(ersteZwei(a));\n}",
start:"double verdoppeln(double[] v) {\n  double[] w = new double[v.length()];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v[i] * 2;\n  }\n  return w;\n}\n\ndouble summe(double[] v) {\n  int s = 0;\n  for (double x : v) {\n    s = s + x;\n  }\n  return s;\n}\n\ndouble[] ersteZwei(double[] v) {\n  if (v.length < 2) {\n    return null;\n  }\n  return {v[0], v[1]};\n}",
loesung:"double[] verdoppeln(double[] v) {\n  double[] w = new double[v.length];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v[i] * 2;\n  }\n  return w;\n}\n\ndouble summe(double[] v) {\n  double s = 0;\n  for (double x : v) {\n    s = s + x;\n  }\n  return s;\n}\n\ndouble[] ersteZwei(double[] v) {\n  if (v.length < 2) {\n    return null;\n  }\n  return new double[]{v[0], v[1]};\n}",
tests:A({a:"1.0, 2.0, 3.5"},{a:"4.5"},{a:""}),tipp:"1) Rückgabetyp von verdoppeln muss `double[]` sein. 2) `v.length` ohne Klammern. 3) s muss double sein. 4) Nach return braucht es `new double[]{…}`."});
feh({id:"vf_logik",n:3,titel:"Fehler finden · add und dot",kurz:"Original verändert, return in der Schleife, Startwert",
aufgabe:"Alles kompiliert, aber die Ergebnisse stimmen nicht. Der Vektor a muss am Ende unverändert sein.",
nach:h("zeige")+M2+"  IO.println(dot(a, b));\n  zeige(add(a, b));\n  zeige(a);\n}",
start:"double[] add(double[] v1, double[] v2) {\n  double[] w = v1;\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v1[i] + v2[i];\n  }\n  return w;\n}\n\ndouble dot(double[] v1, double[] v2) {\n  double sum = 1.0;\n  for (int i = 0; i < v1.length; i++) {\n    sum += v1[i] * v2[i];\n    if (i > 0) {\n      return sum;\n    }\n  }\n  return sum;\n}",
loesung:"double[] add(double[] v1, double[] v2) {\n  double[] w = new double[v1.length];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v1[i] + v2[i];\n  }\n  return w;\n}\n\ndouble dot(double[] v1, double[] v2) {\n  double sum = 0.0;\n  for (int i = 0; i < v1.length; i++) {\n    sum += v1[i] * v2[i];\n  }\n  return sum;\n}",
tests:A({a:"1.0, 2.0, 3.0",b:"4.0, 5.0, 6.0"},{a:"2.0",b:"3.0"},{a:"",b:""}),tipp:"1) `w = v1` ist keine Kopie. 2) Eine Summe beginnt bei 0. 3) Das return in der Schleife bricht zu früh ab."});
feh({id:"vf_shift",n:3,titel:"Fehler finden · shift und normalize",kurz:"% bei negativ, % 0, Division durch 0",
aufgabe:"shift und normalize wie im Bsp06, aber mit kaputten Sonderfällen.",
nach:h("same","dot","lsq","len","zeige")+M1+"  zeige(shift(a, {k}));\n  zeige(normalize(a));\n}",
start:"double[] shift(double[] v, int amount) {\n  int n = v.length;\n  double[] w = new double[n];\n  int offset = amount % n;\n  for (int i = 0; i < n; i++) {\n    w[(i + offset) % n] = v[i];\n  }\n  return w;\n}\n\ndouble[] normalize(double[] v) {\n  double len = length(v);\n  if (v.length == 0) {\n    return null;\n  }\n  double[] w = new double[v.length];\n  for (int i = 0; i < w.length; i++) {\n    w[i] = v[i] / len;\n  }\n  return w;\n}",
loesung:M.shift+"\n\n"+M.norm,tests:A({a:"3.0, 4.0",k:"1"},{a:"3.0, 4.0",k:"-1"},{a:"",k:"2"},{a:"0.0, 0.0",k:"5"}),
tipp:"1) Leeres Array vor dem % abfangen. 2) `(amount % n + n) % n` für negative Werte. 3) `len == 0.0` prüfen, sonst kommt NaN heraus."});

/* ---- Vorhersagen ---- */
function vor(o){o.gruppe="vk4"; o.typ="vorhersage"; o.aufgabe="Was gibt dieses Programm aus? Schreib die Ausgabe genau so auf, wie sie in der Konsole erscheinen würde – jede Ausgabezeile in eine eigene Zeile."; o.tests=[{}]; X.push(o)}
vor({id:"vv_ref",titel:"Vorhersage · Wer verändert das Original?",kurz:"Referenz, neues Array",
code:R`void eins(double[] v) {
  v[0] = 10.0;
}

void zwei(double[] v) {
  v = new double[]{20.0, 20.0};
  v[1] = 30.0;
}

double[] drei(double[] v) {
  double[] w = v;
  w[1] = 40.0;
  return w;
}

void main() {
  double[] a = {1.0, 2.0};
  eins(a);
  IO.println(a[0] + " " + a[1]);
  zwei(a);
  IO.println(a[0] + " " + a[1]);
  double[] b = drei(a);
  IO.println(a[0] + " " + a[1]);
  IO.println(a == b);
}`,erkl:"`eins` schreibt direkt ins Original → **10.0 2.0**. `zwei` hängt nur seine lokale Variable um → **10.0 2.0**. `drei` macht mit `w = v` keine Kopie → **10.0 40.0**, und b ist dasselbe Array → **true**.",tipp:"Wo steht new? Und wird vor oder nach dem new geschrieben?"});
vor({id:"vv_mod",titel:"Vorhersage · Modulo und Umrunden",kurz:"% mit positiven und negativen Zahlen",
code:R`void main() {
  final int N = 4;
  IO.println(5 % N);
  IO.println(-5 % N);
  IO.println((-5 % N + N) % N);
  IO.println((0 % N + N) % N);
  for (int i = 0; i < N; i++) {
    IO.print((i + 3) % N + " ");
  }
  IO.println();
}`,erkl:"5 % 4 = **1**. Negativ bleibt negativ: **-1**. -1 + 4 = 3, 3 % 4 = **3**. 0 + 4 = 4, 4 % 4 = **0**. Schleife: 3, 4 % 4 = 0, 1, 2 → **3 0 1 2**.",tipp:"Das Vorzeichen kommt von der linken Zahl. % wird vor + ausgerechnet."});
vor({id:"vv_shift",titel:"Vorhersage · shift von Hand",kurz:"Auf welchem Platz landet jedes Element?",
code:R`void main() {
  int[] v = {10, 20, 30, 40, 50};
  int n = v.length;
  int[] w = new int[n];
  int offset = (-7 % n + n) % n;
  IO.println(offset);
  for (int i = 0; i < n; i++) {
    w[(i + offset) % n] = v[i];
  }
  for (int x : w) {
    IO.print(x + ",");
  }
  IO.println();
  IO.println(v[0]);
}`,erkl:"-7 % 5 = -2, +5 = 3 → **3**. 10 → Platz 3, 20 → 4, 30 → 0, 40 → 1, 50 → 2: **30,40,50,10,20,**. v wurde nicht verändert → **10**.",tipp:"Schreib dir fünf leere Kästchen auf und trag jedes Element ein."});
vor({id:"vv_null",titel:"Vorhersage · null, leer und 0.0",kurz:"Unterschiede bei der Ausgabe",
code:R`double[] f(double[] v) {
  if (v.length == 0) {
    return null;
  }
  return new double[v.length];
}

void main() {
  double[] leer = new double[0];
  IO.println(leer == null);
  IO.println(leer.length);
  IO.println(f(leer));
  double[] w = f(new double[]{5.0, 6.0});
  IO.println(w[1]);
  IO.println(w == null || w.length == 0);
  double x = 0.0;
  IO.println(x / x);
}`,erkl:"Ein leeres Array ist nicht null → **false**, Länge **0**. f(leer) liefert **null**. Ein neues double-Array ist mit **0.0** gefüllt. w ist weder null noch leer → **false**. 0.0 / 0.0 → **NaN**.",tipp:"new double[0] ist ein echtes Array."});
vor({id:"vv_trace",titel:"Vorhersage · Skalarprodukt mitrechnen",kurz:"Zwischensummen ausgeben",
code:R`double dot(double[] v1, double[] v2) {
  if (v1.length != v2.length) {
    return 0;
  }
  double sum = 0;
  for (int i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
    IO.println(i + ": " + sum);
  }
  return sum;
}

void main() {
  double[] a = {2.0, -1.0, 3.0};
  double[] b = {1.0, 4.0, 2.0};
  IO.println(dot(a, b));
  IO.println(dot(a, new double[]{1.0}));
  IO.println(Math.sqrt(dot(b, new double[]{1.0, 0.0, 4.0})));
}`,erkl:"2 → **0: 2.0**, dann −4 → **1: -2.0**, dann +6 → **2: 4.0**, Ergebnis **4.0**. Verschiedene Länge → **0.0** (int 0 wird zu double). Dritter Aufruf: **0: 1.0**, **1: 1.0**, **2: 9.0**, Wurzel **3.0**.",tipp:"Erst werden die Zwischenzeilen aus der Methode ausgegeben, dann das Ergebnis in main."});

Array.prototype.push.apply(UEBUNG.aufgaben,X);
UEBUNG.gruppen.unshift(
["vk1","Bsp06 · Vektoren: jede Methode einzeln","Von print bis shift, Schritt für Schritt. Fang hier an!"],
["vk2","Bsp06 · ähnliche Array-Methoden","Gleiche Muster, neue Aufgaben – damit du es wirklich kannst und nicht nur auswendig"],
["vk3","Bsp06 · komplett aus dem Kopf","Die ganze Hausübung mit der main aus der Angabe"],
["vk4","Bsp06 · Fehler finden und vorhersagen","Typische Fallen: Referenzen, null, % mit negativen Zahlen, NaN"]);
/* ---- Schritt für Schritt ---- */
if(!window.ABLAUF) return;
function ab(id,name,kurz,intro,tipp,code){ABLAUF.progs.push({id:id,gruppe:"arr",name:name,kurz:kurz,intro:intro,tipp:tipp,inputs:[],code:code})}
ABLAUF.gruppen.unshift(["arr","Arrays und Vektoren (Bsp06)","Schau zu, wie die Vektor-Methoden Element für Element arbeiten"]);
ab("arr_start","ArrayStart.java","Array anlegen, lesen, ändern","Ein Array Schritt für Schritt: erzeugen, Elemente ändern, mit der Schleife durchgehen.","Achte auf i: Die Schleife hört auf, sobald i gleich v.length ist.",R`void main() {
  double[] v = new double[3];
  v[0] = 1.5;
  v[2] = 4.0;
  double sum = 0.0;
  for (int i = 0; i < v.length; i++) {
    sum = sum + v[i];
  }
  IO.println("Summe: " + sum);
}`);
ab("arr_ref","ArrayReferenz.java","b = a ist keine Kopie","Zwei Variablen, ein Array – und warum man für eine Kopie new braucht.","Schau nach b[0] = 9.0, was mit a passiert.",R`void main() {
  double[] a = {1.0, 2.0};
  double[] b = a;
  b[0] = 9.0;
  IO.println(a[0]);
  double[] c = new double[a.length];
  for (int i = 0; i < a.length; i++) {
    c[i] = a[i];
  }
  c[1] = 7.0;
  IO.println(a[1]);
}`);
ab("vek_print","VektorPrint.java","Bsp06 · print und der Komma-Trick","Wie [1.0, 2.0, 3.0] Stück für Stück entsteht und warum [] ohne Sonderfall klappt.","Bei i = 0 wird das if übersprungen.",M.print+"\n\nvoid main() {\n  print(new double[]{1.0, 2.0, 3.0});\n  print(new double[0]);\n}");
ab("vek_add","VektorAdd.java","Bsp06 · add mit neuem Array und null","Einmal passen die Dimensionen, einmal nicht.","w füllt sich Element für Element, v1 und v2 bleiben gleich.",M.same+"\n\n"+M.add+"\n\nvoid main() {\n  double[] a = {1.0, 2.0, 3.0};\n  double[] b = {4.0, 5.0, 6.0};\n  double[] w = add(a, b);\n  IO.println(w[0] + \" \" + w[1] + \" \" + w[2]);\n  IO.println(add(a, new double[]{1.0}));\n}");
ab("vek_norm","VektorNormalize.java","Bsp06 · normalize → length → lengthSq → dot","Eine Methode ruft die nächste auf. Verfolge, wie die Ergebnisse zurückwandern.","9 + 0 + 16 = 25, Wurzel 5, dann 3/5, 0/5, 4/5.",[M.same,M.dot,M.lsq,M.len,M.norm].join("\n\n")+"\n\nvoid main() {\n  double[] w = normalize(new double[]{3.0, 0.0, 4.0});\n  IO.println(w[0] + \" \" + w[1] + \" \" + w[2]);\n}");
ab("vek_shift","VektorShift.java","Bsp06 · shift mit negativem Wert","Warum (amount % n + n) % n nötig ist: Hier wird um -1 verschoben.","Rechne vor jedem Weiter selbst aus, auf welchem Platz v[i] landet.",M.shift+"\n\n"+M.print+"\n\nvoid main() {\n  double[] a = {1.0, 2.0, 3.0};\n  print(shift(a, -1));\n  print(a);\n}");
ABLAUF.progs.push({id:"bsp06",gruppe:"ps",name:"Bsp06.java",kurz:"PS · Vektoren, alle Methoden mit der main aus der Angabe",intro:"Dein komplettes Bsp06 mit der main aus der Angabe. Das sind viele Schritte – für einzelne Methoden nimm die kurzen Programme unter „Arrays und Vektoren“.",tipp:"Mit dem Schieberegler kannst du zu einer bestimmten Stelle springen.",inputs:[],
code:"// Vorname Nachname, Matrikelnummer\n\n"+J(["print","same","add","sub","mul","dot","cross","len","lsq","norm","shift"])+"\n\n"+P1.replace(/ {2}print\(a\);\n}$/,"\n")+P2.replace(DEC,"")});
/* Reihenfolge der Programme = Reihenfolge der Gruppen */
var rang={}; ABLAUF.gruppen.forEach(function(g,i){rang[g[0]]=i});
ABLAUF.progs.sort(function(a,b){return rang[a.gruppe]-rang[b.gruppe]});
})();
