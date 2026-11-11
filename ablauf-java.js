/* Java-Programme Schritt für Schritt
   Jedes Programm hat den Java-Code (so wie in den VO-/PS-Dateien) und eine run-Funktion,
   die das Programm in JavaScript nachspielt und nach jeder Zeile einen "Schnappschuss" macht:
   welche Zeile, welche Variablen mit welchem Wert, was in der Konsole steht, plus Erklärung.
   Die Ausgaben wurden mit echtem Java 25 verglichen (gleiche Eingaben → gleiche Ausgabe). */
(function(){

/* ---------- Mini-Engine ---------- */
function jd(x){ // Double.toString wie in Java
  if(isNaN(x)) return "NaN";
  if(!isFinite(x)) return x>0?"Infinity":"-Infinity";
  if(x===0) return 1/x<0?"-0.0":"0.0";
  var a=Math.abs(x);
  if(a>=1e-3&&a<1e7){var s=String(x);return s.indexOf(".")<0&&s.indexOf("e")<0?s+".0":s}
  var m=x.toExponential().split("e"), man=m[0];
  if(man.indexOf(".")<0) man+=".0";
  return man+"E"+(+m[1]);
}
function JErr(msg){this.msg=msg}
function Stop(msg){this.msg=msg}

function Tracer(prog, inputs){
  this.code=prog.code.split("\n"); this.inp=inputs.slice(); this.frames=[]; this.out="";
  this.steps=[]; this.max=prog.max||600; this.bad=[];
}
Tracer.prototype={
  main:function(){return this.call("main",[])},
  call:function(name,params){
    var f={name:name,order:[],t:{},v:{}}; this.frames.push(f);
    for(var i=0;i<params.length;i++) this.dec(params[i][0],params[i][1],params[i][2]);
    return f.v;
  },
  ret:function(){this.frames.pop(); return this.frames.length?this.frames[this.frames.length-1].v:null},
  top:function(){return this.frames[this.frames.length-1]},
  dec:function(n,t,val){var f=this.top(); if(f.order.indexOf(n)<0) f.order.push(n); f.t[n]=t; f.v[n]=val},
  del:function(n){var f=this.top(), k=f.order.indexOf(n); if(k>=0) f.order.splice(k,1); delete f.v[n]},
  line:function(ref){
    if(typeof ref==="number") return ref;
    if(ref==="ENDE"){for(var e=this.code.length;e>0;e--) if(this.code[e-1].trim()) return e}
    var occ=1, m=/^(.*)#(\d+)$/.exec(ref); if(m){ref=m[1];occ=+m[2]}
    var hits=[]; for(var i=0;i<this.code.length;i++) if(this.code[i].indexOf(ref)>=0) hits.push(i+1);
    if(hits.length<occ||(!m&&hits.length>1)) this.bad.push(ref+" ("+hits.length+" Treffer)");
    return hits[occ-1]||1;
  },
  s:function(ref,text){
    var snap=this.frames.map(function(f){return {n:f.name,vars:f.order.map(function(k){return [k,f.t[k],f.v[k]]})}});
    this.steps.push({l:this.line(ref),x:text,o:this.out,f:snap});
    if(this.steps.length>=this.max) throw new Stop("Nach "+this.max+" Schritten angehalten.");
  },
  print:function(s){this.out+=(s===undefined?"":s)},
  println:function(s){this.out+=(s===undefined?"":s)+"\n"},
  read:function(prompt){
    if(prompt) this.out+=prompt;
    if(!this.inp.length) throw new Stop("Keine Eingaben mehr übrig – das Programm wartet auf eine weitere Eingabe. Trag unten bei „Eingaben“ mehr Werte ein.");
    var val=this.inp.shift();
    this.out+="\u0001"+val+"\u0002\n"; return val;
  },
  pi:function(s){
    if(!/^[+-]?\d+$/.test(s)||Math.abs(+s)>2147483647) throw new JErr("NumberFormatException: For input string: \""+s+"\" – das ist keine ganze Zahl, Integer.parseInt kann sie nicht umwandeln.");
    return parseInt(s,10);
  },
  pd:function(s){
    var t=s.trim();
    if(!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(t)) throw new JErr("NumberFormatException: "+(t?"For input string: \""+s+"\"":"empty String")+" – Double.parseDouble braucht eine Zahl (mit Punkt, nicht Komma!).");
    return parseFloat(t);
  },
  d:jd,
  div:function(a,b){if(b===0) throw new JErr("ArithmeticException: / by zero – durch 0 teilen geht bei ganzen Zahlen nicht."); return Math.trunc(a/b)|0},
  mod:function(a,b){if(b===0) throw new JErr("ArithmeticException: / by zero"); return a%b},
  fail:function(msg){throw new JErr(msg)}
};

function run(prog, inputs){
  var T=new Tracer(prog, inputs), err=null, stop=null;
  try{ prog.run(T) }
  catch(e){
    if(e instanceof JErr) err=e.msg; else if(e instanceof Stop) stop=e.msg; else throw e;
    var last=T.steps[T.steps.length-1];
    T.steps.push({l:last?last.l:1, x:err?"**Absturz!** Das Programm bricht hier mit einem Fehler ab:\n`"+err+"`":/^Keine/.test(stop)?"**"+stop+"**":"**"+stop+"** Das Programm würde hier ewig weiterlaufen – eine **Endlosschleife**. In echt müsstest du es mit Strg+C abbrechen.", o:T.out, f:last?last.f:[], err:!!err, stop:!!stop});
  }
  return {steps:T.steps, bad:T.bad, out:T.out};
}

/* Hilfen für Texte */
function q(s){return "\""+s+"\""}
function tf(b){return b?"**true**":"**false**"}

/* ---------- Programme ---------- */
var P=[];

/* ===== Ganz einfach – zum Reinkommen ===== */

P.push({id:"hallo", gruppe:"start", name:"Hallo.java", kurz:"Ausgabe mit print und println",
intro:"Das allereinfachste Programm: Es schreibt nur Text in die Konsole. Hier siehst du den Unterschied zwischen `IO.println` und `IO.print`.",
inputs:[],
code:String.raw`void main() {
  IO.println("Hallo!");
  IO.print("Ich bin ");
  IO.print("ein Programm.");
  IO.println();
  IO.println("Tschüss!");
}`,
run:function(T){
  T.main();
  T.s("void main()","Jedes Programm startet bei `void main()`. Alles zwischen `{` und `}` wird **von oben nach unten** ausgeführt, eine Zeile nach der anderen. Klick auf **Weiter**, um die nächste Zeile auszuführen.");
  T.println("Hallo!");
  T.s("Hallo!","`IO.println(\"Hallo!\")` schreibt den Text in die Konsole und macht danach einen **Zeilenumbruch** (ln = line, also Zeile). Die Anführungszeichen erscheinen nicht in der Ausgabe. Sie zeigen nur, wo der Text anfängt und aufhört.");
  T.print("Ich bin ");
  T.s("Ich bin","`IO.print(…)` ist **ohne** ln: Der Text wird geschrieben, aber **ohne** Zeilenumbruch. Der Cursor bleibt in derselben Zeile. Das Leerzeichen nach „bin“ gehört zum Text.");
  T.print("ein Programm.");
  T.s("ein Programm","Weil vorher kein Zeilenumbruch kam, steht dieser Text direkt dahinter in **derselben Zeile**.");
  T.println();
  T.s("IO.println();","`IO.println()` ohne Inhalt schreibt keinen Text, macht aber den Zeilenumbruch. Die nächste Ausgabe landet in einer neuen Zeile.");
  T.println("Tschüss!");
  T.s("Tschüss","Noch eine Ausgabe mit Zeilenumbruch.");
  T.s("ENDE","Die schließende Klammer `}` von main ist erreicht, das Programm ist **fertig**.");
}});

P.push({id:"variablen", gruppe:"start", name:"Variablen.java", kurz:"Variablen anlegen, rechnen, ändern",
intro:"Eine **Variable** ist wie eine beschriftete Schachtel: Sie hat einen **Namen** (z. B. `a`), einen **Typ** (z. B. `int` = ganze Zahl) und einen **Wert**. Rechts unter „Variablen“ siehst du die Schachteln und was gerade drin ist.",
inputs:[],
code:String.raw`void main() {
  int a = 5;
  int b = 3;
  int summe = a + b;
  IO.println("Summe: " + summe);

  a = a + 1;
  IO.println("a ist jetzt " + a);
  IO.println("summe ist immer noch " + summe);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Das Programm startet. Noch gibt es keine Variablen.");
  T.dec("a","int",5);
  T.s("int a = 5","`int a = 5;` legt eine Variable namens `a` vom Typ `int` (ganze Zahl) an und legt gleich den Wert 5 hinein. Schau rechts bei **Variablen**: Da ist jetzt `a` mit 5.");
  T.dec("b","int",3);
  T.s("int b = 3","Genauso: Variable `b` mit dem Wert 3.");
  T.dec("summe","int",v.a+v.b);
  T.s("int summe","Zuerst wird die **rechte Seite** ausgerechnet: `a + b` → 5 + 3 = 8. Erst dann kommt das Ergebnis in die neue Variable `summe`.");
  T.println("Summe: "+v.summe);
  T.s("Summe: ","`\"Summe: \" + summe`: Wenn links vom `+` ein Text (String) steht, wird **nicht gerechnet**, sondern **angehängt**. Aus \"Summe: \" und 8 wird der Text \"Summe: 8\".");
  v.a=v.a+1;
  T.s("a = a + 1","Achtung: `=` heißt in Java **nicht** „ist gleich“, sondern „**speichere** in“. Rechts wird mit dem **alten** Wert gerechnet: a + 1 = 5 + 1 = 6. Danach wird 6 in `a` gespeichert, die alte 5 ist weg.");
  T.println("a ist jetzt "+v.a);
  T.s("a ist jetzt","Ausgabe des neuen Werts von `a`.");
  T.println("summe ist immer noch "+v.summe);
  T.s("immer noch","Wichtig: `summe` ist **immer noch 8**, nicht 9! `summe` hat sich nur den Wert gemerkt, der damals herauskam. Wenn sich `a` später ändert, rechnet Java `summe` nicht automatisch neu aus.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"eingabe", gruppe:"start", name:"Eingabe.java", kurz:"Tastatur-Eingabe lesen und umwandeln",
intro:"Das Programm fragt nach Name und Alter. Unten bei **Eingaben** kannst du selbst eintragen, was „getippt“ wird, und dann neu starten.",
tipp:"Gib beim Alter einmal „zwanzig“ ein. Dann siehst du, was passiert, wenn `Integer.parseInt` keine Zahl bekommt.",
inputs:[{l:"Name",d:"Anna"},{l:"Alter",d:"20"}],
code:String.raw`void main() {
  String name = IO.readln("Wie heißt du? ");
  int alter = Integer.parseInt(IO.readln("Wie alt bist du? "));
  int naechstesJahr = alter + 1;
  IO.println("Hallo " + name + "!");
  IO.println("Nächstes Jahr bist du " + naechstesJahr + ".");
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  var s=T.read("Wie heißt du? ");
  T.dec("name","String",s);
  T.s("String name","`IO.readln(\"Wie heißt du? \")` schreibt zuerst die Frage in die Konsole und **wartet** dann, bis man etwas tippt und Enter drückt. Die Eingabe (hier "+q(s)+") wird als **String** (Text) zurückgegeben und in `name` gespeichert.");
  var a=T.read("Wie alt bist du? ");
  T.s("int alter","Auch hier liefert `IO.readln` einen **Text**, also "+q(a)+" und nicht die Zahl. Mit Text kann man nicht rechnen. Darum steht `Integer.parseInt(…)` außen herum: Es **wandelt den Text in eine ganze Zahl** (int) um.");
  T.dec("alter","int",T.pi(a));
  T.s("int alter","Das Umwandeln hat geklappt: `alter` ist jetzt die Zahl "+v.alter+" (rechts ohne Anführungszeichen, weil es kein Text mehr ist).");
  T.dec("naechstesJahr","int",v.alter+1);
  T.s("naechstesJahr =","Jetzt kann man rechnen: "+v.alter+" + 1 = "+v.naechstesJahr+".");
  T.println("Hallo "+v.name+"!");
  T.s("Hallo","Mehrere Teile werden mit `+` zu einem Text zusammengehängt: \"Hallo \" + "+q(v.name)+" + \"!\".");
  T.println("Nächstes Jahr bist du "+v.naechstesJahr+".");
  T.s("Nächstes Jahr","Die Zahl "+v.naechstesJahr+" wird dabei automatisch in Text umgewandelt.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"wenn", gruppe:"start", name:"WennDann.java", kurz:"if / else – eine Entscheidung",
intro:"Mit `if` trifft das Programm eine Entscheidung: **Wenn** die Bedingung stimmt, läuft der erste Block, **sonst** (`else`) der zweite. Es läuft **immer genau einer** der beiden.",
tipp:"Starte einmal mit 72 und einmal mit 30 Punkten. Achte darauf, welche Zeilen übersprungen werden.",
inputs:[{l:"Punkte",d:"72"}],
code:String.raw`void main() {
  int punkte = Integer.parseInt(IO.readln("Punkte (0-100): "));
  if (punkte >= 50) {
    IO.println("Bestanden!");
  } else {
    IO.println("Leider nicht bestanden.");
  }
  IO.println("Ende");
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("punkte","int",T.pi(T.read("Punkte (0-100): ")));
  T.s("int punkte","Eingabe lesen und mit `Integer.parseInt` in eine Zahl umwandeln: `punkte` = "+v.punkte+".");
  var b=v.punkte>=50;
  T.s("if (punkte","Die **Bedingung** `punkte >= 50` wird geprüft: "+v.punkte+" >= 50 ist "+tf(b)+". "+(b?"Also geht es in den **if-Block** (die erste geschweifte Klammer).":"Also wird der if-Block **übersprungen** und es geht in den **else-Block**."));
  if(b){ T.println("Bestanden!"); T.s("Bestanden!","Diese Zeile läuft, weil die Bedingung true war."); T.s("} else {","Der if-Block ist zu Ende. Den else-Block **überspringt** Java komplett, es läuft ja immer nur einer von beiden."); }
  else { T.println("Leider nicht bestanden."); T.s("Leider","Diese Zeile läuft, weil die Bedingung false war. „Bestanden!“ wurde übersprungen."); }
  T.println("Ende");
  T.s("\"Ende\"","Nach dem if/else geht es ganz normal weiter. Diese Zeile läuft **in jedem Fall**.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"while", gruppe:"start", name:"Zaehlen.java", kurz:"while-Schleife – etwas wiederholen",
intro:"Eine `while`-Schleife wiederholt ihren Block, **solange** die Bedingung true ist. Vor jeder Runde wird die Bedingung neu geprüft. Beobachte, wie `i` größer wird und der Sprung zurück nach oben passiert.",
inputs:[],
code:String.raw`void main() {
  int i = 1;
  while (i <= 3) {
    IO.println("Runde " + i);
    i = i + 1;
  }
  IO.println("Fertig, i ist jetzt " + i);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("i","int",1);
  T.s("int i = 1","Die **Zählvariable** `i` startet bei 1.");
  while(true){
    var b=v.i<=3;
    T.s("while","Bedingung prüfen: `i <= 3` → "+v.i+" <= 3 ist "+tf(b)+". "+(b?"Also wird der Schleifenblock (noch einmal) ausgeführt.":"Also ist die Schleife **vorbei**. Es geht nach der schließenden `}` weiter."));
    if(!b) break;
    T.println("Runde "+v.i);
    T.s("Runde","Ausgabe mit dem aktuellen Wert von `i` ("+v.i+").");
    v.i=v.i+1;
    T.s("i = i + 1","`i` wird um 1 erhöht: jetzt "+v.i+". Ohne diese Zeile wäre `i` immer 1, die Bedingung immer true, und das wäre eine **Endlosschleife**!");
    T.s("  }","Ende des Schleifenblocks. Java **springt zurück** zum `while` und prüft die Bedingung neu.");
  }
  T.println("Fertig, i ist jetzt "+v.i);
  T.s("Fertig","Nach der Schleife ist `i` = "+v.i+". Genau dieser Wert hat die Bedingung false gemacht.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"for", gruppe:"start", name:"ForSchleife.java", kurz:"for-Schleife – Zählschleife",
intro:"Die `for`-Schleife ist eine kompakte Zählschleife. In der Klammer stehen drei Teile: **Start** (`int i = 1`, läuft nur einmal), **Bedingung** (`i <= n`, wird vor jeder Runde geprüft) und **Schritt** (`i++`, läuft nach jeder Runde).",
inputs:[{l:"Bis wohin?",d:"4"}],
code:String.raw`void main() {
  int n = Integer.parseInt(IO.readln("Bis wohin? "));
  for (int i = 1; i <= n; i++) {
    IO.println(i + " mal " + i + " = " + (i * i));
  }
  IO.println("Fertig");
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int",T.pi(T.read("Bis wohin? ")));
  T.s("int n","`n` = "+v.n+".");
  T.dec("i","int",1);
  T.s("for (","**Start-Teil** `int i = 1`: Die Zählvariable `i` wird angelegt. Das passiert nur **ein einziges Mal**.");
  var first=true;
  while(true){
    var b=v.i<=v.n;
    if(!first){ T.s("for (","**Schritt-Teil** `i++` (heißt dasselbe wie `i = i + 1`): `i` ist jetzt "+v.i+"."); }
    T.s("for (","**Bedingung** `i <= n` → "+v.i+" <= "+v.n+" ist "+tf(b)+". "+(b?"Der Block wird ausgeführt.":"Die Schleife endet."));
    if(!b) break;
    T.println(v.i+" mal "+v.i+" = "+(v.i*v.i));
    T.s("mal","Ausgabe. `(i * i)` steht in Klammern, damit zuerst **gerechnet** wird ("+v.i+" * "+v.i+" = "+(v.i*v.i)+"). Ohne Klammern würde Java die Zahlen nur als Text aneinanderhängen.");
    v.i++; first=false;
  }
  T.del("i");
  T.println("Fertig");
  T.s("Fertig","Nach der Schleife gibt es `i` nicht mehr (rechts verschwunden). Eine Variable, die im `for(…)` angelegt wurde, gilt **nur innerhalb der Schleife**.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"methode", gruppe:"start", name:"Methode.java", kurz:"Eigene Methode mit Parameter und return",
intro:"Eine **Methode** ist ein kleines Unterprogramm mit Namen. Man **ruft** sie auf, gibt ihr einen Wert mit (**Parameter**), und mit `return` gibt sie ein Ergebnis zurück. Rechts siehst du für jede laufende Methode einen eigenen Kasten mit ihren Variablen.",
inputs:[],
code:String.raw`int verdopple(int x) {
  int ergebnis = 2 * x;
  return ergebnis;
}

void main() {
  int zahl = 7;
  int doppelt = verdopple(zahl);
  IO.println(zahl + " verdoppelt ist " + doppelt);
  IO.println("Und nochmal: " + verdopple(doppelt));
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Auch wenn `verdopple` weiter oben steht: Das Programm startet **immer bei main**. Methoden laufen erst, wenn man sie aufruft.");
  T.dec("zahl","int",7);
  T.s("int zahl","`zahl` = 7.");
  T.dec("doppelt","int");
  function verdopple(arg, ref){
    var w=T.call("verdopple",[["x","int",arg]]);
    T.s("int verdopple","**Aufruf** `verdopple("+ref+")`: Java springt in die Methode. Der Wert "+arg+" wird in den **Parameter** `x` kopiert. Rechts siehst du einen neuen Kasten „verdopple“ mit eigenen Variablen.");
    T.dec("ergebnis","int",2*w.x);
    T.s("int ergebnis","2 * "+w.x+" = "+w.ergebnis+".");
    var r=w.ergebnis;
    T.s("return","`return ergebnis;` beendet die Methode und gibt "+r+" an die Stelle zurück, an der sie aufgerufen wurde. Die Variablen `x` und `ergebnis` verschwinden dabei.");
    T.ret(); return r;
  }
  T.s("int doppelt","Hier wird `verdopple(zahl)` aufgerufen, also mit dem Wert 7.");
  var r=verdopple(v.zahl,"zahl");
  v.doppelt=r;
  T.s("int doppelt","Zurück in main: Der Aufruf `verdopple(zahl)` hat "+r+" geliefert, das kommt in `doppelt`.");
  T.println(v.zahl+" verdoppelt ist "+v.doppelt);
  T.s("verdoppelt ist","Ausgabe.");
  T.s("Und nochmal","Man kann eine Methode auch **direkt in einem Ausdruck** aufrufen. Zuerst wird `verdopple(doppelt)` ausgerechnet, erst dann wird ausgegeben.");
  var r2=verdopple(v.doppelt,"doppelt");
  T.println("Und nochmal: "+r2);
  T.s("Und nochmal","Der Aufruf hat "+r2+" geliefert, jetzt wird ausgegeben.");
  T.s("ENDE","Fertig.");
}});

/* ===== VO Kapitel 1–3 ===== */

P.push({id:"kreis", gruppe:"k13", name:"Kreis.java", kurz:"Kap. 1 · Umfang und Fläche",
intro:"Das erste VO-Beispiel: Umfang und Fläche eines Kreises mit fest eingetragenem Radius.",
inputs:[],
code:String.raw`void main(){

  double umfang, flaeche;
  final double PI = 3.14159;

  double radius = 30.5;

  umfang = 2 * PI * radius;
  flaeche = PI * radius * radius;

  IO.println("Umfang  = " + umfang);
  IO.println("Flaeche = " + flaeche);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("umfang","double"); T.dec("flaeche","double");
  T.s("double umfang","Zwei Variablen vom Typ `double` (Kommazahl) werden **deklariert** (angelegt), aber noch **ohne Wert**. Rechts steht deshalb „?“.");
  T.dec("PI","double",3.14159);
  T.s("final double PI","`final` heißt: eine **Konstante**. Der Wert 3.14159 kann später nicht mehr geändert werden. Konstanten schreibt man üblicherweise in GROSSBUCHSTABEN.");
  T.dec("radius","double",30.5);
  T.s("double radius","Deklaration **und** Wert in einem: `radius` = 30.5. In Java schreibt man Kommazahlen mit **Punkt**!");
  v.umfang=2*v.PI*v.radius;
  T.s("umfang =","Rechts ausrechnen: 2 * 3.14159 * 30.5 = "+jd(v.umfang)+". Dann in `umfang` speichern.");
  v.flaeche=v.PI*v.radius*v.radius;
  T.s("flaeche =","π · r² = 3.14159 * 30.5 * 30.5 = "+jd(v.flaeche)+".");
  T.println("Umfang  = "+jd(v.umfang));
  T.s("Umfang  =","Text + Zahl → die Zahl wird als Text angehängt.");
  T.println("Flaeche = "+jd(v.flaeche));
  T.s("Flaeche =","Die vielen Nachkommastellen kommen daher, dass `double` nicht exakt rechnet (mehr dazu bei DoubleUngenau.java).");
  T.s("ENDE","Fertig.");
}});

P.push({id:"kreiseingabe", gruppe:"k13", name:"KreisMitEingabe.java", kurz:"Kap. 2 · Radius eingeben",
intro:"Wie Kreis.java, aber der Radius wird eingegeben.",
tipp:"Gib einmal „2,5“ mit Komma ein. Java braucht einen Punkt!",
inputs:[{l:"Radius",d:"2.5"}],
code:String.raw`void main(){

  double radius, umfang, flaeche;
  final double PI = 3.14159;

  IO.println();
  IO.print("Bitte Radius eingeben: ");

  String eingabe = IO.readln();
  radius = Double.parseDouble(eingabe);

  umfang = 2 * PI * radius;
  flaeche = PI * radius * radius;

  IO.println("Umfang  = " + umfang);
  IO.println("Flaeche = " + flaeche);
  IO.println();
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("radius","double"); T.dec("umfang","double"); T.dec("flaeche","double");
  T.s("double radius","Drei double-Variablen, noch ohne Wert.");
  T.dec("PI","double",3.14159);
  T.s("final double PI","Konstante PI.");
  T.println();
  T.s("IO.println();#1","Eine Leerzeile.");
  T.print("Bitte Radius eingeben: ");
  T.s("IO.print(","`print` ohne ln, damit man die Eingabe **in derselben Zeile** hinter die Aufforderung tippt.");
  T.dec("eingabe","String",T.read());
  T.s("String eingabe","`IO.readln()` wartet auf die Eingabe und liefert sie als **Text**: "+q(v.eingabe)+".");
  v.radius=T.pd(v.eingabe);
  T.s("Double.parseDouble","`Double.parseDouble` wandelt den Text "+q(v.eingabe)+" in die Kommazahl "+jd(v.radius)+" um.");
  v.umfang=2*v.PI*v.radius;
  T.s("umfang =","2 * PI * "+jd(v.radius)+" = "+jd(v.umfang));
  v.flaeche=v.PI*v.radius*v.radius;
  T.s("flaeche =","PI * "+jd(v.radius)+" * "+jd(v.radius)+" = "+jd(v.flaeche));
  T.println("Umfang  = "+jd(v.umfang)); T.s("Umfang  =","Ausgabe.");
  T.println("Flaeche = "+jd(v.flaeche)); T.s("Flaeche =","Ausgabe.");
  T.println(); T.s("IO.println();#2","Leerzeile am Schluss.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"werttausch", gruppe:"k13", name:"WertTausch.java", kurz:"Kap. 2 · zwei Werte tauschen",
intro:"Wie tauscht man die Inhalte zweier Variablen? Man braucht eine **Hilfsvariable**, so wie man beim Tauschen zweier voller Gläser ein drittes, leeres Glas braucht.",
inputs:[],
code:String.raw`void main(){

  IO.println("Werttausch von 2 Variablen");
  int wert1 = 10;
  int wert2 = 20;

  int hilf = wert1;
  wert1 = wert2;
  wert2 = hilf;

  IO.println("Wert 1: " + wert1);
  IO.println("Wert 2: " + wert2);
  IO.println();
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.println("Werttausch von 2 Variablen"); T.s("Werttausch von","Überschrift ausgeben.");
  T.dec("wert1","int",10); T.s("int wert1","wert1 = 10");
  T.dec("wert2","int",20); T.s("int wert2","wert2 = 20");
  T.dec("hilf","int",v.wert1);
  T.s("int hilf","Den Wert von wert1 (10) **sichern**, bevor er überschrieben wird.");
  v.wert1=v.wert2;
  T.s("wert1 = wert2","wert1 bekommt den Wert von wert2 → 20. Die alte 10 wäre jetzt verloren, steckt aber zum Glück noch in `hilf`.");
  v.wert2=v.hilf;
  T.s("wert2 = hilf","wert2 bekommt die gesicherte 10. **Getauscht!** Ohne `hilf` (also nur `wert1 = wert2; wert2 = wert1;`) wären am Ende beide 20.");
  T.println("Wert 1: "+v.wert1); T.s("Wert 1","Ausgabe.");
  T.println("Wert 2: "+v.wert2); T.s("Wert 2","Ausgabe.");
  T.println(); T.s("IO.println();","Leerzeile.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"zuweisung", gruppe:"k13", name:"Zuweisung.java", kurz:"Kap. 2 · int und double mischen",
intro:"Welche Zuweisungen erlaubt Java zwischen `int` und `double`? Die auskommentierten Zeilen (`//`) wären Compilerfehler.",
inputs:[],
code:String.raw`void main(){

  int n = 11;
  IO.println("a) n: " + n);

//     n = 4.27;      //nicht erlaubt!!

  double x = 2 * n + 1;
  IO.println("b) n: " + n + " x: " + x);

//     n = x - 0.5;   //nicht erlaubt!!

  n = n + 1;
  IO.println("c) n: " + n + " x: " + x);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int",11); T.s("int n","n = 11");
  T.println("a) n: "+v.n); T.s("a) n:","Ausgabe.");
  T.s("n = 4.27","Diese Zeile ist **auskommentiert** (`//`), Java ignoriert sie. Sie wäre verboten: 4.27 ist ein double. Ein double passt nicht automatisch in ein int, weil die Nachkommastellen verloren gingen → Compilerfehler.");
  T.dec("x","double",2*v.n+1);
  T.s("double x","Rechts wird mit ganzen Zahlen gerechnet: 2 * 11 + 1 = 23. Beim Speichern in die double-Variable wird daraus **automatisch** 23.0. Das ist erlaubt, weil dabei nichts verloren geht.");
  T.println("b) n: "+v.n+" x: "+jd(v.x)); T.s("b) n:","double-Werte werden immer mit Komma-Stelle ausgegeben: 23.0.");
  T.s("n = x - 0.5","Wieder verboten: `x - 0.5` ist ein double und darf nicht ohne Weiteres in das int `n`.");
  v.n=v.n+1; T.s("n = n + 1","n = 11 + 1 = 12");
  T.println("c) n: "+v.n+" x: "+jd(v.x)); T.s("c) n:","Ausgabe.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"wechselgeld", gruppe:"k13", name:"WechselGeld.java", kurz:"Kap. 2 · Münzen mit / und %",
intro:"Für einen Betrag werden die nötigen Münzen berechnet, immer zuerst die größte. Dafür braucht man zwei Operatoren für ganze Zahlen: `/` (wie oft passt es ganz hinein?) und `%` (was bleibt übrig = **Rest**).",
tipp:"Probier 2.89: Plötzlich fehlt ein Cent! 2.89 * 100 ergibt in double 288.99999999999994, und `(int)` schneidet die Kommastellen einfach ab.",
inputs:[{l:"Betrag in Euro",d:"3.88"}],
code:String.raw`void main(){

  double betragEuro;
  int betragCent;
  int zweiE, einE;                 //Euro-Muenzen
  int fuenfzigC, zwanzigC, zehnC,  //Cent-Muenzen
      fuenfC, zweiC, einC;

  IO.println("Betrag in Euro eingeben: ");
  betragEuro = Double.parseDouble(IO.readln());

  //Euro in Cent umwandeln
  betragCent = (int)(betragEuro * 100);

  //Muenzanzahlen berechnen
  zweiE = betragCent / 200;
  betragCent = betragCent % 200;
  einE = betragCent / 100;
  betragCent = betragCent % 100;
  fuenfzigC = betragCent / 50;
  betragCent = betragCent % 50;
  zwanzigC = betragCent / 20;
  betragCent = betragCent % 20;
  zehnC = betragCent / 10;
  betragCent = betragCent % 10;
  fuenfC = betragCent / 5;
  betragCent = betragCent % 5;
  zweiC = betragCent / 2;
  betragCent = betragCent % 2;
  einC = betragCent;

  IO.println();
  IO.println(betragEuro + " Euro benoetigen folgende Muenzen:");
  IO.println(" 2-Euro : " + zweiE);
  IO.println(" 1-Euro : " + einE);
  IO.println(" 50-Cent: " + fuenfzigC);
  IO.println(" 20-Cent: " + zwanzigC);
  IO.println(" 10-Cent: " + zehnC);
  IO.println("  5-Cent: " + fuenfC);
  IO.println("  2-Cent: " + zweiC);
  IO.println("  1-Cent: " + einC);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("betragEuro","double"); T.dec("betragCent","int");
  ["zweiE","einE","fuenfzigC","zwanzigC","zehnC","fuenfC","zweiC","einC"].forEach(function(n){T.dec(n,"int")});
  T.s("fuenfC, zweiC, einC","Alle Variablen sind deklariert, haben aber noch keinen Wert. Eine Deklaration darf über mehrere Zeilen gehen. Sie endet erst beim `;`.");
  T.println("Betrag in Euro eingeben: "); T.s("Betrag in Euro eingeben","Aufforderung.");
  v.betragEuro=T.pd(T.read());
  T.s("betragEuro = Double","Eingabe lesen und in double umwandeln: "+jd(v.betragEuro)+".");
  var raw=v.betragEuro*100; v.betragCent=Math.trunc(raw)|0;
  T.s("(int)(betragEuro","`betragEuro * 100` = "+jd(raw)+". Der **Cast** `(int)` macht daraus eine ganze Zahl, indem er die Nachkommastellen **abschneidet** (nicht rundet!) → "+v.betragCent+" Cent."+(raw!==v.betragCent?" ⚠️ Hier sieht man die double-Ungenauigkeit: ein Cent geht verloren!":""));
  var coins=[["zweiE",200,"2-Euro"],["einE",100,"1-Euro"],["fuenfzigC",50,"50-Cent"],["zwanzigC",20,"20-Cent"],["zehnC",10,"10-Cent"],["fuenfC",5,"5-Cent"],["zweiC",2,"2-Cent"]];
  coins.forEach(function(c,i){
    var before=v.betragCent;
    v[c[0]]=T.div(v.betragCent,c[1]);
    T.s(c[0]+" = betragCent","`"+before+" / "+c[1]+"` = "+v[c[0]]+". Bei ganzen Zahlen ist `/` die **Ganzzahldivision**: Wie oft passt "+c[1]+" ganz in "+before+"? → "+v[c[0]]+" × "+c[2]+(i===0?". (Kommastellen fallen weg.)":"."));
    v.betragCent=T.mod(v.betragCent,c[1]);
    T.s("betragCent % "+c[1]+";","`"+before+" % "+c[1]+"` = "+v.betragCent+". `%` (Modulo) liefert den **Rest** der Division. Das ist der Betrag, der noch übrig bleibt.");
  });
  v.einC=v.betragCent; T.s("einC = betragCent","Was jetzt noch übrig ist ("+v.einC+"), sind 1-Cent-Münzen.");
  T.println(); T.s("IO.println();","Leerzeile.");
  T.println(jd(v.betragEuro)+" Euro benoetigen folgende Muenzen:"); T.s("Euro benoetigen","Hier steht die Zahl **vorne**. Weil danach ein String kommt, wird trotzdem zu Text verbunden.");
  T.println(" 2-Euro : "+v.zweiE);T.println(" 1-Euro : "+v.einE);T.println(" 50-Cent: "+v.fuenfzigC);T.println(" 20-Cent: "+v.zwanzigC);T.println(" 10-Cent: "+v.zehnC);T.println("  5-Cent: "+v.fuenfC);T.println("  2-Cent: "+v.zweiC);T.println("  1-Cent: "+v.einC);
  T.s("1-Cent:","Die acht Ausgabezeilen (hier zusammengefasst).");
  T.s("ENDE","Fertig.");
}});

P.push({id:"maximum", gruppe:"k13", name:"Maximum.java", kurz:"Kap. 3 · größere von zwei Zahlen",
intro:"Zwei Zahlen einlesen und die größere ausgeben, mit `if`/`else` ohne geschweifte Klammern. Das geht, weil jeder Zweig nur **eine** Anweisung hat.",
inputs:[{l:"erste Zahl",d:"4"},{l:"zweite Zahl",d:"9"}],
code:String.raw`void main() {

  int a, b, max;

  IO.println("Maximum-Berechnung");
  IO.println(" erste Zahl: ");
  a = Integer.parseInt(IO.readln());
  IO.println(" zweite Zahl: ");
  b = Integer.parseInt(IO.readln());

  if (a >= b)
    max = a;
  else
    max = b;

  IO.println(" Maximum: " + max);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("a","int");T.dec("b","int");T.dec("max","int");
  T.s("int a, b, max","Drei int-Variablen, noch ohne Wert.");
  T.println("Maximum-Berechnung"); T.s("Maximum-Berechnung","Überschrift.");
  T.println(" erste Zahl: "); T.s("erste Zahl","Aufforderung.");
  v.a=T.pi(T.read()); T.s("a = Integer","Eingabe → a = "+v.a);
  T.println(" zweite Zahl: "); T.s("zweite Zahl","Aufforderung.");
  v.b=T.pi(T.read()); T.s("b = Integer","Eingabe → b = "+v.b);
  var c=v.a>=v.b;
  T.s("if (a >= b)","`a >= b` → "+v.a+" >= "+v.b+" ist "+tf(c)+(c?", also läuft die Zeile direkt darunter.":", also wird `max = a;` übersprungen und der else-Zweig läuft."));
  if(c){v.max=v.a;T.s("max = a","max = "+v.max);}
  else{v.max=v.b;T.s("max = b","max = "+v.max);}
  T.println(" Maximum: "+v.max); T.s("Maximum:","Ausgabe.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"muenzwurf", gruppe:"k13", name:"Muenzwurf.java", kurz:"Kap. 3 · Zufall mit Math.random()",
intro:"Simuliert einen Münzwurf. Bei jedem Neustart kommt eine andere Zufallszahl heraus. Klick ein paarmal auf **Neu starten**!",
inputs:[],
code:String.raw`void main() {

  IO.print("Muenzwurf: ");
  if (Math.random() < 0.5)          //0 <= Math.random() < 1
    IO.println("Kopf");
  else
    IO.println("Zahl");

}`,
run:function(T){
  T.main();
  T.s("void main()","Start.");
  T.print("Muenzwurf: "); T.s("IO.print(","Ausgabe ohne Zeilenumbruch. Das Ergebnis kommt in dieselbe Zeile.");
  var r=Math.random(), c=r<0.5;
  T.s("Math.random()","`Math.random()` liefert eine zufällige Kommazahl zwischen 0 (inklusive) und 1 (exklusive). Diesmal: **"+jd(r)+"**. "+jd(r)+" < 0.5 ist "+tf(c)+". Das passiert in genau der Hälfte der Fälle.");
  if(c){T.println("Kopf");T.s("\"Kopf\"","Kopf!");} else {T.println("Zahl");T.s("\"Zahl\"","Zahl!");}
  T.s("ENDE","Fertig.");
}});

P.push({id:"summen", gruppe:"k13", name:"SummeN.java", kurz:"Kap. 3 · 1+2+…+n mit while",
intro:"Addiert alle Zahlen von 1 bis n. Typisches Schleifenmuster: eine **Summenvariable** startet bei 0, eine **Zählvariable** läuft von 1 bis n.",
inputs:[{l:"n",d:"4"}],
code:String.raw`void main(){

  int n;       //Obergrenze
  int sum = 0; //Summe
  int i = 1;   //Index fuer Werte 1 bis n

  IO.println("Summe 1 bis n berechnen, n eingeben:");
  n = Integer.parseInt(IO.readln());

  while (i <= n){
    sum = sum + i;
    i = i + 1;
  }

  IO.println();
  IO.println("Summe 1 bis " + n + " : " + sum);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int"); T.s("int n;","n ohne Wert. Er wird gleich eingelesen.");
  T.dec("sum","int",0); T.s("int sum","Die Summe startet bei 0. Es ist ja noch nichts addiert.");
  T.dec("i","int",1); T.s("int i","Die Zählvariable startet bei 1.");
  T.println("Summe 1 bis n berechnen, n eingeben:"); T.s("n eingeben","Aufforderung.");
  v.n=T.pi(T.read()); T.s("n = Integer","n = "+v.n);
  while(true){
    var c=v.i<=v.n;
    T.s("while (i <= n)","`i <= n` → "+v.i+" <= "+v.n+" ist "+tf(c)+(c?".":", also ist die Schleife fertig."));
    if(!c) break;
    var old=v.sum; v.sum=v.sum+v.i;
    T.s("sum = sum + i","sum = "+old+" + "+v.i+" = "+v.sum);
    v.i=v.i+1;
    T.s("i = i + 1","i = "+v.i+". Zurück zur Bedingung.");
  }
  T.println(); T.s("IO.println();","Leerzeile.");
  T.println("Summe 1 bis "+v.n+" : "+v.sum); T.s("\"Summe 1 bis \"","Ausgabe. (Kontrolle mit der Gauß-Formel: n·(n+1)/2 = "+(v.n*(v.n+1)/2)+".)");
  T.s("ENDE","Fertig.");
}});

P.push({id:"ggt", gruppe:"k13", name:"GGTDifferenz.java", kurz:"Kap. 3 · größter gemeinsamer Teiler",
intro:"Der **ggT** (größte gemeinsame Teiler) mit dem Differenzalgorithmus: Man zieht die kleinere Zahl so lange von der größeren ab, bis beide gleich sind. Das ist dann der ggT. Kommt in Kap. 5 nochmal vor.",
tipp:"Gib eine 0 ein. Dann hört die Schleife nie auf (Endlosschleife)!",
inputs:[{l:"m",d:"12"},{l:"n",d:"18"}],
max:300,
code:String.raw`void main(){

  int m, n;          //Ausgangswerte fuer ggT-Berechnung
  int hilf1, hilf2;  //Hilfsvariable

  IO.println("GGT-Berechnung - 2 Zahlen eingeben");
  m = Integer.parseInt(IO.readln());
  n = Integer.parseInt(IO.readln());

  hilf1 = m; hilf2 = n;  // Originalwerte bleiben erhalten

  while (hilf1 != hilf2)      //keine Klammern noetig,
    if (hilf1 > hilf2)        // da nur eine if-Anweisung!
      hilf1 = hilf1 - hilf2;
    else
      hilf2 = hilf2 - hilf1;

  IO.println();
  IO.println("ggT(" + m + ", " + n + ") = " + hilf1);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("m","int");T.dec("n","int"); T.s("int m, n","Die beiden Eingabewerte.");
  T.dec("hilf1","int");T.dec("hilf2","int"); T.s("int hilf1","Hilfsvariablen. Mit ihnen wird gerechnet, damit m und n unverändert bleiben.");
  T.println("GGT-Berechnung - 2 Zahlen eingeben"); T.s("GGT-Berechnung","Aufforderung.");
  v.m=T.pi(T.read()); T.s("m = Integer","m = "+v.m);
  v.n=T.pi(T.read()); T.s("n = Integer","n = "+v.n);
  v.hilf1=v.m; v.hilf2=v.n; T.s("hilf1 = m","Zwei Anweisungen in einer Zeile: Kopien anlegen. hilf1 = "+v.hilf1+", hilf2 = "+v.hilf2+".");
  while(true){
    var c=v.hilf1!==v.hilf2;
    T.s("while (hilf1","`hilf1 != hilf2` (`!=` heißt „ungleich“) → "+v.hilf1+" != "+v.hilf2+" ist "+tf(c)+(c?". Die beiden sind noch verschieden, also weiter.":". Sie sind gleich, das ist der ggT!"));
    if(!c) break;
    var g=v.hilf1>v.hilf2;
    T.s("if (hilf1 > hilf2)","Welche ist größer? "+v.hilf1+" > "+v.hilf2+" ist "+tf(g)+".");
    if(g){var o=v.hilf1; v.hilf1-=v.hilf2; T.s("hilf1 = hilf1 - hilf2","hilf1 = "+o+" − "+v.hilf2+" = "+v.hilf1);}
    else{var o2=v.hilf2; v.hilf2-=v.hilf1; T.s("hilf2 = hilf2 - hilf1","hilf2 = "+o2+" − "+v.hilf1+" = "+v.hilf2);}
  }
  T.println(); T.s("IO.println();","Leerzeile.");
  T.println("ggT("+v.m+", "+v.n+") = "+v.hilf1); T.s("\"ggT(\"","Ausgabe. Hier sieht man, wozu die Hilfsvariablen gut waren: m und n haben noch ihre ursprünglichen Werte.");
  T.s("ENDE","Fertig.");
}});

/* ===== Kapitel 4 ===== */

P.push({id:"typecast", gruppe:"k4", name:"TypeCast.java", kurz:"Kap. 4 · Typumwandlung (Cast)",
intro:"Was passiert beim Rechnen und Zuweisen mit verschiedenen Typen? Ein **Cast** wie `(int)` oder `(double)` wandelt einen Wert ausdrücklich in einen anderen Typ um.",
inputs:[],
code:String.raw`void main(){

  byte b = 127; int i = 4; double d = 4.6;

  d = i / 10;    //Erg: 0.0
  IO.println("a) b: " + b + " i: " + i + " d: " + d);

  d = (double)i / 10;  //Erg: 0.4
  IO.println("b) b: " + b + " i: " + i + " d: " + d);

//    i = d * 4;            //nicht erlaubt

  i = (int)(d) * 4;      //Erg: 0
  IO.println("c) b: " + b + " i: " + i + " d: " + d);

  i = (int)(d * 4);      //Erg: 1
  IO.println("d) b: " + b + " i: " + i + " d: " + d);

  b = (byte)(i * 128);
  IO.println("e) b: " + b + " i: " + i + " d: " + d);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("b","byte",127);T.dec("i","int",4);T.dec("d","double",4.6);
  T.s("byte b = 127","Drei Variablen: `byte` ist eine kleine ganze Zahl (nur −128 bis 127), `int` eine normale ganze Zahl, `double` eine Kommazahl.");
  function line(l){return l+") b: "+v.b+" i: "+v.i+" d: "+jd(v.d)}
  v.d=T.div(v.i,10);
  T.s("d = i / 10","**Falle!** `i / 10` sind zwei ganze Zahlen, also rechnet Java **ganzzahlig**: 4 / 10 = 0 (Rest wird weggeworfen). Erst **danach** wird die 0 in den double gespeichert → 0.0. Dass links ein double steht, hilft nicht mehr.");
  T.println(line("a")); T.s("\"a) b","Ausgabe.");
  v.d=v.i/10;
  T.s("d = (double)i","`(double)i` macht aus 4 zuerst 4.0. Jetzt ist eine Seite eine Kommazahl, also rechnet Java mit Kommazahlen: 4.0 / 10 = 0.4. Der Cast gilt nur für `i`, weil er stärker bindet als `/`.");
  T.println(line("b")); T.s("\"b) b","Ausgabe.");
  T.s("i = d * 4","Auskommentiert, denn das wäre ein Fehler: `d * 4` ist double (1.6) und passt nicht ohne Cast in ein int.");
  v.i=Math.trunc(v.d)*4;
  T.s("i = (int)(d) * 4","Der Cast wirkt nur auf `d`: (int)0.4 = **0** (abgeschnitten). Dann 0 * 4 = 0.");
  T.println(line("c")); T.s("\"c) b","Ausgabe.");
  v.i=Math.trunc(v.d*4);
  T.s("i = (int)(d * 4)","Jetzt zuerst die Klammer: 0.4 * 4 = 1.6. Dann der Cast: (int)1.6 = **1**. Es wird abgeschnitten, nicht gerundet!");
  T.println(line("d")); T.s("\"d) b","Ausgabe.");
  v.b=((v.i*128)<<24)>>24;
  T.s("b = (byte)","i * 128 = 128. Aber in ein byte passen nur −128 bis 127! Der Cast `(byte)` nimmt nur die untersten 8 Bit. 128 „läuft über“ und wird zu **−128** (wie ein Kilometerzähler, der von 999 auf 000 springt). Das nennt man **Überlauf**.");
  T.println(line("e")); T.s("\"e) b","Ausgabe.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"charint", gruppe:"k4", name:"CharInt.java", kurz:"Kap. 4 · Zeichen ↔ Zahl",
intro:"Jedes Zeichen (`char`) hat intern eine **Nummer** (Unicode/ASCII). Zum Beispiel ist 'A' die 65. Java kann zwischen char und int hin- und herwandeln.",
tipp:"Probier bei der Zahl 97, 48 oder 9731.",
inputs:[{l:"Zeichen",d:"x"},{l:"Zahl",d:"65"}],
code:String.raw`void main(){

  char c;
  int a;

  c = '0'; a = c;
  IO.println("Ziffern:         " + c + " / int-Wert: " + a);
  c = 'A'; a = c;
  IO.println("Grossbuchstaben: " + c + " / int-Wert: " + a);
  c = 'a'; a = c;
  IO.println("Kleinbuchstaben: " + c + " / int-Wert: " + a);
  IO.println();

  IO.println("Zeichen eingeben:");
  c = IO.readln().trim().charAt(0);
  a = c;        //char -> int Zuweisung
  IO.println();
  IO.println("char -> int \n" +
             "  Zeichen: " + c + " / int-Wert: " + a);

  a = c + c;    //Addition mit char - Ergebnistyp int!!
  c = (char)a;  // type cast int -> char
  IO.println("type cast int -> char \n" +
             "  Zeichen: " + c + " / int-Wert: " + a);
  IO.println();

  IO.println("Zahl fuer Konversion int -> char:");
  a = Integer.parseInt(IO.readln());
  c = (char)a;
  IO.println("Zahl: " + a + " / Zeichen >" + c + "<");
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("c","char");T.dec("a","int"); T.s("int a;","Ein `char` (ein einzelnes Zeichen, in **einfachen** Anführungszeichen) und ein `int`.");
  [["'0'","Ziffern:         ","Achtung: Das **Zeichen** '0' ist nicht die Zahl 0! Seine Nummer ist 48."],["'A'","Grossbuchstaben: ","'A' hat die Nummer 65, 'B' 66 usw."],["'a'","Kleinbuchstaben: ","Kleinbuchstaben kommen später: 'a' = 97, also genau 32 nach 'A'."]].forEach(function(x){
    v.c=x[0].charAt(1); v.a=v.c.charCodeAt(0);
    T.s("c = "+x[0],"`c = "+x[0]+";` und dann `a = c;`: Einem int darf man einfach ein char zuweisen. Gespeichert wird die **Nummer** des Zeichens: "+v.a+". "+x[2]);
    T.println(x[1]+v.c+" / int-Wert: "+v.a); T.s(x[1].trim(),"Ausgabe: Das char wird als Zeichen ausgegeben, das int als Zahl.");
  });
  T.println(); T.s("IO.println();#1","Leerzeile.");
  T.println("Zeichen eingeben:"); T.s("Zeichen eingeben","Aufforderung.");
  var s=T.read(), t=s.trim(); if(!t) T.fail("StringIndexOutOfBoundsException – die Eingabe war leer, also gibt es kein Zeichen an Position 0.");
  v.c=t.charAt(0);
  T.s("charAt(0)","`IO.readln()` liefert "+q(s)+", `.trim()` entfernt Leerzeichen am Rand, `.charAt(0)` nimmt das **erste Zeichen** (Position 0) → '"+v.c+"'.");
  v.a=v.c.charCodeAt(0); T.s("a = c;        //char","char → int: a = "+v.a+".");
  T.println(); T.s("IO.println();#2","Leerzeile.");
  T.println("char -> int \n  Zeichen: "+v.c+" / int-Wert: "+v.a); T.s("IO.println(\"char -> int","`\\n` im Text ist ein Zeilenumbruch, deshalb zwei Zeilen.");
  v.a=v.c.charCodeAt(0)*2;
  T.s("a = c + c","**Rechnen mit char ergibt int!** '"+v.c+"' + '"+v.c+"' = "+(v.a/2)+" + "+(v.a/2)+" = "+v.a+". Gerechnet wird mit den Nummern, nicht mit Text.");
  v.c=String.fromCharCode(v.a&0xFFFF);
  T.s("c = (char)a;#1","Umgekehrt (int → char) braucht man einen **Cast** `(char)`. Zeichen Nummer "+v.a+" ist '"+v.c+"'.");
  T.println("type cast int -> char \n  Zeichen: "+v.c+" / int-Wert: "+v.a); T.s("IO.println(\"type cast","Ausgabe.");
  T.println(); T.s("IO.println();#3","Leerzeile.");
  T.println("Zahl fuer Konversion int -> char:"); T.s("Zahl fuer Konversion","Aufforderung.");
  v.a=T.pi(T.read()); T.s("a = Integer","a = "+v.a);
  v.c=String.fromCharCode(v.a&0xFFFF); T.s("c = (char)a;#2","Zeichen Nummer "+v.a+" → '"+v.c+"'.");
  T.println("Zahl: "+v.a+" / Zeichen >"+v.c+"<"); T.s("Zahl: ","Die > < zeigen, wo das Zeichen anfängt und aufhört. Hilfreich bei unsichtbaren Zeichen wie dem Leerzeichen (32).");
  T.s("ENDE","Fertig.");
}});

P.push({id:"stringkonk", gruppe:"k4", name:"StringKonkatenation.java", kurz:"Kap. 4 · Texte zusammenhängen",
intro:"Der `+`-Operator hat zwei Bedeutungen: Bei Zahlen **addiert** er, sobald ein String beteiligt ist, **hängt** er aneinander (Konkatenation). Ausgewertet wird **von links nach rechts**.",
inputs:[],
code:String.raw`void main(){

  String s1 = "Guten ";
  String s2 = s1 + "Tag";
  IO.println("s1: " + s1);
  IO.println("s2: " + s2);

  int a = 7;
  s1 = a + "5";
  s1 = 1 + s1;
  IO.println ("a: " + a);
  IO.println ("s1: " + s1);

  IO.println(" a:   " + a + "\n a+1: " + (a+1));

  s1 = "Ein \" im String!";
  IO.println(s1 + "\nneue Zeile");
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("s1","String","Guten "); T.s("String s1","s1 = \"Guten \" (mit Leerzeichen am Ende).");
  T.dec("s2","String",v.s1+"Tag"); T.s("String s2","\"Guten \" + \"Tag\" → \"Guten Tag\".");
  T.println("s1: "+v.s1); T.s("IO.println(\"s1: \" + s1);#1","Ausgabe.");
  T.println("s2: "+v.s2); T.s("\"s2: \"","Ausgabe.");
  T.dec("a","int",7); T.s("int a","a = 7");
  v.s1=v.a+"5"; T.s("s1 = a + \"5\"","7 + \"5\": ein String ist dabei, also wird **angehängt**, nicht gerechnet → \"75\" (Text!).");
  v.s1=1+v.s1; T.s("s1 = 1 + s1","1 + \"75\" → \"175\". Auch hier wird nicht gerechnet, weil s1 ein String ist.");
  T.println("a: "+v.a); T.s("\"a: \"","Ausgabe.");
  T.println("s1: "+v.s1); T.s("IO.println (\"s1: \"","Ausgabe.");
  T.println(" a:   "+v.a+"\n a+1: "+(v.a+1));
  T.s("a+1: ","Zwei Tricks: `\\n` ist ein **Zeilenumbruch** im Text. Und `(a+1)` steht in Klammern, damit zuerst gerechnet wird (8). Ohne Klammern hätte Java \"…7\" + 1 zu \"71\" verbunden!");
  v.s1="Ein \" im String!"; T.s("s1 = \"Ein","Wie bekommt man ein Anführungszeichen **in** einen String? Mit `\\\"` (Backslash davor). Das nennt man **Escape-Sequenz**.");
  T.println(v.s1+"\nneue Zeile"); T.s("neue Zeile","Ausgabe mit Zeilenumbruch in der Mitte.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"stringvgl", gruppe:"k4", name:"StringVergleich.java", kurz:"Kap. 4 · == vs. equals",
intro:"Strings vergleicht man **nicht** mit `==`, sondern mit `.equals(…)`. `==` prüft nur, ob beide Variablen auf **dasselbe Objekt** im Speicher zeigen (gleicher „Zeiger“), nicht ob der Text gleich ist.",
tipp:"Gib genau „Hallo“ ein: `==` ist trotzdem false, `equals` aber true!",
inputs:[{l:"Text",d:"Hallo"}],
code:String.raw`void main(){

  String s1 = "Hallo", s2;

  IO.println ("Text eingeben:");
  s2 = IO.readln();     //liest ganze Zeile als String

  IO.println("s1 == s2:     " + (s1 == s2));
  IO.println("s1 equals s2: " + (s1.equals(s2)));

  if (s1 == "Hallo")
    IO.println ("selber Zeiger");
  else
    IO.println ("verschiedener Zeiger");
  IO.println();

  s1 = "Jetzt neu";
  IO.println("s1 zeigt auf \"Jetzt neu\", Laenge:" + s1.length());
  IO.println("Zeichen an Pos. 3 von s1: " + s1.charAt(3));
  IO.println("Vergleich " + s1 + " - " + s2 + " : " +
             s1.compareTo(s2));
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("s1","String","Hallo"); T.dec("s2","String"); T.s("String s1","s1 zeigt auf den Text \"Hallo\", s2 hat noch keinen Wert.");
  T.println("Text eingeben:"); T.s("Text eingeben","Aufforderung.");
  v.s2=T.read(); T.s("s2 = IO.readln","s2 = "+q(v.s2)+". Wichtig: `readln` erzeugt dafür ein **neues** String-Objekt im Speicher.");
  T.println("s1 == s2:     false");
  T.s("s1 == s2:","`s1 == s2` ist **false**, "+(v.s2==="Hallo"?"obwohl beide \"Hallo\" enthalten! Es sind zwei verschiedene Objekte an verschiedenen Stellen im Speicher, und `==` vergleicht nur diese Stellen.":"weil es zwei verschiedene Objekte sind (und hier ist sogar der Text verschieden)."));
  var eq=v.s1===v.s2;
  T.println("s1 equals s2: "+eq); T.s("s1 equals s2","`s1.equals(s2)` vergleicht den **Inhalt** Zeichen für Zeichen → "+tf(eq)+". So vergleicht man Strings richtig!");
  T.s("if (s1 == \"Hallo\")","Sonderfall: `s1` wurde mit dem **Literal** \"Hallo\" belegt, und hier steht nochmal das Literal \"Hallo\". Java legt gleiche Literale nur **einmal** im Speicher an. Darum zeigen beide auf dasselbe Objekt → `==` ist **true**. Darauf sollte man sich aber nie verlassen.");
  T.println("selber Zeiger"); T.s("\"selber Zeiger\"","Der if-Zweig läuft.");
  T.println(); T.s("IO.println();","Leerzeile.");
  v.s1="Jetzt neu"; T.s("s1 = \"Jetzt neu\"","s1 zeigt jetzt auf einen anderen Text.");
  T.println("s1 zeigt auf \"Jetzt neu\", Laenge:"+v.s1.length); T.s("Laenge:","`s1.length()` = Anzahl der Zeichen = "+v.s1.length+" (das Leerzeichen zählt mit).");
  T.println("Zeichen an Pos. 3 von s1: "+v.s1.charAt(3)); T.s("charAt(3)","`charAt(3)`: Die Positionen beginnen bei **0**! J=0, e=1, t=2, z=3 → 'z'.");
  var a=v.s1,b=v.s2,n=Math.min(a.length,b.length),r=a.length-b.length,k=-1;
  for(var i=0;i<n;i++) if(a.charCodeAt(i)!==b.charCodeAt(i)){r=a.charCodeAt(i)-b.charCodeAt(i);k=i;break;}
  T.println("Vergleich "+v.s1+" - "+v.s2+" : "+r);
  T.s("s1.compareTo","`compareTo` vergleicht alphabetisch: **negativ** = s1 kommt vorher, **0** = gleich, **positiv** = s1 kommt nachher. "+(k>=0?"Erstes unterschiedliches Zeichen an Position "+k+": '"+a[k]+"' ("+a.charCodeAt(k)+") − '"+b[k]+"' ("+b.charCodeAt(k)+") = "+r+".":"Ein String ist der Anfang des anderen, also ist das Ergebnis der Längenunterschied: "+r+"."));
  T.s("ENDE","Fertig.");
}});

P.push({id:"doubleungenau", gruppe:"k4", name:"DoubleUngenau.java", kurz:"Kap. 4 · double rechnet nicht exakt",
intro:"Man würde erwarten: 0.1 + 0.2 + 0.3 + 0.4 = 1.0, also passen 4 Summanden genau hinein. Aber `double` speichert Zahlen im Binärsystem, und 0.1 ist dort ein unendlicher Bruch, also nur **ungefähr** 0.1. Kleine Fehler summieren sich.",
inputs:[],
code:String.raw`void main(){

  double rest = 1.0;
  double aktuell = 0.1;
  int anz = 0;

  while (rest >= aktuell){
    rest = rest - aktuell;
    anz = anz + 1;
    aktuell = aktuell + 0.1;
  }

  IO.println("Anzahl der Summanden:" + anz);
  IO.println("restlicher Wert:     " + rest);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("rest","double",1.0); T.s("double rest","rest = 1.0");
  T.dec("aktuell","double",0.1); T.s("double aktuell","aktuell = 0.1");
  T.dec("anz","int",0); T.s("int anz","anz zählt die Summanden.");
  while(true){
    var c=v.rest>=v.aktuell;
    T.s("while (rest","`rest >= aktuell` → "+jd(v.rest)+" >= "+jd(v.aktuell)+" ist "+tf(c)+"."+(!c&&v.anz===3?" **Überraschung:** Eigentlich sollte rest 0.4 sein und die Bedingung true. Aber rest ist ein winziges bisschen **kleiner** als 0.4, und aktuell ein winziges bisschen **größer**!":""));
    if(!c) break;
    var o=v.rest; v.rest=v.rest-v.aktuell; T.s("rest = rest - aktuell",jd(o)+" − "+jd(v.aktuell)+" = **"+jd(v.rest)+"**");
    v.anz++; T.s("anz = anz + 1","anz = "+v.anz);
    var o2=v.aktuell; v.aktuell=v.aktuell+0.1; T.s("aktuell = aktuell + 0.1",jd(o2)+" + 0.1 = **"+jd(v.aktuell)+"**"+(jd(v.aktuell).length>5?". Da ist er, der Rundungsfehler!":""));
  }
  T.println("Anzahl der Summanden:"+v.anz); T.s("Anzahl der Summanden","Nur 3 statt 4!");
  T.println("restlicher Wert:     "+jd(v.rest)); T.s("restlicher Wert","**Merke:** double-Werte nie mit `==` vergleichen und bei Geldbeträgen lieber mit ganzen Cent (int) rechnen.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"danglingelse", gruppe:"k4", name:"DanglingElse.java", kurz:"Kap. 4 · Zu welchem if gehört das else?",
intro:"Die Einrückung täuscht! Das `else` sieht aus, als gehöre es zum äußeren `if (a >= b)`. Java ignoriert aber Einrückungen: Ein `else` gehört **immer zum nächsten (inneren) if**, das noch kein else hat. Rechts siehst du, was das für Folgen hat.",
tipp:"Mit a = 3, b = 7 kommt 0 heraus statt 7! Probier auch a = −2, b = −5 und a = 8, b = 2.",
inputs:[{l:"erste Zahl a",d:"3"},{l:"zweite Zahl b",d:"7"}],
code:String.raw`void main(){

  int a, b, erg = 0;

  IO.println("Maximum-Berechnung");
  IO.println(" erste Zahl: ");
  a = Integer.parseInt(IO.readln());
  IO.println(" zweite Zahl: ");
  b = Integer.parseInt(IO.readln());

  if (a >= b)
    if (a > 0)
      erg = a;
  else
    erg = b;

  IO.println(" Ergebnis: " + erg);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("a","int");T.dec("b","int");T.dec("erg","int",0); T.s("int a, b, erg","erg startet mit 0.");
  T.println("Maximum-Berechnung"); T.s("Maximum-Berechnung","Überschrift.");
  T.println(" erste Zahl: "); T.s("erste Zahl","Aufforderung.");
  v.a=T.pi(T.read()); T.s("a = Integer","a = "+v.a);
  T.println(" zweite Zahl: "); T.s("zweite Zahl","Aufforderung.");
  v.b=T.pi(T.read()); T.s("b = Integer","b = "+v.b);
  var c1=v.a>=v.b;
  T.s("if (a >= b)","`a >= b` → "+v.a+" >= "+v.b+" ist "+tf(c1)+". So liest Java den Code wirklich:\n`if (a >= b) { if (a > 0) erg = a; else erg = b; }`"+(c1?"":"\nDas äußere if hat **kein** else, also passiert gar nichts!"));
  if(c1){
    var c2=v.a>0;
    T.s("if (a > 0)","`a > 0` → "+v.a+" > 0 ist "+tf(c2)+".");
    if(c2){v.erg=v.a;T.s("erg = a","erg = "+v.erg);}
    else{v.erg=v.b;T.s("erg = b","Das else gehört zum **inneren** if (a > 0). Deshalb erg = b = "+v.erg+(v.a!==Math.max(v.a,v.b)?"":", obwohl a größer ist")+".");}
  } else {
    T.s(" Ergebnis","Beide Zuweisungen wurden übersprungen. erg ist immer noch **0**, das ist eigentlich falsch, denn das Maximum wäre "+v.b+".");
  }
  T.println(" Ergebnis: "+v.erg); T.s(" Ergebnis","Ausgabe. **Lösung:** Mit geschweiften Klammern sagt man Java klar, was zusammengehört: `if (a >= b) { if (a > 0) erg = a; } else erg = b;`");
  T.s("ENDE","Fertig.");
}});

P.push({id:"maximum3", gruppe:"k4", name:"Maximum3.java", kurz:"Kap. 4 · verschachtelte ifs + Methode",
intro:"Maximum von drei Zahlen mit einer eigenen Methode `max3`, die drei Parameter bekommt und das Ergebnis mit `return` zurückgibt. Darin stecken ifs in ifs.",
inputs:[{l:"erste Zahl",d:"5"},{l:"zweite Zahl",d:"9"},{l:"dritte Zahl",d:"2"}],
code:String.raw`void main(){

  int x, y, z;

  IO.println("Maximum von 3 Zahlen");
  IO.println(" erste Zahl: ");
  x = Integer.parseInt(IO.readln());
  IO.println(" zweite Zahl: ");
  y = Integer.parseInt(IO.readln());
  IO.println(" dritte Zahl: ");
  z = Integer.parseInt(IO.readln());

  IO.println(" Maximum: " + max3(x, y, z));
}

//berechnet Maximum der 3 Werte a, b, c
int max3 (int a, int b, int c){
  int max;
  if (a >= b)
    if (a >= c)
      max = a;
    else
      max = c;
  else
    if (b >= c)
      max = b;
    else
      max = c;
  return max;
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("x","int");T.dec("y","int");T.dec("z","int"); T.s("int x, y, z","Drei Variablen.");
  T.println("Maximum von 3 Zahlen"); T.s("Maximum von 3","Überschrift.");
  [["x","erste"],["y","zweite"],["z","dritte"]].forEach(function(p){
    T.println(" "+p[1]+" Zahl: "); T.s(p[1]+" Zahl","Aufforderung.");
    v[p[0]]=T.pi(T.read()); T.s(p[0]+" = Integer",p[0]+" = "+v[p[0]]);
  });
  T.s(" Maximum: ","Bevor ausgegeben werden kann, muss `max3(x, y, z)` ausgerechnet werden. Java **springt in die Methode**.");
  var w=T.call("max3",[["a","int",v.x],["b","int",v.y],["c","int",v.z]]);
  T.s("int max3","Die Werte werden der Reihe nach in die Parameter **kopiert**: a = x = "+w.a+", b = y = "+w.b+", c = z = "+w.c+". Die Methode hat eigene Variablen (Kasten „max3“ rechts).");
  T.dec("max","int"); T.s("int max;","Lokale Variable max.");
  var c1=w.a>=w.b;
  T.s("if (a >= b)",w.a+" >= "+w.b+" ist "+tf(c1)+(c1?". Also ist a schon mal größer als b. Jetzt muss a noch gegen c antreten.":". Also ist b größer. Weiter beim **äußeren else**, wo b gegen c antritt."));
  if(c1){
    var c2=w.a>=w.c; T.s("if (a >= c)",w.a+" >= "+w.c+" ist "+tf(c2)+".");
    if(c2){w.max=w.a;T.s("max = a","max = a = "+w.max);} else {w.max=w.c;T.s("max = c;#1","max = c = "+w.max);}
  } else {
    var c3=w.b>=w.c; T.s("if (b >= c)",w.b+" >= "+w.c+" ist "+tf(c3)+".");
    if(c3){w.max=w.b;T.s("max = b","max = b = "+w.max);} else {w.max=w.c;T.s("max = c;#2","max = c = "+w.max);}
  }
  var r=w.max;
  T.s("return max","`return` gibt "+r+" zurück. Die Methode ist fertig, ihre Variablen verschwinden.");
  T.ret();
  T.println(" Maximum: "+r); T.s(" Maximum: ","Zurück in main: `max3(x, y, z)` wird durch "+r+" ersetzt und ausgegeben.");
  T.s(14,"Fertig.");
}});

P.push({id:"median3", gruppe:"k4", name:"Median3.java", kurz:"Kap. 4 · mittlerer von 3 Werten",
intro:"Der **Median** ist der mittlere Wert, wenn man die Zahlen sortiert (bei 3, 8, 5 also 5). Die Methode findet ihn mit einer if-else-if-Kette. Die Kommentare im Code zeigen jeweils, welche Reihenfolge gerade gilt.",
inputs:[{l:"x",d:"3"},{l:"y",d:"8"},{l:"z",d:"5"}],
code:String.raw`void main(){

  int x, y, z;

  IO.println("Medianberechnung, 3 ganzzahlige Werte eingeben:");
  x = Integer.parseInt(IO.readln());
  y = Integer.parseInt(IO.readln());
  z = Integer.parseInt(IO.readln());

  IO.println();
  IO.println("Median von " + x + ", " + y + ", " + z + ":   "
             + median(x, y, z));
}

//Median von 3 Zahlen
int median(int a, int b, int c){
  int median;
  if (a < b)
    if (b < c)
      median = b;       //a < b < c
    else if (a < c)
      median = c;       //a < c < b
    else
      median = a;       //c < a < b
  else if (a < c)
    median = a;         //b < a < c
  else if (b < c)
    median = c;         //b < c < a
  else
    median = b;         //c < b < a
  return median;
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("x","int");T.dec("y","int");T.dec("z","int"); T.s("int x, y, z","Drei Variablen.");
  T.println("Medianberechnung, 3 ganzzahlige Werte eingeben:"); T.s("Medianberechnung","Aufforderung.");
  ["x","y","z"].forEach(function(n){v[n]=T.pi(T.read()); T.s(n+" = Integer",n+" = "+v[n]);});
  T.println(); T.s("IO.println();","Leerzeile.");
  T.s("\"Median von \"","Der Ausdruck geht über zwei Zeilen. Zuerst wird `median(x, y, z)` aufgerufen.");
  var w=T.call("median",[["a","int",v.x],["b","int",v.y],["c","int",v.z]]);
  T.s("int median(","a = "+w.a+", b = "+w.b+", c = "+w.c+". (Die Variable `median` heißt so wie die Methode. Das ist erlaubt, aber verwirrend.)");
  T.dec("median","int"); T.s("int median;","Lokale Variable.");
  var A=w.a,B=w.b,C=w.c,k;
  T.s("if (a < b)",A+" < "+B+" ist "+tf(A<B)+".");
  if(A<B){
    T.s("    if (b < c)",B+" < "+C+" ist "+tf(B<C)+".");
    if(B<C){w.median=B;k="//a < b < c";}
    else{ T.s("else if (a < c)#1",A+" < "+C+" ist "+tf(A<C)+".");
      if(A<C){w.median=C;k="//a < c < b";} else {w.median=A;k="//c < a < b";} }
  } else {
    T.s("else if (a < c)#2",A+" < "+C+" ist "+tf(A<C)+".");
    if(A<C){w.median=A;k="//b < a < c";}
    else{ T.s("else if (b < c)",B+" < "+C+" ist "+tf(B<C)+".");
      if(B<C){w.median=C;k="//b < c < a";} else {w.median=B;k="//c < b < a";} }
  }
  T.s(k,"Damit ist die Reihenfolge klar: `"+k.slice(2)+"`. Der mittlere Wert ist "+w.median+".");
  var r=w.median; T.s("return median","Rückgabe von "+r+"."); T.ret();
  T.println("Median von "+v.x+", "+v.y+", "+v.z+":   "+r); T.s("\"Median von \"","Ausgabe.");
  T.s(13,"Fertig.");
}});

P.push({id:"tage", gruppe:"k4", name:"TageProMonat.java", kurz:"Kap. 4 · switch mit case und break",
intro:"`switch` springt direkt zu dem `case`, der zum Wert passt. Ohne `break` läuft Java einfach weiter in die nächsten Zeilen (**Durchfallen**, „fall-through“). Das wird hier absichtlich genutzt, um mehrere Monate zusammenzufassen.",
tipp:"Probier 2, 9 und 13.",
inputs:[{l:"Monat (1-12)",d:"4"}],
code:String.raw`void main(){

  int monat, tage = 0;

  IO.println("Monat als Zahl (1-12) eingeben:");
  monat = Integer.parseInt(IO.readln());

  switch (monat){
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      tage = 31;break;
    case 4:
    case 6:
    case 9:
    case 11:
      tage = 30; break;
    case 2:
      tage = 28; break;
    default:
      IO.println(" Monat ungueltig!");
  }
  IO.println("Anzahl der Tage: " + tage);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("monat","int");T.dec("tage","int",0); T.s("int monat","tage startet mit 0.");
  T.println("Monat als Zahl (1-12) eingeben:"); T.s("Monat als Zahl","Aufforderung.");
  v.monat=T.pi(T.read()); T.s("monat = Integer","monat = "+v.monat);
  var m=v.monat, g31=[1,3,5,7,8,10,12], g30=[4,6,9,11];
  T.s("switch (monat)","`switch (monat)`: Java sucht ein `case "+m+":`. "+((g31.concat(g30,[2]).indexOf(m)>=0)?"Gefunden! Java **springt direkt dorthin**.":"Es gibt keinen passenden case, also springt Java zu `default:`."));
  if(g31.indexOf(m)>=0||g30.indexOf(m)>=0){
    var grp=g31.indexOf(m)>=0?g31:g30, val=grp===g31?31:30, rest=grp.slice(grp.indexOf(m));
    T.s("case "+m+":","Hier geht es los. "+(rest.length>1?"Unter `case "+m+":` steht keine Anweisung, also **fällt** Java einfach durch die folgenden case-Zeilen ("+rest.slice(1).join(", ")+") hindurch bis zur ersten Anweisung.":"Direkt darunter steht die Anweisung."));
    v.tage=val; T.s("tage = "+val,"tage = "+val+". Dann sorgt `break;` dafür, dass der switch **sofort verlassen** wird. Ohne break würde Java in die nächsten Fälle weiterlaufen und tage überschreiben!");
  } else if(m===2){
    T.s("case 2:","Februar.");
    v.tage=28; T.s("tage = 28","tage = 28, dann `break;`.");
  } else {
    T.s("default:","`default` fängt alle Werte ab, für die es keinen case gibt.");
    T.println(" Monat ungueltig!"); T.s("Monat ungueltig","Fehlermeldung. tage bleibt 0.");
  }
  T.println("Anzahl der Tage: "+v.tage); T.s("Anzahl der Tage","Nach dem switch geht's hier weiter.");
  T.s("ENDE","Fertig.");
}});

P.push({id:"tage2", gruppe:"k4", name:"TageProMonat_v2.java", kurz:"Kap. 4 · moderner switch-Ausdruck",
intro:"Dasselbe Programm mit dem **neuen** switch: Mehrere Werte stehen durch Komma getrennt in einem case, mit `->` statt `:`. Es gibt **kein Durchfallen** und kein break. Und der ganze switch liefert einen **Wert**, der direkt in `tage` gespeichert wird.",
inputs:[{l:"Monat (1-12)",d:"9"}],
code:String.raw`void main(){

  int monat, tage = 0;

  IO.println("Monat als Zahl (1-12) eingeben:");
  monat = Integer.parseInt(IO.readln());

  tage = switch (monat){
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11 -> 30;
    case 2 -> 28;
    default -> {
       IO.println(" Monat ungueltig!");
       yield 0;
       }
  };
  IO.println("Anzahl der Tage: " + tage);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("monat","int");T.dec("tage","int",0); T.s("int monat","Variablen.");
  T.println("Monat als Zahl (1-12) eingeben:"); T.s("Monat als Zahl","Aufforderung.");
  v.monat=T.pi(T.read()); T.s("monat = Integer","monat = "+v.monat);
  var m=v.monat;
  T.s("tage = switch","Der switch ist hier ein **Ausdruck**: Er wird zu einem Wert ausgewertet, und der landet in `tage`.");
  if([1,3,5,7,8,10,12].indexOf(m)>=0){T.s("-> 31",m+" steht in dieser Liste → der Wert ist **31**. Die anderen cases werden nicht angeschaut.");v.tage=31;}
  else if([4,6,9,11].indexOf(m)>=0){T.s("-> 30",m+" steht in dieser Liste → der Wert ist **30**.");v.tage=30;}
  else if(m===2){T.s("case 2 ->","→ **28**.");v.tage=28;}
  else { T.s("default ->","Kein case passt. Bei default steht ein ganzer Block `{ … }`.");
    T.println(" Monat ungueltig!"); T.s("Monat ungueltig","Meldung ausgeben.");
    T.s("yield 0","In einem Block gibt `yield` den Wert des switch zurück → **0**."); v.tage=0; }
  T.s("};","Der Wert "+v.tage+" wird in `tage` gespeichert. Beachte den Strichpunkt nach `}`: Das Ganze ist eine Zuweisung.");
  T.println("Anzahl der Tage: "+v.tage); T.s("Anzahl der Tage","Ausgabe.");
  T.s("ENDE","Fertig.");
}});

/* ===== Kapitel 5 ===== */

P.push({id:"summenfor", gruppe:"k5", name:"SummeNFor.java", kurz:"Kap. 5 · Summe mit for + Methode",
intro:"Wie SummeN.java aus Kap. 3, aber mit `for`-Schleife und in eine Methode `sum` ausgelagert.",
inputs:[{l:"n",d:"4"}],
code:String.raw`void main(){

  int n;       //Obergrenze

  IO.println("Summe 1 bis n berechnen, n eingeben:");
  n = Integer.parseInt(IO.readln());

  IO.println();
  IO.println("Summe 1 bis " + n + " : " + sum(n));
}

//Summe 1+2+3+..+limit
int sum (int limit){
  int i, sum = 0;

  for (i = 1; i <= limit; i++)
    sum = sum + i;

  return sum;
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int"); T.s("int n;","n ohne Wert.");
  T.println("Summe 1 bis n berechnen, n eingeben:"); T.s("n eingeben","Aufforderung.");
  v.n=T.pi(T.read()); T.s("n = Integer","n = "+v.n);
  T.println(); T.s("IO.println();","Leerzeile.");
  T.s("sum(n)","Für die Ausgabe wird zuerst `sum(n)` aufgerufen.");
  var w=T.call("sum",[["limit","int",v.n]]);
  T.s("int sum (","Der Wert von n ("+w.limit+") wird in den Parameter `limit` kopiert.");
  T.dec("i","int");T.dec("sum","int",0); T.s("int i, sum = 0","i ohne Wert, sum = 0.");
  w.i=1; T.s("for (i = 1","Start-Teil: i = 1. Hier wird i nicht neu angelegt, sondern die schon deklarierte Variable benutzt.");
  var first=true;
  while(true){
    if(!first) T.s("for (i = 1","`i++` → i = "+w.i+".");
    var c=w.i<=w.limit; T.s("for (i = 1","Bedingung `i <= limit` → "+w.i+" <= "+w.limit+" ist "+tf(c)+".");
    if(!c) break;
    var o=w.sum; w.sum+=w.i; T.s("sum = sum + i","sum = "+o+" + "+w.i+" = "+w.sum+". (Ohne `{}` gehört nur diese eine Zeile zur Schleife.)");
    w.i++; first=false;
  }
  var r=w.sum; T.s("return sum","Rückgabe "+r+"."); T.ret();
  T.println("Summe 1 bis "+v.n+" : "+r); T.s("sum(n)","Zurück in main: Ausgabe mit dem Ergebnis "+r+".");
  T.s(10,"Fertig.");
}});

P.push({id:"treppe", gruppe:"k5", name:"Zeichentreppe.java", kurz:"Kap. 5 · verschachtelte for-Schleifen",
intro:"Eine Schleife **in** einer Schleife: Die äußere zählt die Zeilen (Stufen), die innere gibt in jeder Zeile die Zeichen aus. In Zeile 1 läuft die innere 1-mal, in Zeile 2 2-mal usw.",
inputs:[{l:"Anzahl Stufen",d:"3"},{l:"Zeichen",d:"#"}],
code:String.raw`void main(){

  int hoehe;     //Anzahl der Stufen
  char baustein; //"Baustein" der Treppe

  IO.println("Zeichentreppe - Anzahl der Stufen eingeben");
  hoehe = Integer.parseInt(IO.readln());
  IO.println("gewuenschtes Zeichen?");
  baustein = IO.readln().trim().charAt(0);

  zeichneTreppe(hoehe, baustein);
}

void zeichneTreppe (int hoch, char zeichen){
  for (int zeile = 1; zeile <= hoch; zeile++){      //aussen: Stufenanzahl
    for (int spalte = 1; spalte <= zeile; spalte++)  //innen: Zeichen pro Stufe
      IO.print(zeichen);
    IO.println();
  }
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("hoehe","int");T.dec("baustein","char"); T.s("char baustein","Variablen.");
  T.println("Zeichentreppe - Anzahl der Stufen eingeben"); T.s("Zeichentreppe -","Aufforderung.");
  v.hoehe=T.pi(T.read()); T.s("hoehe = Integer","hoehe = "+v.hoehe);
  T.println("gewuenschtes Zeichen?"); T.s("gewuenschtes Zeichen","Aufforderung.");
  var s=T.read().trim(); if(!s) T.fail("StringIndexOutOfBoundsException – leere Eingabe, kein Zeichen an Position 0.");
  v.baustein=s.charAt(0); T.s("baustein = IO","Erstes Zeichen der Eingabe: '"+v.baustein+"'.");
  T.s("zeichneTreppe(hoehe","Aufruf der Methode. `void` heißt: Sie gibt nichts zurück, sie zeichnet nur.");
  var w=T.call("zeichneTreppe",[["hoch","int",v.hoehe],["zeichen","char",v.baustein]]);
  T.s("void zeichneTreppe","hoch = "+w.hoch+", zeichen = '"+w.zeichen+"'.");
  T.dec("zeile","int",1); T.s("int zeile = 1","**Äußere** Schleife startet: zeile = 1.");
  while(true){
    var c=w.zeile<=w.hoch;
    T.s("int zeile = 1","Äußere Bedingung `zeile <= hoch` → "+w.zeile+" <= "+w.hoch+" ist "+tf(c)+(c?". Es wird Stufe "+w.zeile+" gezeichnet.":". Fertig mit allen Stufen."));
    if(!c) break;
    T.dec("spalte","int",1); T.s("int spalte = 1","**Innere** Schleife startet **jedes Mal neu** bei spalte = 1.");
    while(true){
      var c2=w.spalte<=w.zeile;
      T.s("int spalte = 1","Innere Bedingung `spalte <= zeile` → "+w.spalte+" <= "+w.zeile+" ist "+tf(c2)+(c2?".":". Diese Stufe hat genug Zeichen."));
      if(!c2) break;
      T.print(w.zeichen); T.s("IO.print(zeichen)","Ein Zeichen ausgeben (ohne Zeilenumbruch).");
      w.spalte++;
    }
    T.del("spalte");
    T.println(); T.s("IO.println();","Nach der inneren Schleife: Zeilenumbruch. Die nächste Stufe beginnt in einer neuen Zeile.");
    w.zeile++; T.s("int zeile = 1","Äußeres `zeile++` → zeile = "+w.zeile+".");
  }
  T.del("zeile"); T.ret();
  T.s(12,"Zurück in main. Fertig.");
}});

P.push({id:"ziffernsturz", gruppe:"k5", name:"ZiffernSturz.java", kurz:"Kap. 5 · do-while, % 10 und / 10",
intro:"Gibt die Ziffern einer Zahl rückwärts aus. Zwei Tricks: `n % 10` ist die **letzte Ziffer** (Rest bei Division durch 10), `n / 10` **streicht** die letzte Ziffer weg. Neu ist die `do … while`-Schleife: Sie prüft die Bedingung erst **am Ende**, läuft also mindestens einmal.",
tipp:"Gib 0 ein: Bei while würde nichts ausgegeben, do-while gibt die 0 aus.",
inputs:[{l:"Zahl",d:"1234"}],
code:String.raw`void main(){

  int n;

  IO.println("Ziffernsturz - ganze Zahl eingeben:");
  n = Integer.parseInt(IO.readln());

  do {

    IO.print(n % 10);
    n = n / 10;

  }while (n != 0);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int"); T.s("int n;","n ohne Wert.");
  T.println("Ziffernsturz - ganze Zahl eingeben:"); T.s("Ziffernsturz","Aufforderung.");
  v.n=T.pi(T.read()); T.s("n = Integer","n = "+v.n);
  T.s("do {","`do` heißt: **zuerst** den Block ausführen, ohne eine Bedingung zu prüfen.");
  while(true){
    var z=T.mod(v.n,10); T.print(z);
    T.s("n % 10",v.n+" % 10 = **"+z+"** (der Rest bei Division durch 10 ist die letzte Ziffer) → ausgeben.");
    var o=v.n; v.n=T.div(v.n,10);
    T.s("n = n / 10",o+" / 10 = "+v.n+" (Ganzzahldivision streicht die letzte Ziffer weg).");
    var c=v.n!==0;
    T.s("while (n != 0)","Erst **jetzt** wird geprüft: `n != 0` → "+v.n+" != 0 ist "+tf(c)+(c?". Zurück zu `do`.":". Keine Ziffern mehr übrig, also Ende."));
    if(!c) break;
  }
  T.s("ENDE","Fertig. (Nach der Ausgabe kommt kein Zeilenumbruch, weil nur `print` benutzt wurde.)");
}});

P.push({id:"endlos", gruppe:"k5", name:"Endlos.java", kurz:"Kap. 5 · eine Endlosschleife",
intro:"Bei manchen Eingaben hört diese Schleife **nie** auf. Bei geraden Zahlen geht's gut (6 → 4 → 2 → 0), bei ungeraden kommt man irgendwann bei 1 an, und aus der 1 wird wieder eine 3 …",
tipp:"Vergleiche 6 und 5.",
inputs:[{l:"Zahl",d:"5"}],
max:60,
code:String.raw`void main(){

  int n;

  IO.println("Endlos-Demo - Zahl eingeben");
  n = Integer.parseInt(IO.readln());

  while (n > 0)
    if (n == 1)
      n = 3;
    else
      n = n - 2;

  IO.println("Schleife beendet, n: " + n);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("n","int"); T.s("int n;","n ohne Wert.");
  T.println("Endlos-Demo - Zahl eingeben"); T.s("Endlos-Demo","Aufforderung.");
  v.n=T.pi(T.read()); T.s("n = Integer","n = "+v.n);
  while(true){
    var c=v.n>0; T.s("while (n > 0)","`n > 0` → "+v.n+" > 0 ist "+tf(c)+".");
    if(!c) break;
    var e=v.n===1; T.s("if (n == 1)","`n == 1` (zwei = heißt **Vergleich**!) → "+tf(e)+".");
    if(e){v.n=3;T.s("n = 3","n = 3. Hier ist das Problem: n wird wieder größer, und das Ganze beginnt von vorn!");}
    else{v.n-=2;T.s("n = n - 2","n = "+v.n);}
  }
  T.println("Schleife beendet, n: "+v.n); T.s("Schleife beendet","Die Schleife ist zu Ende (n = "+v.n+").");
  T.s("ENDE","Fertig.");
}});

P.push({id:"abbruch", gruppe:"k5", name:"SchleifenAbbruch.java", kurz:"Kap. 5 · break",
intro:"Zahlen werden aufsummiert, bis man eine negative Zahl eingibt. Wird aber das Maximum 4711 überschritten, bricht `break` die Schleife **sofort** ab, egal was die while-Bedingung sagt.",
tipp:"Eingaben durch Komma trennen. Probier „10, 20, -1“ (normales Ende) und „1000, 2000, 3000“ (break).",
inputs:[{l:"Werte (durch Komma getrennt)",d:"1000, 2000, 3000",liste:true}],
code:String.raw`void main(){

  int wert;              //einzelner, einzugebender Wert
  int sum;               //Summe
  final int MAX = 4711;  //Maximum fuer Summe

  IO.println("Summe von Werten: Werte eingeben \n"
             + "Ende mit negativem Wert");
  sum = 0;
  wert = Integer.parseInt(IO.readln());

  while (wert >= 0) {
    sum = sum + wert;
    if (sum > MAX){
      IO.print(" Maximum ueberschritten! - ");
      break;
    }
    wert = Integer.parseInt(IO.readln());
  }
  IO.println("Summe: " + sum);
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("wert","int");T.dec("sum","int");T.dec("MAX","int",4711); T.s("final int MAX","Variablen und die Konstante MAX = 4711.");
  T.println("Summe von Werten: Werte eingeben \nEnde mit negativem Wert"); T.s("Summe von Werten","Aufforderung (zwei Zeilen wegen `\\n`).");
  v.sum=0; T.s("sum = 0","sum = 0");
  v.wert=T.pi(T.read()); T.s("wert = Integer.parseInt(IO.readln());#1","Erster Wert: "+v.wert);
  var br=false;
  while(true){
    var c=v.wert>=0; T.s("while (wert >= 0)","`wert >= 0` → "+v.wert+" >= 0 ist "+tf(c)+(c?".":". Negativer Wert, also normales Ende der Schleife."));
    if(!c) break;
    var o=v.sum; v.sum+=v.wert; T.s("sum = sum + wert","sum = "+o+" + "+v.wert+" = "+v.sum);
    var g=v.sum>v.MAX; T.s("if (sum > MAX)",v.sum+" > 4711 ist "+tf(g)+".");
    if(g){ T.print(" Maximum ueberschritten! - "); T.s("Maximum ueberschritten","Meldung (ohne Zeilenumbruch).");
      T.s("break;","`break` verlässt die Schleife **sofort**. Es geht direkt nach der schließenden `}` der Schleife weiter."); br=true; break; }
    v.wert=T.pi(T.read()); T.s("wert = Integer.parseInt(IO.readln());#2","Nächster Wert: "+v.wert+". Zurück zur Bedingung.");
  }
  T.println("Summe: "+v.sum); T.s("\"Summe: \"","Ausgabe."+(br?" Weil vorher `print` (ohne ln) benutzt wurde, steht die Summe in derselben Zeile wie die Meldung.":""));
  T.s("ENDE","Fertig.");
}});

/* ===== Proseminar: eigene Abgaben ===== */

P.push({id:"bsp02", gruppe:"ps", name:"Bsp02.java", kurz:"PS · Tempolimit und Toleranz",
intro:"Deine Abgabe zu Blatt 2: Aus Tempolimit und gemessener Geschwindigkeit wird berechnet, ob (und um wie viel) zu schnell gefahren wurde. Die Toleranz ist 10 %, aufgerundet.",
tipp:"Probier 50 / 55 (gerade noch ok), 50 / 56 und 100 / 190 (Raser).",
inputs:[{l:"Tempolimit",d:"50"},{l:"Geschwindigkeit",d:"70"}],
code:String.raw`void main() {
  IO.println("? Tempolimit (km/h): ");
  int tempolimit = Integer.parseInt(IO.readln());

  IO.println("? Geschwindigkeit (km/h): ");
  int geschwindigkeit = Integer.parseInt(IO.readln());

  long toleranzgrenze = (11L * tempolimit + 9) / 10;
  long zuschnell = geschwindigkeit - toleranzgrenze;

  if (zuschnell > 0) {
    IO.println("Geschwindigkeitsuebertretung um " + zuschnell + " km/h");
  } else {
    IO.println("keine Geschwindigkeitsuebertretung");
  }

  // Aufgabe 2
  if (zuschnell > 70) {
    IO.println("Achtung Raser!");
  } else {
    IO.println("kein Raser!");
  }
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.println("? Tempolimit (km/h): "); T.s("? Tempolimit","Aufforderung.");
  T.dec("tempolimit","int",T.pi(T.read())); T.s("int tempolimit","tempolimit = "+v.tempolimit);
  T.println("? Geschwindigkeit (km/h): "); T.s("? Geschwindigkeit","Aufforderung.");
  T.dec("geschwindigkeit","int",T.pi(T.read())); T.s("int geschwindigkeit","geschwindigkeit = "+v.geschwindigkeit);
  var p=11*v.tempolimit+9; T.dec("toleranzgrenze","long",Math.trunc(p/10));
  T.s("long toleranzgrenze","Das ist der Trick: Toleranz = Limit + 10 % = Limit · 1.1, **aufgerundet**. Ohne Kommazahlen: `(11 · Limit + 9) / 10`. Das `+ 9` sorgt dafür, dass bei der Ganzzahldivision **aufgerundet** statt abgerundet wird.\n11 · "+v.tempolimit+" + 9 = "+p+", "+p+" / 10 = **"+v.toleranzgrenze+"**. `11L` ist ein long-Literal, so wird gleich mit `long` gerechnet (kein Überlauf bei großen Zahlen).");
  T.dec("zuschnell","long",v.geschwindigkeit-v.toleranzgrenze);
  T.s("long zuschnell",v.geschwindigkeit+" − "+v.toleranzgrenze+" = "+v.zuschnell+(v.zuschnell<=0?" (negativ oder 0 heißt: nicht zu schnell).":"."));
  var c=v.zuschnell>0; T.s("if (zuschnell > 0)",v.zuschnell+" > 0 ist "+tf(c)+".");
  if(c){T.println("Geschwindigkeitsuebertretung um "+v.zuschnell+" km/h");T.s("Geschwindigkeitsuebertretung um","Ausgabe.");}
  else{T.println("keine Geschwindigkeitsuebertretung");T.s("keine Geschwindigkeitsuebertretung","Ausgabe.");}
  var r=v.zuschnell>70; T.s("if (zuschnell > 70)","Unabhängig davon die zweite Prüfung: "+v.zuschnell+" > 70 ist "+tf(r)+".");
  if(r){T.println("Achtung Raser!");T.s("Achtung Raser","Ausgabe.");} else {T.println("kein Raser!");T.s("kein Raser","Ausgabe.");}
  T.s("ENDE","Fertig.");
}});

P.push({id:"bsp03", gruppe:"ps", name:"Bsp03.java", kurz:"PS · Schrittziel mit Trainingsrunden",
intro:"Deine Abgabe zu Blatt 3: Schrittziel je nach Alter anpassen, dann so lange Trainingsrunden drehen, bis das Ziel erreicht ist.",
tipp:"Probier Alter 25 und 12000 Schritte (keine Runden nötig) oder 300 Schritte pro Runde.",
inputs:[{l:"Name",d:"Anna"},{l:"Alter",d:"16"},{l:"Schritte",d:"6000"},{l:"Schritte pro Runde",d:"1000"}],
max:500,
code:String.raw`void main() {
  final int mindestalter = 18;
  final int schrittziel = 10000;

  IO.println("Mindestalter für das Trainingsziel: " + mindestalter);
  IO.println("Schrittziel: " + schrittziel);

  String name = IO.readln("? Name: ");
  int alter = Integer.parseInt(IO.readln("? Alter: "));
  int schritte = Integer.parseInt(IO.readln("? Schritte: "));

  int schrittanzahl = schrittziel;

  if (alter < mindestalter) {
    int fehlendeJahre = mindestalter - alter;
    int differenz = schrittziel / 100 * 5 * fehlendeJahre;
    schrittanzahl = schrittziel - differenz;

    IO.println("Schrittziel aufgrund des Alters um " + differenz + " auf " + schrittanzahl + " adaptiert.");
  }

  if (schritte >= schrittanzahl) {
    IO.println("Schrittziel mit " + schritte + " Schritten ohne zusätzliches Training erreicht.");
  } else {
    IO.println("Schrittziel mit " + schritte + " Schritten ohne zusätzliches Training nicht erreicht.");
  }

  final int INTENSIVES_TRAINING = 2500;
  final int MODERATES_TRAINING = 1500;

  int schritteProRunde =
          Integer.parseInt(IO.readln("? Schritte pro Trainingsrunde: "));
  int startSchritte = schritte;
  int runden = 0;

  while (schritte < schrittanzahl) {
    schritte = schritte + schritteProRunde;
    runden = runden + 1;
    IO.println("Runde " + runden + ": " + schritte + " Schritte.");
  }

  if (runden > 0) {
    int zusaetzlich = schritte - startSchritte;

    if (zusaetzlich >= INTENSIVES_TRAINING) {
      IO.println("Intensives Training (" + zusaetzlich + " Schritte in " + runden + " Runden).");
    } else if (zusaetzlich >= MODERATES_TRAINING) {
      IO.println("Moderates Training (" + zusaetzlich + " Schritte in " + runden + " Runden).");
    } else {
      IO.println("Leichtes Training (" + zusaetzlich + " Schritte in " + runden + " Runden).");
    }

    IO.println("Schrittziel durch " + runden + " zusätzliche Trainingsrunden erreicht: " + schritte);
  } else {
    IO.println("Schrittziel ohne zusätzliche Trainingsrunden erreicht: " + schritte);
  }
}`,
run:function(T){
  var v=T.main();
  T.s("void main()","Start.");
  T.dec("mindestalter","int",18); T.s("final int mindestalter","Konstante (final): 18.");
  T.dec("schrittziel","int",10000); T.s("final int schrittziel","Konstante: 10000.");
  T.println("Mindestalter für das Trainingsziel: 18"); T.s("Mindestalter für","Ausgabe.");
  T.println("Schrittziel: 10000"); T.s("\"Schrittziel: \"","Ausgabe.");
  T.dec("name","String",T.read("? Name: ")); T.s("String name","`IO.readln(\"? Name: \")` gibt die Frage aus und liest die Antwort: "+q(v.name)+". (name wird später gar nicht mehr verwendet.)");
  T.dec("alter","int",T.pi(T.read("? Alter: "))); T.s("int alter","alter = "+v.alter);
  T.dec("schritte","int",T.pi(T.read("? Schritte: "))); T.s("int schritte =","schritte = "+v.schritte);
  T.dec("schrittanzahl","int",v.schrittziel); T.s("int schrittanzahl","Das persönliche Ziel startet beim normalen Schrittziel ("+v.schrittanzahl+").");
  var j=v.alter<v.mindestalter; T.s("if (alter < mindestalter)",v.alter+" < 18 ist "+tf(j)+(j?". Jünger als 18, also wird das Ziel verringert.":". Kein Abzug, der Block wird übersprungen."));
  if(j){
    T.dec("fehlendeJahre","int",v.mindestalter-v.alter); T.s("int fehlendeJahre","18 − "+v.alter+" = "+v.fehlendeJahre+". Diese Variable gibt es nur **innerhalb** der `{ }` des if.");
    T.dec("differenz","int",T.div(v.schrittziel,100)*5*v.fehlendeJahre); T.s("int differenz","Von links nach rechts: 10000 / 100 = 100 (das ist 1 %), · 5 = 500 (5 %), · "+v.fehlendeJahre+" = **"+v.differenz+"**. Pro fehlendem Jahr 5 % weniger.");
    v.schrittanzahl=v.schrittziel-v.differenz; T.s("schrittanzahl = schrittziel - differenz","Neues Ziel: 10000 − "+v.differenz+" = "+v.schrittanzahl+".");
    T.println("Schrittziel aufgrund des Alters um "+v.differenz+" auf "+v.schrittanzahl+" adaptiert."); T.s("aufgrund des Alters","Ausgabe.");
    T.del("fehlendeJahre"); T.del("differenz");
  }
  var e=v.schritte>=v.schrittanzahl; T.s("if (schritte >= schrittanzahl)",(j?"Die Variablen fehlendeJahre und differenz sind verschwunden, ihr Block ist vorbei. ":"")+v.schritte+" >= "+v.schrittanzahl+" ist "+tf(e)+".");
  if(e){T.println("Schrittziel mit "+v.schritte+" Schritten ohne zusätzliches Training erreicht.");T.s("Training erreicht.\");","Ausgabe.");}
  else{T.println("Schrittziel mit "+v.schritte+" Schritten ohne zusätzliches Training nicht erreicht.");T.s("nicht erreicht","Ausgabe.");}
  T.dec("INTENSIVES_TRAINING","int",2500); T.s("INTENSIVES_TRAINING =","Konstante 2500.");
  T.dec("MODERATES_TRAINING","int",1500); T.s("MODERATES_TRAINING =","Konstante 1500.");
  T.dec("schritteProRunde","int",T.pi(T.read("? Schritte pro Trainingsrunde: "))); T.s("Schritte pro Trainingsrunde","Die Anweisung geht über zwei Zeilen und endet erst beim `;`. schritteProRunde = "+v.schritteProRunde);
  T.dec("startSchritte","int",v.schritte); T.s("int startSchritte","Den Startwert merken, um später die zusätzlichen Schritte ausrechnen zu können.");
  T.dec("runden","int",0); T.s("int runden","Rundenzähler = 0.");
  while(true){
    var c=v.schritte<v.schrittanzahl; T.s("while (schritte < schrittanzahl)",v.schritte+" < "+v.schrittanzahl+" ist "+tf(c)+(c?". Noch nicht genug, also eine Runde laufen.":". Ziel erreicht, die Schleife ist fertig."));
    if(!c) break;
    v.schritte+=v.schritteProRunde; T.s("schritte = schritte + schritteProRunde","schritte = "+v.schritte+(v.schritteProRunde<=0?" – ⚠️ Mit "+v.schritteProRunde+" Schritten pro Runde wird schritte nie größer!":""));
    v.runden++; T.s("runden = runden + 1","runden = "+v.runden);
    T.println("Runde "+v.runden+": "+v.schritte+" Schritte."); T.s("\"Runde \"","Ausgabe.");
  }
  var r=v.runden>0; T.s("if (runden > 0)",v.runden+" > 0 ist "+tf(r)+".");
  if(r){
    T.dec("zusaetzlich","int",v.schritte-v.startSchritte); T.s("int zusaetzlich",v.schritte+" − "+v.startSchritte+" = "+v.zusaetzlich+" zusätzliche Schritte.");
    var z=v.zusaetzlich, txt=" ("+z+" Schritte in "+v.runden+" Runden).";
    T.s("if (zusaetzlich >= INTENSIVES","if-else-if-Kette: Die Bedingungen werden **der Reihe nach** geprüft, die erste passende gewinnt. "+z+" >= 2500 ist "+tf(z>=2500)+".");
    if(z>=2500){T.println("Intensives Training"+txt);T.s("\"Intensives Training","Ausgabe.");}
    else{ T.s("else if (zusaetzlich",z+" >= 1500 ist "+tf(z>=1500)+".");
      if(z>=1500){T.println("Moderates Training"+txt);T.s("\"Moderates Training","Ausgabe.");}
      else{T.println("Leichtes Training"+txt);T.s("\"Leichtes Training","Keine Bedingung hat gepasst, also läuft der letzte else-Zweig.");} }
    T.println("Schrittziel durch "+v.runden+" zusätzliche Trainingsrunden erreicht: "+v.schritte); T.s("Schrittziel durch","Ausgabe.");
  } else { T.println("Schrittziel ohne zusätzliche Trainingsrunden erreicht: "+v.schritte); T.s("ohne zusätzliche Trainingsrunden","Ausgabe."); }
  T.s("ENDE","Fertig.");
}});

P.push({id:"bsp04", gruppe:"ps", name:"Bsp04.java", kurz:"PS · Mäxchen mit vielen Methoden",
intro:"Deine Abgabe zu Blatt 4: das Würfelspiel Mäxchen, aufgeteilt in viele kleine Methoden. Gut zu sehen ist, wie Methoden andere Methoden aufrufen. Rechts stapeln sich die Kästen (main → playMatch → playRound → readPlayerRoll → readDiceRoll …), und mit jedem `return` verschwindet der oberste wieder.",
tipp:"Eingaben: zuerst die Rundenanzahl, dann immer zwei Würfel pro Spieler. Ein ungültiger Wurf wie „7“ wird abgelehnt und neu gefragt (im Beispiel ist ein „x“ drin).",
inputs:[{l:"Eingaben (durch Komma): Runden, dann Würfel",d:"3, 3, 1, 4, x, 2, 5, 5, 6, 4, 1, 2, 6, 6",liste:true}],
max:900,
code:String.raw`int getValue(int d1, int d2) {
  int high = Math.max(d1, d2);
  int low = Math.min(d1, d2);
  return 10 * high + low;
}

boolean isNumericDice(char c) {
  return '1' <= c && c <= '6';
}

int parseNumericDice(char c) {
  return Character.getNumericValue(c);
}

int readDiceRoll() {
  while (true) {
    IO.println("? Dice roll:");
    String input = IO.readln();
    boolean valid = input.length() == 1 && isNumericDice(input.charAt(0));
    if (valid) {
      return parseNumericDice(input.charAt(0));
    }
    IO.println("Invalid dice roll!");
  }
}

int readPlayerRoll() {
  int first = readDiceRoll();
  int second = readDiceRoll();
  return getValue(first, second);
}

boolean isMaexchen(int roll) {
  return roll == 21;
}

boolean isPair(int roll) {
  return roll / 10 == roll % 10;
}

int rank(int roll) {
  if (isMaexchen(roll)) {
    return 1000;
  } else if (isPair(roll)) {
    return 100 + roll;
  } else {
    return roll;
  }
}

int compareRolls(int roll1, int roll2) {
  return rank(roll2) - rank(roll1);
}

int playRound() {
  IO.println("Player 1:");
  int rollP1 = readPlayerRoll();
  IO.println("Player 2:");
  int rollP2 = readPlayerRoll();
  IO.println("Rolls: " + rollP1 + " vs. " + rollP2);

  int result = compareRolls(rollP1, rollP2);
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
  int winsP1 = 0;
  int winsP2 = 0;

  for (int round = 1; round <= rounds && winsP1 < needed && winsP2 < needed; round++) {
    IO.println("=== Round " + round + " ===");
    int result = playRound();
    while (result == 0) {
      IO.println("Round is repeated...");
      result = playRound();
    }

    if (result < 0) {
      winsP1++;
    } else {
      winsP2++;
    }
  }

  IO.println("=== End of match ===");
  if (winsP1 > winsP2) {
    IO.println("Player 1 has won the match!");
  } else if (winsP2 > winsP1) {
    IO.println("Player 2 has won the match!");
  } else {
    IO.println("Match is a Tie!");
  }
}

void main() {
  int rounds = Integer.parseInt(IO.readln());
  playMatch(rounds);
}`,
run:function(T){
  var v=T.main(), firstDice=true;
  T.s("void main()","Obwohl main ganz unten steht, startet das Programm hier. Alle anderen Methoden laufen nur, wenn sie aufgerufen werden.");
  T.dec("rounds","int",T.pi(T.read())); T.s("int rounds = Integer","Rundenanzahl einlesen (ohne Aufforderung): rounds = "+v.rounds+".");
  T.s("playMatch(rounds);","Aufruf von playMatch mit "+v.rounds+".");

  function readDiceRoll(){
    var w=T.call("readDiceRoll",[]);
    T.s("int readDiceRoll()",firstDice?"readDiceRoll hat **keine** Parameter, aber einen Rückgabewert (int).":"Neuer Aufruf von readDiceRoll.");
    while(true){
      T.s("while (true)",firstDice?"`while (true)` ist eigentlich eine Endlosschleife. Sie wird nur durch das `return` weiter unten verlassen. So wird so lange gefragt, bis ein gültiger Wurf kommt.":"Schleife (läuft bis zum return).");
      T.println("? Dice roll:"); T.s("? Dice roll","Aufforderung.");
      T.dec("input","String",T.read()); T.s("String input","input = "+q(w.input));
      var len1=w.input.length===1, num=false;
      if(len1){
        var ch=w.input.charAt(0), u=T.call("isNumericDice",[["c","char",ch]]);
        num=('1'<=ch&&ch<='6');
        T.s("return '1' <= c","isNumericDice('"+ch+"'): Zeichen kann man wie Zahlen vergleichen (über ihre Nummer). Liegt '"+ch+"' zwischen '1' und '6'? → "+tf(num)+".");
        T.ret();
      }
      T.dec("valid","boolean",len1&&num);
      T.s("boolean valid","`input.length() == 1` ist "+tf(len1)+(len1?", und isNumericDice lieferte "+tf(num):". Wegen `&&` wird der zweite Teil gar nicht mehr geprüft (Kurzschluss-Auswertung)")+". → valid = "+tf(w.valid)+".");
      T.s("if (valid)","valid ist "+tf(w.valid)+".");
      if(w.valid){
        var d=+w.input; var u2=T.call("parseNumericDice",[["c","char",w.input]]);
        T.s("return Character.getNumericValue","Das Zeichen '"+w.input+"' wird zur Zahl "+d+". (Man könnte auch `c - '0'` rechnen.)");
        T.ret();
        T.s("return parseNumericDice","readDiceRoll gibt "+d+" zurück.");
        T.ret(); firstDice=false; return d;
      }
      T.println("Invalid dice roll!"); T.s("Invalid dice roll","Ungültig! Kein return, also läuft die Schleife weiter und fragt nochmal.");
      T.del("input"); T.del("valid");
    }
  }
  function readPlayerRoll(){
    var w=T.call("readPlayerRoll",[]);
    T.s("int readPlayerRoll()","Ein Spieler würfelt zweimal.");
    T.dec("first","int"); var a=readDiceRoll(); w.first=a; T.s("int first =","first = "+a);
    T.dec("second","int"); var b=readDiceRoll(); w.second=b; T.s("int second =","second = "+b);
    var g=T.call("getValue",[["d1","int",a],["d2","int",b]]);
    T.s("int getValue(","getValue("+a+", "+b+").");
    T.dec("high","int",Math.max(a,b)); T.dec("low","int",Math.min(a,b)); T.s("int low =","Größerer Würfel = Zehner, kleinerer = Einer.");
    var r=10*g.high+g.low; T.s("return 10 * high","10 · "+g.high+" + "+g.low+" = **"+r+"**."); T.ret();
    T.s("return getValue","readPlayerRoll gibt "+r+" zurück."); T.ret(); return r;
  }
  function rank(roll,which){
    var w=T.call("rank",[["roll","int",roll]]), r;
    T.s("int rank(","rank("+roll+") macht aus dem Wurf eine Punktzahl, damit man einfach vergleichen kann.");
    var m=roll===21; T.s("if (isMaexchen(roll))","isMaexchen: "+roll+" == 21 ist "+tf(m)+(m?". Mäxchen ist das Höchste.":"."));
    if(m){r=1000;T.s("return 1000","→ 1000.");}
    else{ var p=Math.trunc(roll/10)===roll%10;
      T.s("else if (isPair(roll))","isPair: Zehner "+Math.trunc(roll/10)+" == Einer "+(roll%10)+" ist "+tf(p)+".");
      if(p){r=100+roll;T.s("return 100 + roll","Pasch → 100 + "+roll+" = "+r+" (schlägt alle normalen Würfe).");}
      else{r=roll;T.s("return roll;","Normaler Wurf → "+r+".");} }
    T.ret(); return r;
  }
  function playRound(){
    var w=T.call("playRound",[]);
    T.s("int playRound()","Eine Runde.");
    T.println("Player 1:"); T.s("\"Player 1:\"","Ausgabe.");
    T.dec("rollP1","int"); w.rollP1=readPlayerRoll(); T.s("int rollP1","rollP1 = "+w.rollP1);
    T.println("Player 2:"); T.s("\"Player 2:\"","Ausgabe.");
    T.dec("rollP2","int"); w.rollP2=readPlayerRoll(); T.s("int rollP2","rollP2 = "+w.rollP2);
    T.println("Rolls: "+w.rollP1+" vs. "+w.rollP2); T.s("Rolls: ","Ausgabe.");
    T.dec("result","int");
    var c=T.call("compareRolls",[["roll1","int",w.rollP1],["roll2","int",w.rollP2]]);
    T.s("int compareRolls","compareRolls("+w.rollP1+", "+w.rollP2+") rechnet rank(roll2) − rank(roll1).");
    var r2=rank(w.rollP2), r1=rank(w.rollP1), res=r2-r1;
    T.s("return rank(roll2)",r2+" − "+r1+" = **"+res+"**. Negativ heißt Spieler 1 hat mehr, positiv Spieler 2, 0 unentschieden."); T.ret();
    w.result=res; T.s("int result = compareRolls","result = "+res);
    T.s("if (result < 0)#1",res+" < 0 ist "+tf(res<0)+".");
    if(res<0){T.println("Player 1 wins!");T.s("\"Player 1 wins!\"","Ausgabe.");}
    else{ T.s("} else if (result > 0)",res+" > 0 ist "+tf(res>0)+".");
      if(res>0){T.println("Player 2 wins!");T.s("\"Player 2 wins!\"","Ausgabe.");} else {T.println("Tie!");T.s("\"Tie!\"","Unentschieden.");} }
    T.s("return result","playRound gibt "+res+" zurück."); T.ret(); return res;
  }

  var w=T.call("playMatch",[["rounds","int",v.rounds]]);
  T.s("void playMatch","rounds = "+w.rounds+".");
  T.println("Best of "+w.rounds); T.s("Best of","Ausgabe.");
  T.dec("needed","int",T.div(w.rounds,2)+1); T.s("int needed","Gewinnsiege nötig: "+w.rounds+" / 2 + 1 = "+w.needed+" (Ganzzahldivision!).");
  T.dec("winsP1","int",0); T.dec("winsP2","int",0); T.s("int winsP2","Siegzähler auf 0.");
  T.dec("round","int",1); T.s("for (int round = 1","for-Schleife mit **drei** Bedingungen, verknüpft mit `&&` (und): Es geht nur weiter, solange noch Runden übrig sind **und** noch keiner genug Siege hat.");
  var first=true;
  while(true){
    if(!first) T.s("for (int round = 1","`round++` → round = "+w.round+".");
    var c=w.round<=w.rounds&&w.winsP1<w.needed&&w.winsP2<w.needed;
    T.s("for (int round = 1","round <= rounds ("+w.round+" <= "+w.rounds+"): "+tf(w.round<=w.rounds)+", winsP1 < needed ("+w.winsP1+" < "+w.needed+"): "+tf(w.winsP1<w.needed)+", winsP2 < needed ("+w.winsP2+" < "+w.needed+"): "+tf(w.winsP2<w.needed)+" → insgesamt "+tf(c)+".");
    if(!c) break;
    T.println("=== Round "+w.round+" ==="); T.s("=== Round","Ausgabe.");
    T.dec("result","int"); w.result=playRound(); T.s("int result = playRound()","result = "+w.result);
    while(w.result===0){
      T.s("while (result == 0)","Unentschieden → Runde wiederholen.");
      T.println("Round is repeated..."); T.s("Round is repeated","Ausgabe.");
      w.result=playRound(); T.s("result = playRound();#2","result = "+w.result);
    }
    T.s("while (result == 0)","result == 0 ist **false**, also keine Wiederholung nötig.");
    if(w.result<0){w.winsP1++;T.s("winsP1++","Spieler 1 bekommt einen Sieg: winsP1 = "+w.winsP1);}
    else{w.winsP2++;T.s("winsP2++","Spieler 2 bekommt einen Sieg: winsP2 = "+w.winsP2);}
    T.del("result"); w.round++; first=false;
  }
  T.del("round");
  T.println("=== End of match ==="); T.s("End of match","Ausgabe.");
  if(w.winsP1>w.winsP2){T.println("Player 1 has won the match!");T.s("Player 1 has won","Endstand "+w.winsP1+":"+w.winsP2+".");}
  else if(w.winsP2>w.winsP1){T.println("Player 2 has won the match!");T.s("Player 2 has won","Endstand "+w.winsP1+":"+w.winsP2+".");}
  else{T.println("Match is a Tie!");T.s("Match is a Tie","Unentschieden.");}
  T.ret();
  T.s("ENDE","Zurück in main. Fertig.");
}});

var G=[["start","Ganz einfach – zum Reinkommen","Eigene Mini-Beispiele: je ein Grundbaustein pro Programm. Fang hier an!"],
       ["k13","VO Kap. 1–3","Variablen, Eingabe, Rechnen, erste if und while"],
       ["k4","VO Kap. 4","Typen, Casts, Strings, if-Ketten, switch"],
       ["k5","VO Kap. 5","for, verschachtelte Schleifen, do-while, break"],
       ["ps","Proseminar – deine Abgaben","Bsp02–Bsp04 aus deinem PS-Ordner"]];

window.ABLAUF={progs:P, gruppen:G, run:run, jd:jd};
})();
