/* Mini-Java: ein kleiner Java-Interpreter für den Browser (Teilmenge von Java 25, kompakte Syntax)
   Unterstützt: void main(), eigene Methoden, Konstanten/Felder, int long double boolean char byte short String var,
   if/else, while, do-while, for, switch (alt und neu, auch als Ausdruck mit yield), break/continue/return,
   alle Operatoren, Casts, IO.println/print/readln (auch System.out), Integer/Double/Math/Character/String-Methoden.
   Arrays (auch mehrdimensional, for-each, Arrays.toString/sort/fill/copyOf/equals), Klassen mit Feldern, Konstruktoren,
   this/super, static, Vererbung (extends), abstract, Interfaces (implements), Überschreiben (@Override), Überladen,
   Polymorphismus (dynamisches Binden), instanceof (auch mit Muster), Casts, toString/equals.
   Fehlermeldungen auf Deutsch. Nicht unterstützt: Generics/ArrayList, Exceptions (try/catch), enum, record, innere anonyme Klassen. */
(function(){
"use strict";
var KW=Object.create(null);"void int long double float boolean char byte short final if else while for do return break continue switch case default yield true false null new var class public private protected static abstract interface extends implements this super instanceof".split(" ").forEach(function(w){KW[w]=1});
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
function Parser(toks,src){
  this.k=toks;this.i=0;this.src=src;this.cn=Object.create(null);
  for(var j=0;j+1<toks.length;j++) if(toks[j].t==="kw"&&(toks[j].v==="class"||toks[j].v==="interface")&&toks[j+1].t==="id") this.cn[toks[j+1].v]=1;
}
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
var LISTS=D({ArrayList:1,List:1,LinkedList:1,HashMap:1,Map:1,HashSet:1,Set:1,Integer:1,Double:1,Character:1,Boolean:1,Long:1});
Pp.isTypeName=function(v){ return v==="String"||v==="Object"||!!this.cn[v] };
Pp.dims=function(){ var d=""; while(this.is("[")&&this.is("]",1)){ this.i+=2; d+="[]"; } return d; };
Pp.tryType=function(){ // gibt Typ zurück oder null (ohne zu verbrauchen, wenn kein Typ)
  var t=this.peek();
  if(t.t==="kw"&&(PRIM[t.v]||t.v==="void"||t.v==="var")){
    if(t.v==="float") throw new CErr("float wird hier nicht unterstützt – nimm double.",t.line);
    this.i++; var d=this.dims();
    if(d&&(t.v==="void"||t.v==="var")) throw new CErr(t.v+"[] gibt es nicht. Schreib den Elementtyp, z. B. int[].",t.line);
    if(this.is("[")) throw new CErr("Beim Typ eines Arrays stehen nur leere Klammern: int[] a = new int[5]; (die Größe kommt erst nach new).",t.line);
    return t.v+d;
  }
  if(t.t==="id"&&this.isTypeName(t.v)){
    if(this.is("<",1)) throw new CErr("Generics (<…>) werden hier nicht unterstützt.",t.line);
    if(this.peek(1).t==="id"||(this.is("[",1)&&this.is("]",2))){ this.i++; var d2=this.dims(); if(this.is("[")) throw new CErr("Beim Typ eines Arrays stehen nur leere Klammern: "+t.v+"[] a = new "+t.v+"[5];",t.line); return t.v+d2; }
    return null;
  }
  if(t.t==="id"&&(this.peek(1).t==="id"||this.is("<",1)||(this.is("[",1)&&this.is("]",2)))){
    if(t.v==="Scanner") throw new CErr("Scanner brauchst du hier nicht. Eingaben liest man mit IO.readln().",t.line);
    if(LISTS[t.v]) throw new CErr(t.v+" (Listen/Wrapper-Klassen als Typ) wird in diesem Trainer nicht unterstützt – nimm ein Array bzw. den primitiven Typ.",t.line);
    if(t.v==="string") throw new CErr("Der Typ heißt String (mit großem S).",t.line);
    throw new CErr("Unbekannter Typ '"+t.v+"'. Erlaubt sind int, long, double, boolean, char, byte, short, String, var, Arrays davon und eigene Klassen (class "+t.v+" { … } muss es dann geben).",t.line);
  }
  return null;
};
Pp.isDeclStart=function(){
  var t=this.peek();
  if(t.t==="kw"&&(t.v==="final"||PRIM[t.v]||t.v==="var")) return true;
  if(t.t==="id"&&this.peek(1).t==="id") return true;
  if(t.t==="id"&&this.is("[",1)&&this.is("]",2)) return true;
  if(t.t==="id"&&this.is("<",1)&&/^[A-Z]/.test(t.v)&&this.peek(2).t==="id"&&(this.is(">",3)||this.is(",",3))) return true;
  return false;
};
Pp.program=function(){
  var methods=Object.create(null),funcs=[],fields=[],classes=[];
  while(this.peek().t!=="eof"){
    var t=this.peek();
    if(t.t==="id"&&t.v==="import"){ while(!this.is(";")&&this.peek().t!=="eof") this.next(); this.expect(";"); continue; }
    if(t.t==="id"&&t.v==="package") throw new CErr("package brauchst du hier nicht.",t.line);
    if(this.is("}")) throw new CErr("Diese } ist zu viel – zu ihr gibt es keine öffnende {.",t.line);
    var mb=this.member(null);
    if(mb.kind==="class") classes.push(mb.c);
    else if(mb.kind==="method"){ var m=mb.m; (methods[m.name]=methods[m.name]||[]).push(m); funcs.push(m); }
    else fields.push(mb.d);
  }
  return {methods:methods,funcs:funcs,fields:fields,classes:classes};
};
Pp.params=function(){
  this.expect("("); var params=[];
  if(!this.is(")")){
    do{ this.accept("final"); var pl=this.peek().line, pt=this.tryType(); if(!pt||pt==="void"||pt==="var") throw new CErr("Parameter brauchen einen Typ, z. B. (int a, int b) oder (int[] werte).",pl); if(this.is(".")) throw new CErr("Varargs (…) werden hier nicht unterstützt – nimm ein Array als Parameter.",pl); params.push({name:this.ident("Parameter").v,type:pt,line:pl}); }while(this.accept(","));
  }
  this.expect(")");
  return params;
};
Pp.member=function(cls){
  var mods=Object.create(null), ann=[];
  while(true){
    if(this.is("@")){ this.next(); ann.push(this.ident("Annotation").v); continue; }
    if(this.is("public")||this.is("private")||this.is("protected")||this.is("static")||this.is("final")||this.is("abstract")){ var mt=this.next(); if(mods[mt.v]) throw new CErr("Der Modifizierer "+mt.v+" steht doppelt da.",mt.line); mods[mt.v]=1; continue; }
    break;
  }
  var t=this.peek(), start=this.i;
  if(this.is("class")||this.is("interface")){
    if(cls) throw new CErr("Klassen innerhalb von Klassen werden hier nicht unterstützt. Schreib jede Klasse für sich, außerhalb der anderen.",t.line);
    return {kind:"class",c:this.classDecl(mods)};
  }
  if(t.t==="id"&&(t.v==="enum"||t.v==="record")) throw new CErr(t.v+" wird in diesem Trainer nicht unterstützt – nimm eine normale class.",t.line);
  if(this.is("default")&&cls&&cls.iface) throw new CErr("default-Methoden in Interfaces werden hier nicht unterstützt.",t.line);
  var acc=mods["private"]?0:mods["protected"]?2:mods["public"]?3:1;
  if(cls&&t.t==="id"&&t.v===cls.name&&this.is("(",1)){
    if(cls.iface) throw new CErr("Ein Interface hat keinen Konstruktor.",t.line);
    if(mods["static"]||mods["abstract"]||mods["final"]) throw new CErr("Ein Konstruktor darf nicht static, abstract oder final sein.",t.line);
    this.next(); var cp=this.params();
    if(!this.is("{")) throw new CErr("Nach dem Konstruktorkopf muss ein Rumpf in { } folgen.",this.peek().line);
    return {kind:"ctor",m:{name:cls.name,ctor:true,ret:"void",params:cp,body:this.block(),line:t.line,acc:acc,ann:ann}};
  }
  var ty=this.tryType();
  if(!ty){
    if(t.t==="id"&&this.is("(",1)) throw new CErr(cls?"Vor '"+t.v+"(…)' fehlt der Rückgabetyp (z. B. void oder int). Falls das ein Konstruktor sein soll: Er muss genau so heißen wie die Klasse ("+cls.name+").":"Vor dem Methodennamen '"+t.v+"' fehlt der Rückgabetyp, z. B. void "+t.v+"(…) oder int "+t.v+"(…).",t.line);
    if(cls&&t.t!=="eof"&&!this.is("}")) throw new CErr("Unerwartet: "+this.desc(t)+". In einer Klasse stehen nur Felder, Konstruktoren und Methoden – Anweisungen gehören in eine Methode.",t.line);
    if(t.t==="id"||t.t==="kw") throw new CErr("Unerwartet: "+this.desc(t)+". Anweisungen müssen innerhalb einer Methode stehen, z. B. in void main() { … }.",t.line);
    throw new CErr("Unerwartet: "+this.desc(t)+". Hier sollte eine Methode wie void main() { … } beginnen.",t.line);
  }
  var nameTok=this.ident(ty==="void"?"Methode":"Methode oder Variable");
  if(this.is("(")){
    var params=this.params(), body=null, abs=!!mods["abstract"]||(cls&&cls.iface&&!mods["static"]);
    if(abs){
      if(this.is("{")) throw new CErr(cls&&cls.iface?"Methoden in einem Interface haben hier keinen Rumpf – nur den Kopf mit ; am Ende.":"Eine abstract-Methode hat keinen Rumpf: nur der Kopf mit ; am Ende.",this.peek().line);
      this.expect(";"," Eine abstrakte Methode endet mit ; (ohne Rumpf).");
    } else {
      if(!this.is("{")) throw new CErr("Nach dem Methodenkopf muss ein Rumpf in { } folgen."+(this.is(";")?" (Kein ; nach der Klammer – außer bei abstract-Methoden.)":""),this.peek().line);
      body=this.block();
    }
    return {kind:"method",m:{name:nameTok.v,ret:ty,params:params,body:body,line:nameTok.line,stat:!!mods["static"],abs:abs,acc:cls&&cls.iface?3:acc,ann:ann,fin:!!mods["final"]}};
  }
  if(ty==="void") throw new CErr("void gibt es nur bei Methoden. Nach "+nameTok.v+" fehlt ( ).",nameTok.line);
  if(mods["abstract"]) throw new CErr("Felder können nicht abstract sein.",nameTok.line);
  var iff=cls&&cls.iface;
  var d=this.declRest(ty,!!mods["final"]||iff,nameTok,start); this.expect(";"); d.field=true; d.stat=!!mods["static"]||iff; d.acc=acc;
  return {kind:"field",d:d};
};
Pp.classDecl=function(mods){
  var kt=this.next(), iface=kt.v==="interface", nt=this.ident(iface?"Interface":"Klasse");
  if(/^[a-z]/.test(nt.v)) {} // erlaubt, aber unüblich
  var c={name:nt.v,iface:iface,abs:iface||!!mods["abstract"],sup:null,ifaces:[],fields:[],methods:[],ctors:[],line:nt.line,fin:!!mods["final"]};
  if(this.accept("extends")){
    if(iface){ do{ c.ifaces.push({n:this.ident("Interface").v,line:this.prevLine()}); }while(this.accept(",")); }
    else { c.sup=this.ident("Oberklasse").v; c.supLine=this.prevLine(); if(this.is(",")) throw new CErr("Eine Klasse kann nur von EINER Klasse erben (extends). Für mehrere Typen gibt es Interfaces (implements).",this.peek().line); }
  }
  if(this.is("implements")){ var il=this.next().line; if(iface) throw new CErr("Ein Interface erweitert andere Interfaces mit extends, nicht mit implements.",il); do{ c.ifaces.push({n:this.ident("Interface").v,line:this.prevLine()}); }while(this.accept(",")); }
  if(this.is("extends")) throw new CErr("extends muss vor implements stehen: class A extends B implements C",this.peek().line);
  if(this.is("<")) throw new CErr("Generische Klassen (<T>) werden hier nicht unterstützt.",this.peek().line);
  var l=this.expect("{"," Nach dem Klassenkopf kommt der Klassenrumpf in { }.").line;
  while(!this.is("}")){
    if(this.peek().t==="eof") throw new CErr("Es fehlt eine schließende geschweifte Klammer }. Die { der Klasse "+c.name+" (Zeile "+l+") wird nie geschlossen.",this.prevLine());
    if(this.accept(";")) continue;
    var mb=this.member(c);
    if(mb.kind==="field") c.fields.push(mb.d);
    else if(mb.kind==="ctor") c.ctors.push(mb.m);
    else c.methods.push(mb.m);
  }
  this.next();
  return c;
};
Pp.arrInit=function(){
  var st=this.i, l=this.expect("{").line, el=[];
  while(!this.is("}")){
    el.push(this.is("{")?this.arrInit():this.expr());
    if(!this.accept(",")) break;
  }
  this.expect("}"," Die Werte im Array-Literal werden mit Kommas getrennt: {1, 2, 3}");
  return this.span({k:"arrlit",elems:el,line:l},st);
};
Pp.declRest=function(ty,fin,firstTok,start){
  var vars=[], nt=firstTok;
  while(true){
    var init=null;
    var vd=this.dims();
    if(this.is("[")) throw new CErr("Die Größe eines Arrays legt man mit new fest: "+ty+"[] "+nt.v+" = new "+ty+"[5];",nt.line);
    if(this.accept("=")) init=this.is("{")?this.arrInit():this.expr();
    vars.push({name:nt.v,init:init,line:nt.line,dims:vd});
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
    var init=[];
    if(!this.is(";")){
      if(this.isDeclStart()){
        var is=this.i, fin=this.accept("final"), ty=this.tryType(), vt=this.ident("Variable");
        if(this.is(":")){ this.next(); var it=this.expr(); this.expect(")"); return this.span({k:"foreach",ty:ty,fin:fin,name:vt.v,vline:vt.line,iter:it,body:this.stmt(),line:t.line},st); }
        init.push(this.declRest(ty,fin,vt,is));
      }
      else { do{ init.push(this.exprStmtExpr()); }while(this.accept(",")); }
    }
    if(this.is(":")) throw new CErr("Bei der for-each-Schleife braucht die Variable einen Typ: for (int x : werte)",t.line);
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
  if((this.is("this")||this.is("super"))&&this.is("(",1)){ this.next(); var ca=this.args(); this.expect(";"); return this.span({k:"ctorcall",which:t.v,args:ca,line:t.line},st); }
  if(this.is("class")||this.is("interface")) throw new CErr("Eine Klasse darf nicht innerhalb einer Methode stehen. Schreib class … { } außerhalb von main.",t.line);
  if((t.t==="id"&&this.isTypeName(t.v)||t.t==="kw"&&PRIM[t.v])&&this.is("[",1)&&!this.is("]",2)){
    var j=2, dep=1; while(dep>0&&this.peek(j).t!=="eof"){ if(this.is("[",j)) dep++; else if(this.is("]",j)) dep--; j++; }
    if(this.peek(j).t==="id") throw new CErr("Ein Array deklariert man so: "+t.v+"[] "+this.peek(j).v+" = new "+t.v+"[größe]; – die Größe steht erst nach new.",t.line);
  }
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
  if(!(e.k==="assign"||e.k==="incdec"||e.k==="call"||e.k==="new")){
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
      else if(isExpr){ var ex=this.expr(); this.expect(";"); c.value=ex; c.body=[]; c.vline=bt.line; }
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
function isLv(e){ return e.k==="name"||e.k==="index"||e.k==="field" }
Pp.expr=function(){
  var st=this.i, l=this.ternary(), t=this.peek();
  if(t.t==="op"&&ASSIGN[t.v]){
    this.next();
    if(!isLv(l)||l.paren){ throw new CErr("Links von "+t.v+" muss eine Variable (oder ein Array-Element a[i] bzw. ein Feld obj.x) stehen."+(t.v==="="&&(l.k==="bin"||l.k==="un")?" Für einen Vergleich nimm == (zwei Gleichheitszeichen).":""),t.line); }
    var r=this.is("{")&&t.v==="="?this.arrInit():this.expr();
    return this.span({k:"assign",op:t.v,target:l,e:r,line:t.line},st);
  }
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
    if(t.t==="kw"&&t.v==="instanceof"){
      if(PREC["<"]<min) break;
      this.next(); var tt=this.peek(), ity=this.tryType();
      if(!ity&&tt.t==="id"&&this.isTypeName(tt.v)){ this.next(); ity=tt.v+this.dims(); }
      if(!ity||PRIM[ity]||ity==="var") throw new CErr("Nach instanceof muss eine Klasse stehen, z. B. x instanceof Hund.",tt.line);
      var bind=null; if(this.peek().t==="id"){ bind=this.next(); }
      l=this.span({k:"instof",e:l,tt:ity,bind:bind?bind.v:null,line:t.line},st);
      continue;
    }
    if(t.t!=="op"||!PREC[t.v]||PREC[t.v]<min) break;
    this.next();
    var r=this.bin(PREC[t.v]+1);
    l=this.span({k:"bin",op:t.v,l:l,r:r,line:t.line},st);
  }
  return l;
};
Pp.startsOperand=function(o){ var t=this.peek(o); return t.t==="id"||t.t==="num"||t.t==="str"||t.t==="chr"||(t.t==="kw"&&(t.v==="this"||t.v==="new"||t.v==="null"||t.v==="super"||t.v==="true"||t.v==="false"))||(t.t==="op"&&t.v==="(") };
Pp.unary=function(){
  var t=this.peek(), st=this.i;
  if(t.t==="op"&&(t.v==="!"||t.v==="-"||t.v==="+"||t.v==="~")){
    this.next();
    if(t.v==="-"&&this.peek().t==="num"&&this.peek().big){ this.next(); return this.span({k:"lit",ty:"int",v:-2147483648,line:t.line,neg:true},st); }
    return this.span({k:"un",op:t.v,e:this.unary(),line:t.line},st);
  }
  if(t.t==="op"&&(t.v==="++"||t.v==="--")){ this.next(); var tg=this.unary(); if(!isLv(tg)) throw new CErr(t.v+" geht nur mit einer Variablen.",t.line); return this.span({k:"incdec",op:t.v,prefix:true,target:tg,line:t.line},st); }
  if(this.is("(")&&this.peek(1).t==="kw"&&PRIM[this.peek(1).v]&&this.is(")",2)){
    this.next(); var ct=this.next().v; this.next();
    if(ct==="float") throw new CErr("float wird hier nicht unterstützt – nimm double.",t.line);
    return this.span({k:"cast",ty:ct,e:this.unary(),line:t.line},st);
  }
  if(this.is("(")&&this.peek(1).t==="id"&&this.isTypeName(this.peek(1).v)){
    var j=2; while(this.is("[",j)&&this.is("]",j+1)) j+=2;
    if(this.is(")",j)&&this.startsOperand(j+1)){
      this.next(); var cn=this.next().v; var cd=this.dims(); this.next();
      return this.span({k:"cast",ty:cn+cd,e:this.unary(),line:t.line},st);
    }
  }
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
    } else if(this.is("[")){
      var bl=this.next().line;
      if(this.is("]")) throw new CErr("In den [ ] fehlt der Index, z. B. a[0] oder a[i].",bl);
      var ix=this.expr(); this.expect("]"," Nach dem Index kommt ]");
      e=this.span({k:"index",obj:e,idx:ix,line:bl},st);
    }
    else break;
  }
  while(this.is("++")||this.is("--")){ var ot=this.next(); if(!isLv(e)) throw new CErr(ot.v+" geht nur mit einer Variablen.",ot.line); e=this.span({k:"incdec",op:ot.v,prefix:false,target:e,line:ot.line},st); }
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
  if(this.is("this")){ this.next(); return this.span({k:"this",line:t.line},st); }
  if(this.is("super")){ this.next(); if(!this.is(".")) throw new CErr("Nach super kommt entweder (…) für den Konstruktor der Oberklasse (als erste Anweisung im Konstruktor) oder .methode(…).",t.line); return this.span({k:"super",line:t.line},st); }
  if(this.is("new")){
    this.next(); var bt=this.peek(), base;
    if(bt.t==="kw"&&PRIM[bt.v]){ if(bt.v==="float") throw new CErr("float wird hier nicht unterstützt – nimm double.",bt.line); base=bt.v; }
    else if(bt.t==="id"&&this.isTypeName(bt.v)) base=bt.v;
    else if(bt.t==="id"){
      if(bt.v==="Scanner") throw new CErr("Scanner brauchst du hier nicht. Eingaben liest man mit IO.readln().",bt.line);
      if(LISTS[bt.v]) throw new CErr(bt.v+" wird in diesem Trainer nicht unterstützt – nimm ein Array.",bt.line);
      throw new CErr("Die Klasse '"+bt.v+"' gibt es nicht. Für new "+bt.v+"(…) brauchst du class "+bt.v+" { … }.",bt.line);
    }
    else throw new CErr("Nach new kommt ein Typ, z. B. new int[5] oder new Hund(…).",bt.line);
    this.next();
    if(this.is("<")) throw new CErr("Generics (<…>) werden hier nicht unterstützt.",bt.line);
    if(this.is("[")){
      var sizes=[], empty=0;
      while(this.is("[")){
        var lb=this.next().line;
        if(this.is("]")){ this.next(); empty++; }
        else { if(empty) throw new CErr("Bei new müssen zuerst die Größen kommen, leere [] nur am Ende: new int[3][].",lb); sizes.push(this.expr()); this.expect("]"); }
      }
      var aty=base+new Array(sizes.length+empty+1).join("[]");
      if(!sizes.length){
        if(!this.is("{")) throw new CErr("Bei new "+base+"[] fehlt die Größe, z. B. new "+base+"[5], oder die Werte: new "+base+"[]{…}.",bt.line);
        var ai=this.arrInit(); return this.span({k:"newarr",ty:aty,init:ai,line:t.line},st);
      }
      if(this.is("{")) throw new CErr("Entweder Größe ODER Werte: new int[3] oder new int[]{1, 2, 3} – nicht beides.",bt.line);
      return this.span({k:"newarr",ty:aty,sizes:sizes,line:t.line},st);
    }
    if(PRIM[base]) throw new CErr("new "+base+"(…) gibt es nicht. Für ein Array schreib new "+base+"[größe].",bt.line);
    if(!this.is("(")) throw new CErr("Nach new "+base+" fehlen die Klammern für den Konstruktor: new "+base+"(…).",bt.line);
    return this.span({k:"new",cls:base,args:this.args(),line:t.line},st);
  }
  if(t.t==="id"){
    this.next();
    if(this.is("(")) return this.span({k:"call",obj:null,name:t.v,args:this.args(),line:t.line},st);
    return this.span({k:"name",n:t.v,line:t.line},st);
  }
  if(t.t==="op"&&PREC[t.v]&&t.v!=="-"&&t.v!=="+") throw new CErr("Vor dem Operator "+t.v+" fehlt etwas. Tipp: Bei Vergleichen muss auf beiden Seiten etwas stehen, z. B. x > 1 && x < 10 (nicht x > 1 && < 10).",t.line);
  if(t.t==="op"&&t.v==="=") throw new CErr("Unerwartetes =. Für Vergleiche: == (gleich), != (ungleich), <=, >= (das = steht immer hinten).",t.line);
  if(t.t==="op"&&t.v==="{") throw new CErr("Ein Array-Literal { … } geht nur direkt bei der Deklaration (int[] a = {1, 2};). Sonst: new int[]{1, 2}.",t.line);
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
function isArr(t){ return typeof t==="string"&&t.slice(-2)==="[]" }
function elemOf(t){ return t.slice(0,-2) }
function isRefTy(t){ return !!t&&t!=="void"&&!PRIM[t] }
var STATIC=D({IO:1,Math:1,Integer:1,Double:1,Long:1,Character:1,String:1,System:1,Boolean:1,Arrays:1});
function subOf(C,s,t){ // ist Typ s ein Untertyp von t?
  if(s===t) return true;
  if(s==="null") return isRefTy(t);
  if(t==="Object") return isRefTy(s);
  if(isArr(s)&&isArr(t)){ var a=elemOf(s), b=elemOf(t); if(PRIM[a]||PRIM[b]) return a===b; return subOf(C,a,b); }
  var c=C[s]; if(!c) return false;
  function up(k){ if(!k) return false; if(k.name===t) return true; if(up(k.supC)) return true; return (k.ifC||[]).some(up) }
  return up(c);
}
function mkObjectClass(){
  var O={name:"Object",builtin:true,iface:false,abs:false,sup:null,supC:null,ifC:[],fields:[],fmap:Object.create(null),ctors:[],methods:[],line:0};
  O.methods=[{name:"toString",ret:"String",params:[],nat:"toString",acc:3,cls:O,sig:"toString()"},{name:"equals",ret:"boolean",params:[{name:"o",type:"Object"}],nat:"equals",acc:3,cls:O,sig:"equals(Object)"},{name:"hashCode",ret:"int",params:[],nat:"hashCode",acc:3,cls:O,sig:"hashCode()"}];
  O.ctors=[{name:"Object",ctor:true,params:[],nat:"ctor",cls:O,sig:"Object()",ret:"void"}];
  return O;
}
function sigOf(m){ return m.name+"("+m.params.map(function(p){return p.type}).join(",")+")" }
function sigShow(m){ return m.name+"("+m.params.map(function(p){return p.type}).join(", ")+")" }
var ACC=["private","(ohne Modifizierer)","protected","public"];

function Checker(prog){this.prog=prog;this.errors=[];this.warnings=[];this.scopes=[];this.fields=Object.create(null);this.loop=0;this.sw=0;this.swx=0;this.m=null;this.cls=null;this.stat=false;this.C=Object.create(null)}
var Cp=Checker.prototype;
Cp.err=function(msg,line){throw new CErr(msg,line)};
Cp.warn=function(msg,line){ if(!this.warnings.some(function(w){return w.msg===msg&&w.line===line})) this.warnings.push({msg:msg,line:line}) };
Cp.isRef=function(t){ return t==="String"||t==="null"||t==="Object"||isArr(t)||!!this.C[t] };
Cp.isSub=function(s,t){ return subOf(this.C,s,t) };
Cp.lookup=function(n){
  for(var i=this.scopes.length-1;i>=0;i--) if(this.scopes[i][n]) return this.scopes[i][n];
  if(this.cls){ var f=this.findField(this.cls,n,true,0); if(f) return {ty:f.ty,fin:f.fin,fieldOf:f,line:f.line}; }
  return this.fields[n]||null;
};
Cp.findField=function(c,n,inside,line){ // sucht Feld n in Klasse c und ihren Oberklassen/Interfaces
  var self=this, start=c, hit=null;
  function walk(k){ if(!k||hit) return; if(k.fmap&&k.fmap[n]){ hit=k.fmap[n]; return; } walk(k.supC); (k.ifC||[]).forEach(walk); }
  walk(c);
  if(hit&&hit.priv&&hit.owner!==start){
    if(line===0) return null;
    this.err("'"+n+"' ist in "+hit.owner.name+" private und deshalb in "+start.name+" nicht sichtbar (private wird nicht vererbt). Mach das Feld protected oder benutze einen Getter wie get"+n.charAt(0).toUpperCase()+n.slice(1)+"().",line);
  }
  return hit;
};
Cp.methodsNamed=function(c,name){ // alle sichtbaren Methoden mit diesem Namen (die am weitesten unten definierte gewinnt)
  var list=[], seen=Object.create(null), start=c, O=this.C.Object;
  function visit(k){ if(!k) return; k.methods.forEach(function(m){ if(m.name===name&&!seen[m.sig]){ seen[m.sig]=1; if(m.acc===0&&k!==start&&!m.nat) return; list.push(m); } }); visit(k.supC); (k.ifC||[]).forEach(visit); }
  visit(c); if(c.iface) visit(O);
  return list;
};
Cp.canAssign=function(t,s,node){ try{ this.assignable(t,s,node,0,false); return true }catch(x){ if(x instanceof CErr) return false; throw x } };
Cp.pick=function(cands,a,ts,line,what){
  var self=this; what=what.charAt(0).toUpperCase()+what.slice(1);
  var app=cands.filter(function(m){ return m.params.length===ts.length&&m.params.every(function(p,i){ return self.canAssign(p.type,ts[i],a[i]) }) });
  if(app.length===1) return app[0];
  if(!app.length){
    if(cands.length===1){
      var m=cands[0];
      if(ts.length!==m.params.length) this.err(what+" erwartet "+m.params.length+" Argument"+(m.params.length===1?"":"e")+" ("+m.params.map(function(p){return p.type+" "+p.name}).join(", ")+"), bekommt aber "+ts.length+".",line);
      m.params.forEach(function(p,i){ self.assignable(p.type,ts[i],a[i],line,false) });
    }
    this.err("Keine passende Variante von "+what+" für die Argumente ("+ts.join(", ")+"). Vorhanden: "+cands.map(sigShow).join(", ")+".",line);
  }
  var best=app.filter(function(m){ return app.every(function(o){ return o===m||m.params.every(function(p,i){ return self.canAssign(o.params[i].type,p.type,null) }) }) });
  if(best.length===1) return best[0];
  this.err("Der Aufruf von "+what+" ist mehrdeutig – mehrere Varianten passen: "+app.map(sigShow).join(", ")+".",line);
};
Cp.declare=function(n,info,line){
  for(var i=this.scopes.length-1;i>=0;i--) if(this.scopes[i][n]) this.err("Die Variable '"+n+"' gibt es schon (Zeile "+this.scopes[i][n].line+"). Man kann sie nicht nochmal deklarieren – zum Ändern einfach "+n+" = …; schreiben (ohne Typ davor).",line);
  info.line=line; this.scopes[this.scopes.length-1][n]=info;
};
Cp.setupClasses=function(){
  var P=this.prog, C=this.C, self=this;
  C.Object=mkObjectClass();
  P.classes.forEach(function(c){
    self.wrap(function(){
      if(C[c.name]||STATIC[c.name]||c.name==="String"||c.name==="Object") self.err("Den Klassennamen "+c.name+" gibt es schon"+(STATIC[c.name]||c.name==="String"||c.name==="Object"?" (in Java eingebaut). Nimm einen anderen Namen.":"."),c.line);
      C[c.name]=c;
    });
  });
  P.classes.forEach(function(c){
    self.wrap(function(){
      if(C[c.name]!==c) return;
      if(!c.iface){
        if(c.sup){
          var s=C[c.sup];
          if(!s) self.err("Die Oberklasse '"+c.sup+"' gibt es nicht.",c.supLine||c.line);
          if(s.iface) self.err(c.sup+" ist ein Interface – von einem Interface erbt man mit implements, nicht mit extends.",c.supLine||c.line);
          if(s.fin) self.err("Von der final-Klasse "+c.sup+" kann man nicht erben.",c.line);
          c.supC=s;
        } else c.supC=C.Object;
      } else c.supC=null;
      c.ifC=c.ifaces.map(function(x){ var k=C[x.n]; if(!k) self.err("Das Interface '"+x.n+"' gibt es nicht.",x.line); if(!k.iface) self.err(x.n+" ist eine Klasse, kein Interface – "+(c.iface?"ein Interface kann nur Interfaces erweitern.":"von einer Klasse erbt man mit extends."),x.line); return k; });
    });
    if(!c.ifC) c.ifC=[];
    if(c.supC===undefined) c.supC=c.iface?null:C.Object;
  });
  P.classes.forEach(function(c){ // Zyklen
    var seen=[], k=c; while(k&&!k.builtin){ if(seen.indexOf(k)>=0){ self.errors.push({msg:"Die Klasse "+c.name+" erbt (über Umwege) von sich selbst.",line:c.line}); c.supC=C.Object; break; } seen.push(k); k=k.supC; }
  });
  P.classes.forEach(function(c){
    c.fmap=Object.create(null);
    c.fields.forEach(function(d){ d.vars.forEach(function(v){ self.wrap(function(){ if(c.fmap[v.name]) self.err("Das Feld "+v.name+" gibt es in "+c.name+" schon.",v.line); c.fmap[v.name]={name:v.name,ty:d.type+(v.dims||""),fin:d.fin,stat:d.stat,priv:d.acc===0,owner:c,hasInit:!!v.init,line:v.line,key:c.name+"."+v.name}; if(d.type==="var") self.err("var geht nur bei lokalen Variablen, nicht bei Feldern.",v.line); }) }) });
    var sigs=Object.create(null);
    c.methods.forEach(function(m){ m.cls=c; m.sig=sigOf(m); self.wrap(function(){ if(sigs[m.sig]) self.err("Die Methode "+sigShow(m)+" gibt es in "+c.name+" zweimal.",m.line); sigs[m.sig]=1; if(m.abs&&!c.abs) self.err("Die Methode "+m.name+" ist abstract, also muss auch die Klasse "+c.name+" abstract sein (abstract class "+c.name+").",m.line); if(m.abs&&m.stat) self.err("Eine Methode kann nicht zugleich static und abstract sein.",m.line); }) });
    if(!c.iface&&!c.ctors.length) c.ctors=[{name:c.name,ctor:true,ret:"void",params:[],body:{k:"block",body:[],line:c.line},line:c.line,acc:3,ann:[],synth:true}];
    var cs=Object.create(null);
    c.ctors.forEach(function(m){ m.cls=c; m.sig=sigOf(m); self.wrap(function(){ if(cs[m.sig]) self.err("Den Konstruktor "+sigShow(m)+" gibt es zweimal.",m.line); cs[m.sig]=1; }) });
  });
  // Überschreiben prüfen, abstrakte Methoden
  P.classes.forEach(function(c){
    c.methods.forEach(function(m){
      self.wrap(function(){
        var over=null;
        function find(k){ if(!k||over) return; k.methods.forEach(function(x){ if(!over&&x.sig===m.sig&&x.acc!==0) over=x; }); if(!over){ find(k.supC); (k.ifC||[]).forEach(find); } }
        find(c.supC); c.ifC.forEach(find); if(!over&&c.iface) find(C.Object);
        if(m.ann.indexOf("Override")>=0&&!over) self.err("@Override, aber in keiner Oberklasse bzw. keinem Interface gibt es eine Methode "+sigShow(m)+" zum Überschreiben. Tippfehler im Namen, oder andere Parametertypen?",m.line);
        if(over){
          if(over.stat!==m.stat&&!over.nat) self.err(m.stat?"Die static-Methode "+m.name+" kann die Objektmethode aus "+over.cls.name+" nicht überschreiben.":"Die Methode "+m.name+" kann die static-Methode aus "+over.cls.name+" nicht überschreiben.",m.line);
          if(m.acc<over.acc) self.err(sigShow(m)+" in "+c.name+" überschreibt "+sigShow(m)+" aus "+over.cls.name+", hat aber weniger Zugriffsrechte ("+ACC[m.acc]+" statt "+ACC[over.acc]+"). Schreib "+(over.acc===3?"public":"protected oder public")+" davor."+(over.cls.iface?" (Methoden aus Interfaces sind immer public.)":""),m.line);
          if(m.ret!==over.ret&&!(self.isRef(m.ret)&&self.isSub(m.ret,over.ret))) self.err("Der Rückgabetyp "+m.ret+" passt nicht zur überschriebenen Methode "+sigShow(over)+" aus "+over.cls.name+" (dort "+over.ret+").",m.line);
          if(over.fin) self.err("Die Methode "+m.name+" ist in "+over.cls.name+" final und kann nicht überschrieben werden.",m.line);
        }
      });
    });
    if(!c.abs&&!c.iface){
      self.wrap(function(){
        var abs=Object.create(null), impl=Object.create(null);
        function collect(k){ if(!k) return; k.methods.forEach(function(x){ if(x.abs){ if(!abs[x.sig]) abs[x.sig]=x; } }); collect(k.supC); (k.ifC||[]).forEach(collect); }
        collect(c);
        for(var k=c;k;k=k.supC) k.methods.forEach(function(x){ if(!x.abs) impl[x.sig]=1; });
        for(var sg in abs) if(!impl[sg]) self.err("Die Klasse "+c.name+" muss die abstrakte Methode "+sigShow(abs[sg])+" aus "+abs[sg].cls.name+" implementieren (oder selbst abstract sein).",c.line);
      });
    }
  });
};
Cp.run=function(){
  var P=this.prog, self=this;
  this.setupClasses();
  P.classes.forEach(function(c){ c.methods.forEach(function(m){ if(m.stat&&!c.fmap) c.fmap=Object.create(null); }) });
  this.scopes=[this.fields];
  P.fields.forEach(function(d){ self.wrap(function(){ self.stmt(d) }) });
  this.scopes=[];
  var mains=P.methods.main||[];
  if(!mains.length) this.errors.push({msg:"Es fehlt die main-Methode. Jedes Programm braucht void main() { … } – dort startet es.",line:1});
  else if(mains.length>1||mains[0].params.length||mains[0].ret!=="void") this.errors.push({msg:"main muss so aussehen: void main() { … }",line:mains[0].line});
  var tsig=Object.create(null);
  P.funcs.forEach(function(m){ m.sig=sigOf(m); if(tsig[m.sig]) self.errors.push({msg:"Die Methode "+sigShow(m)+" gibt es zweimal.",line:m.line}); tsig[m.sig]=1; if(m.abs) self.errors.push({msg:"abstract gibt es nur in Klassen.",line:m.line}); });
  P.funcs.forEach(function(m){ self.checkMethod(m,null); });
  P.classes.forEach(function(c){
    if(self.C[c.name]!==c) return;
    self.cls=c;
    c.fields.forEach(function(d){ self.stat=d.stat; self.m=null; self.scopes=[Object.create(null)]; d.vars.forEach(function(v){ var fty=d.type+(v.dims||""); if(v.init) self.wrap(function(){ self.initCheck(fty,v); }); else if(d.fin&&d.stat) self.wrap(function(){ self.err("Die static final-Konstante "+v.name+" braucht gleich einen Wert.",v.line) }); v.ty=fty; }); });
    c.ctors.forEach(function(m){ self.checkMethod(m,c); });
    c.methods.forEach(function(m){ if(!m.abs) self.checkMethod(m,c); });
    self.cls=null;
  });
  this.stat=false; this.cls=null;
  P.C=this.C;
  return this;
};
Cp.checkMethod=function(m,c){
  var self=this; self.m=m; self.cls=c; self.stat=!!m.stat; self.scopes=[Object.create(null)];
  self.wrap(function(){
    m.params.forEach(function(p){ self.declare(p.name,{ty:p.type},p.line) });
    var body=m.body.body;
    if(m.ctor){
      if(body.length&&body[0].k==="ctorcall"){
        var cc=body[0]; cc.ok=true;
        var tgt=cc.which==="this"?c:c.supC;
        var ts=cc.args.map(function(x){ return self.expr(x) });
        if(tgt.builtin){ if(ts.length) self.err("Die Klasse "+c.name+" hat keine eigene Oberklasse – super(…) geht hier nur ohne Argumente.",cc.line); cc.ctor=tgt.ctors[0]; }
        else { cc.ctor=self.pick(tgt.ctors,cc.args,ts,cc.line,"der Konstruktor "+tgt.name+"(…)"); if(cc.ctor===m) self.err("Der Konstruktor ruft sich mit this(…) selbst auf.",cc.line); }
      } else if(c.supC&&!c.supC.builtin){
        var noArg=c.supC.ctors.filter(function(x){return !x.params.length})[0];
        if(!noArg) self.err((m.synth?"Die Klasse "+c.name+" hat keinen Konstruktor, also bekommt sie automatisch "+c.name+"() { super(); }. ":"")+"Die Oberklasse "+c.supC.name+" hat "+(m.synth?"aber ":"")+"keinen Konstruktor ohne Parameter (nur "+c.supC.ctors.map(sigShow).join(", ")+"). "+(m.synth?"Schreib einen Konstruktor, der als erste Anweisung super(…) mit passenden Werten aufruft.":"Ruf im Konstruktor als erste Anweisung super(…) mit passenden Werten auf."),m.line);
        c.supNoArg=noArg;
      }
    }
    self.blockBody(body);
    if(m.ret!=="void"&&self.canComplete(m.body)) self.err("In der Methode "+m.name+" fehlt ein return. Eine Methode mit Rückgabetyp "+m.ret+" muss auf jedem Weg einen Wert zurückgeben (auch wenn kein if zutrifft).",self.lastLine(m.body));
  });
};
Cp.initCheck=function(ty,v){
  if(v.init.k==="arrlit"){ if(!isArr(ty)) this.err(ty==="var"?"Bei var geht { … } nicht – schreib den Typ aus: int[] "+v.name+" = {…};":"Mit { … } kann man nur Arrays befüllen – "+v.name+" hat den Typ "+ty+".",v.line); this.arrLit(v.init,ty); return; }
  var it=this.expr(v.init); this.assignable(ty,it,v.init,v.line,true);
};
Cp.arrLit=function(node,ty){
  var self=this, et=elemOf(ty); node.ty=ty;
  node.elems.forEach(function(el){
    if(el.k==="arrlit"){ if(!isArr(et)) self.err("Hier ist ein { … } zu viel – die Elemente haben den Typ "+et+".",el.line); self.arrLit(el,et); }
    else { var t=self.expr(el); self.assignable(et,t,el,el.line,true); }
  });
};
Cp.lastLine=function(b){ return b.body&&b.body.length?b.body[b.body.length-1].line:b.line };
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
      var ty=s.type+(v.dims||""), pend=null;
      if(v.dims) self.warn("Erlaubt, aber unüblich: "+s.type+" "+v.name+v.dims+". In Java schreibt man die [] zum Typ: "+s.type+v.dims+" "+v.name+".",v.line);
      try{
      if(ty==="var"){ if(!v.init) self.err("Bei var muss gleich ein Wert zugewiesen werden: var "+v.name+" = …;",v.line); if(v.init.k==="arrlit") self.initCheck(ty,v); ty=self.expr(v.init); if(ty==="null"||ty==="void") self.err("Mit var kann man hier keinen Typ ableiten.",v.line); v.ty=ty; }
      else { v.ty=ty; if(v.init){ self.initCheck(ty,v); } else if(s.fin&&s.field) self.err("Die Konstante "+v.name+" braucht gleich einen Wert.",v.line); }
      }catch(ex){ if(!(ex instanceof CErr)) throw ex; pend=ex; if(!v.ty||v.ty==="var") v.ty="int"; }
      var info={ty:v.ty,fin:s.fin,field:!!s.field}; if(s.fin&&v.init&&v.init.k!=="arrlit"){ var cv=self.constVal(v.init); if(cv.ok&&cv.ty!=="String"&&cv.ty!=="boolean"&&cv.ty!=="null") info.cv=cv; }
      self.declare(v.name,info,v.line);
      if(pend) throw pend;
    });
    break;
  case "expr": this.expr(s.e,true); break;
  case "if":
    this.scoped(function(){
      self.condition(s.cond,"if");
      if(s.then.k==="empty") self.warn("Achtung: Direkt nach if (…) steht ein ; – damit ist der if-Teil leer und der Block danach läuft immer!",s.line);
      self.scoped(function(){ self.stmt(s.then) });
      if(s.els) self.scoped(function(){ self.stmt(s.els) });
    });
    break;
  case "while": case "do":
    this.scoped(function(){
      if(s.k==="while") self.condition(s.cond,"while");
      if(s.k==="while"&&s.body.k==="empty") self.warn("Achtung: Direkt nach while (…) steht ein ; – die Schleife hat dann keinen Rumpf (oft eine Endlosschleife)!",s.line);
      self.loop++; try{ self.scoped(function(){ self.stmt(s.body) }) } finally{ self.loop-- }
      if(s.k==="do") self.condition(s.cond,"do-while");
    });
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
  case "foreach":
    this.scoped(function(){
      var it=self.expr(s.iter);
      if(!isArr(it)) self.err("Die for-each-Schleife (for (x : …)) geht hier nur mit Arrays – "+self.srcName(s.iter)+" hat den Typ "+it+"."+(it==="String"?" Für die Zeichen eines Strings: for (char c : text.toCharArray())":""),s.line);
      var et=elemOf(it), vty=s.ty==="var"?et:s.ty;
      self.assignable(vty,et,null,s.line,false);
      s.et=et; s.vty=vty;
      self.declare(s.name,{ty:vty,fin:s.fin},s.vline);
      self.loop++; try{ self.scoped(function(){ self.stmt(s.body) }) } finally{ self.loop-- }
    });
    break;
  case "ret":
    var m=this.m;
    if(!m){ this.err("return darf nur in einer Methode stehen.",s.line); }
    if(this.swx) this.err("In einem switch-Ausdruck nimm yield statt return.",s.line);
    if(m.ret==="void"){ if(s.e) this.err(m.ctor?"Ein Konstruktor gibt keinen Wert zurück (kein return mit Wert).":"Die Methode "+m.name+" ist void und darf keinen Wert zurückgeben. Entweder nur return; schreiben oder den Rückgabetyp ändern.",s.line); }
    else { if(!s.e) this.err("Hier muss ein Wert zurückgegeben werden: return …; (die Methode hat den Typ "+m.ret+").",s.line); var rt=this.expr(s.e); this.assignable(m.ret,rt,s.e,s.line,true); s.rt=m.ret; }
    break;
  case "break": if(!this.loop&&!this.sw) this.err("break darf nur in einer Schleife oder in switch stehen.",s.line); break;
  case "continue": if(!this.loop) this.err("continue darf nur in einer Schleife stehen.",s.line); break;
  case "yield": if(!this.swx) this.err("yield gibt es nur in einem switch-Ausdruck.",s.line); s.ty=this.expr(s.e); this.yields.push(s); break;
  case "switch": this.switchCheck(s,false); break;
  case "ctorcall": if(!s.ok) this.err(s.which+"(…) darf nur als allererste Anweisung in einem Konstruktor stehen.",s.line); break;
  default: this.err("Unbekannte Anweisung",s.line);
  }
};
Cp.srcName=function(e){ return e.k==="name"?e.n:"der Ausdruck" };
Cp.condition=function(e,kw){
  var t=this.expr(e);
  if(t!=="boolean"){
    if(e.k==="assign"&&e.op==="=") this.err("In der Bedingung von "+kw+" steht ein einzelnes = (das ist eine Zuweisung). Zum Vergleichen brauchst du == (zwei Gleichheitszeichen).",e.line);
    this.err("Die Bedingung von "+kw+" muss true oder false ergeben (boolean), ergibt hier aber "+t+". Vergleiche mit ==, <, > usw.",e.line);
  }
};
Cp.constVal=function(e){
  if(e.k==="lit") return {ok:true,v:e.v,ty:e.ty};
  if(e.k==="un"&&e.op==="-"&&e.e.k==="lit"&&isNum(e.e.ty)) return {ok:true,v:-e.e.v,ty:e.e.ty};
  if(e.k==="name"){ var v=this.lookup(e.n); if(v&&v.fin&&v.cv) return v.cv; }
  return {ok:false};
};
Cp.switchCheck=function(s,isExpr){
  var self=this, st=this.expr(s.subj);
  if(!(st==="int"||st==="char"||st==="String"||st==="byte"||st==="short")) this.err("switch geht hier mit int, char oder String, nicht mit "+st+".",s.line);
  var seen={}, hasDef=false, rtypes=[], oldY;
  s.subjTy=st;
  if(isExpr){ oldY=this.yields; this.yields=[]; }
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
  if(isNum(t)&&isNum(s)){
    if(s==="char"&&(t==="int"||t==="long"||t==="double")) return;
    if(s!=="char"&&t!=="char"&&RANK[s]<=RANK[t]&&!(s==="short"&&t==="char")) return;
    if(narrowConst&&e&&(s==="int"||s==="char"||s==="short"||s==="byte")&&(t==="byte"||t==="short"||t==="char")){
      var cv=this.constVal(e);
      if(cv.ok){ var v=Number(cv.v), lo=t==="byte"?-128:t==="short"?-32768:0, hi=t==="byte"?127:t==="short"?32767:65535; if(v>=lo&&v<=hi) return; }
    }
    var tip=t==="int"||t==="long"||t==="char"||t==="byte"||t==="short"?" Tipp: mit ("+t+") umwandeln (Cast) – dann werden Nachkommastellen bzw. Bits abgeschnitten.":"";
    this.err("Inkompatible Typen: möglicher Verlust bei der Umwandlung von "+s+" in "+t+"."+tip,line);
  }
  if(s==="String"&&isNum(t)) this.err("Inkompatible Typen: Ein String (Text) kann nicht einfach in "+t+" gespeichert werden."+(t==="int"?" Tipp: Integer.parseInt(…) wandelt Text in eine ganze Zahl um.":t==="double"?" Tipp: Double.parseDouble(…) wandelt Text in eine Kommazahl um.":t==="char"?" Tipp: Mit text.charAt(0) bekommst du das erste Zeichen.":""),line);
  if(t==="String"&&isNum(s)&&s!=="char") this.err("Inkompatible Typen: "+s+" kann nicht in String gespeichert werden. Tipp: \"\" + wert oder String.valueOf(wert) macht daraus Text.",line);
  if(t==="String"&&s==="char") this.err("Inkompatible Typen: char kann nicht in String gespeichert werden. Tipp: \"\" + zeichen oder String.valueOf(zeichen).",line);
  if(this.isRef(t)){
    if(this.isSub(s,t)) return;
    if(isArr(t)&&!isArr(s)) this.err("Inkompatible Typen: "+s+" ist kein Array, gebraucht wird "+t+".",line);
    if(!isArr(t)&&isArr(s)) this.err("Inkompatible Typen: "+s+" ist ein ganzes Array, gebraucht wird ein einzelner Wert vom Typ "+t+". Tipp: Mit a[i] greifst du auf ein Element zu.",line);
    if(isArr(t)&&isArr(s)) this.err("Inkompatible Typen: Ein "+s+" ist kein "+t+" (die Elementtypen müssen zusammenpassen).",line);
    if(this.isRef(s)&&this.isSub(t,s)) this.err("Inkompatible Typen: Ein "+s+" ist nicht unbedingt ein "+t+". Wenn du sicher bist, dass es einer ist, wandle mit ("+t+") um (Cast) – am besten nach einer Prüfung mit instanceof.",line);
    if(t==="Object"&&!this.isRef(s)) this.err("Primitive Werte ("+s+") in Object zu speichern (Autoboxing) wird hier nicht unterstützt.",line);
    this.err("Inkompatible Typen: "+s+" kann nicht in "+t+" umgewandelt werden.",line);
  }
  if(isArr(s)&&isNum(t)) this.err("Inkompatible Typen: "+s+" ist ein ganzes Array, gebraucht wird eine einzelne Zahl ("+t+"). Tipp: a[i] für ein Element, a.length für die Länge.",line);
  this.err("Inkompatible Typen: "+s+" kann nicht in "+t+" umgewandelt werden.",line);
};
Cp.castable=function(s,t){
  if(this.isSub(s,t)||this.isSub(t,s)) return true;
  var cs=this.C[s], ct=this.C[t];
  if(cs&&ct&&(cs.iface||ct.iface)) return !(cs.fin||ct.fin);
  return false;
};
Cp.privWarn=function(f,line){
  if(f.priv&&this.cls!==f.owner) this.warn("Hinweis: '"+f.name+"' ist private in "+f.owner.name+". Hier geht der Zugriff nur, weil alles in einer Datei steht – in einer eigenen Datei "+f.owner.name+".java wäre das ein Fehler. Besser: einen Getter/Setter benutzen.",line);
};
Cp.call=function(e){
  var self=this, a=e.args, argT=function(){return a.map(function(x){return self.expr(x)})};
  function nArgs(n,sig){ if(a.length!==n) self.err(sig+" erwartet "+n+" Argument"+(n===1?"":"e")+", bekommt aber "+a.length+".",e.line) }
  function needNum(ts,sig){ ts.forEach(function(t){ if(!isNum(t)) self.err(sig+" braucht Zahlen als Argumente, bekommt aber "+t+".",e.line) }) }
  function needStr(t,sig){ if(t!=="String") self.err(sig+" braucht einen String (Text) als Argument, bekommt aber "+t+"."+(t==="char"?" Tipp: \"…\" statt '…'.":""),e.line) }
  function needArr(t,sig){ if(!isArr(t)) self.err(sig+" braucht ein Array als Argument, bekommt aber "+t+".",e.line) }
  var ts, m, cands;
  if(e.obj===null){
    if(this.cls){
      cands=this.methodsNamed(this.cls,e.name);
      if(!cands.length){ var pm=null; for(var k=this.cls.supC;k;k=k.supC) k.methods.forEach(function(x){ if(x.name===e.name&&x.acc===0) pm=x; }); if(pm) this.err("Die Methode "+e.name+"(…) ist in "+pm.cls.name+" private und deshalb in "+this.cls.name+" nicht sichtbar. Mach sie protected, wenn Unterklassen sie benutzen sollen.",e.line); }
      if(cands.length){
        ts=argT(); m=this.pick(cands,a,ts,e.line,"die Methode "+e.name+"(…)");
        if(!m.stat&&this.stat) this.err("Die Objektmethode "+e.name+"(…) kann man in einer static-Methode nicht ohne Objekt aufrufen (es gibt kein this).",e.line);
        e.bi="method"; e.m=m; e.virt=!m.stat; e.self=true; return m.ret;
      }
    }
    var list=this.prog.methods[e.name];
    if(!list){
      var low=e.name.toLowerCase(), sim=Object.keys(this.prog.methods).filter(function(n){return n.toLowerCase()===low})[0];
      if(e.name==="println"||e.name==="print"||e.name==="readln") this.err("Vor "+e.name+" fehlt IO. – richtig: IO."+e.name+"(…)",e.line);
      if(this.C[e.name]) this.err("Ein Objekt der Klasse "+e.name+" erzeugt man mit new: new "+e.name+"(…).",e.line);
      this.err("Die Methode "+e.name+"(…) gibt es nicht."+(sim?" Meintest du "+sim+"? (Groß-/Kleinschreibung zählt!)":""),e.line);
    }
    ts=argT(); m=this.pick(list,a,ts,e.line,"die Methode "+e.name);
    e.bi="user"; e.m=m; return m.ret;
  }
  if(e.obj.k==="super"){
    if(!this.cls||this.stat||this.cls.iface) this.err("super.…(…) geht nur in Objektmethoden einer Klasse mit Oberklasse.",e.line);
    cands=this.methodsNamed(this.cls.supC,e.name);
    if(!cands.length) this.err("Die Oberklasse "+this.cls.supC.name+" hat keine Methode "+e.name+"(…).",e.line);
    ts=argT(); m=this.pick(cands,a,ts,e.line,"super."+e.name+"(…)");
    if(m.abs) this.err("Die Methode "+e.name+" ist in der Oberklasse abstract – es gibt dort nichts zum Aufrufen.",e.line);
    e.bi="method"; e.m=m; e.virt=false; e.self=true; return m.ret;
  }
  if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&this.C[e.obj.n]&&e.obj.n!=="Object"){
    var sc=this.C[e.obj.n];
    cands=this.methodsNamed(sc,e.name);
    if(!cands.length) this.err("Die Klasse "+sc.name+" hat keine Methode "+e.name+"(…).",e.line);
    ts=argT(); m=this.pick(cands,a,ts,e.line,sc.name+"."+e.name+"(…)");
    if(!m.stat) this.err(e.name+"(…) ist keine static-Methode – man braucht ein Objekt dafür: objekt."+e.name+"(…) (z. B. nach "+sc.name+" x = new "+sc.name+"(…);).",e.line);
    e.bi="method"; e.m=m; e.virt=false; e.noObj=true; return m.ret;
  }
  var cls=null;
  if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&STATIC[e.obj.n]) cls=e.obj.n;
  if(e.obj.k==="field"&&e.obj.obj.k==="name"&&e.obj.obj.n==="System"&&!this.lookup("System")){
    if(e.obj.name==="out"&&(e.name==="println"||e.name==="print")){ cls="IO"; e.sysout=true; }
    else this.err("System."+e.obj.name+"."+e.name+" wird hier nicht unterstützt. Nimm IO.println(…).",e.line);
  }
  if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&!STATIC[e.obj.n]&&!this.C[e.obj.n]){
    if(/^[a-z]/.test(e.obj.n)) this.err("Die Variable '"+e.obj.n+"' gibt es nicht.",e.line);
    if(e.obj.n==="Io"||e.obj.n==="io") this.err("Es heißt IO (beide Buchstaben groß).",e.line);
    this.err("'"+e.obj.n+"' ist hier unbekannt.",e.line);
  }
  if(cls){
    var ts2, sig=cls+"."+e.name+"(…)";
    e.bi=cls+"."+e.name;
    switch(e.bi){
    case "IO.println": ts2=argT(); if(a.length>1) this.err("IO.println nimmt nur EIN Argument. Mehrere Teile verbindet man mit +, z. B. IO.println(\"x = \" + x);",e.line); if(ts2[0]==="void") this.err("Diese Methode liefert keinen Wert (void), den man ausgeben könnte.",e.line); e.at=ts2[0]; if(e.at==="char[]"&&e.sysout) e.bi="IO.printlnChars"; else if(isArr(e.at)) this.warn("Achtung: Ein Array direkt auszugeben zeigt nur etwas wie [I@1b6d3586 (Typ und Speicheradresse), nicht den Inhalt. Für den Inhalt: Arrays.toString("+(a[0].k==="name"?a[0].n:"…")+") oder eine Schleife.",e.line); return "void";
    case "IO.print": ts2=argT(); nArgs(1,"IO.print"); if(ts2[0]==="void") this.err("Diese Methode liefert keinen Wert (void).",e.line); e.at=ts2[0]; if(e.at==="char[]"&&e.sysout) e.bi="IO.printChars"; else if(isArr(e.at)) this.warn("Achtung: Ein Array direkt auszugeben zeigt nur Typ und Speicheradresse, nicht den Inhalt. Nimm Arrays.toString(…) oder eine Schleife.",e.line); return "void";
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
    case "Arrays.toString": ts2=argT(); nArgs(1,sig); needArr(ts2[0],sig); e.at=ts2[0]; if(isArr(elemOf(e.at))) this.warn("Bei einem 2D-Array zeigt Arrays.toString nur die Adressen der Zeilen. Für den ganzen Inhalt: Arrays.deepToString(…).",e.line); return "String";
    case "Arrays.deepToString": ts2=argT(); nArgs(1,sig); needArr(ts2[0],sig); e.at=ts2[0]; return "String";
    case "Arrays.sort": ts2=argT(); nArgs(1,sig); needArr(ts2[0],sig); var se=elemOf(ts2[0]); if(!(isNum(se)||se==="String")) this.err("Arrays.sort geht hier nur mit Zahlen-, char- oder String-Arrays.",e.line); e.at=ts2[0]; return "void";
    case "Arrays.fill": ts2=argT(); nArgs(2,sig); needArr(ts2[0],sig); this.assignable(elemOf(ts2[0]),ts2[1],a[1],e.line,true); e.at=ts2[0]; return "void";
    case "Arrays.copyOf": ts2=argT(); nArgs(2,sig); needArr(ts2[0],sig); this.assignable("int",ts2[1],a[1],e.line,false); e.at=ts2[0]; return ts2[0];
    case "Arrays.equals": ts2=argT(); nArgs(2,sig); needArr(ts2[0],sig); needArr(ts2[1],sig); e.ats=ts2; return "boolean";
    }
    if(cls==="IO") this.err("IO."+e.name+" gibt es nicht. Es gibt IO.println, IO.print und IO.readln.",e.line);
    this.err(sig+" wird hier nicht unterstützt.",e.line);
  }
  var ot=this.expr(e.obj);
  if(this.C[ot]){
    var oc=this.C[ot];
    cands=this.methodsNamed(oc,e.name);
    if(!cands.length){
      var pm2=null; for(var k2=oc.supC;k2;k2=k2.supC) k2.methods.forEach(function(x){ if(x.name===e.name&&x.acc===0) pm2=x; });
      if(pm2) this.err("Die Methode "+e.name+"(…) ist in "+pm2.cls.name+" private – über den Typ "+ot+" ist sie nicht sichtbar.",e.line);
      var fh=this.findField(oc,e.name,false,0);
      this.err("Die Klasse "+ot+" hat keine Methode "+e.name+"(…)."+(fh?" ("+e.name+" ist ein Feld – ohne Klammern: obj."+e.name+")":"")+(ot!==e.obj.ty?"":"")+this.subHint(oc,e.name),e.line);
    }
    ts=argT(); m=this.pick(cands,a,ts,e.line,"die Methode "+e.name+"(…)");
    if(m.acc===0&&m.cls!==this.cls&&!m.nat) this.warn("Hinweis: Die Methode "+e.name+"(…) ist private in "+m.cls.name+". Hier geht der Aufruf nur, weil alles in einer Datei steht – in einer eigenen Datei wäre das ein Fehler.",e.line);
    e.bi="method"; e.m=m; e.virt=!m.stat; return m.ret;
  }
  if(isArr(ot)){
    if(e.name==="length") this.err("Bei Arrays ist length ein Feld, keine Methode – also ohne Klammern: "+(e.obj.k==="name"?e.obj.n:"a")+".length",e.line);
    this.err("Arrays haben keine Methoden wie ."+e.name+"(…). Länge: a.length (ohne Klammern); Ausgabe: Arrays.toString(a); Sortieren: Arrays.sort(a).",e.line);
  }
  if(ot!=="String"){
    if(e.name==="equals"&&isNum(ot)) this.err("Zahlen (primitive Typen wie "+ot+") haben keine Methoden. Vergleiche Zahlen mit ==.",e.line);
    if(ot==="null") this.err("Auf null kann man keine Methode aufrufen.",e.line);
    this.err("Ein Wert vom Typ "+ot+" hat keine Methoden"+(isNum(ot)||ot==="boolean"?" (primitive Typen haben keine Methoden).":"."),e.line);
  }
  var t3=argT(); e.bi="S."+e.name; e.ats=t3;
  function sig2(n,types){ nArgs(n,"."+e.name+"(…)"); types.forEach(function(ty,i){ if(ty==="int") self.assignable("int",t3[i],a[i],e.line,false); else if(ty==="String"&&t3[i]!=="String"&&t3[i]!=="null") self.err("."+e.name+"(…) braucht einen String als Argument"+(t3[i]==="char"?" – nimm \"…\" statt '…'":"")+".",e.line) }) }
  switch(e.name){
  case "length": sig2(0,[]); return "int";
  case "charAt": sig2(1,["int"]); return "char";
  case "equals": case "equalsIgnoreCase": nArgs(1,"."+e.name); if(t3[0]!=="String"&&t3[0]!=="null"&&t3[0]!=="Object") this.warn("Ein String ist nie gleich einem "+t3[0]+" – equals liefert hier immer false.",e.line); return "boolean";
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
  case "toCharArray": sig2(0,[]); return "char[]";
  case "split": sig2(1,["String"]); return "String[]";
  case "hashCode": sig2(0,[]); return "int";
  case "toString": sig2(0,[]); return "String";
  }
  var hint=e.name==="lenght"?" Tippfehler? Es heißt length().":e.name==="size"?" Bei Strings heißt es length().":"";
  this.err("Die String-Methode ."+e.name+"(…) gibt es nicht (oder wird hier nicht unterstützt)."+hint,e.line);
};
Cp.subHint=function(c,name){ // Methode gibt es nur in einer Unterklasse?
  var subs=this.prog.classes.filter(function(k){ return k!==c&&subOf(this.C,k.name,c.name)&&k.methods.some(function(m){return m.name===name}) },this);
  return subs.length?" Die Methode gibt es nur in "+subs.map(function(k){return k.name}).join(", ")+". Der Variablentyp "+c.name+" entscheidet, was man aufrufen darf – vorher mit instanceof prüfen und casten, z. B. if (x instanceof "+subs[0].name+" y) y."+name+"(…).":"";
};
Cp.expr=function(e,top){
  var t=this.expr0(e,top); e.ty=t; return t;
};
Cp.lval=function(tg,op,line){
  var v, f;
  if(tg.k==="name"){
    v=this.lookup(tg.n);
    if(!v) this.expr(tg);
    this.expr(tg);
    f=v.fieldOf;
    if(v.fin){
      if(f&&!f.stat&&!f.hasInit&&this.m&&this.m.ctor&&this.cls===f.owner) return v.ty;
      this.err("'"+tg.n+"' ist final (eine Konstante) und kann "+(op==="="?"keinen neuen Wert bekommen.":"nicht verändert werden."),line);
    }
    return v.ty;
  }
  var t=this.expr(tg);
  if(tg.k==="field"){
    if(tg.isLen) this.err("Die Länge eines Arrays (length) kann man nicht ändern. Ein größeres Array braucht ein neues: new …[größe] (oder Arrays.copyOf).",line);
    if(tg.fk) this.err(tg.fk+" ist eine Konstante und kann nicht geändert werden.",line);
    f=tg.fld;
    if(f&&f.fin){
      if(!f.stat&&!f.hasInit&&this.m&&this.m.ctor&&this.cls===f.owner&&tg.obj.k==="this") return t;
      this.err("Das Feld "+f.name+" ist final und kann nicht geändert werden.",line);
    }
  }
  return t;
};
Cp.expr0=function(e,top){
  var self=this, lt, rt, v, f;
  switch(e.k){
  case "lit": if(e.ty==="int"||e.ty==="char") e.cv={ok:true,v:e.v,ty:e.ty}; return e.ty;
  case "name":
    v=this.lookup(e.n);
    if(!v){
      if(this.cls){ var pf=null; for(var k=this.cls.supC;k;k=k.supC) if(k.fmap&&k.fmap[e.n]) { pf=k.fmap[e.n]; break; } if(pf&&pf.priv) this.findField(this.cls,e.n,true,e.line); }
      if(STATIC[e.n]||this.C[e.n]) this.err(e.n+" alleine ist kein Wert. Gemeint ist wohl "+e.n+".… (mit Feld oder Methode)"+(this.C[e.n]?" oder ein Objekt: new "+e.n+"(…)":"")+".",e.line);
      var all=[]; for(var i=0;i<this.scopes.length;i++) all=all.concat(Object.keys(this.scopes[i])); all=all.concat(Object.keys(this.fields));
      var sim=all.filter(function(n){return n.toLowerCase()===e.n.toLowerCase()})[0];
      if(e.n==="True"||e.n==="False"||e.n==="TRUE"||e.n==="FALSE") this.err("In Java schreibt man true und false klein.",e.line);
      if(e.n==="string") this.err("Der Typ heißt String (mit großem S).",e.line);
      if(e.n==="length") this.err("length alleine gibt es nicht – bei Arrays heißt es name.length, bei Strings text.length().",e.line);
      this.err("Die Variable '"+e.n+"' gibt es nicht (cannot find symbol)."+(sim?" Meintest du "+sim+"? Groß-/Kleinschreibung zählt!":" Wurde sie deklariert (mit Typ, z. B. int "+e.n+" = …;)? Oder ist sie nur in einem anderen Block { } gültig?"),e.line);
    }
    if(v.fieldOf){ e.fld=v.fieldOf; if(!v.fieldOf.stat&&this.stat) this.err("Auf das Objektfeld '"+e.n+"' kann man in einer static-Methode nicht zugreifen – dort gibt es kein this (kein Objekt).",e.line); }
    e.vi=v; return v.ty;
  case "this":
    if(!this.cls) this.err("this gibt es nur innerhalb einer Klasse (in Konstruktoren und Objektmethoden).",e.line);
    if(this.stat) this.err("In einer static-Methode gibt es kein this.",e.line);
    return this.cls.name;
  case "super": this.err("super alleine ist kein Wert – nur super.methode(…) oder super(…) im Konstruktor.",e.line);
  case "assign":
    var tt=this.lval(e.target,e.op,e.line);
    if(e.e.k==="arrlit") this.err("Ein Array-Literal { … } geht nur direkt bei der Deklaration (int[] a = {1, 2};). Bei einer späteren Zuweisung schreib: "+this.srcName(e.target)+" = new "+tt+"{…};",e.line);
    rt=this.expr(e.e);
    if(e.op==="="){ this.assignable(tt,rt,e.e,e.line,true); }
    else {
      var bop=e.op.slice(0,-1);
      if(bop==="+"&&tt==="String"){ if(rt==="void") this.err("void-Wert",e.line); }
      else if(isNum(tt)&&isNum(rt)){ if((bop==="&"||bop==="|"||bop==="^"||bop==="<<"||bop===">>"||bop===">>>")&&!(isInt(tt)&&isInt(rt))) this.err("Der Operator "+e.op+" geht nur mit ganzen Zahlen.",e.line); e.pt=(bop==="<<"||bop===">>"||bop===">>>")?promote1(tt):promote(tt,rt); }
      else if(tt==="boolean"&&rt==="boolean"&&(bop==="&"||bop==="|"||bop==="^")) e.pt="boolean";
      else this.err("Der Operator "+e.op+" passt nicht zu den Typen "+tt+" und "+rt+".",e.line);
    }
    return tt;
  case "incdec":
    lt=this.lval(e.target,e.op,e.line);
    if(!isNum(lt)) this.err(e.op+" geht nur mit Zahlen-Variablen, nicht mit "+lt+".",e.line);
    e.pt=promote1(lt); return lt;
  case "cast":
    lt=this.expr(e.e);
    if(isNum(e.ty)&&isNum(lt)) return e.ty;
    if(e.ty===lt) return e.ty;
    if(lt==="String"&&!this.isRef(e.ty)) this.err("Ein String kann nicht mit ("+e.ty+") umgewandelt werden."+(e.ty==="int"?" Nimm Integer.parseInt(…).":e.ty==="double"?" Nimm Double.parseDouble(…).":""),e.line);
    if(this.isRef(e.ty)){
      if(e.ty==="String"&&!this.isRef(lt)) this.err("(String) als Cast funktioniert nicht mit "+lt+". Eine Zahl wird zu Text mit \"\" + zahl oder String.valueOf(zahl).",e.line);
      if(!this.isRef(lt)) this.err("("+e.ty+") geht nicht mit einem Wert vom Typ "+lt+".",e.line);
      if(!this.castable(lt,e.ty)) this.err("Inkompatible Typen: "+lt+" kann nie ein "+e.ty+" sein (die Klassen sind nicht verwandt), der Cast geht nicht.",e.line);
      e.refcast=!this.isSub(lt,e.ty); return e.ty;
    }
    this.err("("+e.ty+") geht nicht mit einem Wert vom Typ "+lt+".",e.line);
  case "instof":
    lt=this.expr(e.e);
    if(!this.isRef(lt)) this.err("instanceof geht nur mit Objekten, nicht mit "+lt+".",e.line);
    if(lt!=="null"&&!this.castable(lt,e.tt)) this.err("Inkompatible Typen: "+lt+" kann nie ein "+e.tt+" sein – instanceof ergäbe immer false.",e.line);
    if(e.bind) this.declare(e.bind,{ty:e.tt},e.line);
    return "boolean";
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
    if(this.isRef(at)&&this.isRef(bt)){ if(this.isSub(at,bt)) return bt; if(this.isSub(bt,at)) return at; }
    this.err("Beim Bedingungsoperator ?: müssen beide Ergebnisse denselben Typ haben ("+at+" vs. "+bt+").",e.line);
  case "bin": return this.binary(e);
  case "call": return this.call(e);
  case "index":
    lt=this.expr(e.obj);
    if(!isArr(lt)) this.err("[ ] geht nur bei Arrays"+(e.obj.k==="name"?" – "+e.obj.n+" hat aber den Typ "+lt:"")+"."+(lt==="String"?" Für ein Zeichen eines Strings: text.charAt(i).":""),e.line);
    rt=this.expr(e.idx);
    if(!(isInt(rt)&&rt!=="long")) this.err("Der Index in [ ] muss eine ganze Zahl (int) sein, nicht "+rt+"."+(rt==="double"?" Tipp: (int) davor.":""),e.line);
    return elemOf(lt);
  case "newarr":
    if(e.init){ this.arrLit(e.init,e.ty); return e.ty; }
    e.sizes.forEach(function(x){ var st=self.expr(x); if(!(isInt(st)&&st!=="long")) self.err("Die Größe eines Arrays muss eine ganze Zahl (int) sein, nicht "+st+".",e.line); });
    return e.ty;
  case "arrlit": this.err("Ein Array-Literal { … } geht nur direkt bei der Deklaration (int[] a = {1, 2};). Sonst: new int[]{1, 2}.",e.line);
  case "new":
    if(e.cls==="String"){ var sts=e.args.map(function(x){return self.expr(x)}); if(sts.length>1||(sts.length===1&&sts[0]!=="String"&&sts[0]!=="char[]")) this.err("new String(…) geht hier nur mit einem String oder einem char[].",e.line); e.at=sts[0]; return "String"; }
    if(e.cls==="Object"){ if(e.args.length) this.err("new Object() hat keine Parameter.",e.line); e.ctor=this.C.Object.ctors[0]; e.co=this.C.Object; return "Object"; }
    var c=this.C[e.cls];
    if(c.iface) this.err("Von einem Interface kann man kein Objekt erzeugen (new "+c.name+"(…) geht nicht). Erzeuge ein Objekt einer Klasse, die "+c.name+" implementiert.",e.line);
    if(c.abs) this.err(c.name+" ist abstract – davon kann man keine Objekte erzeugen. Erzeuge ein Objekt einer (nicht abstrakten) Unterklasse.",e.line);
    var cts=e.args.map(function(x){return self.expr(x)});
    e.ctor=this.pick(c.ctors,e.args,cts,e.line,"der Konstruktor "+c.name+"(…)"); e.co=c;
    return c.name;
  case "field":
    if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&!this.C[e.obj.n]){
      var key=e.obj.n+"."+e.name;
      var F=D({"Math.PI":"double","Math.E":"double","Integer.MAX_VALUE":"int","Integer.MIN_VALUE":"int","Long.MAX_VALUE":"long","Long.MIN_VALUE":"long","Double.MAX_VALUE":"double","Double.MIN_VALUE":"double","Character.MAX_VALUE":"char","Character.MIN_VALUE":"char"});
      if(F[key]){ e.fk=key; return F[key]; }
      if(key==="System.out") this.err("System.out alleine geht nicht – gemeint ist System.out.println(…). Einfacher: IO.println(…).",e.line);
    }
    if(e.obj.k==="name"&&!this.lookup(e.obj.n)&&this.C[e.obj.n]){
      var sc=this.C[e.obj.n]; f=this.findField(sc,e.name,false,e.line);
      if(!f) this.err("Die Klasse "+sc.name+" hat kein Feld "+e.name+".",e.line);
      if(!f.stat) this.err(e.name+" ist ein Objektfeld (nicht static) – man braucht ein Objekt: objekt."+e.name+" statt "+sc.name+"."+e.name+".",e.line);
      this.privWarn(f,e.line); e.fld=f; e.noObj=true; return f.ty;
    }
    if(e.obj.k==="super"){
      if(!this.cls||this.stat) this.err("super.… geht nur in Objektmethoden.",e.line);
      f=this.findField(this.cls.supC,e.name,false,e.line); if(!f) this.err("Die Oberklasse hat kein Feld "+e.name+".",e.line);
      e.fld=f; e.viaThis=true; return f.ty;
    }
    var ot=this.expr(e.obj);
    if(isArr(ot)){ if(e.name==="length"){ e.isLen=true; return "int"; } this.err("Arrays haben nur das Feld length (ohne Klammern).",e.line); }
    if(this.C[ot]){
      f=this.findField(this.C[ot],e.name,false,e.line);
      if(!f){ var hm=this.methodsNamed(this.C[ot],e.name).length; this.err("Die Klasse "+ot+" hat kein Feld "+e.name+"."+(hm?" ("+e.name+" ist eine Methode – mit Klammern: "+e.name+"())":""),e.line); }
      this.privWarn(f,e.line); e.fld=f; return f.ty;
    }
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
    if(lt==="String"||rt==="String"){ if(isArr(lt)||isArr(rt)) this.warn("Achtung: Ein Array mit + an einen String zu hängen zeigt nur Typ und Adresse (z. B. [I@1b6d3586). Für den Inhalt: Arrays.toString(…).",e.line); return "String"; }
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return e.pt; }
    if(lt==="boolean"||rt==="boolean") bad(" Mit true/false kann man nicht rechnen.");
    if(isArr(lt)||isArr(rt)) bad(" Mit ganzen Arrays kann man nicht rechnen – nur mit einzelnen Elementen a[i].");
    bad();
  case "-": case "*": case "/": case "%":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return e.pt; }
    if(lt==="String"||rt==="String") bad(op==="-"?" Mit Text kann man nicht rechnen – nur + hängt Texte zusammen. Zahlen aus Text bekommst du mit Integer.parseInt(…).":" Mit Text kann man nicht rechnen. Zahlen aus Text bekommst du mit Integer.parseInt(…).");
    if(isArr(lt)||isArr(rt)) bad(" Mit ganzen Arrays kann man nicht rechnen – nur mit einzelnen Elementen a[i].");
    bad();
  case "<": case ">": case "<=": case ">=":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return "boolean"; }
    if(lt==="boolean"&&e.l.k==="bin"&&/^[<>]=?$/.test(e.l.op)) this.err("In Java kann man nicht a < x < b schreiben (wie in Mathe). Schreib stattdessen: a < x && x < b",e.line);
    if(lt==="String"||rt==="String") bad(" Strings vergleicht man mit .compareTo(…) bzw. auf Gleichheit mit .equals(…).");
    if(isArr(lt)||isArr(rt)) bad(" Meintest du die Länge? Die bekommst du mit a.length.");
    bad();
  case "==": case "!=":
    if(isNum(lt)&&isNum(rt)){ e.pt=promote(lt,rt); return "boolean"; }
    if(lt==="boolean"&&rt==="boolean"){ e.pt="boolean"; return "boolean"; }
    if(this.isRef(lt)&&this.isRef(rt)){
      if(lt!=="null"&&rt!=="null"&&!this.castable(lt,rt)) bad(" "+lt+" und "+rt+" können nie dasselbe Objekt sein.");
      if(lt==="String"&&rt==="String") this.warn("Strings mit "+op+" zu vergleichen prüft nur, ob es dasselbe Objekt ist – nicht, ob der Text gleich ist! Für den Inhalt nimm "+(op==="!="?"!a.equals(b)":"a.equals(b)")+".",e.line);
      else if(isArr(lt)&&isArr(rt)) this.warn("Arrays mit "+op+" zu vergleichen prüft nur, ob es dasselbe Array-Objekt ist – nicht den Inhalt. Für den Inhalt: Arrays.equals(a, b).",e.line);
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
function dflt(ty){ return ty==="long"?0n:ty==="boolean"?false:PRIM[ty]?0:null }
function isStrV(v){ return typeof v==="string"||v instanceof String }
function hex(id){ return ((id*2654435761+0x1b6d3586)>>>0).toString(16) }
function str(v,ty){
  if(v===null||v===undefined) return "null";
  switch(ty){
  case "double": return jd(v);
  case "char": return String.fromCharCode(v);
  case "boolean": return v?"true":"false";
  default: return String(v);
  }
}
function arrTag(v){ var et=v.et, d=1; while(isArr(et)){ et=elemOf(et); d++; } var c={int:"I",long:"J",double:"D",boolean:"Z",char:"C",byte:"B",short:"S"}[et]; return new Array(d+1).join("[")+(c||"L"+(et==="String"||et==="Object"?"java.lang."+et:et)+";")+"@"+hex(v.id) }
function showRef(v,ty,depth){ // Anzeige im Schritt-für-Schritt-Modus (ruft kein toString auf)
  if(v===null||v===undefined) return "null";
  if(!isRefTy(ty)&&!(v&&(v.arr||v.cls))) return ty==="double"?jd(v):ty==="char"?"'"+String.fromCharCode(v)+"'":ty==="long"?v.toString():String(v);
  if(isStrV(v)) return "\""+String(v)+"\"";
  if(v.arr){ if(depth>2) return "[…]"; var a=v.a.length>12?v.a.slice(0,12):v.a; return "["+a.map(function(x){return showRef(x,v.et,depth+1)}).join(", ")+(v.a.length>12?", … ("+v.a.length+" Elemente)":"")+"]"; }
  if(v.cls){
    if(depth>1) return v.cls.name+"@"+(v.id);
    var parts=[];
    for(var k in v.f){ var r=v.f[k]; parts.push(k.split(".")[1]+"="+showRef(r.v,r.ty,depth+1)); }
    return v.cls.name+"{"+parts.join(", ")+"}";
  }
  return String(v);
}
function disp(v,ty){ // für Variablenanzeige
  if(v===undefined) return undefined;
  if(ty==="char") return String.fromCharCode(v);
  if(ty==="long") return v.toString();
  if(ty==="String") return v===null?null:String(v);
  if(isRefTy(ty)) return showRef(v,ty,0);
  return v;
}
function Interp(prog,src,inputs,opts){
  this.prog=prog; this.src=src; this.inp=inputs.slice(); this.out=""; this.stdout=""; this.n=0;
  this.max=opts.maxSteps||300000; this.trace=opts.trace?[]:null; this.tmax=opts.traceMax||1500;
  this.frames=[]; this.globals={order:[],vars:Object.create(null)}; this.statics={order:[],vars:Object.create(null)}; this.depth=0; this.line=1; this.oid=0; this.C=prog.C;
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
  if(this.statics.order.length) fr.push({n:"static-Felder",vars:this.statics.order.map(function(k){var r=self.statics.vars[k];return [k,r.ty,disp(r.v,r.ty)]})});
  this.frames.forEach(function(f){
    var vars=[]; if(f.self) vars.push(["this",f.self.cls.name,showRef(f.self,f.self.cls.name,0)]);
    f.scopes.forEach(function(s){ s.order.forEach(function(k){ var r=s.vars[k]; vars.push([k,r.ty,r.set?disp(r.v,r.ty):undefined]) }) });
    fr.push({n:f.name,vars:vars});
  });
  this.trace.push({l:line,x:text,o:this.out,f:fr});
  if(this.trace.length>=this.tmax) throw new RErr("TRACE",line);
};
Ip.fmtVal=function(v,ty){ return ty==="String"?(v===null?"null":"\""+String(v)+"\""):ty==="char"?"'"+String.fromCharCode(v)+"'":isRefTy(ty)?showRef(v,ty,1):str(v,ty) };
Ip.write=function(s){ this.out+=s; this.stdout+=s; if(this.stdout.length>100000) this.fail("Es wird sehr viel ausgegeben – vermutlich eine Endlosschleife.") };
Ip.rtType=function(v){ return isStrV(v)?"String":v.arr?v.et+"[]":v.cls.name };
Ip.instOf=function(v,t){ return v!==null&&v!==undefined&&subOf(this.C,this.rtType(v),t) };
Ip.toStr=function(v,ty,line){ // wie String.valueOf: ruft bei Objekten toString() auf
  if(!isRefTy(ty)) return str(v,ty);
  if(v===null||v===undefined) return "null";
  if(isStrV(v)) return String(v);
  if(v.arr) return arrTag(v);
  var m=this.findImpl(v.cls,"toString()");
  if(m&&!m.nat){ var r=this.invoke(m,[],line,v); return r===null?"null":String(r); }
  return v.cls.name+"@"+hex(v.id);
};
Ip.findImpl=function(c,sig){
  if(!c.vt) c.vt=Object.create(null);
  if(sig in c.vt) return c.vt[sig];
  var r=null; for(var k=c;k&&!r;k=k.supC) k.methods.forEach(function(m){ if(!r&&m.sig===sig&&!m.abs) r=m; });
  return c.vt[sig]=r;
};
Ip.start=function(){
  var self=this, P=this.prog;
  P.classes.forEach(function(c){ c.fields.forEach(function(d){ if(!d.stat) return; d.vars.forEach(function(v){ var key=c.name+"."+v.name; self.statics.order.push(key); self.statics.vars[key]={ty:v.ty,v:dflt(v.ty),set:true}; }); }); });
  P.classes.forEach(function(c){ c.fields.forEach(function(d){ if(!d.stat) return; d.vars.forEach(function(v){ if(v.init){ self.tick(v.line); self.statics.vars[c.name+"."+v.name].v=self.initVal(v.init,v.ty); } }); }); });
  P.fields.forEach(function(d){ self.execDecl(d) });
  this.invoke(P.methods.main[0],[],P.methods.main[0].line);
};
Ip.initVal=function(init,ty){ return init.k==="arrlit"?this.mkLit(init,ty):conv(this.eval(init),init.ty,ty) };
Ip.invoke=function(m,args,callLine,self,note){
  if(++this.depth>2500) this.fail("StackOverflowError: Die Methode "+m.name+" ruft sich (direkt oder indirekt) endlos selbst auf.",callLine);
  var nm=m.cls?m.cls.name+"."+m.name:m.name;
  var f={name:nm,scopes:[{order:[],vars:Object.create(null)}],self:m.stat?null:self||null}, me=this;
  this.frames.push(f);
  m.params.forEach(function(p,i){ me.declare(p.name,p.type,args[i],true) });
  var isMain=m.name==="main"&&!m.cls&&this.frames.length===1;
  if(this.trace){
    if(isMain) this.snap(m.line,"Das Programm startet bei **void main()**.");
    else this.snap(m.line,"Aufruf der Methode **"+nm+"**"+(f.self?" für das Objekt this":"")+(note||"")+(m.params.length?" – die Werte werden in die Parameter kopiert: "+m.params.map(function(p,i){return p.name+" = "+me.fmtVal(args[i],p.type)}).join(", "):"")+".");
  }
  var sig=this.execBlockBody(m.body.body), rv;
  if(sig&&sig.k==="ret") rv=sig.v;
  if(this.trace){
    if(isMain) this.snap(this.lastLineOf(m.body),"Ende von main – das Programm ist **fertig**.");
    else this.snap(sig&&sig.k==="ret"?sig.line:this.lastLineOf(m.body),m.ret==="void"?"Die Methode **"+nm+"** ist fertig, zurück zum Aufrufer.":"**"+nm+"** gibt "+this.fmtVal(rv,m.ret)+" zurück. Ihre Variablen verschwinden.");
  }
  this.frames.pop(); this.depth--;
  return rv;
};
Ip.newObj=function(c,ctor,args,line){
  var o={cls:c,f:Object.create(null),id:++this.oid}, chain=[];
  for(var k=c;k&&!k.builtin;k=k.supC) chain.unshift(k);
  chain.forEach(function(k){ k.fields.forEach(function(d){ if(!d.stat) d.vars.forEach(function(v){ o.f[k.name+"."+v.name]={ty:v.ty,v:dflt(v.ty),set:true}; }); }); });
  this.runCtor(c,ctor,args,o,line,true);
  return o;
};
Ip.initFields=function(c,o){
  var self=this;
  c.fields.forEach(function(d){ if(d.stat) return; d.vars.forEach(function(v){ if(v.init){ self.tick(v.line); o.f[c.name+"."+v.name].v=self.initVal(v.init,v.ty); if(self.trace) self.snap(v.line,"Feld **"+v.name+"** bekommt seinen Startwert "+self.fmtVal(o.f[c.name+"."+v.name].v,v.ty)+"."); } }); });
};
Ip.runCtor=function(c,m,args,o,line,first){
  if(!m||m.nat||c.builtin) return;
  if(++this.depth>2500) this.fail("StackOverflowError: Konstruktoren rufen sich endlos gegenseitig auf.",line);
  var f={name:c.name+" (Konstruktor)",scopes:[{order:[],vars:Object.create(null)}],self:o}, me=this;
  this.frames.push(f);
  m.params.forEach(function(p,i){ me.declare(p.name,p.type,args[i],true) });
  if(this.trace) this.snap(m.line,(first?"**new "+o.cls.name+"(…)**: Ein neues Objekt entsteht, alle Felder haben zuerst Standardwerte (0, 0.0, false, null). Jetzt läuft der ":"Es läuft der ")+"Konstruktor **"+c.name+"("+m.params.map(function(p){return p.type}).join(", ")+")**"+(m.params.length?" mit "+m.params.map(function(p,i){return p.name+" = "+me.fmtVal(args[i],p.type)}).join(", "):"")+".");
  var body=m.body.body, start=0;
  if(body.length&&body[0].k==="ctorcall"){
    var cc=body[0]; start=1; this.tick(cc.line);
    var vals=cc.args.map(function(x,i){ return conv(me.eval(x),x.ty,cc.ctor.params[i]?cc.ctor.params[i].type:undefined) });
    if(this.trace) this.snap(cc.line,"`"+this.srcOf(cc)+"` – zuerst läuft der Konstruktor "+(cc.which==="super"?"der **Oberklasse**":"**"+c.name+"** (eine andere Variante)")+".");
    if(cc.which==="this") this.runCtor(c,cc.ctor,vals,o,cc.line,false);
    else { this.runCtor(c.supC,cc.ctor,vals,o,cc.line,false); this.initFields(c,o); }
  } else {
    if(c.supC&&!c.supC.builtin){ if(this.trace) this.snap(m.line,"Kein super(…) angegeben – Java ruft automatisch **super()** auf, den Konstruktor von "+c.supC.name+" ohne Parameter."); this.runCtor(c.supC,c.supNoArg,[],o,m.line,false); }
    this.initFields(c,o);
  }
  this.execBlockBody(start?body.slice(start):body);
  if(this.trace) this.snap(this.lastLineOf(m.body),"Konstruktor **"+c.name+"** ist fertig.");
  this.frames.pop(); this.depth--;
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
    if(v.init){ var val=self.initVal(v.init,v.ty); self.declare(v.name,v.ty,val,true); parts.push("**"+v.name+"** = "+self.fmtVal(val,v.ty)); }
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
    this.push();
    try{
      c=this.eval(s.cond);
      if(this.trace) this.snap(s.line,"Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"der if-Teil wird ausgeführt.":s.els?"der else-Teil wird ausgeführt.":"der if-Teil wird übersprungen."));
      if(c) return this.execScoped(s.then);
      if(s.els) return this.execScoped(s.els);
      return null;
    } finally { this.pop() }
  case "while":
    while(true){
      this.tick(s.line);
      this.push();
      try{
        c=this.eval(s.cond);
        if(this.trace) this.snap(s.line,"Schleifen-Bedingung `"+this.srcOf(s.cond)+"` ist **"+c+"** → "+(c?"der Schleifenrumpf läuft (noch einmal).":"die Schleife ist zu Ende."));
        if(!c) return null;
        sig=this.execScoped(s.body);
      } finally { this.pop() }
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
        if(sig){ if(sig===TBREAK){ if(this.trace) this.snap(sig.line||s.line,"**break** – die Schleife wird sofort verlassen."); return null; } if(sig!==TCONT) return sig; }
        s.upd.forEach(function(x){ self.tick(s.line); self.eval(x); if(self.trace) self.snap(s.line,"for-Schritt `"+self.srcOf(x)+"` → "+self.explainChange(x)+"."); });
      }
    } finally { this.pop() }
  case "foreach":
    this.tick(s.line);
    var arr=this.eval(s.iter);
    if(arr===null) this.fail("NullPointerException: Die for-each-Schleife läuft über "+this.srcOf(s.iter)+", aber das ist null (kein Array).",s.line);
    for(var i=0;i<=arr.a.length;i++){
      this.tick(s.line);
      if(i===arr.a.length){ if(this.trace) this.snap(s.line,"for-each: alle "+arr.a.length+" Elemente sind durch – die Schleife ist zu Ende."); return null; }
      this.push();
      try{
        var ev=conv(arr.a[i],s.et,s.vty);
        this.declare(s.name,s.vty,ev,true);
        if(this.trace) this.snap(s.line,"for-each: **"+s.name+"** = "+this.fmtVal(ev,s.vty)+" (Element mit Index "+i+").");
        sig=this.execScoped(s.body);
      } finally { this.pop() }
      if(sig){ if(sig===TBREAK){ if(this.trace) this.snap(sig.line||s.line,"**break** – die Schleife wird sofort verlassen."); return null; } if(sig!==TCONT) return sig; }
    }
    return null;
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
  var v=this.eval(s.subj), idx=this.matchCase(s,v);
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
  if(e.k==="assign"||e.k==="incdec"){
    if(e.target.k==="name"&&!e.target.fld){ var r=this.find(e.target.n); return "**"+e.target.n+"** ist jetzt "+this.fmtVal(r.v,r.ty); }
    if(this.lastSet) return "**"+this.srcOf(e.target)+"** ist jetzt "+this.fmtVal(this.lastSet.v,this.lastSet.ty);
  }
  return "ausgeführt";
};
Ip.explainExpr=function(e,before){
  var s="`"+this.srcOf(e)+"`";
  if(e.k==="assign"||e.k==="incdec") return s+" → "+this.explainChange(e)+".";
  if(e.k==="call"){
    if(e.bi==="IO.println"||e.bi==="IO.print"||e.bi==="IO.printlnChars"||e.bi==="IO.printChars") return s+" → Ausgabe in die Konsole"+(e.bi==="IO.println"||e.bi==="IO.printlnChars"?" (mit Zeilenumbruch)":" (ohne Zeilenumbruch)")+".";
    if(e.bi==="user"||e.bi==="method") return s+" → der Aufruf ist fertig.";
  }
  if(e.k==="new") return s+" → das Objekt wurde erzeugt (aber in keiner Variablen gespeichert).";
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
Ip.npe=function(what,line){ this.fail("NullPointerException: "+what+" – die Variable zeigt auf kein Objekt (null). Wurde das Objekt bzw. Array mit new erzeugt?",line) };
Ip.cell=function(e){ // Speicherplatz einer Variablen, eines Feldes oder Array-Elements
  var self=this, o, f;
  if(e.k==="name"){
    if(!e.fld) return this.find(e.n);
    f=e.fld;
    if(f.stat) return this.statics.vars[f.key];
    o=this.top().self; return o.f[f.key];
  }
  if(e.k==="field"){
    f=e.fld;
    if(f.stat){ if(!e.noObj&&!e.viaThis) this.eval(e.obj); return this.statics.vars[f.key]; }
    o=e.viaThis?this.top().self:this.eval(e.obj);
    if(o===null) this.npe("Zugriff auf ."+e.name+" von null",e.line);
    return o.f[f.key];
  }
  if(e.k==="index"){
    var arr=this.eval(e.obj), i=this.eval(e.idx);
    if(arr===null) this.npe(this.srcOf(e.obj)+"["+i+"] geht nicht",e.line);
    if(i<0||i>=arr.a.length) this.fail("ArrayIndexOutOfBoundsException: Index "+i+" out of bounds for length "+arr.a.length+" – erlaubt sind nur 0 bis "+(arr.a.length-1)+(i===arr.a.length?" (der letzte Index ist length - 1!)":"")+".",e.line);
    return {ty:arr.et,set:true,get v(){return arr.a[i]},set v(x){arr.a[i]=x}};
  }
  this.fail("Interner Fehler: kein Speicherplatz",e.line);
};
Ip.mkArr=function(ty,sizes,k){
  var et=elemOf(ty), n=sizes[k], a=new Array(n);
  for(var i=0;i<n;i++) a[i]=k+1<sizes.length?this.mkArr(et,sizes,k+1):dflt(et);
  return {arr:true,et:et,a:a,id:++this.oid};
};
Ip.mkLit=function(node,ty){
  var self=this, et=elemOf(ty);
  return {arr:true,et:et,a:node.elems.map(function(el){ return el.k==="arrlit"?self.mkLit(el,et):conv(self.eval(el),el.ty,et) }),id:++this.oid};
};
Ip.eval=function(e){
  var self=this, r, a, b;
  switch(e.k){
  case "lit": return e.v;
  case "name":
    r=this.cell(e);
    if(!r.set) this.fail("Die Variable '"+e.n+"' hat noch keinen Wert, wird hier aber gelesen. (Java meldet das schon beim Kompilieren: „Variable "+e.n+" wurde möglicherweise nicht initialisiert“.) Gib ihr bei der Deklaration einen Startwert.",e.line);
    return r.v;
  case "this": return this.top().self;
  case "index": return this.cell(e).v;
  case "assign":
    r=this.cell(e.target);
    if(e.op==="="){ var nv=conv(this.eval(e.e),e.e.ty,r.ty); r.v=nv; r.set=true; this.lastSet={v:nv,ty:r.ty}; return nv; }
    if(!r.set) this.fail("Die Variable '"+e.target.n+"' hat noch keinen Wert – "+e.op+" braucht aber den alten Wert.",e.line);
    var cur=r.v; b=this.eval(e.e); var bop=e.op.slice(0,-1);
    if(bop==="+"&&r.ty==="String") r.v=new String(this.toStr(cur,"String",e.line)+this.toStr(b,e.e.ty,e.line));
    else r.v=conv(this.arith(bop,conv(cur,r.ty,e.pt),conv(b,e.e.ty,(bop==="<<"||bop===">>"||bop===">>>")?(e.e.ty==="long"?"long":"int"):e.pt),e.pt,e.line),e.pt,r.ty);
    this.lastSet={v:r.v,ty:r.ty};
    return r.v;
  case "incdec":
    r=this.cell(e.target);
    if(!r.set) this.fail("Die Variable '"+e.target.n+"' hat noch keinen Wert – "+e.op+" geht deshalb nicht.",e.line);
    var old=r.v, one=e.pt==="long"?1n:1;
    r.v=conv(this.arith(e.op==="++"?"+":"-",conv(old,r.ty,e.pt),one,e.pt,e.line),e.pt,r.ty);
    this.lastSet={v:r.v,ty:r.ty};
    return e.prefix?r.v:old;
  case "cast":
    if(e.refcast){ var cv=this.eval(e.e); if(cv!==null&&!this.instOf(cv,e.ty)) this.fail("ClassCastException: Das Objekt ist ein "+this.rtType(cv)+" und kann nicht in "+e.ty+" umgewandelt werden – der Cast ("+e.ty+") geht schief. Tipp: vorher mit instanceof prüfen.",e.line); return cv; }
    return conv(this.eval(e.e),e.e.ty,e.ty);
  case "instof":
    a=this.eval(e.e); b=this.instOf(a,e.tt);
    if(b&&e.bind) this.declare(e.bind,e.tt,a,true);
    return b;
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
    a=this.eval(e.l);
    if(op==="+"&&e.ty==="String"){ var ls=this.toStr(a,e.l.ty,e.line); b=this.eval(e.r); return new String(ls+this.toStr(b,e.r.ty,e.line)); }
    b=this.eval(e.r);
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
    if(e.isLen){ var la=this.eval(e.obj); if(la===null) this.npe(this.srcOf(e.obj)+".length geht nicht",e.line); return la.a.length; }
    if(e.fld) return this.cell(e).v;
    break;
  case "newarr":
    if(e.init) return this.mkLit(e.init,e.ty);
    var sz=e.sizes.map(function(x){ var n=self.eval(x); if(n<0) self.fail("NegativeArraySizeException: "+n+" – ein Array kann keine negative Größe haben.",e.line); return n; });
    var tot=sz.reduce(function(p,n){return p*Math.max(n,1)},1); if(tot>5000000) this.fail("OutOfMemoryError: Das Array ist zu groß für diesen Trainer.",e.line);
    return this.mkArr(e.ty,sz,0);
  case "new":
    if(e.cls==="String"){ if(!e.args.length) return new String(""); var sa=this.eval(e.args[0]); if(sa===null) this.npe("new String(null)",e.line); return new String(e.at==="char[]"?sa.a.map(function(c){return String.fromCharCode(c)}).join(""):String(sa)); }
    var vals=e.args.map(function(x,i){ return conv(self.eval(x),x.ty,e.ctor.params[i].type) });
    if(e.co.builtin) return {cls:e.co,f:Object.create(null),id:++this.oid};
    return this.newObj(e.co,e.ctor,vals,e.line);
  case "switchx":
    var sig=this.execSwitch(e,true);
    if(!sig||sig.k!=="yield") this.fail("Der switch-Ausdruck liefert keinen Wert.",e.line);
    return conv(sig.v,sig.ty,e.ty);
  case "call": return this.call(e);
  }
  this.fail("Unbekannter Ausdruck",e.line);
};
Ip.callMethod=function(e){
  var self=this, m=e.m, obj=null, note="";
  if(!m.stat){
    if(e.self) obj=this.top().self;
    else { obj=this.eval(e.obj); if(obj===null) this.npe("Methode ."+e.name+"(…) auf null aufgerufen",e.line); }
    if(e.virt){
      if(isStrV(obj)||obj.arr){ var vals0=e.args.map(function(x){return self.eval(x)}); return this.nativeObj(m,obj,vals0,e); }
      var impl=this.findImpl(obj.cls,m.sig);
      if(impl&&impl!==m) note=" (dynamisches Binden: das Objekt ist ein **"+obj.cls.name+"**, darum läuft die Version aus "+impl.cls.name+")";
      if(impl) m=impl;
    }
  } else if(e.obj&&!e.noObj&&!e.self&&e.obj.k!=="super") this.eval(e.obj);
  var vals=e.args.map(function(x,i){ return conv(self.eval(x),x.ty,e.m.params[i].type) });
  if(m.nat) return this.nativeObj(m,obj,vals,e);
  return this.invoke(m,vals,e.line,obj,note);
};
Ip.nativeObj=function(m,obj,vals,e){
  switch(m.nat){
  case "toString": return new String(isStrV(obj)?String(obj):obj.arr?arrTag(obj):obj.cls.name+"@"+hex(obj.id));
  case "equals": return isStrV(obj)?(isStrV(vals[0])&&String(obj)===String(vals[0])):obj===vals[0];
  case "hashCode": if(isStrV(obj)){ var h=0,s=String(obj); for(var i=0;i<s.length;i++) h=(Math.imul(h,31)+s.charCodeAt(i))|0; return h; } return (parseInt(hex(obj.id),16)|0);
  }
  this.fail("Unbekannte Methode",e.line);
};
function cmpJ(a,b){ return a<b?-1:a>b?1:0 }
function cmpStr(x,y){ for(var i=0;i<Math.min(x.length,y.length);i++) if(x.charCodeAt(i)!==y.charCodeAt(i)) return x.charCodeAt(i)-y.charCodeAt(i); return x.length-y.length }
Ip.arrStr=function(arr,deep,line){
  var self=this; if(arr===null) return "null";
  return "["+arr.a.map(function(x){ return deep&&isArr(arr.et)?self.arrStr(x,true,line):self.toStr(x,arr.et,line) }).join(", ")+"]";
};
Ip.call=function(e){
  var self=this, A=e.args, av=function(i){return self.eval(A[i])};
  switch(e.bi){
  case "user":
    var vals=A.map(function(x,i){ return conv(self.eval(x),x.ty,e.m.params[i].type) });
    return this.invoke(e.m,vals,e.line);
  case "method": return this.callMethod(e);
  case "IO.println": this.write((A.length?this.toStr(av(0),e.at,e.line):"")+"\n"); return;
  case "IO.print": this.write(this.toStr(av(0),e.at,e.line)); return;
  case "IO.printlnChars": case "IO.printChars":
    var ca=av(0); if(ca===null) this.npe("Ausgabe von null-char[]",e.line);
    this.write(ca.a.map(function(c){return String.fromCharCode(c)}).join("")+(e.bi==="IO.printlnChars"?"\n":"")); return;
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
  case "String.valueOf": var sv=av(0); if(e.at==="char[]"){ if(sv===null) this.npe("String.valueOf(null)",e.line); return new String(sv.a.map(function(c){return String.fromCharCode(c)}).join("")); } return new String(this.toStr(sv,e.at,e.line));
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
  case "Arrays.toString": case "Arrays.deepToString": return new String(this.arrStr(av(0),e.bi==="Arrays.deepToString",e.line));
  case "Arrays.sort":
    var sa=av(0); if(sa===null) this.npe("Arrays.sort(null)",e.line);
    var et=sa.et; this.n+=sa.a.length;
    if(et==="String") sa.a.sort(function(p,q){ if(p===null||q===null) self.npe("Arrays.sort mit null-Element",e.line); return cmpStr(String(p),String(q)) });
    else if(et==="double") sa.a.sort(function(p,q){ return isNaN(p)?(isNaN(q)?0:1):isNaN(q)?-1:p<q?-1:p>q?1:(p===0&&q===0?(1/p<1/q?-1:1/p>1/q?1:0):0) });
    else sa.a.sort(cmpJ);
    return;
  case "Arrays.fill": var fa=av(0), fv=av(1); if(fa===null) this.npe("Arrays.fill(null, …)",e.line); fv=conv(fv,A[1].ty,fa.et); for(var fi=0;fi<fa.a.length;fi++) fa.a[fi]=fv; return;
  case "Arrays.copyOf":
    var oa=av(0), on=av(1); if(oa===null) this.npe("Arrays.copyOf(null, …)",e.line); if(on<0) this.fail("NegativeArraySizeException: "+on,e.line);
    var na=[]; for(var ci=0;ci<on;ci++) na.push(ci<oa.a.length?oa.a[ci]:dflt(oa.et));
    return {arr:true,et:oa.et,a:na,id:++this.oid};
  case "Arrays.equals":
    var p1=av(0), p2=av(1); if(p1===p2) return true; if(p1===null||p2===null) return false; if(p1.a.length!==p2.a.length) return false;
    for(var ei=0;ei<p1.a.length;ei++){ var u=p1.a[ei], w=p2.a[ei]; if(isRefTy(p1.et)){ if(!(u===w||(isStrV(u)&&isStrV(w)&&String(u)===String(w)))) return false; } else if(u!==w&&!(p1.et==="double"&&isNaN(u)&&isNaN(w))) return false; }
    return true;
  }
  // String-Methoden
  var o=this.eval(e.obj);
  if(o===null) this.fail("NullPointerException: Methode ."+e.name+"() auf null aufgerufen.",e.line);
  var S=String(o), args=A.map(function(x){return self.eval(x)}), t=e.ats;
  function idx(i,max,what){ if(i<0||i>max) self.fail("StringIndexOutOfBoundsException: "+what,e.line) }
  switch(e.name){
  case "length": return S.length;
  case "charAt": idx(args[0],S.length-1,"Index "+args[0]+" gibt es nicht – \""+S+"\" hat "+S.length+" Zeichen, erlaubt sind 0 bis "+(S.length-1)+"."); return S.charCodeAt(args[0]);
  case "equals": return args[0]!==null&&isStrV(args[0])&&S===String(args[0]);
  case "equalsIgnoreCase": return args[0]!==null&&t[0]==="String"&&S.toLowerCase()===String(args[0]).toLowerCase();
  case "compareTo": case "compareToIgnoreCase":
    var x2=S, y2=String(args[0]); if(e.name==="compareToIgnoreCase"){x2=x2.toLowerCase();y2=y2.toLowerCase()}
    return cmpStr(x2,y2);
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
  case "toCharArray": var chs=[]; for(var k=0;k<S.length;k++) chs.push(S.charCodeAt(k)); return {arr:true,et:"char",a:chs,id:++this.oid};
  case "split":
    var re; try{ re=new RegExp(String(args[0]),"g"); }catch(x){ this.fail("PatternSyntaxException: ungültiger regulärer Ausdruck \""+args[0]+"\"",e.line); }
    var parts=[], last=0, mm; if(S.length===0) parts=[""]; else {
      while((mm=re.exec(S))!==null){ if(mm[0].length===0){ re.lastIndex++; if(mm.index===0||mm.index>=S.length) continue; } else if(mm.index===0&&last===0&&mm[0].length>0&&false){} parts.push(S.slice(last,mm.index)); last=mm.index+mm[0].length; }
      parts.push(S.slice(last));
      if(parts.length>1&&parts[0]===""&&S.search(re)===0&&new RegExp(String(args[0])).exec(S)[0].length===0) parts.shift();
      while(parts.length>1&&parts[parts.length-1]==="") parts.pop();
      if(parts.length===1&&parts[0]===""&&S.length>0) parts=[];
    }
    return {arr:true,et:"String",a:parts.map(function(p){return new String(p)}),id:++this.oid};
  case "hashCode": var h=0; for(var hi=0;hi<S.length;hi++) h=(Math.imul(h,31)+S.charCodeAt(hi))|0; return h;
  case "toString": return o;
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
