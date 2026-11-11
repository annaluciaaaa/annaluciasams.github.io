/* Mini-Java: ein kleiner Java-Interpreter für den Browser (Teilmenge von Java 25, kompakte Syntax)
   Unterstützt: void main(), eigene Methoden, Konstanten/Felder, int long double boolean char byte short String var,
   if/else, while, do-while, for, switch (alt und neu, auch als Ausdruck mit yield), break/continue/return,
   alle Operatoren, Casts, IO.println/print/readln (auch System.out), Integer/Double/Math/Character/String-Methoden.
   Fehlermeldungen auf Deutsch. Nicht unterstützt: Klassen, Arrays, Objekte (new), Exceptions (try/catch). */
(function(){
"use strict";
var KW=Object.create(null);"void int long double float boolean char byte short final if else while for do return break continue switch case default yield true false null new var class public private protected static".split(" ").forEach(function(w){KW[w]=1});
function D(o){var r=Object.create(null);for(var k in o)r[k]=o[k];return r}
var PRIM=D({int:1,long:1,double:1,boolean:1,char:1,byte:1,short:1,float:1});
var OPS=[">>>=","<<=",">>=",">>>","->","++","--","&&","||","==","!=","<=",">=","+=","-=","*=","/=","%=","&=","|=","^=","<<",">>","+","-","*","/","%","=","<",">","!","~","?",":",";",",",".","(",")","{","}","[","]","&","|","^","@"];
function CErr(msg,line){this.msg=msg;this.line=line}
function RErr(msg,line){this.msg=msg;this.line=line}

function jd(x){
  if(isNaN(x)) return "NaN";
  if(!isFinite(x)) return x>0?"Infinity":"-Infinity";
  if(x===0) return 1/x<0?"-0.0":"0.0";
  var a=Math.abs(x);
  if(a>=1e-3&&a<1e7){var s=String(x);return s.indexOf(".")<0&&s.indexOf("e")<0?s+".0":s}
  var m=x.toExponential().split("e"), man=m[0]; if(man.indexOf(".")<0) man+=".0";
  return man+"E"+(+m[1]);
}

/* ================= Lexer ================= */
function lex(src){
  var toks=[],i=0,line=1,n=src.length;
  function push(t,v,st,extra){var o={t:t,v:v,line:line,p:st,e:i};if(extra)for(var k in extra)o[k]=extra[k];toks.push(o)}
  var ESC=D({n:"\n",t:"\t",r:"\r",b:"\b",f:"\f",s:" ","0":"\0","\\":"\\","'":"'","\"":"\""});
  function readEsc(){ // i zeigt auf Backslash
    var c=src[i+1];
    if(c==="u"){var h=src.substr(i+2,4); if(!/^[0-9a-fA-F]{4}$/.test(h)) throw new CErr("Ungültige Escape-Sequenz \\u"+h,line); i+=6; return String.fromCharCode(parseInt(h,16))}
    if(c===undefined||!(c in ESC)) throw new CErr("Ungültige Escape-Sequenz \\"+(c||"")+" – erlaubt sind z. B. \\n, \\t, \\\", \\\\",line);
    i+=2; return ESC[c];
  }
  while(i<n){
    var c=src[i];
    if(c==="\n"){line++;i++;continue}
    if(c===" "||c==="\t"||c==="\r"||c==="\u00a0"){i++;continue}
    if(c==="/"&&src[i+1]==="/"){while(i<n&&src[i]!=="\n")i++;continue}
    if(c==="/"&&src[i+1]==="*"){var sl=line;i+=2;while(i<n&&!(src[i]==="*"&&src[i+1]==="/")){if(src[i]==="\n")line++;i++} if(i>=n) throw new CErr("Der Kommentar /* wird nie mit */ geschlossen.",sl); i+=2;continue}
    var st=i;
    if(/[A-Za-z_$äöüÄÖÜß]/.test(c)){while(i<n&&/[A-Za-z0-9_$äöüÄÖÜß]/.test(src[i]))i++; var w=src.slice(st,i); push(KW[w]?"kw":"id",w,st); continue}
    if(/[0-9]/.test(c)||(c==="."&&/[0-9]/.test(src[i+1]||""))){
      var m;
      if(c==="0"&&/[xX]/.test(src[i+1]||"")){
        m=/^0[xX][0-9a-fA-F_]+[lL]?/.exec(src.slice(i)); if(!m) throw new CErr("Ungültige Hex-Zahl",line);
        i+=m[0].length; var hx=m[0].replace(/_/g,""), isL=/[lL]$/.test(hx); hx=hx.replace(/[lL]$/,"");
        if(isL) push("num",BigInt.asIntN(64,BigInt(hx)),st,{nt:"long"}); else { var hv=parseInt(hx,16); if(hv>0xFFFFFFFF) throw new CErr("Zahl zu groß für int",line); push("num",hv|0,st,{nt:"int"}); }
        continue;
      }
      m=/^(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d+)?[lLdDfF]?/.exec(src.slice(i));
      i+=m[0].length; var txt=m[0].replace(/_/g,""), suf=/[lLdDfF]$/.test(txt)?txt.slice(-1).toLowerCase():"", body=suf?txt.slice(0,-1):txt;
      var isD=/[.eE]/.test(body);
      if(/[A-Za-z_]/.test(src[i]||"")) throw new CErr("Ein Name darf nicht mit einer Ziffer anfangen: "+m[0]+src[i]+"…",line);
      if(suf==="l"){ if(isD) throw new CErr("Ungültige long-Zahl "+m[0],line); push("num",BigInt.asIntN(64,BigInt(body)),st,{nt:"long"}); }
      else if(suf==="f"){ throw new CErr("float-Zahlen (mit f) werden hier nicht unterstützt – nimm double (ohne f).",line); }
      else if(suf==="d"||isD){ push("num",parseFloat(body),st,{nt:"double"}); }
      else { var iv=parseInt(body,10); if(iv>2147483648) throw new CErr("Die Zahl "+body+" ist zu groß für int (max. 2147483647). Tipp: Für long ein L anhängen.",line); push("num",iv,st,{nt:"int",big:iv===2147483648}); }
      continue;
    }
    if(c==='"'){
      if(src.substr(i,3)==='"""') throw new CErr("Textblöcke (\"\"\") werden hier nicht unterstützt.",line);
      i++; var s="";
      while(true){
        if(i>=n||src[i]==="\n") throw new CErr("Der Text (String) wird nicht mit \" geschlossen.",line);
        if(src[i]==='"'){i++;break}
        if(src[i]==="\\"){s+=readEsc();continue}
        s+=src[i++];
      }
      push("str",s,st); continue;
    }
    if(c==="'"){
      i++; var ch;
      if(src[i]==="\\") ch=readEsc(); else if(src[i]==="'"||src[i]==="\n"||i>=n) throw new CErr("Leeres Zeichen-Literal '' ist nicht erlaubt.",line); else ch=src[i++];
      if(src[i]!=="'"){ var j=i; while(j<n&&src[j]!=="'"&&src[j]!=="\n")j++; throw new CErr("In einfache Anführungszeichen ' ' gehört genau EIN Zeichen (char). Für Text nimm doppelte Anführungszeichen \"…\".",line); }
      i++; push("chr",ch.charCodeAt(0),st); continue;
    }
    var op=null; for(var k=0;k<OPS.length;k++){ if(src.substr(i,OPS[k].length)===OPS[k]){op=OPS[k];break} }
    if(op){ i+=op.length; push("op",op,st); continue; }
    if(c==="„"||c==="“"||c==="”") throw new CErr("Das Zeichen "+c+" ist kein Java-Anführungszeichen. Nimm das normale \" (Shift+2).",line);
    throw new CErr("Unerwartetes Zeichen '"+c+"'",line);
  }
  i=n; push("eof","Ende des Codes",n);
  return toks;
}

/* ================= Parser ================= */
function Parser(toks,src){this.k=toks;this.i=0;this.src=src}
var Pp=Parser.prototype;
Pp.peek=function(o){return this.k[Math.min(this.i+(o||0),this.k.length-1)]};
Pp.next=function(){return this.k[this.i++]};
Pp.is=function(v,o){var t=this.peek(o);return (t.t==="op"||t.t==="kw")&&t.v===v};
Pp.accept=function(v){if(this.is(v)){this.i++;return true}return false};
Pp.prevLine=function(){return this.i>0?this.k[this.i-1].line:1};
Pp.desc=function(t){return t.t==="eof"?"das Ende des Codes":t.t==="str"?"\""+t.v+"\"":t.t==="chr"?"'"+String.fromCharCode(t.v)+"'":"'"+(t.t==="num"?this.src.slice(t.p,t.e):t.v)+"'"};
Pp.expect=function(v,hint){
  if(this.is(v)) return this.next();
  var t=this.peek();
  if(v===";") throw new CErr("Hier fehlt ein Strichpunkt ; am Ende der Anweisung."+(hint||""),this.prevLine());
  if(v===")"&&t.t!=="eof") throw new CErr("')' erwartet, gefunden: "+this.desc(t)+". Fehlt eine schließende Klammer oder ein Operator?"+(hint||""),t.line);
  if(v==="}"&&t.t==="eof") throw new CErr("Es fehlt eine schließende geschweifte Klammer }. Zu jeder { gehört eine }.",this.prevLine());
  throw new CErr("'"+v+"' erwartet, gefunden: "+this.desc(t)+(hint||""),t.line);
};
Pp.ident=function(what){var t=this.peek(); if(t.t==="id") return this.next(); if(t.t==="kw") throw new CErr("'"+t.v+"' ist ein reserviertes Schlüsselwort und kann nicht als Name ("+what+") verwendet werden.",t.line); throw new CErr("Name ("+what+") erwartet, gefunden: "+this.desc(t),t.line)};
Pp.span=function(node,start){node.p=this.k[start].p;node.q=this.k[this.i-1].e;return node};
Pp.tryType=function(){ // gibt Typ zurück oder null (ohne zu verbrauchen, wenn kein Typ)
  var t=this.peek();
  if(t.t==="kw"&&(PRIM[t.v]||t.v==="void"||t.v==="var")){
    if(t.v==="float") throw new CErr("float wird hier nicht unterstützt – nimm double.",t.line);
    this.i++; this.noArray(); return t.v;
  }
  if(t.t==="id"&&this.peek(1).t==="id"){
    if(t.v==="String"){this.i++; this.noArray(); return "String"}
    if(t.v==="Scanner") throw new CErr("Scanner brauchst du hier nicht. Eingaben liest man mit IO.readln().",t.line);
    throw new CErr("Unbekannter Typ '"+t.v+"'. Erlaubt sind hier int, long, double, boolean, char, byte, short, String und var.",t.line);
  }
  if(t.t==="id"&&t.v==="String"&&this.is("[",1)) {this.i++;this.noArray()}
  return null;
};
Pp.noArray=function(){ if(this.is("[")) throw new CErr("Arrays (mit [ ]) werden in diesem Trainer noch nicht unterstützt.",this.peek().line) };
Pp.isDeclStart=function(){
  var t=this.peek();
  if(t.t==="kw"&&(t.v==="final"||PRIM[t.v]||t.v==="var")) return true;
  if(t.t==="id"&&this.peek(1).t==="id") return true;
  if(t.t==="id"&&t.v==="String"&&this.is("[",1)) return true;
  return false;
};
Pp.program=function(){
  var methods=Object.create(null),order=[],fields=[];
  while(this.peek().t!=="eof"){
    var t=this.peek();
    if(t.t==="id"&&t.v==="import") throw new CErr("import brauchst du hier nicht – IO, Math, Integer usw. sind schon da.",t.line);
    if(t.t==="id"&&t.v==="package") throw new CErr("package brauchst du hier nicht.",t.line);
    var fin=false;
    while(this.is("public")||this.is("private")||this.is("protected")||this.is("static")||this.is("final")){ if(this.next().v==="final") fin=true; }
    t=this.peek();
    if(this.is("class")) throw new CErr("Klassen (class) werden hier nicht unterstützt. Schreib einfach void main() { … } wie in der VO.",t.line);
    if(this.is("}")) throw new CErr("Diese } ist zu viel – zu ihr gibt es keine öffnende {.",t.line);
    var start=this.i, ty=this.tryType();
    if(!ty){
      if(t.t==="id"&&this.is("(",1)) throw new CErr("Vor dem Methodennamen '"+t.v+"' fehlt der Rückgabetyp, z. B. void "+t.v+"(…) oder int "+t.v+"(…).",t.line);
      if(t.t==="id"||t.t==="kw") throw new CErr("Unerwartet: "+this.desc(t)+". Anweisungen müssen innerhalb einer Methode stehen, z. B. in void main() { … }.",t.line);
      throw new CErr("Unerwartet: "+this.desc(t)+". Hier sollte eine Methode wie void main() { … } beginnen.",t.line);
    }
    var nameTok=this.ident(ty==="void"?"Methode":"Methode oder Variable");
    if(this.is("(")){
      this.next(); var params=[];
      if(!this.is(")")){
        do{ this.accept("final"); var pl=this.peek().line, pt=this.tryType(); if(!pt||pt==="void"||pt==="var") throw new CErr("Parameter brauchen einen Typ, z. B. (int a, int b).",pl); params.push({name:this.ident("Parameter").v,type:pt,line:pl}); }while(this.accept(","));
      }
      this.expect(")");
      if(!this.is("{")) throw new CErr("Nach dem Methodenkopf muss ein Rumpf in { } folgen."+(this.is(";")?" (Kein ; nach der Klammer!)":""),this.peek().line);
      var body=this.block();
      if(methods[nameTok.v]) throw new CErr("Die Methode "+nameTok.v+" gibt es zweimal.",nameTok.line);
      methods[nameTok.v]={name:nameTok.v,ret:ty,params:params,body:body,line:nameTok.line}; order.push(nameTok.v);
    } else {
      if(ty==="void") throw new CErr("void gibt es nur bei Methoden. Nach "+nameTok.v+" fehlt ( ).",nameTok.line);
      var d=this.declRest(ty,fin,nameTok,start); this.expect(";"); d.field=true; fields.push(d);
    }
  }
  return {methods:methods,order:order,fields:fields};
};
Pp.declRest=function(ty,fin,firstTok,start){
  var vars=[], nt=firstTok;
  while(true){
    var init=null; this.noArray();
    if(this.accept("=")) init=this.expr();
    vars.push({name:nt.v,init:init,line:nt.line});
    if(!this.accept(",")) break;
    nt=this.ident("Variable");
  }
  return this.span({k:"decl",type:ty,fin:fin,vars:vars,line:firstTok.line},start);
};
Pp.block=function(){
  var st=this.i, l=this.expect("{").line, body=[];
  while(!this.is("}")){ if(this.peek().t==="eof") throw new CErr("Es fehlt eine schließende geschweifte Klammer }. Die { in Zeile "+l+" wird nie geschlossen.",this.prevLine()); body.push(this.stmt()); }
  this.next(); return this.span({k:"block",body:body,line:l},st);
};
Pp.cond=function(kw){
  this.expect("(",kw==="if"?" Nach if kommt die Bedingung in runden Klammern: if (…)":" Nach "+kw+" kommt die Bedingung in runden Klammern.");
  if(this.is(")")) throw new CErr("Die Bedingung in den Klammern fehlt.",this.peek().line);
  var e=this.expr(); this.expect(")"); return e;
};
Pp.stmt=function(){
  var t=this.peek(), st=this.i, n;
  if(this.is("{")) return this.block();
  if(this.is(";")){this.next();return this.span({k:"empty",line:t.line},st)}
  if(this.is("if")){ this.next(); var c=this.cond("if"); var th=this.stmt(), el=null; if(this.accept("else")) el=this.stmt(); return this.span({k:"if",cond:c,then:th,els:el,line:t.line},st); }
  if(this.is("else")) throw new CErr("else ohne passendes if. Steht vielleicht ein ; direkt nach if (…), oder fehlen { } um mehrere Anweisungen?",t.line);
  if(this.is("while")){ this.next(); var wc=this.cond("while"); return this.span({k:"while",cond:wc,body:this.stmt(),line:t.line},st); }
  if(this.is("do")){ this.next(); var db=this.stmt(); if(!this.is("while")) throw new CErr("Nach do { … } muss while (…); folgen.",this.peek().line); var wl=this.next().line; var dc=this.cond("while"); this.expect(";"," Nach do-while (…) kommt ein ;"); return this.span({k:"do",body:db,cond:dc,line:t.line,cline:wl},st); }
  if(this.is("for")){
    this.next(); this.expect("(");
    if(this.peek().t==="id"&&this.peek(1).t==="id"&&this.is(":",2)||this.isDeclStart()&&this.is(":",2)) throw new CErr("Die for-each-Schleife (for (x : …)) gibt es erst mit Arrays/Listen.",t.line);
    var init=[];
    if(!this.is(";")){
      if(this.isDeclStart()){ var is=this.i, fin=this.accept("final"), ty=this.tryType(); init.push(this.declRest(ty,fin,this.ident("Variable"),is)); }
      else { do{ init.push(this.exprStmtExpr()); }while(this.accept(",")); }
    }
    this.expect(";"," Im for-Kopf werden die drei Teile mit ; getrennt: for (int i = 0; i < n; i++)");
    var fc=null; if(!this.is(";")) fc=this.expr();
    this.expect(";"," Im for-Kopf werden die drei Teile mit ; getrennt: for (int i = 0; i < n; i++)");
    var upd=[]; if(!this.is(")")){ do{ upd.push(this.exprStmtExpr()); }while(this.accept(",")); }
    this.expect(")");
    return this.span({k:"for",init:init,cond:fc,upd:upd,body:this.stmt(),line:t.line},st);
  }
  if(this.is("return")){ this.next(); var re=null; if(!this.is(";")) re=this.expr(); this.expect(";"); return this.span({k:"ret",e:re,line:t.line},st); }
  if(this.is("break")){ this.next(); if(this.peek().t==="id") throw new CErr("break mit Label wird hier nicht unterstützt.",t.line); this.expect(";"); return this.span({k:"break",line:t.line},st); }
  if(this.is("continue")){ this.next(); this.expect(";"); return this.span({k:"continue",line:t.line},st); }
  if(this.is("yield")){ this.next(); var ye=this.expr(); this.expect(";"); return this.span({k:"yield",e:ye,line:t.line},st); }
  if(this.is("switch")){ this.next(); var sw=this.switchBody(false); return this.span(sw,st); }
  if(this.is("case")||this.is("default")) throw new CErr(t.v+" darf nur innerhalb von switch (…) { … } stehen.",t.line);
  if(this.isDeclStart()){
    var fin2=this.accept("final"), ty2=this.tryType();
    if(ty2==="void") throw new CErr("void gibt es nur als Rückgabetyp von Methoden, nicht für Variablen.",t.line);
    var nt=this.ident("Variable");
    if(this.is("(")) throw new CErr("Methoden darf man nicht innerhalb einer anderen Methode schreiben. Schreib "+nt.v+"(…) außerhalb von main.",t.line);
    n=this.declRest(ty2,fin2,nt,st); this.expect(";"); return n;
  }
  var e=this.exprStmtExpr();
  this.expect(";");
  return this.span({k:"expr",e:e,line:t.line},st);
};
Pp.exprStmtExpr=function(){
  var t=this.peek(), e=this.expr();
  if(!(e.k==="assign"||e.k==="incdec"||e.k==="call")){
    var hint="";
    if(e.k==="bin"&&e.op==="=="&&e.l.k==="name") hint=" Meintest du "+e.l.n+" = … (Zuweisung mit einem =)?";
    else if(e.k==="name"&&this.peek().t==="id") hint=" Fehlt ein Typ oder ein Operator?";
    throw new CErr("Das ist keine vollständige Anweisung (not a statement). Eine Anweisung ist z. B. eine Zuweisung x = …;, ein Aufruf wie IO.println(…); oder x++;."+hint,t.line);
  }
  return e;
};
Pp.switchBody=function(isExpr){
  var l=this.k[this.i-1].line;
  this.expect("(",' Nach switch kommt der Wert in Klammern: switch (x)');
  var subj=this.expr(); this.expect(")"); this.expect("{");
  var cases=[], arrow=null;
  while(!this.is("}")){
    var t=this.peek(), c={labels:[],def:false,line:t.line};
    if(this.accept("default")) c.def=true;
    else if(this.accept("case")){ do{ c.labels.push(this.ternary()); }while(this.accept(",")); }
    else if(t.t==="eof") throw new CErr("Der switch-Block wird nie mit } geschlossen.",this.prevLine());
    else throw new CErr("Im switch-Block muss jede Anweisung unter einem case … : oder default: stehen.",t.line);
    var isArrow;
    if(this.accept("->")) isArrow=true; else if(this.accept(":")) isArrow=false; else throw new CErr("Nach case … fehlt ein : (oder ->).",this.prevLine());
    if(arrow===null) arrow=isArrow; else if(arrow!==isArrow) throw new CErr("In einem switch darf man case … : und case … -> nicht mischen.",t.line);
    if(isArrow){
      var bt=this.peek();
      if(this.is("{")) c.body=[this.block()];
      else if(isExpr){ var bst=this.i; var ex=this.expr(); this.expect(";"); c.value=ex; c.body=[]; c.vline=bt.line; }
      else { c.body=[this.stmt()]; }
    } else {
      c.body=[];
      while(!this.is("case")&&!this.is("default")&&!this.is("}")){ if(this.peek().t==="eof") throw new CErr("Der switch-Block wird nie mit } geschlossen.",this.prevLine()); c.body.push(this.stmt()); }
    }
    cases.push(c);
  }
  this.next();
  return {k:isExpr?"switchx":"switch",subj:subj,cases:cases,arrow:!!arrow,line:l};
};
var BIN=[["||"],["&&"],["|"],["^"],["&"],["==","!="],["<",">","<=",">="],["<<",">>",">>>"],["+","-"],["*","/","%"]];
var PREC=Object.create(null); BIN.forEach(function(g,i){g.forEach(function(o){PREC[o]=i+1})});
var ASSIGN=D({"=":1,"+=":1,"-=":1,"*=":1,"/=":1,"%=":1,"&=":1,"|=":1,"^=":1,"<<=":1,">>=":1,">>>=":1});
Pp.expr=function(){
  var st=this.i, l=this.ternary(), t=this.peek();
  if(t.t==="op"&&ASSIGN[t.v]){
    this.next();
    if(l.k!=="name"){ throw new CErr("Links von "+t.v+" muss eine Variable stehen."+(t.v==="="&&(l.k==="bin"||l.k==="un")?" Für einen Vergleich nimm == (zwei Gleichheitszeichen).":""),t.line); }
    var r=this.expr();
    return this.span({k:"assign",op:t.v,target:l,e:r,line:t.line},st);
  }
  if(t.t==="op"&&t.v==="="&&false) return l;
  return l;
};
Pp.ternary=function(){
  var st=this.i, c=this.bin(1);
  if(this.is("?")){ var lt=this.next().line; var a=this.expr(); this.expect(":"," Beim Bedingungsoperator gehört zu ? immer ein : (bed ? a : b)"); var b=this.ternary(); return this.span({k:"cond",c:c,a:a,b:b,line:lt},st); }
  return c;
};
Pp.bin=function(min){
  var st=this.i, l=this.unary();
  while(true){
    var t=this.peek();
    if(t.t!=="op"||!PREC[t.v]||PREC[t.v]<min) break;
    if(t.v==="="&&this.is(">",1)) break;
    this.next();
    if(t.v==="<"&&this.is("=")) {}
    var r=this.bin(PREC[t.v]+1);
    l=this.span({k:"bin",op:t.v,l:l,r:r,line:t.line},st);
  }
  return l;
};
Pp.unary=function(){
  var t=this.peek(), st=this.i;
  if(t.t==="op"&&(t.v==="!"||t.v==="-"||t.v==="+"||t.v==="~")){
    this.next();
    if(t.v==="-"&&this.peek().t==="num"&&this.peek().big){ var nt=this.next(); return this.span({k:"lit",ty:"int",v:-2147483648,line:t.line,neg:true},st); }
    return this.span({k:"un",op:t.v,e:this.unary(),line:t.line},st);
  }
  if(t.t==="op"&&(t.v==="++"||t.v==="--")){ this.next(); var tg=this.unary(); if(tg.k!=="name") throw new CErr(t.v+" geht nur mit einer Variablen.",t.line); return this.span({k:"incdec",op:t.v,prefix:true,target:tg,line:t.line},st); }
  if(this.is("(")&&this.peek(1).t==="kw"&&PRIM[this.peek(1).v]&&this.is(")",2)){
    this.next(); var ct=this.next().v; this.next();
    if(ct==="float") throw new CErr("float wird hier nicht unterstützt – nimm double.",t.line);
    return this.span({k:"cast",ty:ct,e:this.unary(),line:t.line},st);
  }
  if(this.is("(")&&this.peek(1).t==="id"&&this.peek(1).v==="String"&&this.is(")",2)) throw new CErr("(String) als Cast funktioniert hier nicht. Eine Zahl wird zu Text mit \"\" + zahl oder String.valueOf(zahl).",t.line);
  return this.postfix();
};
Pp.postfix=function(){
  var st=this.i, e=this.primary();
  while(true){
    if(this.is(".")){
      var dl=this.next().line, nt=this.peek();
      if(nt.t!=="id") throw new CErr("Nach dem Punkt muss ein Name kommen.",dl);
      this.next();
      if(this.is("(")){ e=this.span({k:"call",obj:e,name:nt.v,args:this.args(),line:nt.line},st); }
      else e=this.span({k:"field",obj:e,name:nt.v,line:nt.line},st);
    } else if(this.is("[")) throw new CErr("Arrays (mit [ ]) werden in diesem Trainer noch nicht unterstützt.",this.peek().line);
    else break;
  }
  while(this.is("++")||this.is("--")){ var ot=this.next(); if(e.k!=="name") throw new CErr(ot.v+" geht nur mit einer Variablen.",ot.line); e=this.span({k:"incdec",op:ot.v,prefix:false,target:e,line:ot.line},st); }
  return e;
};
Pp.args=function(){
  this.expect("("); var a=[];
  if(!this.is(")")){ do{ a.push(this.expr()); }while(this.accept(",")); }
  this.expect(")"," Fehlt ein Komma zwischen den Argumenten oder eine Klammer?");
  return a;
};
Pp.primary=function(){
  var t=this.peek(), st=this.i;
  if(t.t==="num"){ this.next(); if(t.big) throw new CErr("Die Zahl 2147483648 ist zu groß für int.",t.line); return this.span({k:"lit",ty:t.nt,v:t.v,line:t.line},st); }
  if(t.t==="str"){ this.next(); return this.span({k:"lit",ty:"String",v:t.v,line:t.line},st); }
  if(t.t==="chr"){ this.next(); return this.span({k:"lit",ty:"char",v:t.v,line:t.line},st); }
  if(this.is("true")||this.is("false")){ this.next(); return this.span({k:"lit",ty:"boolean",v:t.v==="true",line:t.line},st); }
  if(this.is("null")){ this.next(); return this.span({k:"lit",ty:"null",v:null,line:t.line},st); }
  if(this.is("(")){ this.next(); if(this.is(")")) throw new CErr("Leere Klammern () – hier fehlt ein Ausdruck.",t.line); var e=this.expr(); this.expect(")"); e.paren=true; return e; }
  if(this.is("switch")){ this.next(); return this.span(this.switchBody(true),st); }
  if(this.is("new")) throw new CErr("new (Objekte/Arrays) wird in diesem Trainer noch nicht unterstützt.",t.line);
  if(t.t==="id"){
    this.next();
    if(this.is("(")) return this.span({k:"call",obj:null,name:t.v,args:this.args(),line:t.line},st);
    return this.span({k:"name",n:t.v,line:t.line},st);
  }
  if(t.t==="op"&&PREC[t.v]&&t.v!=="-"&&t.v!=="+") throw new CErr("Vor dem Operator "+t.v+" fehlt etwas. Tipp: Bei Vergleichen muss auf beiden Seiten etwas stehen, z. B. x > 1 && x < 10 (nicht x > 1 && < 10).",t.line);
  if(t.t==="op"&&t.v==="=") throw new CErr("Unerwartetes =. Für Vergleiche: == (gleich), != (ungleich), <=, >= (das = steht immer hinten).",t.line);
  if(t.t==="kw"&&(PRIM[t.v]||t.v==="final")) throw new CErr("Eine Variablendeklaration ("+t.v+" …) ist hier nicht erlaubt.",t.line);
  if(t.t==="eof") throw new CErr("Der Code hört mitten in einem Ausdruck auf.",this.prevLine());
  throw new CErr("Hier wird ein Wert oder Ausdruck erwartet, gefunden: "+this.desc(t),t.line);
};

/* ================= Typprüfung ================= */
var RANK=D({byte:1,short:2,char:2,int:3,long:4,double:6});
function isNum(t){return t in RANK}
function isInt(t){return t==="byte"||t==="short"||t==="char"||t==="int"||t==="long"}
function promote(a,b){ if(a==="double"||b==="double") return "double"; if(a==="long"||b==="long") return "long"; return "int"; }
function promote1(a){ return a==="double"?"double":a==="long"?"long":"int"; }
var STATIC=D({IO:1,Math:1,Integer:1,Double:1,Long:1,Character:1,String:1,System:1,Boolean:1});

function Checker(prog){this.prog=prog;this.errors=[];this.warnings=[];this.scopes=[];this.fields=Object.create(null);this.loop=0;this.sw=0;this.swx=0;this.m=null}
var Cp=Checker.prototype;
Cp.err=function(msg,line){throw new CErr(msg,line)};
Cp.warn=function(msg,line){ if(!this.warnings.some(function(w){return w.msg===msg&&w.line===line})) this.warnings.push({msg:msg,line:line}) };
Cp.lookup=function(n){ for(var i=this.scopes.length-1;i>=0;i--) if(this.scopes[i][n]) return this.scopes[i][n]; return this.fields[n]||null };
Cp.declare=function(n,info,line){
  for(var i=this.scopes.length-1;i>=0;i--) if(this.scopes[i][n]) this.err("Die Variable '"+n+"' gibt es schon (Zeile "+this.scopes[i][n].line+"). Man kann sie nicht nochmal deklarieren – zum Ändern einfach "+n+" = …; schreiben (ohne Typ davor).",line);
  info.line=line; this.scopes[this.scopes.length-1][n]=info;
};
Cp.run=function(){
  var P=this.prog, self=this;
  this.scopes=[this.fields];
  P.fields.forEach(function(d){ self.wrap(function(){ self.stmt(d) }) });
  this.scopes=[];
  if(!P.methods.main) this.errors.push({msg:"Es fehlt die main-Methode. Jedes Programm braucht void main() { … } – dort startet es.",line:1});
  else if(P.methods.main.params.length||P.methods.main.ret!=="void") this.errors.push({msg:"main muss so aussehen: void main() { … }",line:P.methods.main.line});
  P.order.forEach(function(name){
    var m=P.methods[name]; self.m=m; self.scopes=[Object.create(null)];
    self.wrap(function(){
      m.params.forEach(function(p){ self.declare(p.name,{ty:p.type},p.line) });
      self.blockBody(m.body.body);
      if(m.ret!=="void"&&self.canComplete(m.body)) self.err("In der Methode "+name+" fehlt ein return. Eine Methode mit Rückgabetyp "+m.ret+" muss auf jedem Weg einen Wert zurückgeben (auch wenn kein if zutrifft).",self.lastLine(m.body));
    });
  });
  return this;
};
Cp.lastLine=function(b){ var src=b; return b.body&&b.body.length?b.body[b.body.length-1].line:b.line };
Cp.wrap=function(f){ if(this.errors.length>=4) return; try{f()}catch(e){ if(e instanceof CErr) this.errors.push({msg:e.msg,line:e.line}); else throw e; } };
Cp.blockBody=function(list){
  var self=this, dead=false;
  list.forEach(function(s){
    if(dead&&s.k!=="empty"){ self.err("Diese Anweisung wird nie erreicht – sie steht nach einem return/break/continue.",s.line); }
    self.wrap(function(){ self.stmt(s) });
    if(!self.canComplete(s)) dead=true;
  });
};
Cp.scoped=function(f){ this.scopes.push(Object.create(null)); try{f()} finally{ this.scopes.pop() } };
Cp.stmt=function(s){
  var self=this;
  switch(s.k){
  case "block": this.scoped(function(){ self.blockBody(s.body) }); break;
  case "empty": break;
  case "decl":
    s.vars.forEach(function(v){
      var ty=s.type, pend=null;
      try{
      if(ty==="var"){ if(!v.init) self.err("Bei var muss gleich ein Wert zugewiesen werden: var "+v.name+" = …;",v.line); ty=self.expr(v.init); if(ty==="null"||ty==="void") self.err("Mit var kann man hier keinen Typ ableiten.",v.line); if(ty==="byte"||ty==="short") ty=ty; v.ty=ty; }
      else { v.ty=ty; if(v.init){ var it=self.expr(v.init); self.assignable(ty,it,v.init,v.line,true); } else if(s.fin&&s.field) self.err("Die Konstante "+v.name+" braucht gleich einen Wert.",v.line); }
      }catch(ex){ if(!(ex instanceof CErr)) throw ex; pend=ex; if(!v.ty||v.ty==="var") v.ty="int"; }
      var info={ty:v.ty,fin:s.fin,field:!!s.field}; if(s.fin&&v.init){ var cv=self.constVal(v.init); if(cv.ok&&cv.ty!=="String"&&cv.ty!=="boolean"&&cv.ty!=="null") info.cv=cv; }
      self.declare(v.name,info,v.line);
      if(pend) throw pend;
    });
    break;
  case "expr": this.expr(s.e,true); break;
  case "if":
    this.condition(s.cond,"if");
    if(s.then.k==="empty") this.warn("Achtung: Direkt nach if (…) steht ein ; – damit ist der if-Teil leer und der Block danach läuft immer!",s.line);
    this.scoped(function(){ self.stmt(s.then) });
    if(s.els) this.scoped(function(){ self.stmt(s.els) });
    break;
  case "while": case "do":
    this.condition(s.cond,s.k==="do"?"do-while":"while");
    if(s.k==="while"&&s.body.k==="empty") this.warn("Achtung: Direkt nach while (…) steht ein ; – die Schleife hat dann keinen Rumpf (oft eine Endlosschleife)!",s.line);
    this.loop++; try{ this.scoped(function(){ self.stmt(s.body) }) } finally{ this.loop-- }
    break;
  case "for":
    this.scoped(function(){
      s.init.forEach(function(x){ if(x.k==="decl") self.stmt(x); else self.expr(x,true) });
      if(s.cond) self.condition(s.cond,"for");
      s.upd.forEach(function(x){ self.expr(x,true) });
      if(s.body.k==="empty") self.warn("Achtung: Direkt nach for (…) steht ein ; – die Schleife hat dann keinen Rumpf!",s.line);
      self.loop++; try{ self.scoped(function(){ self.stmt(s.body) }) } finally{ self.loop-- }
    });
    break;
  case "ret":
    var m=this.m;
    if(!m){ this.err("return darf nur in einer Methode stehen.",s.line); }
    if(this.swx) this.err("In einem switch-Ausdruck nimm yield statt return.",s.line);
    if(m.ret==="void"){ if(s.e) this.err("Die Methode "+m.name+" ist void und darf keinen Wert zurückgeben. Entweder nur return; schreiben oder den Rückgabetyp ändern.",s.line); }
    else { if(!s.e) this.err("Hier muss ein Wert zurückgegeben werden: return …; (die Methode hat den Typ "+m.ret+").",s.line); var rt=this.expr(s.e); this.assignable(m.ret,rt,s.e,s.line,true); s.rt=m.ret; }
    break;
  case "break": if(!this.loop&&!this.sw) this.err("break darf nur in einer Schleife oder in switch stehen.",s.line); break;
  case "continue": if(!this.loop) this.err("continue darf nur in einer Schleife stehen.",s.line); break;
  case "yield": if(!this.swx) this.err("yield gibt es nur in einem switch-Ausdruck.",s.line); s.ty=this.expr(s.e); this.yields.push(s); break;
  case "switch": this.switchCheck(s,false); break;
  default: this.err("Unbekannte Anweisung",s.line);
  }
};
Cp.condition=function(e,kw){
  var t=this.expr(e);
  if(t!=="boolean"){
    if(e.k==="assign"&&e.op==="=") this.err("In der Bedingung von "+kw+" steht ein einzelnes = (das ist eine Zuweisung). Zum Vergleichen brauchst du == (zwei Gleichheitszeichen).",e.line);
    this.err("Die Bedingung von "+kw+" muss true oder false ergeben (boolean), ergibt hier aber "+t+". Vergleiche mit ==, <, > usw.",e.line);
  }
};
Cp.constVal=function(e){
  if(e.k==="lit") return {ok:true,v:e.v,ty:e.ty};
  if(e.k==="un"&&e.op==="-"&&e.e.k==="lit"&&isNum(e.e.ty)) return {ok:true,v:typeof e.e.v==="bigint"?-e.e.v:-e.e.v,ty:e.e.ty};
  if(e.k==="name"){ var v=this.lookup(e.n); if(v&&v.fin&&v.cv) return v.cv; }
  return {ok:false};
};
Cp.switchCheck=function(s,isExpr){
  var self=this, st=this.expr(s.subj);
  if(!(st==="int"||st==="char"||st==="String"||st==="byte"||st==="short")) this.err("switch geht hier mit int, char oder String, nicht mit "+st+".",s.line);
  var seen={}, hasDef=false, rtypes=[];
  s.subjTy=st;
  if(isExpr){ var oldY=this.yields; this.yields=[]; }
  this.sw++; if(isExpr) this.swx++;
  var oldLoop=this.loop; if(isExpr) this.loop=0;
  try{
    this.scoped(function(){
      s.cases.forEach(function(c){
        if(c.def){ if(hasDef) self.err("default darf nur einmal vorkommen.",c.line); hasDef=true; }
        c.vals=c.labels.map(function(l){
          var lt=self.expr(l), cv=self.constVal(l);
          if(!cv.ok) self.err("Hinter case muss ein fester Wert stehen (eine Zahl, ein 'z' oder ein \"Text\"), keine Variable oder Bedingung.",l.line);
          if(st==="String"?lt!=="String":!(isInt(lt)&&lt!=="long"))self.err("Der case-Wert passt nicht zum Typ "+st+" im switch.",l.line);
          var key=String(cv.v); if(seen[key]) self.err("case "+(lt==="char"?"'"+String.fromCharCode(cv.v)+"'":lt==="String"?"\""+cv.v+"\"":key)+" kommt zweimal vor.",l.line); seen[key]=1;
          return st==="String"?cv.v:Number(cv.v);
        });
        if(c.value){ var vt=self.expr(c.value); rtypes.push([vt,c.value]); }
        if(s.arrow) c.body.forEach(function(b){ self.scoped(function(){ self.stmt(b) }) });
        else self.blockBody(c.body);
      });
    });
  } finally { this.sw--; if(isExpr) this.swx--; this.loop=oldLoop; }
  s.hasDef=hasDef;
  if(isExpr){
    this.yields.forEach(function(y){ rtypes.push([y.ty,y.e]) });
    this.yields=oldY;
    if(!hasDef) this.err("Ein switch-Ausdruck braucht einen default-Fall (sonst gibt es nicht für jeden Wert ein Ergebnis).",s.line);
    if(!rtypes.length) this.err("Der switch-Ausdruck liefert keinen Wert.",s.line);
    var rt=rtypes[0][0];
    rtypes.forEach(function(x){ var t=x[0]; if(t===rt) return; if(isNum(t)&&isNum(rt)) rt=promote(t,rt); else self.err("Die Fälle im switch-Ausdruck liefern verschiedene Typen ("+rt+" und "+t+").",x[1].line); });
    if(rt==="void") this.err("Ein switch-Ausdruck muss einen Wert liefern.",s.line);
    return rt;
  }
};
Cp.canComplete=function(s){
  var self=this;
  switch(s.k){
  case "block": for(var i=0;i<s.body.length;i++) if(!this.canComplete(s.body[i])) return false; return true;
  case "ret": case "break": case "continue": case "yield": return false;
  case "if": return s.els?(this.canComplete(s.then)||this.canComplete(s.els)):true;
  case "while": return !(s.cond.k==="lit"&&s.cond.v===true)||this.hasBreak(s.body);
  case "do": return (this.canComplete(s.body)&&!(s.cond.k==="lit"&&s.cond.v===true))||this.hasBreak(s.body);
  case "for": return (s.cond&&!(s.cond.k==="lit"&&s.cond.v===true))||this.hasBreak(s.body);
  case "switch":
    if(!s.cases.some(function(c){return c.def})) return true;
    if(s.cases.some(function(c){return c.body.some(function(b){return self.hasBreak(b)})})) return true;
    if(s.arrow) return s.cases.some(function(c){ return c.body.length===0||self.canComplete(c.body[0]) });
    var last=s.cases[s.cases.length-1]; return last.body.length===0||this.canComplete({k:"block",body:last.body});
  default: return true;
  }
};
Cp.hasBreak=function(s){
  var self=this;
  if(!s) return false;
  switch(s.k){
  case "break": return true;
  case "block": return s.body.some(function(b){return self.hasBreak(b)});
  case "if": return this.hasBreak(s.then)||this.hasBreak(s.els);
  default: return false; // Schleifen/switch: break dort gehört zu ihnen
  }
};
Cp.assignable=function(t,s,e,line,narrowConst){
  if(t===s) return;
  if(s==="void") this.err("Hier wird ein Wert gebraucht, aber die Methode liefert keinen (void).",line);
  if(t==="String"&&s==="null") return;
  if(isNum(t)&&isNum(s)){
    if(s==="char"&&(t==="int"||t==="long"||t==="double")) return;
    if(s!=="char"&&t!=="char"&&RANK[s]<=RANK[t]&&!(s==="short"&&t==="char")) return;
    if(narrowConst&&(s==="int"||s==="char"||s==="short"||s==="byte")&&(t==="byte"||t==="short"||t==="char")){
      var cv=this.constVal(e);
      if(cv.ok){ var v=Number(cv.v), lo=t==="byte"?-128:t==="short"?-32768:0, hi=t==="byte"?127:t==="short"?32767:65535; if(v>=lo&&v<=hi) return; }
    }
    var tip=t==="int"||t==="long"||t==="char"||t==="byte"||t==="short"?" Tipp: mit ("+t+") umwandeln (Cast) – dann werden Nachkommastellen bzw. Bits abgeschnitten.":"";
    this.err("Inkompatible Typen: möglicher Verlust bei der Umwandlung von "+s+" in "+t+"."+tip,line);
  }
  if(s==="String"&&isNum(t)) this.err("Inkompatible Typen: Ein String (Text) kann nicht einfach in "+t+" gespeichert werden."+(t==="int"?" Tipp: Integer.parseInt(…) wandelt Text in eine ganze Zahl um.":t==="double"?" Tipp: Double.parseDouble(…) wandelt Text in eine Kommazahl um.":t==="char"?" Tipp: Mit text.charAt(0) bekommst du das erste Zeichen.":""),line);
  if(t==="String"&&isNum(s)) this.err("Inkompatible Typen: "+s+" kann nicht in String gespeichert werden. Tipp: \"\" + wert oder String.valueOf(wert) macht daraus Text.",line);
  if(t==="String"&&s==="char") this.err("Inkompatible Typen: char kann nicht in String gespeichert werden. Tipp: \"\" + zeichen oder String.valueOf(zeichen).",line);
  this.err("Inkompatible Typen: "+s+" kann nicht in "+t+" umgewandelt werden.",line);
};
Cp.call=function(e){
  var self=this, a=e.args, argT=function(){return a.map(function(x){return self.expr(x)})};
  function nArgs(n,sig){ if(a.length!==n) self.err(sig+" erwartet "+n+" Argument"+(n===1?"":"e")+", bekommt aber "+a.length+".",e.line) }
  function needNum(ts,sig){ ts.forEach(function(t,i){ if(!isNum(t)) self.err(sig+" braucht Zahlen als Argumente, bekommt aber "+t+".",e.line) }) }
  function needStr(t,sig){ if(t!=="String") self.err(sig+" braucht einen String (Text) als Argument, bekommt aber "+t+"."+(t==="char"?" Tipp: \"…\" statt '…'.":""),e.line) }
  if(e.obj===null){
    var m=this.prog.methods[e.name];
    if(!m){
      var low=e.name.toLowerCase(), sim=Object.keys(this.prog.methods).filter(function(n){return n.toLowerCase()===low})[0];
      if(e.name==="println"||e.name==="print"||e.name==="readln") this.err("Vor "+e.name+" fehlt IO. – richtig: IO."+e.name+"(…)",e.line);
      this.err("Die Methode "+e.name+"(…) gibt es nicht."+(sim?" Meintest du "+sim+"? (Groß-/Kleinschreibung zählt!)":""),e.line);
    }
    var ts=argT();
    if(ts.length!==m.params.length) this.err("Die Methode "+m.name+" erwartet "+m.params.length+" Argument"+(m.params.length===1?"":"e")+" ("+m.params.map(function(p){return p.type+" "+p.name}).join(", ")+"), bekommt aber "+ts.length+".",e.line);
    ts.forEach(function(t,i){ self.assignable(m.params[i].type,t,a[i],e.line,false) });
    e.bi="user"; e.m=m; return m.ret;
  }
  var cls=null;
  if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&STATIC[e.obj.n]) cls=e.obj.n;
  if(e.obj.k==="field"&&e.obj.obj.k==="name"&&e.obj.obj.n==="System"&&!this.lookup("System")){
    if(e.obj.name==="out"&&(e.name==="println"||e.name==="print")) cls="IO";
    else this.err("System."+e.obj.name+"."+e.name+" wird hier nicht unterstützt. Nimm IO.println(…).",e.line);
  }
  if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&!STATIC[e.obj.n]){
    if(/^[a-z]/.test(e.obj.n)) this.err("Die Variable '"+e.obj.n+"' gibt es nicht.",e.line);
    if(e.obj.n==="Io"||e.obj.n==="io") this.err("Es heißt IO (beide Buchstaben groß).",e.line);
    this.err("'"+e.obj.n+"' ist hier unbekannt.",e.line);
  }
  if(cls){
    var ts2, sig=cls+"."+e.name+"(…)";
    e.bi=cls+"."+e.name;
    switch(e.bi){
    case "IO.println": ts2=argT(); if(a.length>1) this.err("IO.println nimmt nur EIN Argument. Mehrere Teile verbindet man mit +, z. B. IO.println(\"x = \" + x);",e.line); if(ts2[0]==="void") this.err("Diese Methode liefert keinen Wert (void), den man ausgeben könnte.",e.line); e.at=ts2[0]; return "void";
    case "IO.print": ts2=argT(); nArgs(1,"IO.print"); if(a.length>1) this.err("IO.print nimmt nur EIN Argument. Verbinde mit +.",e.line); if(ts2[0]==="void") this.err("Diese Methode liefert keinen Wert (void).",e.line); e.at=ts2[0]; return "void";
    case "IO.readln": ts2=argT(); if(a.length>1) this.err("IO.readln nimmt höchstens ein Argument (den Fragetext).",e.line); if(a.length===1) needStr(ts2[0],"IO.readln"); return "String";
    case "Integer.parseInt": ts2=argT(); nArgs(1,"Integer.parseInt"); needStr(ts2[0],"Integer.parseInt"); return "int";
    case "Double.parseDouble": ts2=argT(); nArgs(1,"Double.parseDouble"); needStr(ts2[0],"Double.parseDouble"); return "double";
    case "Long.parseLong": ts2=argT(); nArgs(1,"Long.parseLong"); needStr(ts2[0],"Long.parseLong"); return "long";
    case "Boolean.parseBoolean": ts2=argT(); nArgs(1,"Boolean.parseBoolean"); needStr(ts2[0],"Boolean.parseBoolean"); return "boolean";
    case "Integer.toString": ts2=argT(); nArgs(1,sig); this.assignable("int",ts2[0],a[0],e.line,false); return "String";
    case "String.valueOf": ts2=argT(); nArgs(1,sig); if(ts2[0]==="void") this.err("void-Wert",e.line); e.at=ts2[0]; return "String";
    case "Math.max": case "Math.min": ts2=argT(); nArgs(2,sig); needNum(ts2,sig); e.pt=promote(ts2[0],ts2[1]); return e.pt;
    case "Math.abs": ts2=argT(); nArgs(1,sig); needNum(ts2,sig); e.pt=promote1(ts2[0]); return e.pt;
    case "Math.sqrt": case "Math.cbrt": case "Math.floor": case "Math.ceil": case "Math.sin": case "Math.cos": case "Math.tan": case "Math.log": case "Math.log10": case "Math.exp": ts2=argT(); nArgs(1,sig); needNum(ts2,sig); e.at=ts2[0]; return "double";
    case "Math.pow": case "Math.hypot": ts2=argT(); nArgs(2,sig); needNum(ts2,sig); e.ats=ts2; return "double";
    case "Math.random": nArgs(0,sig); return "double";
    case "Math.round": ts2=argT(); nArgs(1,sig); needNum(ts2,sig); e.at=ts2[0]; return "long";
    case "Character.isDigit": case "Character.isLetter": case "Character.isLetterOrDigit": case "Character.isUpperCase": case "Character.isLowerCase": case "Character.isWhitespace":
      ts2=argT(); nArgs(1,sig); this.assignable("char",ts2[0],a[0],e.line,false); return "boolean";
    case "Character.toUpperCase": case "Character.toLowerCase": ts2=argT(); nArgs(1,sig); this.assignable("char",ts2[0],a[0],e.line,false); return "char";
    case "Character.getNumericValue": ts2=argT(); nArgs(1,sig); this.assignable("char",ts2[0],a[0],e.line,false); return "int";
    }
    if(cls==="IO") this.err("IO."+e.name+" gibt es nicht. Es gibt IO.println, IO.print und IO.readln.",e.line);
    this.err(sig+" wird hier nicht unterstützt.",e.line);
  }
  var ot=this.expr(e.obj);
  if(ot!=="String"){
    if(e.name==="equals"&&isNum(ot)) this.err("Zahlen (primitive Typen wie "+ot+") haben keine Methoden. Vergleiche Zahlen mit ==.",e.line);
    this.err("Ein Wert vom Typ "+ot+" hat keine Methoden (nur Strings haben hier Methoden wie .length()).",e.line);
  }
  var t3=argT(); e.bi="S."+e.name; e.ats=t3;
  function sig2(n,types){ nArgs(n,"."+e.name+"(…)"); types.forEach(function(ty,i){ if(ty==="int") self.assignable("int",t3[i],a[i],e.line,false); else if(ty==="String"&&t3[i]!=="String"&&t3[i]!=="null") self.err("."+e.name+"(…) braucht einen String als Argument"+(t3[i]==="char"?" – nimm \"…\" statt '…'":"")+".",e.line) }) }
  switch(e.name){
  case "length": sig2(0,[]); return "int";
  case "charAt": sig2(1,["int"]); return "char";
  case "equals": case "equalsIgnoreCase": nArgs(1,"."+e.name); if(t3[0]!=="String"&&t3[0]!=="null") this.warn("Ein String ist nie gleich einem "+t3[0]+" – equals liefert hier immer false.",e.line); return "boolean";
  case "compareTo": case "compareToIgnoreCase": sig2(1,["String"]); return "int";
  case "contains": case "startsWith": case "endsWith": sig2(1,["String"]); return "boolean";
  case "isEmpty": case "isBlank": sig2(0,[]); return "boolean";
  case "toUpperCase": case "toLowerCase": case "trim": case "strip": sig2(0,[]); return "String";
  case "repeat": sig2(1,["int"]); return "String";
  case "substring": if(a.length===1) sig2(1,["int"]); else sig2(2,["int","int"]); return "String";
  case "indexOf": case "lastIndexOf":
    if(a.length<1||a.length>2) nArgs(1,"."+e.name);
    if(!(t3[0]==="String"||t3[0]==="char"||t3[0]==="int")) this.err("."+e.name+" braucht ein Zeichen oder einen String.",e.line);
    if(a.length===2) this.assignable("int",t3[1],a[1],e.line,false); return "int";
  case "replace": nArgs(2,".replace"); if(!((t3[0]==="char"&&t3[1]==="char")||(t3[0]==="String"&&t3[1]==="String"))) this.err(".replace braucht zwei Zeichen oder zwei Strings.",e.line); return "String";
  case "charAT": case "Length": case "lenght": break;
  }
  var hint=e.name==="lenght"?" Tippfehler? Es heißt length().":e.name==="size"?" Bei Strings heißt es length().":"";
  this.err("Die String-Methode ."+e.name+"(…) gibt es nicht (oder wird hier nicht unterstützt)."+hint,e.line);
};
Cp.expr=function(e,top){
  var t=this.expr0(e,top); e.ty=t; return t;
};
Cp.expr0=function(e,top){
  var self=this, lt, rt, v;
  switch(e.k){
  case "lit": if(e.ty==="int"||e.ty==="char") e.cv={ok:true,v:e.v,ty:e.ty}; return e.ty;
  case "name":
    v=this.lookup(e.n);
    if(!v){
      if(STATIC[e.n]) this.err(e.n+" alleine ist kein Wert. Gemeint ist wohl "+e.n+".… (mit Methode).",e.line);
      var all=[]; for(var i=0;i<this.scopes.length;i++) all=all.concat(Object.keys(this.scopes[i])); all=all.concat(Object.keys(this.fields));
      var sim=all.filter(function(n){return n.toLowerCase()===e.n.toLowerCase()})[0];
      if(e.n==="True"||e.n==="False"||e.n==="TRUE"||e.n==="FALSE") this.err("In Java schreibt man true und false klein.",e.line);
      if(e.n==="string") this.err("Der Typ heißt String (mit großem S).",e.line);
      this.err("Die Variable '"+e.n+"' gibt es nicht (cannot find symbol)."+(sim?" Meintest du "+sim+"? Groß-/Kleinschreibung zählt!":" Wurde sie deklariert (mit Typ, z. B. int "+e.n+" = …;)? Oder ist sie nur in einem anderen Block { } gültig?"),e.line);
    }
    e.vi=v; return v.ty;
  case "assign":
    v=this.lookup(e.target.n);
    if(!v) this.expr(e.target);
    e.target.ty=v.ty; e.target.vi=v;
    if(v.fin) this.err("'"+e.target.n+"' ist final (eine Konstante) und kann keinen neuen Wert bekommen.",e.line);
    rt=this.expr(e.e);
    if(e.op==="="){ this.assignable(v.ty,rt,e.e,e.line,true); }
    else {
      var bop=e.op.slice(0,-1);
      if(bop==="+"&&v.ty==="String"){ if(rt==="void") this.err("void-Wert",e.line); }
      else if(isNum(v.ty)&&isNum(rt)){ if((bop==="&"||bop==="|"||bop==="^"||bop==="<<"||bop===">>"||bop===">>>")&&!(isInt(v.ty)&&isInt(rt))) this.err("Der Operator "+e.op+" geht nur mit ganzen Zahlen.",e.line); e.pt=(bop==="<<"||bop===">>"||bop===">>>")?promote1(v.ty):promote(v.ty,rt); }
      else if(v.ty==="boolean"&&rt==="boolean"&&(bop==="&"||bop==="|"||bop==="^")) e.pt="boolean";
      else this.err("Der Operator "+e.op+" passt nicht zu den Typen "+v.ty+" und "+rt+".",e.line);
    }
    return v.ty;
  case "incdec":
    v=this.lookup(e.target.n); if(!v) this.expr(e.target);
    e.target.vi=v; e.target.ty=v.ty;
    if(!isNum(v.ty)) this.err(e.op+" geht nur mit Zahlen-Variablen, nicht mit "+v.ty+".",e.line);
    if(v.fin) this.err("'"+e.target.n+"' ist final (eine Konstante) und kann nicht verändert werden.",e.line);
    e.pt=promote1(v.ty); return v.ty;
  case "cast":
    lt=this.expr(e.e);
    if(isNum(e.ty)&&isNum(lt)) return e.ty;
    if(e.ty===lt) return e.ty;
    if(lt==="String") this.err("Ein String kann nicht mit ("+e.ty+") umgewandelt werden."+(e.ty==="int"?" Nimm Integer.parseInt(…).":e.ty==="double"?" Nimm Double.parseDouble(…).":""),e.line);
    this.err("("+e.ty+") geht nicht mit einem Wert vom Typ "+lt+".",e.line);
  case "un":
    lt=this.expr(e.e);
    if(e.op==="!"){ if(lt!=="boolean") this.err("! (nicht) geht nur mit true/false (boolean), nicht mit "+lt+".",e.line); return "boolean"; }
    if(e.op==="~"){ if(!isInt(lt)) this.err("~ geht nur mit ganzen Zahlen.",e.line); e.pt=promote1(lt); return e.pt; }
    if(!isNum(lt)) this.err("Vorzeichen "+e.op+" geht nur mit Zahlen, nicht mit "+lt+".",e.line);
    e.pt=promote1(lt); return e.pt;
  case "cond":
    lt=this.expr(e.c); if(lt!=="boolean") this.err("Vor dem ? muss eine Bedingung (boolean) stehen.",e.line);
    var at=this.expr(e.a), bt=this.expr(e.b);
    if(at===bt) return at;
    if(isNum(at)&&isNum(bt)) return promote(at,bt);
    if((at==="String"&&bt==="null")||(bt==="String"&&at==="null")) return "String";
    this.err("Beim Bedingungsoperator ?: müssen beide Ergebnisse denselben Typ haben ("+at+" vs. "+bt+").",e.line);
  case "bin": return this.binary(e);
  case "call": return this.call(e);
  case "field":
    if(e.obj.k==="name"&&!this.lookup(e.obj.n)){
      var key=e.obj.n+"."+e.name;
      var F=D({"Math.PI":"double","Math.E":"double","Integer.MAX_VALUE":"int","Integer.MIN_VALUE":"int","Long.MAX_VALUE":"long","Long.MIN_VALUE":"long","Double.MAX_VALUE":"double","Double.MIN_VALUE":"double","Character.MAX_VALUE":"char","Character.MIN_VALUE":"char"});
      if(F[key]){ e.fk=key; return F[key]; }
      if(key==="System.out") this.err("System.out alleine geht nicht – gemeint ist System.out.println(…). Einfacher: IO.println(…).",e.line);
    }
    var ot=this.expr(e.obj);
    if(ot==="String"&&(e.name==="length")) this.err("Bei Strings ist length eine Methode und braucht Klammern: "+(e.obj.n||"text")+".length()",e.line);
    this.err("."+e.name+" gibt es hier nicht"+(ot==="String"?" (fehlen die Klammern () für eine Methode?)":"")+".",e.line);
  case "switchx": return this.switchCheck(e,true);
  }
  this.err("Unbekannter Ausdruck",e.line);
};
Cp.binary=function(e){
  var op=e.op, lt=this.expr(e.l), rt=this.expr(e.r), self=this;
  function bad(extra){ self.err("Der Operator "+op+" passt nicht zu den Typen "+lt+" und "+rt+"."+(extra||""),e.line) }
  if(lt==="void"||rt==="void") this.err("Eine void-Methode liefert keinen Wert, mit dem man rechnen oder vergleichen kann.",e.line);
  switch(op){
  case "+":
    if(lt==="String"||rt==="String") return "String";
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return e.pt; }
    if(lt==="boolean"||rt==="boolean") bad(" Mit true/false kann man nicht rechnen.");
    bad();
  case "-": case "*": case "/": case "%":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return e.pt; }
    if(lt==="String"||rt==="String") bad(op==="-"?" Mit Text kann man nicht rechnen – nur + hängt Texte zusammen. Zahlen aus Text bekommst du mit Integer.parseInt(…).":" Mit Text kann man nicht rechnen. Zahlen aus Text bekommst du mit Integer.parseInt(…).");
    bad();
  case "<": case ">": case "<=": case ">=":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return "boolean"; }
    if(lt==="boolean"&&e.l.k==="bin"&&/^[<>]=?$/.test(e.l.op)) this.err("In Java kann man nicht a < x < b schreiben (wie in Mathe). Schreib stattdessen: a < x && x < b",e.line);
    if(lt==="String"||rt==="String") bad(" Strings vergleicht man mit .compareTo(…) bzw. auf Gleichheit mit .equals(…).");
    bad();
  case "==": case "!=":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); if(e.pt==="double") {} return "boolean"; }
    if(lt==="boolean"&&rt==="boolean"){ e.pt="boolean"; return "boolean"; }
    if((lt==="String"||lt==="null")&&(rt==="String"||rt==="null")){
      if(lt==="String"&&rt==="String") this.warn("Strings mit "+op+" zu vergleichen prüft nur, ob es dasselbe Objekt ist – nicht, ob der Text gleich ist! Für den Inhalt nimm "+(op==="!="?"!a.equals(b)":"a.equals(b)")+".",e.line);
      e.pt="ref"; return "boolean";
    }
    if(lt==="boolean"&&e.l.k==="bin"&&/^[<>]=?$/.test(e.l.op)) this.err("In Java kann man nicht a < x == b o. Ä. verketten. Verknüpfe einzelne Vergleiche mit &&.",e.line);
    if((lt==="String"&&rt==="char")||(lt==="char"&&rt==="String")) bad(" Ein Zeichen 'x' (char) ist kein String \"x\". Nimm bei Strings \"…\" und .equals(…).");
    bad(" Man kann nur Gleiches mit Gleichem vergleichen.");
  case "&&": case "||":
    if(lt==="boolean"&&rt==="boolean") return "boolean";
    bad(" "+op+" verknüpft zwei Bedingungen (true/false). Auf jeder Seite muss ein vollständiger Vergleich stehen, z. B. x > 1 "+op+" x < 10.");
  case "&": case "|": case "^":
    if(lt==="boolean"&&rt==="boolean"){ e.pt="boolean"; return "boolean"; }
    if(isInt(lt)&&isInt(rt)){ if(op==="^") this.warn("Achtung: ^ ist in Java NICHT „hoch“, sondern ein Bit-Operator (XOR). 2 ^ 3 ergibt 1! Für Potenzen: Math.pow(2, 3) oder 2 * 2 * 2.",e.line); e.pt=promote(lt,rt); return e.pt; }
    bad(op==="^"?" Achtung: ^ ist in Java NICHT „hoch“! Potenzen rechnet man mit Math.pow(a, b) oder a * a.":"");
  case "<<": case ">>": case ">>>":
    if(isInt(lt)&&isInt(rt)){ e.pt=promote1(lt); return e.pt; }
    bad();
  }
  bad();
};

/* ================= Interpreter ================= */
var TBREAK={k:"break"}, TCONT={k:"continue"};
function d2i(x){ if(isNaN(x)) return 0; if(x>=2147483647) return 2147483647; if(x<=-2147483648) return -2147483648; return Math.trunc(x) }
function d2l(x){ if(isNaN(x)) return 0n; if(x>=9223372036854775807) return 9223372036854775807n; if(x<=-9223372036854775808) return -9223372036854775808n; return BigInt(Math.trunc(x)) }
function conv(v,from,to){
  if(from===to||to===undefined) return v;
  switch(to){
  case "double": return typeof v==="bigint"?Number(v):v;
  case "long": if(from==="double") return d2l(v); return typeof v==="bigint"?v:BigInt(v);
  case "int": if(from==="double") return d2i(v); if(from==="long") return Number(BigInt.asIntN(32,v)); return v|0;
  case "short": return (conv(v,from,"int")<<16)>>16;
  case "byte": return (conv(v,from,"int")<<24)>>24;
  case "char": return conv(v,from,"int")&0xFFFF;
  default: return v;
  }
}
function str(v,ty){
  if(v===null||v===undefined) return "null";
  switch(ty){
  case "double": return jd(v);
  case "char": return String.fromCharCode(v);
  case "boolean": return v?"true":"false";
  default: return String(v);
  }
}
function disp(v,ty){ // für Variablenanzeige
  if(v===undefined) return undefined;
  if(ty==="char") return String.fromCharCode(v);
  if(ty==="long") return v.toString();
  if(ty==="String") return v===null?null:String(v);
  return v;
}
function Interp(prog,src,inputs,opts){
  this.prog=prog; this.src=src; this.inp=inputs.slice(); this.out=""; this.stdout=""; this.n=0;
  this.max=opts.maxSteps||300000; this.trace=opts.trace?[]:null; this.tmax=opts.traceMax||1500;
  this.frames=[]; this.globals={order:[],vars:Object.create(null)}; this.depth=0; this.line=1;
}
var Ip=Interp.prototype;
Ip.tick=function(line){ this.line=line; if(++this.n>this.max) throw new RErr("ZEIT",line) };
Ip.fail=function(msg,line){ throw new RErr(msg,line||this.line) };
Ip.top=function(){return this.frames[this.frames.length-1]};
Ip.scope=function(){var f=this.top();return f.scopes[f.scopes.length-1]};
Ip.push=function(){this.top().scopes.push({order:[],vars:Object.create(null)})};
Ip.pop=function(){this.top().scopes.pop()};
Ip.declare=function(n,ty,v,set){var s=this.frames.length?this.scope():this.globals; if(!(n in s.vars)) s.order.push(n); s.vars[n]={ty:ty,v:v,set:set}};
Ip.find=function(n){ var f=this.top(); if(f) for(var i=f.scopes.length-1;i>=0;i--){ var r=f.scopes[i].vars[n]; if(r) return r; } return this.globals.vars[n] };
Ip.srcOf=function(node){ return node&&node.p!=null?this.src.slice(node.p,node.q).replace(/\s+/g," "):"" };
Ip.snap=function(line,text){
  if(!this.trace) return;
  var fr=[], self=this;
  if(this.globals.order.length) fr.push({n:"Konstanten",vars:this.globals.order.map(function(k){var r=self.globals.vars[k];return [k,r.ty,r.set?disp(r.v,r.ty):undefined]})});
  this.frames.forEach(function(f){
    var vars=[]; f.scopes.forEach(function(s){ s.order.forEach(function(k){ var r=s.vars[k]; vars.push([k,r.ty,r.set?disp(r.v,r.ty):undefined]) }) });
    fr.push({n:f.name,vars:vars});
  });
  this.trace.push({l:line,x:text,o:this.out,f:fr});
  if(this.trace.length>=this.tmax) throw new RErr("TRACE",line);
};
Ip.fmtVal=function(v,ty){ return ty==="String"?(v===null?"null":"\""+String(v)+"\""):ty==="char"?"'"+String.fromCharCode(v)+"'":str(v,ty) };
Ip.write=function(s){ this.out+=s; this.stdout+=s; if(this.stdout.length>100000) this.fail("Es wird sehr viel ausgegeben – vermutlich eine Endlosschleife.") };
Ip.start=function(){
  var self=this, P=this.prog;
  P.fields.forEach(function(d){ self.execDecl(d) });
  this.invoke(P.methods.main,[],P.methods.main.line);
};
Ip.invoke=function(m,args,callLine){
  if(++this.depth>2500) this.fail("StackOverflowError: Die Methode "+m.name+" ruft sich (direkt oder indirekt) endlos selbst auf.",callLine);
  var f={name:m.name,scopes:[{order:[],vars:Object.create(null)}]}, self=this;
  this.frames.push(f);
  m.params.forEach(function(p,i){ self.declare(p.name,p.type,args[i],true) });
  if(this.trace){
    if(m.name==="main"&&this.frames.length===1) this.snap(m.line,"Das Programm startet bei **void main()**.");
    else this.snap(m.line,"Aufruf der Methode **"+m.name+"**"+(m.params.length?" – die Werte werden in die Parameter kopiert: "+m.params.map(function(p,i){return p.name+" = "+self.fmtVal(args[i],p.type)}).join(", "):"")+".");
  }
  var sig=this.execBlockBody(m.body.body), rv;
  if(sig&&sig.k==="ret") rv=sig.v;
  if(this.trace){
    if(m.name==="main"&&this.frames.length===1) this.snap(this.lastLineOf(m.body),"Ende von main – das Programm ist **fertig**.");
    else this.snap(sig&&sig.k==="ret"?sig.line:this.lastLineOf(m.body),m.ret==="void"?"Die Methode **"+m.name+"** ist fertig, zurück zum Aufrufer.":"**"+m.name+"** gibt "+this.fmtVal(rv,m.ret)+" zurück. Ihre Variablen verschwinden.");
  }
  this.frames.pop(); this.depth--;
  return rv;
};
Ip.lastLineOf=function(b){ var s=this.src.slice(0,b.q); return s.split("\n").length };
Ip.execBlockBody=function(list){
  for(var i=0;i<list.length;i++){ var sig=this.exec(list[i]); if(sig) return sig; }
  return null;
};
Ip.execScoped=function(s){ this.push(); try{ return this.exec(s) } finally{ this.pop() } };
Ip.execDecl=function(s){
  var self=this, parts=[];
  s.vars.forEach(function(v){
    self.tick(v.line);
    if(v.init){ var val=conv(self.eval(v.init),v.init.ty,v.ty); self.declare(v.name,v.ty,val,true); parts.push("**"+v.name+"** = "+self.fmtVal(val,v.ty)); }
    else { self.declare(v.name,v.ty,undefined,false); parts.push("**"+v.name+"** (noch ohne Wert)"); }
  });
  if(this.trace&&!s.field) this.snap(s.line,"Neue Variable"+(parts.length>1?"n":"")+" ("+s.vars[0].ty+"): "+parts.join(", ")+".");
};
Ip.exec=function(s){
  var self=this, sig, c;
  switch(s.k){
  case "block": this.push(); try{ return this.execBlockBody(s.body) } finally{ this.pop() }
  case "empty": return null;
  case "decl": this.execDecl(s); return null;
  case "expr":
    this.tick(s.line);
    var before=this.out;
    this.eval(s.e);
    if(this.trace) this.snap(s.line,this.explainExpr(s.e,before));
    return null;
  case "if":
    this.tick(s.line);
    c=this.eval(s.cond);
    if(this.trace) this.snap(s.line,"Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"der if-Teil wird ausgeführt.":s.els?"der else-Teil wird ausgeführt.":"der if-Teil wird übersprungen."));
    if(c) return this.execScoped(s.then);
    if(s.els) return this.execScoped(s.els);
    return null;
  case "while":
    while(true){
      this.tick(s.line);
      c=this.eval(s.cond);
      if(this.trace) this.snap(s.line,"Schleifen-Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"der Schleifenrumpf läuft (noch einmal).":"die Schleife ist zu Ende."));
      if(!c) return null;
      sig=this.execScoped(s.body);
      if(sig){ if(sig===TBREAK){ if(this.trace) this.snap(sig.line||s.line,"**break** – die Schleife wird sofort verlassen."); return null; } if(sig!==TCONT) return sig; }
    }
  case "do":
    while(true){
      this.tick(s.line);
      sig=this.execScoped(s.body);
      if(sig){ if(sig===TBREAK) return null; if(sig!==TCONT) return sig; }
      this.tick(s.cline);
      c=this.eval(s.cond);
      if(this.trace) this.snap(s.cline,"do-while-Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"zurück zu do, noch eine Runde.":"die Schleife ist zu Ende."));
      if(!c) return null;
    }
  case "for":
    this.push();
    try{
      s.init.forEach(function(x){ if(x.k==="decl") self.execDecl(x); else { self.tick(s.line); self.eval(x); if(self.trace) self.snap(s.line,"for-Start: `"+self.srcOf(x)+"`."); } });
      while(true){
        this.tick(s.line);
        c=s.cond?this.eval(s.cond):true;
        if(this.trace) this.snap(s.line,s.cond?"for-Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"der Schleifenrumpf läuft.":"die Schleife ist zu Ende."):"for ohne Bedingung – läuft immer weiter.");
        if(!c) return null;
        sig=this.execScoped(s.body);
        if(sig){ if(sig===TBREAK) return null; if(sig!==TCONT) return sig; }
        s.upd.forEach(function(x){ self.tick(s.line); self.eval(x); if(self.trace) self.snap(s.line,"for-Schritt `"+self.srcOf(x)+"` → "+self.explainChange(x)+"."); });
      }
    } finally { this.pop() }
  case "ret":
    this.tick(s.line);
    return {k:"ret",v:s.e?conv(this.eval(s.e),s.e.ty,s.rt):undefined,line:s.line};
  case "break": this.tick(s.line); TBREAK.line=s.line; return TBREAK;
  case "continue": this.tick(s.line); return TCONT;
  case "yield": this.tick(s.line); return {k:"yield",v:this.eval(s.e),ty:s.ty,line:s.line};
  case "switch": return this.execSwitch(s,false);
  }
  this.fail("Unbekannte Anweisung",s.line);
};
Ip.matchCase=function(s,v){
  var isStr=s.subjTy==="String", def=-1;
  for(var i=0;i<s.cases.length;i++){
    var c=s.cases[i]; if(c.def) def=i;
    for(var j=0;j<c.vals.length;j++){ if(isStr?(v!==null&&String(v)===c.vals[j]):v===c.vals[j]) return i; }
  }
  if(isStr&&v===null) this.fail("NullPointerException: switch über null.",s.line);
  return def;
};
Ip.execSwitch=function(s,isExpr){
  this.tick(s.line);
  var v=this.eval(s.subj), idx=this.matchCase(s,v), self=this;
  if(this.trace) this.snap(s.line,"switch mit dem Wert "+this.fmtVal(v,s.subjTy)+" → "+(idx<0?"kein passender case, kein default – nichts passiert.":s.cases[idx].def?"kein case passt, also springt Java zu **default**.":"springt zu dem passenden **case**."));
  if(idx<0){ if(isExpr) this.fail("Kein passender Fall im switch-Ausdruck.",s.line); return null; }
  this.push();
  try{
    if(s.arrow){
      var c=s.cases[idx];
      if(isExpr&&c.value){ this.tick(c.vline||c.line); var val=this.eval(c.value); return {k:"yield",v:val,ty:c.value.ty}; }
      for(var i=0;i<c.body.length;i++){ var sig=this.execScoped(c.body[i]); if(sig){ if(sig===TBREAK) return null; return sig; } }
      if(isExpr) this.fail("Der switch-Fall liefert keinen Wert (yield fehlt).",c.line);
      return null;
    }
    for(var k=idx;k<s.cases.length;k++){
      var sig2=this.execBlockBody(s.cases[k].body);
      if(sig2){ if(sig2===TBREAK){ if(this.trace) this.snap(sig2.line||s.line,"**break** – der switch wird verlassen."); return null; } return sig2; }
    }
    if(isExpr) this.fail("Der switch-Ausdruck liefert keinen Wert (yield fehlt).",s.line);
    return null;
  } finally { this.pop() }
};
Ip.explainChange=function(e){
  if(e.k==="assign"||e.k==="incdec"){ var r=this.find(e.target.n); return "**"+e.target.n+"** ist jetzt "+this.fmtVal(r.v,r.ty); }
  return "ausgeführt";
};
Ip.explainExpr=function(e,before){
  var s="`"+this.srcOf(e)+"`";
  if(e.k==="assign"||e.k==="incdec") return s+" → "+this.explainChange(e)+".";
  if(e.k==="call"){
    if(e.bi==="IO.println"||e.bi==="IO.print"){ var add=this.out.slice(before.length); return s+" → Ausgabe in die Konsole"+(e.bi==="IO.println"?" (mit Zeilenumbruch)":" (ohne Zeilenumbruch)")+"."; }
    if(e.bi==="user") return s+" → der Aufruf ist fertig.";
  }
  return s+" ausgeführt.";
};
Ip.read=function(line){
  if(!this.inp.length) this.fail("Dein Programm will noch eine Eingabe lesen (IO.readln), aber es gibt keine mehr. Liest du öfter ein als nötig?",line);
  var v=this.inp.shift(); this.out+="\u0001"+v+"\u0002\n"; return new String(v);
};
Ip.arith=function(op,a,b,pt,line){
  if(pt==="int"){
    switch(op){
    case "+": return (a+b)|0; case "-": return (a-b)|0; case "*": return Math.imul(a,b);
    case "/": if(b===0) this.fail("ArithmeticException: / by zero – Division durch 0 ist bei ganzen Zahlen nicht erlaubt.",line); return (a/b)|0;
    case "%": if(b===0) this.fail("ArithmeticException: / by zero – Rest bei Division durch 0 geht nicht.",line); return (a%b)|0;
    case "&": return a&b; case "|": return a|b; case "^": return a^b;
    case "<<": return a<<b; case ">>": return a>>b; case ">>>": return (a>>>b)|0;
    }
  } else if(pt==="long"){
    var r;
    switch(op){
    case "+": r=a+b; break; case "-": r=a-b; break; case "*": r=a*b; break;
    case "/": if(b===0n) this.fail("ArithmeticException: / by zero",line); r=a/b; break;
    case "%": if(b===0n) this.fail("ArithmeticException: / by zero",line); r=a%b; break;
    case "&": r=a&b; break; case "|": r=a|b; break; case "^": r=a^b; break;
    case "<<": r=a<<(BigInt(Number(b)&63)); break; case ">>": r=a>>(BigInt(Number(b)&63)); break; case ">>>": r=BigInt.asUintN(64,a)>>(BigInt(Number(b)&63)); break;
    }
    return BigInt.asIntN(64,r);
  } else if(pt==="double"){
    switch(op){ case "+": return a+b; case "-": return a-b; case "*": return a*b; case "/": return a/b; case "%": return a%b; }
  } else if(pt==="boolean"){
    switch(op){ case "&": return a&&b; case "|": return a||b; case "^": return a!==b; }
  }
  this.fail("Interner Fehler bei "+op,line);
};
Ip.eval=function(e){
  var self=this, r, a, b;
  switch(e.k){
  case "lit": return e.v;
  case "name":
    r=this.find(e.n);
    if(!r.set) this.fail("Die Variable '"+e.n+"' hat noch keinen Wert, wird hier aber gelesen. (Java meldet das schon beim Kompilieren: „Variable "+e.n+" wurde möglicherweise nicht initialisiert“.) Gib ihr bei der Deklaration einen Startwert.",e.line);
    return r.v;
  case "assign":
    r=this.find(e.target.n);
    if(e.op==="="){ var nv=conv(this.eval(e.e),e.e.ty,r.ty); r.v=nv; r.set=true; return nv; }
    if(!r.set) this.fail("Die Variable '"+e.target.n+"' hat noch keinen Wert – "+e.op+" braucht aber den alten Wert.",e.line);
    var cur=r.v; b=this.eval(e.e); var bop=e.op.slice(0,-1);
    if(bop==="+"&&r.ty==="String") r.v=new String(str(cur,"String")+str(b,e.e.ty));
    else r.v=conv(this.arith(bop,conv(cur,r.ty,e.pt),conv(b,e.e.ty,(bop==="<<"||bop===">>"||bop===">>>")?(e.e.ty==="long"?"long":"int"):e.pt),e.pt,e.line),e.pt,r.ty);
    return r.v;
  case "incdec":
    r=this.find(e.target.n);
    if(!r.set) this.fail("Die Variable '"+e.target.n+"' hat noch keinen Wert – "+e.op+" geht deshalb nicht.",e.line);
    var old=r.v, one=e.pt==="long"?1n:1;
    r.v=conv(this.arith(e.op==="++"?"+":"-",conv(old,r.ty,e.pt),one,e.pt,e.line),e.pt,r.ty);
    return e.prefix?r.v:old;
  case "cast": return conv(this.eval(e.e),e.e.ty,e.ty);
  case "un":
    a=this.eval(e.e);
    if(e.op==="!") return !a;
    a=conv(a,e.e.ty,e.pt);
    if(e.op==="+") return a;
    if(e.op==="~") return e.pt==="long"?BigInt.asIntN(64,~a):~a;
    return e.pt==="int"?(-a)|0:e.pt==="long"?BigInt.asIntN(64,-a):-a;
  case "cond": return this.eval(e.c)?conv(this.eval(e.a),e.a.ty,e.ty):conv(this.eval(e.b),e.b.ty,e.ty);
  case "bin":
    var op=e.op;
    if(op==="&&") return this.eval(e.l)&&this.eval(e.r);
    if(op==="||") return this.eval(e.l)||this.eval(e.r);
    a=this.eval(e.l); b=this.eval(e.r);
    if(op==="+"&&e.ty==="String") return new String(str(a,e.l.ty)+str(b,e.r.ty));
    if(op==="=="||op==="!="){
      var eq;
      if(e.pt==="ref"||e.pt==="boolean") eq=a===b;
      else eq=conv(a,e.l.ty,e.pt)===conv(b,e.r.ty,e.pt);
      return op==="=="?eq:!eq;
    }
    if(op==="<"||op===">"||op==="<="||op===">="){
      a=conv(a,e.l.ty,e.pt); b=conv(b,e.r.ty,e.pt);
      return op==="<"?a<b:op===">"?a>b:op==="<="?a<=b:a>=b;
    }
    if(op==="<<"||op===">>"||op===">>>") return this.arith(op,conv(a,e.l.ty,e.pt),conv(b,e.r.ty,e.r.ty==="long"?"long":"int"),e.pt,e.line);
    return this.arith(op,conv(a,e.l.ty,e.pt),conv(b,e.r.ty,e.pt),e.pt,e.line);
  case "field":
    switch(e.fk){ case "Math.PI": return Math.PI; case "Math.E": return Math.E; case "Integer.MAX_VALUE": return 2147483647; case "Integer.MIN_VALUE": return -2147483648;
      case "Long.MAX_VALUE": return 9223372036854775807n; case "Long.MIN_VALUE": return -9223372036854775808n; case "Double.MAX_VALUE": return Number.MAX_VALUE; case "Double.MIN_VALUE": return Number.MIN_VALUE; case "Character.MAX_VALUE": return 65535; case "Character.MIN_VALUE": return 0; }
    break;
  case "switchx":
    var sig=this.execSwitch(e,true);
    if(!sig||sig.k!=="yield") this.fail("Der switch-Ausdruck liefert keinen Wert.",e.line);
    return conv(sig.v,sig.ty,e.ty);
  case "call": return this.call(e);
  }
  this.fail("Unbekannter Ausdruck",e.line);
};
Ip.call=function(e){
  var self=this, A=e.args, av=function(i){return self.eval(A[i])};
  switch(e.bi){
  case "user":
    var vals=A.map(function(x,i){ return conv(self.eval(x),x.ty,e.m.params[i].type) });
    return this.invoke(e.m,vals,e.line);
  case "IO.println": this.write((A.length?str(av(0),e.at):"")+"\n"); return;
  case "IO.print": this.write(str(av(0),e.at)); return;
  case "IO.readln": if(A.length){ var pr=av(0); this.write(str(pr,"String")); } return this.read(e.line);
  case "Integer.parseInt": case "Long.parseLong":
    var s=av(0); if(s===null) this.fail("NumberFormatException: Cannot parse null string",e.line); s=String(s);
    var isL=e.bi==="Long.parseLong";
    if(!/^[+-]?\d+$/.test(s)) this.fail("NumberFormatException: For input string: \""+s+"\" – das ist keine ganze Zahl"+(/^\s|\s$/.test(s)?" (Leerzeichen am Rand zählen auch!)":/[.,]/.test(s)?" (Kommazahlen gehen mit parseInt nicht)":"")+".",e.line);
    if(isL){ var bl=BigInt(s); if(bl>9223372036854775807n||bl< -9223372036854775808n) this.fail("NumberFormatException: Zahl zu groß für long: \""+s+"\"",e.line); return bl; }
    var iv=parseInt(s,10); if(iv>2147483647||iv< -2147483648) this.fail("NumberFormatException: For input string: \""+s+"\" – zu groß für int (max. 2147483647).",e.line); return iv;
  case "Double.parseDouble":
    var ds=av(0); if(ds===null) this.fail("NullPointerException",e.line); ds=String(ds).trim();
    if(!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(ds)&&!/^[+-]?(NaN|Infinity)$/.test(ds)) this.fail("NumberFormatException: "+(ds?"For input string: \""+ds+"\"":"empty String")+" – keine Zahl"+(/,/.test(ds)?" (in Java mit Punkt statt Komma: 2.5)":"")+".",e.line);
    return parseFloat(ds.replace(/[dDfF]$/,""));
  case "Boolean.parseBoolean": var bs=av(0); return bs!==null&&String(bs).toLowerCase()==="true";
  case "Integer.toString": return new String(String(av(0)));
  case "String.valueOf": return new String(str(av(0),e.at));
  case "Math.max": case "Math.min":
    var x=conv(av(0),A[0].ty,e.pt), y=conv(av(1),A[1].ty,e.pt);
    if(e.pt==="double"&&(isNaN(x)||isNaN(y))) return NaN;
    return e.bi==="Math.max"?(x>=y?x:y):(x<=y?x:y);
  case "Math.abs": var ab=conv(av(0),A[0].ty,e.pt); return e.pt==="int"?(ab<0?(-ab)|0:ab):e.pt==="long"?(ab<0n?BigInt.asIntN(64,-ab):ab):Math.abs(ab);
  case "Math.sqrt": return Math.sqrt(conv(av(0),A[0].ty,"double"));
  case "Math.cbrt": return Math.cbrt(conv(av(0),A[0].ty,"double"));
  case "Math.floor": return Math.floor(conv(av(0),A[0].ty,"double"));
  case "Math.ceil": return Math.ceil(conv(av(0),A[0].ty,"double"));
  case "Math.sin": return Math.sin(conv(av(0),A[0].ty,"double"));
  case "Math.cos": return Math.cos(conv(av(0),A[0].ty,"double"));
  case "Math.tan": return Math.tan(conv(av(0),A[0].ty,"double"));
  case "Math.log": return Math.log(conv(av(0),A[0].ty,"double"));
  case "Math.log10": return Math.log10(conv(av(0),A[0].ty,"double"));
  case "Math.exp": return Math.exp(conv(av(0),A[0].ty,"double"));
  case "Math.pow": return Math.pow(conv(av(0),A[0].ty,"double"),conv(av(1),A[1].ty,"double"));
  case "Math.hypot": return Math.hypot(conv(av(0),A[0].ty,"double"),conv(av(1),A[1].ty,"double"));
  case "Math.random": return Math.random();
  case "Math.round": var rd=conv(av(0),A[0].ty,"double"); return d2l(Math.floor(rd+0.5));
  case "Character.isDigit": var cd=av(0); return cd>=48&&cd<=57||/\p{Nd}/u.test(String.fromCharCode(cd));
  case "Character.isLetter": return /\p{L}/u.test(String.fromCharCode(av(0)));
  case "Character.isLetterOrDigit": return /[\p{L}\p{Nd}]/u.test(String.fromCharCode(av(0)));
  case "Character.isUpperCase": return /\p{Lu}/u.test(String.fromCharCode(av(0)));
  case "Character.isLowerCase": return /\p{Ll}/u.test(String.fromCharCode(av(0)));
  case "Character.isWhitespace": var cw=av(0); return cw===32||(cw>=9&&cw<=13)||(cw>=28&&cw<=31);
  case "Character.toUpperCase": var cu=String.fromCharCode(av(0)).toUpperCase(); return cu.length===1?cu.charCodeAt(0):av(0);
  case "Character.toLowerCase": var cl=String.fromCharCode(av(0)).toLowerCase(); return cl.length===1?cl.charCodeAt(0):av(0);
  case "Character.getNumericValue": var cn=av(0); if(cn>=48&&cn<=57) return cn-48; if(cn>=65&&cn<=90) return cn-55; if(cn>=97&&cn<=122) return cn-87; return -1;
  }
  // String-Methoden
  var o=this.eval(e.obj);
  if(o===null) this.fail("NullPointerException: Methode ."+e.name+"() auf null aufgerufen.",e.line);
  var S=String(o), args=A.map(function(x){return self.eval(x)}), t=e.ats;
  function idx(i,max,what){ if(i<0||i>max) self.fail("StringIndexOutOfBoundsException: "+what,e.line) }
  switch(e.name){
  case "length": return S.length;
  case "charAt": idx(args[0],S.length-1,"Index "+args[0]+" gibt es nicht – \""+S+"\" hat "+S.length+" Zeichen, erlaubt sind 0 bis "+(S.length-1)+"."); return S.charCodeAt(args[0]);
  case "equals": return args[0]!==null&&t[0]==="String"&&S===String(args[0]);
  case "equalsIgnoreCase": return args[0]!==null&&t[0]==="String"&&S.toLowerCase()===String(args[0]).toLowerCase();
  case "compareTo": case "compareToIgnoreCase":
    var x2=S, y2=String(args[0]); if(e.name==="compareToIgnoreCase"){x2=x2.toLowerCase();y2=y2.toLowerCase()}
    for(var i=0;i<Math.min(x2.length,y2.length);i++) if(x2.charCodeAt(i)!==y2.charCodeAt(i)) return x2.charCodeAt(i)-y2.charCodeAt(i);
    return x2.length-y2.length;
  case "contains": return S.indexOf(String(args[0]))>=0;
  case "startsWith": return S.indexOf(String(args[0]))===0;
  case "endsWith": var sf=String(args[0]); return S.length>=sf.length&&S.slice(S.length-sf.length)===sf;
  case "isEmpty": return S.length===0;
  case "isBlank": return S.trim().length===0;
  case "toUpperCase": return new String(S.toUpperCase());
  case "toLowerCase": return new String(S.toLowerCase());
  case "trim": return new String(S.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g,""));
  case "strip": return new String(S.trim());
  case "repeat": if(args[0]<0) this.fail("IllegalArgumentException: count is negative",e.line); return new String(S.repeat(args[0]));
  case "substring":
    var b0=args[0], e0=args.length>1?args[1]:S.length;
    if(b0<0||e0>S.length||b0>e0) this.fail("StringIndexOutOfBoundsException: substring("+b0+(args.length>1?", "+e0:"")+") passt nicht zu \""+S+"\" (Länge "+S.length+").",e.line);
    return new String(S.substring(b0,e0));
  case "indexOf": case "lastIndexOf":
    var needle=t[0]==="String"?String(args[0]):String.fromCharCode(args[0]);
    if(e.name==="indexOf") return args.length>1?S.indexOf(needle,Math.max(0,args[1])):S.indexOf(needle);
    return args.length>1?(args[1]<0?-1:S.lastIndexOf(needle,args[1])):S.lastIndexOf(needle);
  case "replace":
    var from=t[0]==="char"?String.fromCharCode(args[0]):String(args[0]), to=t[1]==="char"?String.fromCharCode(args[1]):String(args[1]);
    return new String(S.split(from).join(to));
  }
  this.fail("Unbekannte Methode "+e.name,e.line);
};

/* ================= API ================= */
function compile(src){
  try{
    var toks=lex(src), prog=new Parser(toks,src).program();
    var c=new Checker(prog).run();
    if(c.errors.length) return {errors:c.errors.sort(function(a,b){return a.line-b.line}),warnings:c.warnings};
    return {errors:[],warnings:c.warnings,prog:prog,src:src};
  }catch(e){ if(e instanceof CErr) return {errors:[{msg:e.msg,line:e.line}],warnings:[]}; throw e; }
}
function run(comp,inputs,opts){
  opts=opts||{};
  var I=new Interp(comp.prog,comp.src,inputs||[],opts), res={out:"",stdout:"",error:null,timeout:false,steps:null};
  try{ I.start() }
  catch(e){
    if(!(e instanceof RErr)) throw e;
    if(e.msg==="ZEIT"){ res.timeout=true; res.error={msg:"Das Programm läuft zu lange (über "+I.max+" Schritte) – vermutlich eine Endlosschleife. Prüfe, ob sich die Schleifen-Bedingung irgendwann ändert.",line:e.line}; }
    else if(e.msg==="TRACE"){ res.cut=true; }
    else res.error={msg:e.msg,line:e.line};
    if(I.trace&&!res.cut) I.trace.push({l:e.line,x:res.timeout?"**Angehalten:** zu viele Schritte – wahrscheinlich eine Endlosschleife.":"**Absturz:** "+e.msg,o:I.out,f:I.trace.length?I.trace[I.trace.length-1].f:[],err:!res.timeout,stop:res.timeout});
    if(I.trace&&res.cut) I.trace.push({l:e.line,x:"**Angehalten** nach "+I.tmax+" Schritten (die Anzeige ist hier begrenzt).",o:I.out,f:I.trace[I.trace.length-1].f,stop:true});
  }
  res.out=I.out; res.stdout=I.stdout; res.steps=I.trace;
  return res;
}
window.MJ={compile:compile,run:run,jd:jd};
})();
