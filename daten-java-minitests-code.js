/* Programmstücke zu Mini-Test-Fragen: Das Quiz mischt, deshalb braucht JEDE Frage ihren eigenen vollständigen Code. */
(function(){
var R=String.raw, by={}; FACH.java.themen.forEach(function(t){by[t.id]=t});
var RECHT=R`double a = Double.parseDouble(IO.readln());
double b = Double.parseDouble(IO.readln());
double c = 2*(a+b);
double d = a*b;
IO.println("Die Fläche des Rechtecks ist " + [U]);`;
var WURZEL=by.mt2.terms[2][3], ITER=by.mt2.terms[3][3], IC=by.mt3.terms[0][3], PI=by.mt3.terms[2][3];
var MAXF=R`// größter Teiler von n, der kleiner als n ist
int maxFactor(int n) {
  int i = n / 2;
  while (i > 1 && n % i != 0)
    i = i - 1;
  return i;
}`;
var LIM=by.mt3.terms[3][3], LIMB=LIM.replace("maxFactor(help) > 1","[Y]");
var PIAUF=R`int offset = -1;
double a = 2.5;
boolean erfolg = printIndent(offset, a);
if (erfolg)
  IO.println("Printed!");
else
  IO.println("NOT Printed!");`;
var ENDL=R`int n = 1;
while (n != 100) {
  if (n % 2 == 1)
    n = 0;
  else
    n = n + 1;
}`;
var ZAEHL=by.mt4.terms[1][3];
var DOW=R`int n = ...;   // beliebige positive Zahl > 0
int k = n;
int sum = 0;
do {
  sum = sum + k;
  --k;
} while (k > 0);`;
var MIN=by.mt5.terms[1][3];
var TR=by.mt7.terms[0][3], CC=by.mt7.terms[1][3];
var SG="class StudentGrades {\n  public String[] courses;\n  public int[] grades;\n}";
var ROOM=R`class Room {
  private String name;
  private int seats;

  public Room(String name, int seats) {
    this.name = name;
    this.seats = seats;
  }
  public int getSeats() {
    return seats;
  }
  public String toString() {
    return name + "/" + seats;
  }
}

class LectureRoom extends Room {
  private boolean projector;

  public LectureRoom(String name, int c, boolean projector) {
    super(name, c);
    this.projector = projector;
  }
  public boolean hasProjector() {
    return projector;
  }
  public String toString() {
    String s = "-B";
    if (projector)
      s = "+B";
    return super.toString() + "/" + s;
  }
}`;
var RED="// in der Klasse LectureRoom: 25 % der Sitzplätze, ganzzahlig\npublic int reducedSeats() {\n  return getSeats() * 25 / 100;\n}";
var DEL="// Klasse RoomList mit dem Feld: Room[] list\n"+by.mt8.terms[3][3];
var C={
mt1:{1:RECHT,3:R`int a = Integer.parseInt(IO.readln());
int b = Integer.parseInt(IO.readln());

// Diese Zeilen sind noch zu ordnen:
IO.println("Max. in b");
else
IO.println("Max. in a");
if (a >= b)`},
mt2:{0:R`int m;   // a, b und c haben schon Werte

// Diese Stücke sind noch zu ordnen:
if (c > m) m = c;
m = a;
if (b > a) m = b;`,4:WURZEL,8:ITER},
mt3:{1:IC,2:IC,3:IC,6:R`// [Methodenkopf] {
  int i = 0;
  if (offset >= 0) {
    while (offset > i) {
      IO.print(" ");
      i = i + 1;
    }
    IO.println(wert);
    return true;
  }
  return false;
}

// Aufruf:
int offset = 3;
double a = 2.5;
boolean erfolg = printIndent(offset, a);`,7:PI.replace("offset >= 0","[B]"),8:PI+"\n\n// Aufruf:\n"+PIAUF,9:LIMB+"\n\n"+MAXF,10:LIM+"\n\n"+MAXF,11:MAXF,12:MAXF,13:LIM+"\n\n"+MAXF},
mt4:{1:ENDL,2:ENDL.replace("int n = 1","int n = 2"),4:ZAEHL.replace("int k = 9","int k = 5"),7:"// do-while\n"+DOW+"\n\n// while\nwhile (k > 0) {\n  sum = sum + k;\n  --k;\n}",9:"IO.println(-3 % 2);"},
mt5:{2:MIN.replace("a[i] < a[i-1]","a[i] [c] a[i-1]"),3:MIN,5:"int[] a = {1, 2, 3};\nint i = 2;",6:"int[] a = {1, 2, 3};\na[a.length] = 1;"},
mt6:{1:by.mt6.terms[0][3].replace("new int[arr.length - 1]","[c]"),2:by.mt6.terms[0][3].replace("i < arr.length - 1","i < [f]"),3:"int[] removeFirst(int[] arr) {\n  int[] r = new int[arr.length - 1];\n  for (int i = 0; i < arr.length - 1; i++)\n    [Z]\n  return r;\n}"},
mt7:{1:TR,2:TR+"\n\n// Aufruf:\nint[][] m = {{1,2,3},{4,5,6},{7,8,9}};\ntransform(m);",3:SG+"\n\n"+CC,4:SG+"\n\n"+CC,5:SG+"\n\n"+CC+"\n\n// stud1.courses: {\"Java\", \"Mathe\"}\n// stud2.courses: {\"Mathe\", \"Physik\", \"Java\"}",6:SG+"\n\n"+CC,8:SG+"\n\nStudentGrades s = new StudentGrades();\ns.grades = new int[5];"},
mt8:{1:ROOM+"\n\n// Aufruf:\n"+by.mt8.terms[1][3],2:ROOM,3:ROOM+"\n\n// Aufruf:\nRoom r = new LectureRoom(\"T01\", 120, true);\nIO.println(r.hasProjector());",4:ROOM,5:ROOM+"\n\n"+RED.replace("getSeats() * 25 / 100","[?]"),6:ROOM+"\n\n"+RED,7:DEL.replace("pos < 0 || pos >= list.length","[?]"),8:DEL,9:DEL}};
Object.keys(C).forEach(function(id){Object.keys(C[id]).forEach(function(i){ by[id].quiz[i].code=C[id][i] })});
/* Formulierungen, die auf eine andere Frage verwiesen haben */
function txt(id,i,a,b){ var q=by[id].quiz[i]; q.q=q.q.replace(a,b) }
txt("mt2",4,"Warum wird am Ende","Das Programm berechnet die abgerundete Wurzel von a. Warum wird am Ende");
txt("mt2",7,"Dasselbe Programm, aber mit `int a = 2`.","Jetzt mit `int a = 2`.");
txt("mt2",8,"im Programm oben","in diesem Programm");
txt("mt3",5,"Dasselbe Programm mit `int m = n + 6`.","Jetzt mit `int m = n + 6`, n ist beliebig.");
txt("mt3",4,"das Programm","dieses Programm");
txt("mt4",1,"die Schleife oben","diese Schleife");
txt("mt4",2,"wie im Original","gleich");
txt("mt4",4,"Dasselbe Programmstück mit","Jetzt mit");
txt("mt5",2,"im selben Programm an","in diesem Programm (das Minimum soll nach vorne wandern) an");
txt("mt7",5,"Und mit vertauschten Argumenten, also","Was liefert der Aufruf mit vertauschten Argumenten");
/* Lernkarten ohne (vollständigen) Code */
by.mt5.terms[0][3]="int[] a = new int[];            // Fehler\nint[] b = new int[3];           // ok\nint[] c = new int[] {1, 2, 3};  // ok";
by.mt5.terms[2][3]="int[] a = {1, 2, 3};\nint i = 2;\n\na[0] = i;         // ok\na[i-1] = 6;       // ok\na[a.length] = i;  // Laufzeitfehler\na[i+1] = 6;       // Laufzeitfehler";
by.mt7.terms[2][3]=SG+"\n\nString student = new StudentGrades();   // Fehler\n\nStudentGrades s = new StudentGrades();\ns[i].grades = 1;                        // Fehler\n\nfor (int grade : s.grades)\n  grade = 0;                            // logischer Fehler";
by.mt7.terms[1][3]=SG+"\n\n"+CC;
by.mt8.terms[1][3]=ROOM+"\n\n// Aufruf:\n"+by.mt8.terms[1][3];
by.mt8.terms[2][3]=ROOM+"\n\n"+RED; by.mt8.terms[3][3]=DEL;
by.mt3.terms[3][3]=LIM+"\n\n"+MAXF;
/* Beispielprogramme Kap. 1–3: Code des genannten Programms mitzeigen (ArithmAusdruck nicht: dort stünde die Lösung) */
var codeOf={}; by.beispiele.terms.forEach(function(x){ if(x[3]) codeOf[x[0].split(".java")[0]]=x[3] });
by.beispiele.quiz.forEach(function(q){ if(q.code) return; var m=/(\w+)\.java/.exec(q.q); if(m&&m[1]!=="ArithmAusdruck"&&codeOf[m[1]]) q.code=codeOf[m[1]]; else if(/int ggt\(/.test(q.q)) q.code=codeOf.GGT3Zahlen_m3; });
})();
