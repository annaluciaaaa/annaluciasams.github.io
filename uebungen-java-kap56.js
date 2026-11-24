/* Trainer und Schritt-für-Schritt-Programme zu Kap. 5 + 6 (Folien S. 81–112). Eigene Programme nach den Folien; mit Java 25 geprüft.
   Wird nach uebungen-java-vektoren.js geladen und schiebt die Bsp06-Gruppen ans Ende. */
(function(){
if(!window.UEBUNG) return;
var R=String.raw,X=[];
function A(){return Array.prototype.map.call(arguments,function(t){return {set:t}})}
function I(){return Array.prototype.map.call(arguments,function(t){return {in:t}})}
function k(g,o){o.gruppe=g;X.push(o)}
function prog(g,id,t,ku,auf,tests,l,tipp,ex){var o={id:"k"+id,titel:t,kurz:ku,aufgabe:auf,start:"void main() {\n  \n}",tests:tests,loesung:l,tipp:tipp};for(var q in ex||{})o[q]=ex[q];k(g,o)}
function meth(g,id,t,ku,auf,s,nach,tests,l,tipp,ex){var o={id:"k"+id,titel:t,kurz:ku,aufgabe:auf,start:s+" {\n  \n}",nach:nach,tests:tests,loesung:l,tipp:tipp};for(var q in ex||{})o[q]=ex[q];k(g,o)}
function vor(g,id,t,ku,code,erkl,tipp){k(g,{id:"k"+id,typ:"vorhersage",titel:t,kurz:ku,code:code,erkl:erkl,tipp:tipp,tests:[{}],aufgabe:"Was gibt dieses Programm aus? Schreib die Ausgabe genau so auf, wie sie in der Konsole erscheinen würde – jede Ausgabezeile in eine eigene Zeile."})}
var DO=[[/\bdo\b/,"Benutze do-while."]], KEINBREAK=[[/\bbreak\b/,"Bitte ohne break – das ist die Übung."]];
prog("k5",
"5_ziffern","ZiffernSturz (do-while)","Ziffern umgekehrt, auch für 0","Lies eine Zahl n ≥ 0 ein und gib ihre Ziffern umgekehrt aus. Nimm **do-while**.\nEingabe 123 → `321`, 0 → `0`, 120 → `021`",I(["123"],["0"],["120"],["7"]),
"void main() {\n  int n = Integer.parseInt(IO.readln());\n  do {\n    IO.print(n % 10);\n    n = n / 10;\n  } while (n > 0);\n  IO.println();\n}","n % 10 ist die letzte Ziffer, n / 10 schneidet sie ab. Strichpunkt nach while (…) nicht vergessen.",{muss:DO});
prog("k5","5_forwhile","for wird while","Dieselbe Schleife umschreiben","Schreib dieses Programm mit **while** statt for:\n`for (int i = n; i > 0; i -= 2) IO.println(i);`\nn wird eingelesen.",I(["7"],["4"],["0"]),
"void main() {\n  int n = Integer.parseInt(IO.readln());\n  int i = n;\n  while (i > 0) {\n    IO.println(i);\n    i -= 2;\n  }\n}","Initialisierung vor die Schleife, Aktualisierung als letzte Zeile in den Rumpf.",{verboten:[[/\bfor\b/,"Bitte ohne for."]]});
prog("k5","5_ggt","ggT mit Differenzen","while mit if/else","Lies zwei positive ganze Zahlen ein und gib `ggT: …` aus. Verfahren: die kleinere von der größeren abziehen, bis beide gleich sind.",I(["12","18"],["9","24"],["5","5"],["7","3"]),
"void main() {\n  int a = Integer.parseInt(IO.readln());\n  int b = Integer.parseInt(IO.readln());\n  while (a != b) {\n    if (a > b) {\n      a -= b;\n    } else {\n      b -= a;\n    }\n  }\n  IO.println(\"ggT: \" + a);\n}","Schleifenbedingung: a != b.");
prog("k5","5_break","break ersetzen","Abbruch in die Bedingung","Das Programm summiert eingegebene Zahlen, bis eine negative kommt oder die Summe über 100 steigt. Am Ende: bei Überschreitung zuerst die Zeile `Max.!`, immer `Summe: …`.\nSchreib es **ohne break** um.",I(["10","20","-1"],["60","50","3","-1"],["-1"],["100","-5"]),
"void main() {\n  final int MAX = 100;\n  int sum = 0;\n  int wert = Integer.parseInt(IO.readln());\n  while (wert >= 0 && sum <= MAX) {\n    sum += wert;\n    if (sum <= MAX) {\n      wert = Integer.parseInt(IO.readln());\n    }\n  }\n  if (sum > MAX) {\n    IO.println(\"Max.!\");\n  }\n  IO.println(\"Summe: \" + sum);\n}","while (wert >= 0 && sum <= MAX). Nach der Überschreitung nicht weiter einlesen müssen: das Einlesen mit if schützen (auf der Folie wird noch einmal eingelesen, beides zählt hier).",{start:"void main() {\n  final int MAX = 100;\n  int sum = 0;\n  int wert = Integer.parseInt(IO.readln());\n  while (wert >= 0) {\n    sum += wert;\n    if (sum > MAX) {\n      IO.println(\"Max.!\");\n      break;\n    }\n    wert = Integer.parseInt(IO.readln());\n  }\n  IO.println(\"Summe: \" + sum);\n}",verboten:KEINBREAK});
meth("k5","5_treppe","Zeichentreppe","Geschachtelte for-Schleifen","`void zeichneTreppe(int hoch, char zeichen)` – in Zeile i stehen i Zeichen, hoch Zeilen.","void zeichneTreppe(int hoch, char zeichen)","void main() {\n  zeichneTreppe({h}, '{z}');\n}",A({h:"3",z:"*"},{h:"1",z:"#"},{h:"0",z:"x"}),"void zeichneTreppe(int hoch, char zeichen) {\n  for (int zeile = 1; zeile <= hoch; zeile++) {\n    for (int spalte = 1; spalte <= zeile; spalte++) {\n      IO.print(zeichen);\n    }\n    IO.println();\n  }\n}","Innen spalte <= zeile, nach der inneren Schleife IO.println().");
vor("k5","5_v_ink","Vorhersage · ++ und +=","n++ oder ++n",R`void main() {
  int n = 4;
  int a = n++ * 2;
  int b = ++n * 2;
  IO.println(a + " " + b + " " + n);
  n -= 2;
  n *= n + 1;
  IO.println(n);
  n %= 6;
  IO.println(n--);
  IO.println(n);
}`,"n++ liest 4 → a = 8, n = 5. ++n → 6, b = 12: **8 12 6**. n = 4, dann 4 · (4 + 1) = **20**. 20 % 6 = 2: `n--` gibt erst **2** aus, danach ist n **1**.","x *= y + 1 heißt x * (y + 1).");
vor("k5","5_v_for","Vorhersage · for-Fallen","Strichpunkt, zwei Zähler, leere Teile",R`void main() {
  int k, sum = 0;
  for (k = 1; k < 5; k++);
    sum = sum + k;
  IO.println(sum);
  int i, j;
  for (i = 0, j = 7; i < j; i++, j--) {
    IO.print(i + j + " ");
  }
  IO.println(i + "/" + j);
  i = 1;
  for ( ; i <= 20; ) {
    i *= 3;
  }
  IO.println(i);
}`,"Leerer Rumpf: k läuft bis 5, dann einmal addieren → **5**. 0+7, 1+6, 2+5, 3+4 → viermal 7, dann i = 4, j = 3: **7 7 7 7 4/3**. 1 → 3 → 9 → **27**.","i + j + \" \" rechnet zuerst die Zahlen zusammen.");
k("k5",{id:"k5_fehler",titel:"Fehler finden · Schleifen",kurz:"Endlosschleife, Strichpunkt, Startwert",aufgabe:"Das Programm soll für eingelesenes n (≥ 1) die Fakultät n! = 1·2·…·n und danach einen Countdown von n bis 1 ausgeben.\n**Im Code stecken 3 Fehler.**",tests:I(["4"],["1"],["5"]),
start:"void main() {\n  int n = Integer.parseInt(IO.readln());\n  int f = 0;\n  for (int i = 1; i <= n; i++);\n  {\n    f *= 2;\n  }\n  IO.println(f);\n  while (n > 0) {\n    IO.println(n);\n  }\n}".replace("f *= 2","f *= n"),
loesung:"void main() {\n  int n = Integer.parseInt(IO.readln());\n  int f = 1;\n  for (int i = 1; i <= n; i++) {\n    f *= i;\n  }\n  IO.println(f);\n  while (n > 0) {\n    IO.println(n);\n    n--;\n  }\n}",tipp:"1) Produkt mit 1 beginnen. 2) Der Strichpunkt nach dem for-Kopf macht den Rumpf leer (danach muss im Rumpf i stehen). 3) n wird in der while-Schleife nie kleiner."});
/* Kap 6 */
prog("k6","6_temp","Temperatur (Folie 97)","Speichern, Durchschnitt, vergleichen","Lies 7 Temperaturen (Kommazahlen) ein. Gib den Durchschnitt aus und wie viele Werte darüber bzw. darunter liegen:\n`Durchschnitt: 20.0`\n`darueber: 3`\n`darunter: 3`",I(["17","18","19","20","21","22","23"],["5","5","5","5","5","5","5"],["-2","-2","-2","-2","-2","-2","12"]),
"void main() {\n  final int TAGE = 7;\n  double[] t = new double[TAGE];\n  double sum = 0;\n  for (int i = 0; i < t.length; i++) {\n    t[i] = Double.parseDouble(IO.readln());\n    sum += t[i];\n  }\n  double schnitt = sum / t.length;\n  int ueber = 0;\n  int unter = 0;\n  for (double x : t) {\n    if (x > schnitt) {\n      ueber++;\n    } else if (x < schnitt) {\n      unter++;\n    }\n  }\n  IO.println(\"Durchschnitt: \" + schnitt);\n  IO.println(\"darueber: \" + ueber);\n  IO.println(\"darunter: \" + unter);\n}","Zwei Schleifen: erst einlesen und summieren, dann vergleichen. Gleiche Werte zählen nirgends.");
meth("k6","6_suche","Wert von hinten suchen","while mit zwei Bedingungen","`int suche(int[] a, int gesucht)` – Position des **letzten** Vorkommens, sonst -1. Ohne break und ohne zweites return.","int suche(int[] a, int gesucht)","void main() {\n  int[] a = {{a}};\n  IO.println(suche(a, {g}));\n}",A({a:"4, 9, 2, 9, 1",g:"9"},{a:"4, 9",g:"5"},{a:"7",g:"7"},{a:"",g:"1"}),"int suche(int[] a, int gesucht) {\n  int pos = a.length - 1;\n  while (pos >= 0 && a[pos] != gesucht) {\n    pos--;\n  }\n  return pos;\n}","pos >= 0 muss links von && stehen.",{verboten:[[/\bbreak\b/,"Bitte ohne break."],[/return[\s\S]*return/,"Nur ein return am Ende."]]});
meth("k6","6_tage","Tage pro Monat mit Array","Nachschlagetabelle statt switch","`int tage(int monat)` – Tage des Monats 1–12 (Februar 28) über ein Array, ohne if und switch.","int tage(int monat)","void main() {\n  IO.println(tage({m}));\n}",A({m:"1"},{m:"2"},{m:"4"},{m:"12"}),"int tage(int monat) {\n  int[] tageProMonat = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\n  return tageProMonat[monat];\n}","Eine 0 an den Anfang, dann passt der Monat als Index.",{verboten:[[/\b(if|switch)\b/,"Bitte ohne if und switch."]]});
meth("k6","6_max","Maximum im Array","Mit a[0] beginnen","`int max(int[] a)` – größter Wert (a hat mindestens ein Element).","int max(int[] a)","void main() {\n  int[] a = {{a}};\n  IO.println(max(a));\n}",A({a:"3, 8, 2"},{a:"-5, -2, -9"},{a:"4"}),"int max(int[] a) {\n  int max = a[0];\n  for (int i = 1; i < a.length; i++) {\n    if (a[i] > max) {\n      max = a[i];\n    }\n  }\n  return max;\n}","Bei 0 zu beginnen wäre bei negativen Zahlen falsch.");
meth("k6","6_minpos","MinSort Schritt 1: Minimum-Position","ab Position i suchen","`int minPos(int[] a, int ab)` – Index des ersten kleinsten Elements **ab** Position ab.","int minPos(int[] a, int ab)","void main() {\n  int[] a = {{a}};\n  IO.println(minPos(a, {p}));\n}",A({a:"3, 9, 6, 5, 8",p:"0"},{a:"3, 9, 6, 5, 8",p:"1"},{a:"3, 9, 6, 5, 8",p:"4"},{a:"2, 1, 1",p:"0"}),"int minPos(int[] a, int ab) {\n  int pos = ab;\n  for (int i = ab + 1; i < a.length; i++) {\n    if (a[i] < a[pos]) {\n      pos = i;\n    }\n  }\n  return pos;\n}","Die Position merken, nicht den Wert. Mit pos = ab beginnen.");
meth("k6","6_tausche","MinSort Schritt 2: tauschen","Hilfsvariable","`void tausche(int[] a, int i, int j)` vertauscht zwei Elemente **im Array selbst**.","void tausche(int[] a, int i, int j)","void main() {\n  int[] a = {{a}};\n  tausche(a, {i}, {j});\n  IO.println(Arrays.toString(a));\n}",A({a:"1, 2, 3",i:"0",j:"2"},{a:"5, 6",i:"1",j:"1"}),"void tausche(int[] a, int i, int j) {\n  int h = a[i];\n  a[i] = a[j];\n  a[j] = h;\n}","Erst einen Wert in h sichern. Weil a ein Zeiger ist, wirkt das beim Aufrufer.");
meth("k6","6_minsort","MinSort komplett","Aus dem Kopf","`void minSort(int[] werte)` sortiert das Array aufsteigend mit dem Minimum-Verfahren. Ohne Arrays.sort.","void minSort(int[] werte)","void main() {\n  int[] a = {{a}};\n  minSort(a);\n  IO.println(Arrays.toString(a));\n}",A({a:"3, 9, 6, 5, 8"},{a:"5, 4, 3, 2, 1"},{a:"2, 2, 1"},{a:""},{a:"7"}),R`void minSort(int[] werte) {
  for (int i = 0; i < werte.length - 1; i++) {
    int minPos = i;
    for (int j = i + 1; j < werte.length; j++) {
      if (werte[j] < werte[minPos]) {
        minPos = j;
      }
    }
    int h = werte[i];
    werte[i] = werte[minPos];
    werte[minPos] = h;
  }
}`,"Außen i bis werte.length - 2, innen j ab i + 1. Getauscht wird nach der inneren Schleife.",{verboten:[[/Arrays\s*\.\s*sort/,"Bitte selbst sortieren."]]});
meth("k6","6_sortiert","Ist das Array sortiert?","Nachbarn vergleichen","`boolean istSortiert(int[] a)` – true, wenn a[i] <= a[i+1] für alle gültigen i.","boolean istSortiert(int[] a)","void main() {\n  int[] a = {{a}};\n  IO.println(istSortiert(a));\n}",A({a:"1, 2, 2, 5"},{a:"1, 3, 2"},{a:""},{a:"4"}),"boolean istSortiert(int[] a) {\n  for (int i = 0; i < a.length - 1; i++) {\n    if (a[i] > a[i + 1]) {\n      return false;\n    }\n  }\n  return true;\n}","Nur bis a.length - 1 (ausschließlich), sonst ist i + 1 zu groß.");
meth("k6","6_2d","2D: Summe der Indizes","Geschachtelte Schleifen","`int[][] indexSumme(int z, int s)` – neues Array mit z Zeilen und s Spalten, in dem jedes Element Zeile + Spalte ist.","int[][] indexSumme(int z, int s)","void main() {\n  IO.println(Arrays.deepToString(indexSumme({z}, {s})));\n}",A({z:"3",s:"4"},{z:"1",s:"1"},{z:"2",s:"0"}),"int[][] indexSumme(int z, int s) {\n  int[][] a = new int[z][s];\n  for (int i = 0; i < a.length; i++) {\n    for (int j = 0; j < a[i].length; j++) {\n      a[i][j] = i + j;\n    }\n  }\n  return a;\n}","new int[z][s], außen a.length, innen a[i].length.");
meth("k6","6_zacken","2D: verschieden lange Zeilen","new int[n][]","`int[][] dreieck(int n)` – n Zeilen; Zeile i hat i + 1 Elemente, alle mit dem Wert i + 1. n = 3 → `[[1], [2, 2], [3, 3, 3]]`","int[][] dreieck(int n)","void main() {\n  IO.println(Arrays.deepToString(dreieck({n})));\n}",A({n:"3"},{n:"1"},{n:"0"}),"int[][] dreieck(int n) {\n  int[][] a = new int[n][];\n  for (int i = 0; i < n; i++) {\n    a[i] = new int[i + 1];\n    for (int j = 0; j < a[i].length; j++) {\n      a[i][j] = i + 1;\n    }\n  }\n  return a;\n}","Jede Zeile mit a[i] = new int[i + 1] selbst erzeugen, sonst ist sie null.");
meth("k6","6_foreach","2D-Summe mit for-each","Zeile ist selbst ein Array","`int summe(int[][] a)` – Summe aller Elemente, nur mit for-each-Schleifen.","int summe(int[][] a)","void main() {\n  int[][] a = {{{a}}};\n  IO.println(summe(a));\n}",A({a:"1, 2}, {3"},{a:"5"},{a:"-1, 1}, {}, {7, 7"}),"int summe(int[][] a) {\n  int sum = 0;\n  for (int[] zeile : a) {\n    for (int el : zeile) {\n      sum += el;\n    }\n  }\n  return sum;\n}","Außen ist der Elementtyp int[], innen int.",{verboten:[[/for\s*\([^)]*;/,"Bitte nur for-each benutzen."]]});
vor("k6","6_v_zeiger","Vorhersage · Zeiger (Folie 102–103)","a, b und neue Arrays",R`void main() {
  int[] a = new int[4];
  int[] b = a;
  a[2] = 7;
  b[0] = 5;
  IO.println(a[0] + " " + b[2]);
  a = new int[3];
  a[0] = 1;
  IO.println(a[0] + " " + b[0] + " " + a.length + " " + b.length);
  b = a;
  IO.println(b[0] + " " + b[2]);
}`,"a und b zeigen auf dasselbe Array: **5 7**. Dann bekommt a ein neues Array: **1 5 3 4**. Mit b = a zeigen beide auf das neue: **1 0**; das alte ist nicht mehr greifbar (Garbage Collection).","Zeichne Kästchen und Pfeile.");
vor("k6","6_v_minsort","Vorhersage · MinSort verfolgen","Array nach jedem Durchgang",R`void main() {
  int[] w = {6, 2, 9, 1};
  for (int i = 0; i < w.length - 1; i++) {
    int m = i;
    for (int j = i + 1; j < w.length; j++)
      if (w[j] < w[m])
        m = j;
    int h = w[i];
    w[i] = w[m];
    w[m] = h;
    for (int el : w)
      IO.print(el + ",");
    IO.println();
  }
}`,"i = 0: Minimum 1 tauscht mit 6 → **1,2,9,6,**. i = 1: 2 bleibt → **1,2,9,6,**. i = 2: 6 tauscht mit 9 → **1,2,6,9,**.","Getauscht wird pro Durchgang nur einmal.");
Array.prototype.push.apply(UEBUNG.aufgaben,X);
var G=UEBUNG.gruppen, vk=G.filter(function(g){return /^vk/.test(g[0])}), rest=G.filter(function(g){return !/^vk/.test(g[0])}), at=rest.length;
rest.forEach(function(g,i){if(g[0]==="g8")at=i});
rest.splice(at,0,["k5","VO Kap. 5 · Schleifen","do-while, for, ++, break ersetzen, geschachtelte Schleifen (Folien S. 81–95)"],["k6","VO Kap. 6 · Arrays","Suchen, Zeiger, MinSort, 2D-Arrays, for-each (Folien S. 96–112)"]);
G.length=0; Array.prototype.push.apply(G,rest.concat(vk));
/* Aufgaben in Gruppenreihenfolge, damit Nummern und „nächste Aufgabe“ stimmen */
var r={}; G.forEach(function(g,i){r[g[0]]=i}); UEBUNG.aufgaben.sort(function(a,b){return r[a.gruppe]-r[b.gruppe]});
if(!window.ABLAUF) return;
function ab(id,name,kurz,intro,tipp,code,inp){ABLAUF.progs.push({id:id,gruppe:"k6",name:name,kurz:kurz,intro:intro+" (Eigenes Programm nach den Folien.)",tipp:tipp,inputs:inp||[],code:code})}
ab("k6_zeiger","ArrayZeiger.java","Kap. 6 · Zeiger und neue Arrays (Folie 102–103)","Wohin zeigen a und b?","Nach a = new int[3] sind es zwei verschiedene Arrays.",R`void main() {
  int[] a = new int[4];
  int[] b;
  b = a;
  a[2] = 7;
  b[0] = 5;
  a = new int[3];
  b = new int[2];
  IO.println(a.length + " " + b.length);
}`);
ab("k6_suche","ArraySuche.java","Kap. 6 · Maximum und Suche von hinten","Die zwei Standardmuster von Folie 106.","Bei der zweiten Suche kommt der Wert nicht vor: pos wird -1.",R`int suche(int[] a, int gesucht) {
  int pos = a.length - 1;
  while (pos >= 0 && a[pos] != gesucht)
    pos--;
  return pos;
}

void main() {
  int[] a = {4, 9, 2};
  int max = a[0];
  for (int i = 1; i < a.length; i++)
    if (a[i] > max) max = a[i];
  IO.println("Maximum: " + max);
  IO.println(suche(a, 9));
  IO.println(suche(a, 5));
}`);
ab("k6_2d","ZweiDim.java","Kap. 6 · 2D-Array füllen","Zeile für Zeile durch eine 2×3-Tabelle.","Die innere Schleife läuft für jede Zeile komplett durch.",R`void main() {
  int[][] a = new int[2][3];
  for (int zeile = 0; zeile < a.length; zeile++)
    for (int spalte = 0; spalte < a[zeile].length; spalte++)
      a[zeile][spalte] = zeile + spalte;
  IO.println(a[1][2]);
}`);
ab("k6_foreach","ForEach.java","Kap. 6 · for-each ändert nichts","el bekommt der Reihe nach jeden Wert.","el ändert sich, das Array nicht.",R`void main() {
  int[] a = {2, 4, 6};
  int sum = 0;
  for (int el : a) {
    sum += el;
    el = 0;
  }
  IO.println(sum + " " + a[0]);
}`);
ab("k6_minsort","MinSortDemo.java","Kap. 6 · Sortieren mit MinSort","Das Beispiel 3 9 6 5 8 von Folie 111.","Achte auf minPos: Es merkt sich die Stelle des bisher kleinsten Werts.",R`void main() {
  int[] werte = {3, 9, 6, 5, 8};
  for (int i = 0; i < werte.length - 1; i++) {
    int minPos = i;
    for (int j = i + 1; j < werte.length; j++) {
      if (werte[j] < werte[minPos]) {
        minPos = j;
      }
    }
    int h = werte[i];
    werte[i] = werte[minPos];
    werte[minPos] = h;
  }
  for (int el : werte)
    IO.print(el + " ");
  IO.println();
}`);
var g2=ABLAUF.gruppen, arr=null;
for(var i=g2.length-1;i>=0;i--) if(g2[i][0]==="arr") arr=g2.splice(i,1)[0];
g2.forEach(function(g,j){if(g[0]==="k5")i=j});
g2.splice(i+1,0,["k6","VO Kap. 6","Arrays: Zeiger, Suche, 2D, for-each, MinSort"]);
if(arr) g2.push(arr);
var rg={}; g2.forEach(function(g,j){rg[g[0]]=j}); ABLAUF.progs.sort(function(a,b){return rg[a.gruppe]-rg[b.gruppe]});
})();
