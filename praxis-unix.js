/* Einführung UNIX – Praxis-Prüfung (PS-Test, Aufgabenblatt "PrEU") als Terminal-Trainer.
   Routen: #/linux/praxis (Spickzettel), #/linux/praxis/lauf (ganzer Durchlauf), #/linux/praxis/drill (einzelne Aufgaben).
   Verzeichnis, RFC-Nummer und Betreff wechseln bei jedem Durchlauf. Die Prüfung im Trainer ist eine
   Mustererkennung (RegExp auf den normalisierten Befehl), keine echte Shell. Lösungen in bash getestet. */
(function(){
var RFCS=[2345,4326,2235,1149,2324,3514,1918,2616,5321,6749,4180,8259,2549,1855];
function rnd(n){return Math.floor(Math.random()*n)}
function rx(s){return s.replace(/[.*+?^${}()|[\]\\\/]/g,"\\$&")}
function newVars(fix){
  var y=fix?26:23+rnd(5), r=fix?4326:RFCS[rnd(RFCS.length)];
  return {D:"PrEU"+y, R:"rfc"+r, F:"rfc"+r+".txt", S:"PREU"+y, A:"preu.tar.bz2", H0:fix?317:240+rnd(260)};
}
/* Befehl vereinheitlichen: Leerraum um | ; < > >> && zusammenfassen */
function canon(s){return String(s).replace(/\s*(&&|>>|[|;<>])\s*/g," $1 ").replace(/\s+/g," ").trim()}
function trIn(V){var f=rx(V.F);return new RegExp("(< "+f+"( |$)|cat "+f+" \\||grep [^|]*"+f+"( |$))")}
function readsF(V){var f=rx(V.F);return new RegExp("(< "+f+"( |$)|cat "+f+" \\||^\\S+( -\\S+)* (['\"][^'\"]*['\"] )*"+f+"( |$))")}

/* ---------- Die Aufgaben ---------- */
var STEPS=[
{t:function(V){return "Wechsle in dein Home-Verzeichnis."},
 en:"Change into your home directory",
 sol:function(V){return "cd"},
 why:["`cd` ohne Argument springt immer ins Home. Genauso gut: `cd ~` oder `cd $HOME`."],
 fehler:["`cd /home` – das ist das Verzeichnis ALLER Homes, nicht deins."],
 checks:function(V){return [["`cd` (ohne Argument, `~` oder `$HOME`)",/^cd( ~\/?| \$HOME\/?)?$/]]},
 after:function(P){P.cwd="~"}},
{t:function(V){return "Lege mit <b>einer</b> Befehlszeile das Verzeichnis <code>"+V.D+"</code> an und wechsle hinein."},
 en:"Create with one command line the directory … and change into it",
 sol:function(V){return "mkdir "+V.D+"; cd "+V.D},
 why:["Zwei Befehle in einer Zeile: mit `;` getrennt (oder `&&` = cd nur, wenn mkdir geklappt hat).","Groß-/Kleinschreibung beachten: PrEU ≠ preu."],
 fehler:["Zwei Zeilen statt einer.","`cd` vergessen – dann landen alle Dateien im Home."],
 checks:function(V){var d=rx(V.D);return [["`mkdir "+V.D+"` (genau so geschrieben)",new RegExp("^mkdir (-p )?"+d+"/?( |$)")],["in derselben Zeile mit `;` oder `&&`",/ (;|&&) cd /],["danach `cd "+V.D+"`",new RegExp("cd "+d+"/?$")]]},
 after:function(P){P.cwd="~/"+P.V.D}},
{t:function(V){return "Lade die Datei <code>https://www.ietf.org/rfc/"+V.F+"</code> herunter."},
 en:"Download the file https://www.ietf.org/rfc/….txt",
 sol:function(V){return "wget https://www.ietf.org/rfc/"+V.F},
 why:["`wget URL` speichert die Datei unter ihrem Namen im aktuellen Verzeichnis. (Alternative: `curl -O URL`.)"],
 fehler:["URL falsch abgetippt – vorher genau lesen: www.ietf.org/rfc/rfcNNNN.txt"],
 checks:function(V){return [["`wget` (oder `curl -O`)",/^(wget|curl -O|curl -o \S+) /],["vollständige URL https://www.ietf.org/rfc/"+V.F,new RegExp("https?://www\\.ietf\\.org/rfc/"+rx(V.F)+"$")]]},
 after:function(P){P.files.push(P.V.F)}},
{t:function(V){return "Zähle Zeilen, Wörter und Zeichen in <code>"+V.F+"</code> und leite das Ergebnis in die Datei <code>LWC.txt</code> um."},
 en:"Count lines, words and characters occurring in file … and redirect result into file with name LWC.txt",
 sol:function(V){return "wc -lwc "+V.F+" > LWC.txt"},
 why:["`wc` = word count: -l Zeilen, -w Wörter, -c Zeichen (Bytes; -m wären echte Zeichen, bei RFCs gleich).","`wc` ohne Optionen gibt dieselben drei Zahlen aus.","`>` legt LWC.txt neu an (überschreibt).","Auch richtig: `cat "+"rfc….txt | wc -lwc > LWC.txt` (dann ohne Dateinamen in der Ausgabe)."],
 fehler:["`>>` statt `>` – hier soll die Datei neu entstehen.","lwc.txt klein geschrieben – Dateinamen sind case-sensitive."],
 checks:function(V){return [
  ["`wc` mit -l, -w und -c (oder ganz ohne Optionen)",function(s){var m=s.match(/\bwc((?: -[a-zA-Z]+)*)(?= |$)/);if(!m)return false;var o=m[1].replace(/[ -]/g,"");return o===""||(/l/.test(o)&&/w/.test(o)&&/[cm]/.test(o))}],
  ["liest "+V.F,readsF(V)],
  ["`> LWC.txt` (neu anlegen)",/ > LWC\.txt$/,1]]},
 after:function(P){P.files.push("LWC.txt")}},
{t:function(V){return "Zähle die Punkte („.“) in <code>"+V.F+"</code> und <b>hänge</b> das Ergebnis an <code>LWC.txt</code> an."},
 en:"Count the number of dots (\".\") in file … and append result to LWC.txt",
 sol:function(V){return "tr -cd '.' < "+V.F+" | wc -c >> LWC.txt"},
 why:["`tr -cd '.'`: -d löscht, -c = Komplement → löscht alles AUSSER Punkten. Übrig bleiben nur die Punkte.","`wc -c` zählt diese Zeichen.","`>>` hängt an – `>` würde die Zählung aus Aufgabe 4 löschen!","Alternative: `grep -o '\\.' "+"rfc….txt | wc -l` (jeder Punkt auf eine eigene Zeile, dann Zeilen zählen; Punkt in Anführungszeichen und mit \\ maskieren)."],
 fehler:["`>` statt `>>` – überschreibt LWC.txt.","`grep -c '\\.'` zählt ZEILEN mit Punkt, nicht Punkte.","`grep -o .` ohne Backslash: der Punkt passt auf jedes Zeichen."],
 checks:function(V){return [
  ["nur Punkte behalten: `tr -cd '.'` oder `grep -o '\\.'`",/tr -(cd|dc|c -d|d -c) (['"]\\?\.['"]|\\?\.)( |$)|grep -o (['"]\\\.['"]|['"]\[\.\]['"]|-F ['"]?\.['"]?)|grep -oF ['"]?\.['"]?/],
  ["zählen: `wc -c` nach tr bzw. `wc -l` nach grep -o",function(s){return /^grep|\| grep/.test(s)?/\| wc -l/.test(s):/\| wc -[cm]( |$)/.test(s)}],
  ["liest "+V.F+" (bei tr mit `<` oder `cat … |`)",trIn(V)],
  ["`>> LWC.txt` (anhängen!)",/ >> LWC\.txt$/,1]]}},
{t:function(V){return "Wandle in der Ausgabe von <code>"+V.F+"</code> alle Groß- in Kleinbuchstaben um, extrahiere alle Wörter, sortiere sie, entferne Duplikate und speichere das Ergebnis in <code>words.txt</code>."},
 en:"Change in output of file … all upper case letters to lower case, extract all words, sort these, remove all duplicates and save result in file words.txt",
 sol:function(V){return "tr 'A-Z' 'a-z' < "+V.F+" | tr -cs 'a-z' '\\n' | sort | uniq > words.txt"},
 why:["1. `tr 'A-Z' 'a-z'` – groß → klein (gleich: `tr '[:upper:]' '[:lower:]'`).","2. `tr -cs 'a-z' '\\n'` – alles, was KEIN Buchstabe ist (-c), wird zu einem Zeilenumbruch, mehrere hintereinander zu einem (-s) → ein Wort pro Zeile. (Gleich: `tr -cs '[:alpha:]' '\\n'`.)","3. `sort` – alphabetisch, damit gleiche Wörter untereinander stehen.","4. `uniq` – entfernt aufeinanderfolgende Duplikate (darum vorher sort!). Kurz: `sort -u`.","5. `> words.txt`"],
 fehler:["`'\\n'` ohne Anführungszeichen – die Shell macht daraus ein n.","uniq ohne vorheriges sort – Duplikate bleiben stehen.","`tr` mit Dateinamen als Argument (`tr 'A-Z' 'a-z' datei`) – tr liest nur von der Eingabe: `<` oder `cat … |`."],
 checks:function(V){return [
  ["groß → klein: `tr 'A-Z' 'a-z'` / `[:upper:] [:lower:]`",/tr (['"]?\[?A-Z\]?['"]?|['"]?\[:upper:\]['"]?) (['"]?\[?a-z\]?['"]?|['"]?\[:lower:\]['"]?)/],
  ["Wörter extrahieren: `tr -cs 'a-z' '\\n'` (\\n in Anführungszeichen)",/tr -(cs|sc|c -s|s -c) ['"]?(\[:alpha:\]|\[?a-z\]?|\[?A-Za-z\]?|\[?a-zA-Z\]?|\[:alnum:\])['"]? ['"](\\n|\\012)['"]|grep -(oE|Eo|o -E|E -o|o) ['"][^'"]*(a-z|alpha)[^'"]*['"]/],
  ["liest "+V.F+" mit `<` oder `cat … |` (tr nimmt keinen Dateinamen)",trIn(V)],
  ["`sort`",/\| sort( |$)/],
  ["Duplikate weg: `| uniq` nach sort (oder `sort -u`)",/sort.*\| uniq( |$)|sort -u/],
  ["`> words.txt`",/ > words\.txt$/,1]]},
 after:function(P){P.files.push("words.txt")}},
{t:function(V){return "Bleib in <code>"+V.D+"</code> und erzeuge im <b>darüberliegenden</b> Verzeichnis ein komprimiertes Archiv <code>"+V.A+"</code> mit dem Inhalt von <code>"+V.D+"</code>."},
 en:"Stay in directory … and generate in above directory a compressed archive with name preu.tar.bz2 that shall hold the contents of directory …",
 sol:function(V){return "tar -cjvf ../"+V.A+" ."},
 why:["c = create, j = bzip2 (passt zu .bz2!), v = zeigt Dateien an (optional), f = Dateiname des Archivs – f muss direkt vor dem Namen stehen, also als letzter Buchstabe.","`../preu.tar.bz2` – .. ist das Verzeichnis darüber.","`.` = aktuelles Verzeichnis = Inhalt von "+"PrEU…. (`*` geht auch, lässt aber versteckte Dateien aus.)"],
 fehler:["`-cvzf` – z ist gzip (.gz), für .bz2 braucht es j.","`-cfj` – nach f kommt der Dateiname, j würde zum Archivnamen.","Archiv ins aktuelle Verzeichnis statt nach ../ – dann packt tar sich selbst mit ein."],
 checks:function(V){return [
  ["`tar` mit c (create) und j (bzip2)",function(s){var m=s.match(/^tar -?([a-zA-Z]+) /);return !!m&&/c/.test(m[1])&&/j/.test(m[1])}],
  ["f direkt vor `../"+V.A+"`",new RegExp("^tar -?[a-zA-Z]*f \\.\\./"+rx(V.A)+" ")],
  ["Inhalt: `.` (oder `*`)",new RegExp(rx(V.A)+" (\\.|\\./|\\*|-C \\.\\. "+rx(V.D)+"/?|\\.\\./"+rx(V.D)+"/?)$")]]}},
{t:function(V,P){return "Schneide aus deiner Befehls-History alle Zeilen aus, die du <b>während der Prüfung</b> eingegeben hast, und speichere sie in <code>history.txt</code>."+(P&&P.drill?" <span class=\"mut\">(Seit Prüfungsbeginn stehen schon "+P.hist.length+" Zeilen in der History – tipp <code>history</code>, um nachzusehen.)</span>":"")},
 en:"Cut from your command-history all command-lines that have been issued during the exam and save result into history.txt",
 sol:function(V,P){return "history | tail -n "+(P?P.hist.length+1:9)+" > history.txt"},
 why:["`history` zeigt alle Befehle nummeriert, `tail -n N` nimmt die letzten N.","N = alle Zeilen seit dem ersten `cd` der Prüfung – auch Tippfehler, Probeläufe und `history`-Aufrufe – PLUS 1 für diese Zeile selbst (sie steht schon in der History, wenn sie läuft).","Trick: erst `history` eingeben, die Nummer des ersten Prüfungsbefehls (cd) suchen. N = (Nummer der neuen Zeile) − (Nummer vom cd) + 1."],
 fehler:["N zu klein – dann fehlen die ersten Befehle (cd, mkdir).","`history > history.txt` – enthält auch alles von vor der Prüfung."],
 checks:function(V){return [
  ["`history | tail -n N`",/^history \| tail -(n ?)?\d+( |$)/],
  ["N = alle Prüfungszeilen inkl. dieser",function(s,P){var m=s.match(/tail -(?:n ?)?(\d+)/);return !!m&&+m[1]>=P.hist.length}],
  ["`> history.txt`",/ > (~\/)?history\.txt$/,1]]},
 after:function(P){P.files.push("history.txt")}}
];

/* ---------- Zustand ---------- */
var PX=null;
function newRun(drill,k){
  var V=newVars(false), P={V:V,step:0,drill:!!drill,hist:[],sb:[],cwd:"~",files:[],err:{},help:{},start:Date.now(),streak:0};
  if(drill) setupDrill(P,k);
  return P;
}
function setupDrill(P,k){
  P.V=newVars(false); P.hist=[]; P.sb=[]; P.cwd="~"; P.files=[]; P.shown=false; P.tries=0;
  if(k==null){var w=[1,2,3,4,4,5,5,5,6,6,6,6,7,7,7,8,8,8];k=w[rnd(w.length)]}
  P.step=k-1;
  /* vorherige Aufgaben als schon erledigt in die History (realistisch für Aufgabe 8) */
  for(var i=0;i<P.step;i++){P.hist.push(STEPS[i].sol(P.V,P)); if(STEPS[i].after) STEPS[i].after(P)}
  if(P.step>0) P.sb.push({c:"# Aufgaben 1–"+P.step+" sind schon erledigt.",cls:"cmt"});
}
function prompt(P){return "stud@sshstud:"+P.cwd+"$"}
function histOut(P){
  var prior=["ls","cd uebung","nano notizen.txt","cd"], n0=P.V.H0-prior.length, out=[];
  prior.forEach(function(c,i){out.push(pad(n0+i)+"  "+c)});
  P.hist.forEach(function(c,i){out.push(pad(P.V.H0+i)+"  "+c)});
  return out.join("\n");
}
function pad(n){n=String(n);while(n.length<5)n=" "+n;return n}
function runChecks(st,c,P){var cs=st.checks(P.V);return cs.map(function(k){return {label:k[0],ok:typeof k[1]==="function"?k[1](c,P):k[1].test(c),redir:!!k[2]}})}
function helper(c,P){
  if(c==="clear"){P.sb=[];return ""}
  if(c==="pwd") return P.cwd.replace("~","/home/stud");
  if(/^ls( -[a-zA-Z]+)*$/.test(c)) return P.files.join("  ")||"";
  if(c==="history") return histOut(P);
  if(/^(cat|less|more|head|tail|nano|man|wc|echo)\b[^|<>;]*$/.test(c)) return "(Ausgabe im Trainer nicht simuliert)";
  return null;
}

/* ---------- Seiten ---------- */
window.pxHome=function(){
  setAccent("linux");
  var V=newVars(true), runs=store("px_runs")||[], clean=0;
  for(var i=runs.length-1;i>=0&&!runs[i].err&&!runs[i].help;i--)clean++;
  var h=crumbs([[FACH.linux.name,"#/linux"],["Praxis-Prüfung"]]);
  h+='<div class="th"><span class="tag">PS-Test</span><h1>Praxis-Prüfung im Terminal</h1><p class="src">Aufgaben wie auf dem Praxis-Aufgabenblatt (PrEU) · Lösungen selbst erstellt und in bash getestet</p></div>';
  h+='<p class="note">Im Trainer tippst du jeden Befehl selbst – wie im echten Terminal. Verzeichnisname, RFC-Nummer und Betreff wechseln bei jedem Durchlauf: Lern das <b>Muster</b>, nicht die Zahl. Hilfsbefehle wie <code>ls</code>, <code>pwd</code>, <code>cat</code> und <code>history</code> darfst du jederzeit eingeben. Mit ↑ holst du den letzten Befehl zurück.</p>';
  h+='<div class="modes"><a class="mode" href="#/linux/praxis/lauf"><span class="mstep">Ganze Prüfung</span><span class="mic">▶</span><b>Durchlauf 1–10</b><span class="mt">Alle Aufgaben der Reihe nach, mit History und Mail am Schluss. Ziel: 3× hintereinander ohne Fehler.</span><span class="stat">'+(runs.length?runs.length+' Durchläufe · '+clean+'× fehlerfrei in Folge':'noch keiner')+'</span></a>'+
     '<a class="mode" href="#/linux/praxis/drill"><span class="mstep">Wiederholen</span><span class="mic">⚡</span><b>Einzelne Aufgaben drillen</b><span class="mt">Zufällige Aufgabe, neue Namen, sofort prüfen. Die schweren (5–8) kommen öfter.</span><span class="stat">Bester Lauf: '+(store("px_best")||0)+' richtig in Folge</span></a></div>';
  h+='<h2 class="sh">Alles auf einen Blick <small>(Beispiel: '+V.D+', '+V.F+')</small></h2><pre class="code">'+esc(STEPS.map(function(s,i){return s.sol(V,{hist:{length:8}})}).join("\n"))+'</pre>';
  h+='<p class="sm mut" style="margin:-.6rem 0 1rem">Die 9 bei <code>tail -n</code> stimmt nur, wenn du genau diese 8 Zeilen getippt hast – zähl in der Prüfung selbst (siehe Aufgabe 8).</p>';
  h+='<h2 class="sh">Spickzettel – Aufgabe für Aufgabe</h2><div class="pxcheat">';
  STEPS.forEach(function(s,i){
    h+='<details class="pxc"><summary><span class="pxn">'+(i+1)+'</span><span>'+s.t(V)+'</span></summary><div class="pxcb"><p class="sm mut"><i>'+esc(s.en)+'</i></p><pre class="code">'+esc(s.sol(V,{hist:{length:8}}))+'</pre><ul>'+s.why.map(function(w){return '<li>'+fmt(w)+'</li>'}).join("")+'</ul>'+
       (s.fehler?'<p class="lblf">Typische Fehler</p><ul class="pxf">'+s.fehler.map(function(w){return '<li>'+fmt(w)+'</li>'}).join("")+'</ul>':'')+'</div></details>';
  });
  h+='<details class="pxc"><summary><span class="pxn">9</span><span>Mail an die Adresse vom Aufgabenblatt, Betreff z. B. <code>'+V.S+'</code>, Anhänge <code>'+V.A+'</code> und <code>history.txt</code></span></summary><div class="pxcb"><ul><li>Adresse genau so wie auf dem Blatt (auf dem Foto: bcollini@cs.sbg.ac.at).</li><li>Betreff genau wie angegeben (auf dem Blatt steht er groß geschrieben).</li><li>Beide Dateien anhängen. Sie liegen in <b>verschiedenen</b> Ordnern: das Archiv eins über PrEU…, history.txt dort, wo du es gespeichert hast.</li></ul></div></details>';
  h+='<details class="pxc"><summary><span class="pxn">10</span><span>Mail abschicken</span></summary><div class="pxcb"><p>Vorher kontrollieren: Betreff, beide Anhänge, Adresse.</p></div></details></div>';
  app.innerHTML=h;
};
window.pxRun=function(drill){
  setAccent("linux");
  if(!PX||PX.drill!==!!drill||PX.done) PX=newRun(drill);
  draw();
};
function draw(){
  var P=PX, V=P.V, st=STEPS[P.step];
  var h=crumbs([[FACH.linux.name,"#/linux"],["Praxis-Prüfung","#/linux/praxis"],[P.drill?"Drill":"Durchlauf"]]);
  if(P.step>=STEPS.length&&!P.drill){ app.innerHTML=h+mailHTML(P); bindMail(); return; }
  h+='<div class="ofbarline"><span class="tag" style="margin:0">'+(P.drill?'Drill · '+P.streak+' richtig in Folge':'Aufgabe '+(P.step+1)+' von 10')+'</span>'+
     (P.drill?'':'<span class="pxdots">'+STEPS.map(function(s,i){return '<i class="'+(i<P.step?(P.err[i]||P.help[i]?"part":"ok"):i===P.step?"cur":"")+'"></i>'}).join("")+'<i></i><i></i></span>')+
     '<span class="sm mut">Verzeichnis <code>'+V.D+'</code> · Datei <code>'+V.F+'</code></span></div>';
  h+='<div class="pxtask"><span class="pxn">'+(P.step+1)+'</span><div><p>'+st.t(V,P)+'</p><p class="sm mut"><i>'+esc(st.en)+'</i></p></div></div>';
  h+='<div class="uxterm" id="term">';
  P.sb.forEach(function(e){
    if(e.cls==="cmt") h+='<div class="tl cmt">'+esc(e.c)+'</div>';
    else h+='<div class="tl"><span class="tp">'+esc(e.p)+'</span> '+esc(e.c)+'</div>'+(e.o?'<pre class="to'+(e.ocls?' '+e.ocls:'')+'">'+esc(e.o)+'</pre>':'');
  });
  h+='<div class="tl tin"><span class="tp">'+esc(prompt(P))+'</span><input id="tcmd" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Befehl"></div></div>';
  h+='<div id="pxfb"></div>';
  h+='<div class="row" style="margin-top:.8rem"><button class="btn" id="pxsol">Lösung zeigen</button>'+(P.drill?'<button class="btn" id="pxskip">Andere Aufgabe</button>':'')+'<a class="pill" href="#/linux/praxis" style="margin-left:auto">Spickzettel</a><button class="pill" id="pxnew">Neu starten</button></div>';
  app.innerHTML=h;
  var inp=document.getElementById("tcmd"), term=document.getElementById("term");
  term.scrollTop=term.scrollHeight; inp.focus();
  term.onclick=function(){inp.focus()};
  var hi=P.hist.length;
  inp.onkeydown=function(e){
    if(e.key==="Enter"){e.preventDefault();submit(inp.value)}
    else if(e.key==="ArrowUp"){e.preventDefault();if(hi>0){hi--;inp.value=P.hist[hi]}}
    else if(e.key==="ArrowDown"){e.preventDefault();if(hi<P.hist.length-1){hi++;inp.value=P.hist[hi]}else{hi=P.hist.length;inp.value=""}}
  };
  document.getElementById("pxsol").onclick=function(){
    P.help[P.step]=1; P.shown=true;
    fb('<div class="fbx tip"><b>Lösung – tipp sie jetzt selbst ab</b><pre class="code">'+esc(st.sol(V,P))+'</pre><ul>'+st.why.map(function(w){return '<li>'+fmt(w)+'</li>'}).join("")+'</ul></div>');
    if(P.drill) P.streak=0;
    inp.focus();
  };
  var sk=document.getElementById("pxskip"); if(sk) sk.onclick=function(){setupDrill(P);draw()};
  document.getElementById("pxnew").onclick=function(){PX=newRun(P.drill);draw()};
  if(P.fbHTML){fb(P.fbHTML);P.fbHTML=null}
}
function fb(html){var el=document.getElementById("pxfb"); if(el) el.innerHTML=html}
function submit(raw){
  var P=PX, st=STEPS[P.step]; raw=raw.trim(); if(!raw) return;
  var c=canon(raw);
  P.hist.push(raw);
  var e={p:prompt(P),c:raw}; P.sb.push(e);
  var r=runChecks(st,c,P), ok=r.every(function(x){return x.ok});
  if(ok){
    if(st.after) st.after(P);
    var extra="";
    if(P.step===7){var n=+c.match(/tail -(?:n ?)?(\d+)/)[1]; if(n>P.hist.length) extra=" (Ein paar Zeilen zu viel – genau wären "+P.hist.length+".)"}
    P.sb.push({c:"# ✓ Aufgabe "+(P.step+1)+" richtig"+extra,cls:"cmt"});
    if(P.drill){
      if(!P.shown&&!P.tries) {P.streak++; if(P.streak>(store("px_best")||0)) store("px_best",P.streak);}
      var msg='<div class="fbx good"><b>✓ Richtig!</b> '+(extra?esc(extra):'')+' <span class="sm">Nächste Aufgabe kommt …</span></div>';
      var keep=P.streak; setupDrill(P); P.streak=keep; P.fbHTML=msg; draw(); return;
    }
    P.step++; P.tries=0; P.shown=false;
    P.fbHTML=extra?'<div class="fbx warn"><b>Akzeptiert.</b> '+esc(extra)+'</div>':'';
    draw(); return;
  }
  var redirOnly=r.every(function(x){return x.ok||x.redir}), noRedir=!/ (>|>>) /.test(c);
  if(redirOnly&&noRedir){
    e.o="(Probelauf – die Ausgabe erscheint am Bildschirm)";
    P.fbHTML='<div class="fbx tip"><b>Probelauf ✓</b> Der Befehl stimmt. Jetzt noch mit Umleitung: '+r.filter(function(x){return !x.ok}).map(function(x){return fmt(x.label)}).join(", ")+' – ↑ holt die Zeile zurück.</div>';
    draw(); return;
  }
  var hout=helper(c,P);
  if(hout!==null){ if(c!=="clear"){e.o=hout;} draw(); return; }
  P.err[P.step]=(P.err[P.step]||0)+1; P.tries=(P.tries||0)+1; if(P.drill) P.streak=0;
  e.o="✗ stimmt noch nicht"; e.ocls="bad";
  P.fbHTML='<div class="fbx bad"><b>Noch nicht ganz</b><ul class="ofk">'+r.map(function(x){return '<li class="'+(x.ok?"y":"n")+'">'+(x.ok?"✓ ":"✗ ")+fmt(x.label)+'</li>'}).join("")+'</ul>'+(P.tries>=2&&!P.shown?'<p class="sm" style="margin-top:.4rem">Tipp: „Lösung zeigen“ – danach selbst abtippen.</p>':'')+'</div>';
  draw();
}
function mailHTML(P){
  var V=P.V, files=["preu.tar.bz2","history.txt","words.txt","LWC.txt",V.F];
  var h='<div class="ofbarline"><span class="tag" style="margin:0">Aufgabe 9 & 10</span></div>';
  h+='<div class="pxtask"><span class="pxn">9</span><div><p>Schreib eine Mail an die Adresse vom Aufgabenblatt (<code>bcollini@cs.sbg.ac.at</code>), Betreff <code>'+V.S+'</code>, und häng <code>'+V.A+'</code> und <code>history.txt</code> an. Dann abschicken.</p></div></div>';
  h+='<div class="pxmail"><label>An<input id="mto" autocomplete="off" spellcheck="false"></label><label>Betreff<input id="msub" autocomplete="off" spellcheck="false"></label><div class="lblf">Anhänge</div><div class="chks">'+
     files.map(function(f){return '<label><input type="checkbox" value="'+f+'"> '+f+'</label>'}).join("")+'</div><button class="btn pr" id="msend" style="justify-self:start">Senden</button></div><div id="pxfb"></div>';
  return h;
}
function bindMail(){
  var P=PX;
  document.getElementById("msend").onclick=function(){
    var to=document.getElementById("mto").value.trim().toLowerCase(), sub=document.getElementById("msub").value.trim();
    var att=[].slice.call(app.querySelectorAll(".pxmail input[type=checkbox]:checked")).map(function(x){return x.value});
    var r=[["Adresse bcollini@cs.sbg.ac.at",/^bcollini@cs\.(sbg|plus)\.ac\.at$/.test(to)],["Betreff genau "+P.V.S,sub===P.V.S],["Anhang "+P.V.A,att.indexOf(P.V.A)>=0],["Anhang history.txt",att.indexOf("history.txt")>=0]];
    if(!r.every(function(x){return x[1]})){P.err[8]=(P.err[8]||0)+1;fb('<div class="fbx bad"><b>Noch nicht abschicken!</b><ul class="ofk">'+r.map(function(x){return '<li class="'+(x[1]?"y":"n")+'">'+(x[1]?"✓ ":"✗ ")+esc(x[0])+'</li>'}).join("")+'</ul></div>');return}
    finish();
  };
}
function finish(){
  var P=PX, sec=Math.round((Date.now()-P.start)/1000), nerr=0, nhelp=0;
  Object.keys(P.err).forEach(function(k){nerr+=P.err[k]}); nhelp=Object.keys(P.help).length;
  var runs=store("px_runs")||[]; runs.push({d:Date.now(),err:nerr,help:nhelp,sec:sec}); store("px_runs",runs.slice(-30));
  var clean=0; for(var i=runs.length-1;i>=0&&!runs[i].err&&!runs[i].help;i--)clean++;
  P.done=true;
  var h=crumbs([[FACH.linux.name,"#/linux"],["Praxis-Prüfung","#/linux/praxis"],["Ergebnis"]]);
  h+='<div class="th"><span class="tag">Fertig</span><h1>'+(nerr||nhelp?'Durchgekommen – mit '+nerr+' Fehlversuch'+(nerr===1?'':'en')+(nhelp?' und '+nhelp+'× Lösung angeschaut':''):'Fehlerfrei! 🎉')+'</h1><p class="src">Zeit: '+Math.floor(sec/60)+':'+(sec%60<10?'0':'')+sec%60+' Minuten · '+clean+'× fehlerfrei in Folge (Ziel: 3)</p></div>';
  h+='<div class="prlist">'+STEPS.map(function(s,i){var e=P.err[i]||0,hp=P.help[i];return '<div class="prr '+(e||hp?"part":"ok")+'"><summary style="cursor:default"><span class="pxn">'+(i+1)+'</span><span class="prt">'+s.t(P.V)+'</span><span class="sm mut">'+(hp?'Lösung angeschaut':e?e+'× falsch':'✓')+'</span></summary></div>'}).join("")+'</div>';
  h+='<h2 class="sh">Deine History aus diesem Durchlauf</h2><pre class="code">'+esc(histOut(P).split("\n").slice(4).join("\n"))+'</pre>';
  h+='<div class="row"><button class="btn pr" id="pxagain">Nochmal (neue Namen)</button><a class="btn" href="#/linux/praxis/drill">Schwache Aufgaben drillen</a></div>';
  app.innerHTML=h;
  document.getElementById("pxagain").onclick=function(){PX=newRun(false);draw()};
}
window.PRAXIS={steps:STEPS,canon:canon,newVars:newVars,runChecks:runChecks};
})();
