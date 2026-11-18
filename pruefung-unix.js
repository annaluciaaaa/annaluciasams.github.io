/* Einführung UNIX – Typische Prüfungsfragen WS26 (Stand 30.10.26) als offene Fragen.
   Route #/linux/offen. Antworten und Prioritäten sind selbst erstellt, nicht offiziell.
   p: 1 = A (zuerst lernen), 2 = B, 3 = C.
   k: Prüfpunkte [Beschriftung, RegExp | function(text)] – geprüft wird gegen ofNorm(antwort)
      (klein geschrieben, ä→ae, ö→oe, ü→ue, ß→ss, Leerraum zusammengefasst). */
(function(){
function anz(list,min){return function(t){var n=0;list.forEach(function(r){if(r.test(t))n++});return n>=min}}
var SHELLS=[/\bbash\b/,/\bzsh\b/,/\btcsh\b/,/\bcsh\b/,/\bksh\b/,/\bfish\b/,/\bdash\b/,/\bsh\b|bourne/];
var DISTROS=[/debian/,/ubuntu/,/fedora/,/\barch\b/,/suse/,/mint/,/red ?hat|rhel/,/centos/,/gentoo/,/slackware/,/manjaro/,/kali/,/raspbian|raspberry/,/alpine/,/rocky/,/alma/,/elementary/,/pop!?_?os/,/kubuntu|xubuntu|lubuntu/];
var UNIXOID=[/linux|debian|ubuntu|fedora/,/mac ?os|os ?x/,/freebsd/,/openbsd/,/netbsd/,/solaris|sunos/,/\baix\b/,/hp-?ux/,/minix/,/android/,/\bios\b/,/illumos/,/irix/,/^bsd|\sbsd/];

window.OFFEN = {
quelle: "Typische Prüfungsfragen für die VO-Prüfung, Einführung UNIX WS26, Stand 30.10.26",
fragen: [
{n:"1",p:3,q:"Wie startet man eine bash-Shell?",
 a:"Ein Terminal öffnen, die Login-Shell ist meist schon bash. Sonst `bash` eingeben, mit `exit` kommt man zurück.",
 k:[["`bash` eingeben",/\bbash\b/],["Terminal/Konsole öffnen",/terminal|konsole|login|ssh|shell/]]},
{n:"2",p:1,q:"Wie startet man einen Web-Browser aus der Kommandozeile? Was bedeutet das & in dem Kontext?",
 a:"Den Programmnamen eingeben, z. B. `firefox &`. Das & startet den Browser im Hintergrund: Die Shell bleibt frei und man kann weiter Befehle eingeben.",c:"firefox &",
 k:[["Programmname, z. B. firefox",/firefox|chrom|browser|lynx|w3m|epiphany|xdg-open|safari/],["& = im Hintergrund",/hintergrund|background|\bbg\b/],["Shell bleibt frei",/frei|weiter|blockier|warten|benutzbar|nutzen|verwend/]]},
{n:"3",p:3,q:"Was ist für ein sicheres Kennwort/Password zu beachten?",
 a:"Lang (mindestens 12 Zeichen), Groß- und Kleinbuchstaben, Ziffern und Sonderzeichen gemischt, kein Wort aus dem Wörterbuch, keine persönlichen Daten (Name, Geburtstag), nicht für mehrere Dienste verwenden, niemandem verraten.",
 k:[["lang genug",/lang|laenge|\d+ ?(stellen|zeichen)|zeichen/],["Zeichenarten mischen",/sonderzeichen|ziffer|zahl|gross|klein|gemischt|mix/],["kein Wort/keine persönlichen Daten",/woerterbuch|wort|name|geburt|persoenlich|erraten|dictionary/],["nicht mehrfach verwenden/geheim halten",/mehrfach|wiederverw|ueberall|einmal|geheim|weiterge|verraten|aufschreib|teilen/]]},
{n:"4",p:2,q:"Wie können Sie Ihr Kennwort in einer Shell ändern?",
 a:"Mit `passwd`. Es fragt zuerst das alte, dann zweimal das neue Kennwort.",c:"passwd",
 k:[["`passwd`",/\bpasswd\b/]]},
{n:"5",p:1,q:"Welchen Unterschied sehen Sie, wenn Sie die Befehle \"ls\" und \"ls -a\" ausführen?",
 a:"`ls -a` zeigt zusätzlich die versteckten Dateien, deren Name mit einem Punkt beginnt (z. B. .bashrc), dazu `.` (aktuelles) und `..` (übergeordnetes Verzeichnis).",
 k:[["versteckte Dateien",/versteckt|hidden|unsichtbar/],["Name beginnt mit Punkt",/punkt|mit \.|\.bashrc|\.\.|\s\.\w/]]},
{n:"6",p:1,q:"Erklären Sie das Rechtesystem von Unix.",
 a:"Jede Datei hat einen Besitzer (u), eine Gruppe (g) und alle anderen (o). Für jede dieser drei Klassen gibt es r (lesen), w (schreiben) und x (ausführen, bei Verzeichnissen: betreten). `ls -l` zeigt sie an, z. B. `-rwxr-x---`. Ändern mit `chmod`, symbolisch (`chmod g+w datei`) oder oktal mit r=4, w=2, x=1 (`chmod 750 datei`).",
 k:[["Besitzer, Gruppe, Andere",/(besitzer|user|owner|eigentuemer|\bu\b).*(gruppe|group|\bg\b).*(andere|other|welt|\bo\b)/],["r, w, x: lesen, schreiben, ausführen",/(lesen|read|\br\b).*(schreiben|write|\bw\b).*(ausfuehr|execut|\bx\b)/],["ändern mit chmod / oktal",/chmod|oktal|\b[0-7]{3}\b/]]},
{n:"7",p:3,q:"Nennen Sie drei Shells.",
 a:"bash, zsh, sh (Bourne Shell), csh/tcsh, ksh, fish, dash.",
 k:[["mindestens drei Shells",anz(SHELLS,3)]]},
{n:"8",p:3,q:"Warum sind in /etc/passwd am Fachbereich nicht alle User eingetragen?",
 a:"Die Benutzerkonten des Fachbereichs werden zentral im Netz verwaltet (z. B. LDAP, früher NIS), damit man sich auf jedem Rechner anmelden kann. In /etc/passwd stehen nur die lokalen Konten des einzelnen Rechners (root, Systemkonten).",
 k:[["zentral im Netz verwaltet (LDAP/NIS)",/zentral|netz|ldap|\bnis\b|server|kerberos|active directory|verzeichnisdienst/],["/etc/passwd nur lokale Konten",/lokal/]]},
{n:"9",p:2,q:"Was ist ein home directory?",
 a:"Das persönliche Verzeichnis eines Benutzers, z. B. /home/anna, Kurzform `~`. Dort liegen die eigenen Dateien und Einstellungen (.bashrc). Nach dem Anmelden ist man dort.",
 k:[["persönliches Verzeichnis eines Benutzers",/persoenlich|eigene|benutzer|user|nutzer/],["~ oder /home/…",/~|\/home|\$home/]]},
{n:"10",p:1,q:"Was unterscheidet absolute von relativen Pfaden?",
 a:"Ein absoluter Pfad beginnt mit / (der Wurzel) und gilt egal, wo man gerade ist, z. B. /home/anna/text.txt. Ein relativer Pfad geht vom aktuellen Verzeichnis aus und beginnt nicht mit /, z. B. text.txt oder ../bilder.",
 k:[["absolut: beginnt mit /",/absolut.*(\/|wurzel|root)|(\/|wurzel|root).*absolut/],["relativ: vom aktuellen Verzeichnis aus",/relativ.*(aktuell|working|arbeits|momentan|derzeit|wo man|pwd|gerade)|(aktuell|arbeits|momentan).*relativ/]]},
{n:"11",p:1,q:"Wie verwendet man ls, cp, mv, cd, chmod? Erklären Sie anhand von je einem Beispiel mit Optionen.",
 a:"`ls -la` – alle Dateien (auch versteckte) ausführlich auflisten\n`cp -r ordner kopie` – Verzeichnis samt Inhalt kopieren\n`mv -i alt.txt neu.txt` – umbenennen/verschieben, fragt vor dem Überschreiben\n`cd ..` – ins übergeordnete Verzeichnis wechseln (`cd -` zurück)\n`chmod u+x skript.sh` – Besitzer darf ausführen; `chmod -R 755 ordner` rekursiv",
 c:"ls -la\ncp -r ordner kopie\nmv -i alt.txt neu.txt\ncd ..\nchmod u+x skript.sh",
 k:[["ls mit Option",/\bls\s+-\w/],["cp mit Quelle und Ziel",/\bcp\s+(-\w+\s+)*\S+\s+\S+/],["mv mit Quelle und Ziel",/\bmv\s+(-\w+\s+)*\S+\s+\S+/],["cd mit Ziel",/\bcd\s+\S+/],["chmod mit Rechten und Datei",/\bchmod\s+(-\w+\s+)*\S+\s+\S+/]]},
{n:"12",p:2,q:"Wie finden Sie heraus, ob sich Ihre Shell in Ihrem Homeverzeichnis befindet?",
 a:"Mit `pwd` das aktuelle Verzeichnis ausgeben und mit dem Home vergleichen (`echo $HOME`). Oft zeigt auch der Prompt ein ~.",c:"pwd",
 k:[["`pwd`",/\bpwd\b/]]},
{n:"13",p:1,q:"Mit welchem Befehl können Sie in Ihr Home-Verzeichnis wechseln?",
 a:"`cd` ohne Argument. Ebenso `cd ~` oder `cd $HOME`.",c:"cd",
 k:[["`cd` (ohne Argument, ~ oder $HOME)",/\bcd\b(?!\s*-)/]]},
{n:"14",p:1,q:"Mit welchem Befehl können Sie in das Verzeichnis wechseln, das Sie zuletzt mit cd angesteuert haben?",
 a:"`cd -` wechselt ins vorherige Verzeichnis zurück (und gibt es aus).",c:"cd -",
 k:[["`cd -`",/\bcd\s*-(?!\w)/]]},
{n:"15",p:1,q:"Was macht der Befehl umask 077?",
 a:"umask legt fest, welche Rechte neue Dateien und Verzeichnisse NICHT bekommen. 077 entzieht Gruppe und Anderen alle Rechte: Neue Dateien bekommen rw------- (600), neue Verzeichnisse rwx------ (700). Gilt für die aktuelle Shell, dauerhaft in der .bashrc.",
 k:[["gilt für neu angelegte Dateien",/neu|kuenftig|erstellt|angelegt|zukuenftig|default|standard/],["Gruppe und Andere bekommen keine Rechte",/(gruppe|group).*(andere|other)|nur (der )?(besitzer|eigentuemer|user|owner|ich)|\b600\b|\b700\b|keine rechte/]]},
{n:"16",p:1,q:"Wie können Sie einen Befehl an die Datei .bashrc anhängen, ohne die Datei zu editieren?",
 a:"Mit echo und der Umleitung `>>`, die ans Dateiende anhängt. Ein einfaches `>` würde die Datei überschreiben!",c:"echo \"alias la='ls -la'\" >> ~/.bashrc",
 k:[["`>>` (anhängen)",/>>/],["in ~/.bashrc",/bashrc/]]},
{n:"17",p:3,q:"Mit welchem Befehl kann man den Verzeichnisbaum eines Verzeichnisses anzeigen?",
 a:"`tree verzeichnis` (muss evtl. installiert werden). Ohne tree: `ls -R` oder `find verzeichnis`.",c:"tree ~/uebung",
 k:[["`tree` (oder ls -R / find)",/\btree\b|ls\s+-\w*r|\bfind\b/]]},
{n:"18",p:3,q:"Mit welchem Befehl installiert man apache2?",
 a:"Unter Debian/Ubuntu: `sudo apt install apache2` (älter: `apt-get install`). Installieren braucht Root-Rechte.",c:"sudo apt install apache2",
 k:[["apt install apache2",/(apt(-get)?|dnf|yum)\s+install\s+apache2?/],["sudo / Root-Rechte",/sudo|root|\bsu\b/]]},
{n:"19",p:1,q:"Mit welchem Befehl kann man in einer Befehlszeile den Unterverzeichnisbaum e/f/g erstellen?",
 a:"`mkdir -p e/f/g` – -p legt auch fehlende Zwischenverzeichnisse an.",c:"mkdir -p e/f/g",
 k:[["`mkdir -p`",/mkdir\s+(-\w*p|--parents)/],["e/f/g",/e\/f\/g/]]},
{n:"20",p:1,q:"Mit welchem Befehl können Sie ein Verzeichnis und seinen Inhalt archivieren/zusammenpacken? Wie sollte man das zudem speicherschonend tun?",
 a:"Mit tar: `tar -cvf archiv.tar verz` packt zusammen (c = create, f = Dateiname). Speicherschonend mit Kompression: `tar -czvf archiv.tar.gz verz` (z = gzip) oder `tar -cjf archiv.tar.bz2 verz` (j = bzip2).",c:"tar -czvf archiv.tar.gz verz",
 k:[["`tar`",/\btar\b/],["mit Kompression (z / j / gzip / bzip2)",/gz|gzip|bz|bzip|xz|\btar\s+-\w*[zj]|kompr|zip/]]},
{n:"21",p:1,q:"Wie können Sie überprüfen, wieviel Speicherplatz in Ihrer momentanen Umgebung vorhanden ist (alle vom Rechner aus zugreifbaren Filesysteme)? Wie lautet die Option für menschenlesbare Form?",
 a:"`df` zeigt den freien Platz aller eingehängten Dateisysteme, mit `-h` (human readable) in K, M, G.",c:"df -h",
 k:[["`df`",/\bdf\b/],["Option -h",/-\w*h|human/]]},
{n:"22",p:1,q:"Wie können Sie überprüfen, wieviel Speicherplatz Sie derzeit mit Ihrem gesamten Heimatverzeichnis belegen?",
 a:"`du -sh ~` – du = disk usage, -s nur die Summe, -h lesbar.",c:"du -sh ~",
 k:[["`du`",/\bdu\b/],["-s (Summe) und ~",/-\w*s|~|\$home|summ/]]},
{n:"23",p:1,q:"Wie führt man einen Befehl im Hintergrund aus? Wie kann man einen Hintergrundprozess beenden?",
 a:"Mit & am Ende: `befehl &`. Beenden: `jobs` zeigt die Jobnummer, dann `kill %1`; oder die PID mit `ps` suchen und `kill PID`. Alternativ mit `fg` nach vorne holen und Ctrl+C.",c:"sleep 100 &\njobs\nkill %1",
 k:[["& am Ende",/&/],["kill (oder fg + Ctrl+C)",/\bkill|\bfg\b|ctrl\s*\+?\s*c|strg\s*\+?\s*c|\^c/]]},
{n:"24",p:1,q:"Wozu nützt der Befehl scp? Erklären Sie, wie scp verwendet werden kann.",
 a:"scp (secure copy) kopiert Dateien verschlüsselt über SSH zwischen Rechnern. Syntax wie cp, entfernte Pfade als benutzer@host:pfad. -r kopiert Verzeichnisse.",c:"scp datei.txt user@sshstud.cosy.sbg.ac.at:~/   # hochladen\nscp user@sshstud.cosy.sbg.ac.at:datei.txt .   # herunterladen",
 k:[["kopiert Dateien zwischen Rechnern",/kopier|copy|uebertrag|transfer|hochlad|herunterlad/],["über SSH / verschlüsselt",/ssh|verschluessel|sicher|secure/],["Syntax benutzer@host:pfad",/\w+@[\w.-]+:|host:|rechner:|server:/]]},
{n:"25",p:3,q:"Wie kann man den Prompt einer gerade aktiven Shell auf \"workdir@host\" ändern (mit den tatsächlichen Werten)?",
 a:"In der bash die Variable PS1 setzen: \\w steht für das Arbeitsverzeichnis, \\h für den Hostnamen. Dauerhaft in der .bashrc.",c:"PS1='\\w@\\h '",
 k:[["Variable PS1",/ps1/],["\\w und \\h",/\\w.*\\h|\\h.*\\w/]]},
{n:"26",p:1,q:"Wie kann man sich alle Aliases auflisten? Wie legt man den Alias \"la\" an, als Substitution von \"ls -la\"?",
 a:"`alias` ohne Argument listet alle auf. Anlegen: `alias la='ls -la'` (keine Leerzeichen um das =).",c:"alias\nalias la='ls -la'",
 k:[["`alias` listet auf",/\balias\b/],["alias la='ls -la'",/alias\s+la=['"]?ls -la/]]},
{n:"27",p:3,q:"Wie entfernt man einen Alias wieder (welcher Befehl)?",
 a:"`unalias la`",c:"unalias la",
 k:[["`unalias`",/unalias/]]},
{n:"28",p:1,q:"Wie fügt man Aliases dauerhaft hinzu?",
 a:"In die ~/.bashrc schreiben (oder ~/.bash_aliases). Die wird bei jeder neuen Shell gelesen; sofort wirksam mit `source ~/.bashrc`.",c:"echo \"alias la='ls -la'\" >> ~/.bashrc\nsource ~/.bashrc",
 k:[["in ~/.bashrc",/bashrc|bash_aliases|profile/]]},
{n:"29",p:1,q:"Was bewirkt folgender Befehl: \"cd; find . -name '*.txt' -print | wc -l\"?",
 a:"`cd` wechselt ins Home. `find` sucht dort rekursiv (auch in Unterverzeichnissen) alle Dateien mit Endung .txt und gibt je eine pro Zeile aus. `wc -l` zählt die Zeilen. Ergebnis: die Anzahl der .txt-Dateien im Home.",
 k:[["wechselt ins Home",/home|heim|~/],["sucht .txt-Dateien (auch in Unterverzeichnissen)",/txt/],["zählt sie (Anzahl)",/zaehl|anzahl|count|wie ?viele/]]},
{n:"30",p:2,q:"Was macht der Befehl ssh-keygen -b 4096?",
 a:"Erzeugt ein SSH-Schlüsselpaar mit 4096 Bit Länge: privater Schlüssel ~/.ssh/id_rsa, öffentlicher ~/.ssh/id_rsa.pub. Damit kann man sich ohne Kennwort anmelden.",
 k:[["erzeugt Schlüsselpaar (privat/öffentlich)",/schluessel|key|paar/],["4096 Bit Länge",/4096|bit|laenge/]]},
{n:"31",p:1,q:"Was macht der Befehl ssh-copy-id -i ~/.ssh/id_rsa.pub sshstud.cosy.sbg.ac.at?",
 a:"Kopiert den öffentlichen Schlüssel id_rsa.pub auf den Rechner sshstud.cosy.sbg.ac.at und trägt ihn dort in ~/.ssh/authorized_keys ein. Danach kann man sich dort ohne Kennwort (mit dem Schlüssel) anmelden.",
 k:[["kopiert den öffentlichen Schlüssel",/oeffentlich|public|\.pub|schluessel|key/],["auf den Server, in authorized_keys",/server|host|sshstud|authorized|entfernt|remote|rechner/],["Login danach ohne Kennwort",/ohne (passwort|kennwort|password)|passwortlos|kennwortlos|nicht mehr.*(passwort|kennwort)/]]},
{n:"32",p:2,q:"Was steht in ~/.ssh/authorized_keys?",
 a:"Die öffentlichen Schlüssel (eine Zeile je Schlüssel), mit denen man sich auf diesem Konto ohne Kennwort anmelden darf.",
 k:[["öffentliche Schlüssel",/oeffentlich|public|\.pub|schluessel|key/],["dürfen sich anmelden",/anmeld|login|einlogg|zugang|zugriff|authentif|erlaubt|berechtigt/]]},
{n:"33",p:3,q:"Was tut der Befehl \"wget https://www.ietf.org/rfc/rfc2235.txt\"?",
 a:"Er lädt die Datei rfc2235.txt (RFC 2235 über die Geschichte des Internets) herunter und speichert sie unter diesem Namen im aktuellen Verzeichnis.",
 k:[["lädt herunter",/herunterlad|download|laedt|lade|holt/],["speichert sie lokal im aktuellen Verzeichnis",/speicher|aktuell|lokal|verzeichnis/]]},
{n:"34",p:1,q:"Schreiben Sie eine minimale Web-Seite (in HTML5!), die Ihren Namen (zentriert, fett) und einen Link auf den FB Informatik enthält.",
 a:"Wichtig: `<!DOCTYPE html>`, html/head/title/body, fett mit `<b>` oder `<strong>`, zentriert mit CSS (`text-align:center`, das alte `<center>` gibt es in HTML5 nicht mehr), Link mit `<a href>`.",
 c:"<!DOCTYPE html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Meine Seite</title>\n</head>\n<body>\n  <p style=\"text-align:center\"><b>Vorname Nachname</b></p>\n  <a href=\"https://www.cs.sbg.ac.at\">FB Informatik</a>\n</body>\n</html>",
 k:[["`<!DOCTYPE html>`",/<!doctype html>/],["html, head, title, body",/<html.*<head.*<title.*<body/],["fett (`<b>`/`<strong>`)",/<b>|<strong>|font-weight|bold/],["zentriert (text-align:center)",/text-align ?: ?center|<center>/],["Link `<a href=…>`",/<a\s+href=/]]},
{n:"35",p:1,q:"Welche Rechte braucht Ihr public_html und Ihr home Verzeichnis, damit es vom Webserver gelesen werden kann?",
 a:"Der Webserver zählt als \"Andere\" (o). Home: x für Andere (nur durchqueren, z. B. 711). public_html: r und x für Andere (755). Die Dateien darin: r für Andere (644).",c:"chmod o+x ~\nchmod o+rx ~/public_html",
 k:[["Home: x für Andere",/(home|~|heim).*(\bx\b|711|755|ausfuehr|durchquer|betret)|o\+x/],["public_html: r und x für Andere",/public_html.*(rx|r-x|755|r und x|lesen.*ausfuehr|lese.*betret)|o\+rx|a\+rx/]]},
{n:"36",p:2,q:"Wie lautet die URL zu dem Inhalt Ihres public_html Verzeichnisses aus dem Internet?",
 a:"Server des Fachbereichs + ~ + eigener Benutzername, z. B. `https://student.cs.sbg.ac.at/~benutzername/` (so liegen auch die Übungsblätter: …/~bcollini/).",
 k:[["~benutzername",/~\w+/],["Server des Fachbereichs (cs.sbg.ac.at)",/student\.cs|cs\.sbg|cs\.plus|sbg\.ac\.at|plus\.ac\.at/]]},
{n:"37",p:1,q:"Sie befinden sich im Verzeichnis /Users/User1/Desktop. Wie können Sie mit relativen Pfaden nach /Users/User1/Downloads/code-1.1/ wechseln? Woran erkennt man einen absoluten Pfad?",
 a:"`cd ../Downloads/code-1.1/` – .. geht eine Ebene hoch nach User1. Ein absoluter Pfad beginnt mit /.",c:"cd ../Downloads/code-1.1/",
 k:[["cd ../Downloads/code-1.1",/cd\s+(\.\/)?\.\.\/downloads\/code-1\.1/],["absolut beginnt mit /",/(beginn|anfang|start|faengt|vorne).*\/|\/.*(beginn|anfang|vorne)|wurzel|root/]]},
{n:"38",p:1,q:"Benutzer smac hat die Datei bar.txt in seinem Home Directory. Mit welchem Befehl kopieren Sie sie in Ihr eigenes Home (absoluter Pfad unbekannt)? Welche Rechte müssen die Verzeichnisse und bar.txt haben?",
 a:"`cp ~smac/bar.txt ~` – ~smac ist das Home von smac. Rechte: x auf ~smac (und die Verzeichnisse darüber, z. B. /home) zum Durchqueren, r auf bar.txt zum Lesen, w (und x) auf das eigene Home zum Anlegen der Kopie.",c:"cp ~smac/bar.txt ~",
 k:[["cp ~smac/bar.txt",/cp\s+~smac\/bar\.txt/],["x auf das Home von smac",/smac.*\bx\b|\bx\b.*smac|durchquer|durchsuch|betret|ausfuehr/],["r auf bar.txt",/\br\b|lese/],["w auf das eigene Home",/\bw\b|schreib/]]},
{n:"39",p:1,q:"Mit welchem Befehl löschen Sie bar.txt aus dem aktuellen Verzeichnis so, dass Sie vorher nach einer Bestätigung gefragt werden?",
 a:"`rm -i bar.txt` – -i (interactive) fragt vor dem Löschen.",c:"rm -i bar.txt",
 k:[["`rm -i`",/\brm\s+-\w*i/]]},
{n:"40",p:1,q:"Was bewirkt der Befehl \"chmod a+r goo\" auf dem Verzeichnis goo?",
 a:"Alle (a = Besitzer, Gruppe und Andere) bekommen das Leserecht auf das Verzeichnis: Sie dürfen den Inhalt, also die Dateinamen, auflisten. Zum Betreten und Öffnen der Dateien braucht man zusätzlich x.",
 k:[["alle (u, g, o)",/alle|jeder|\ball\b|ugo|besitzer.*gruppe.*andere/],["dürfen den Inhalt auflisten",/auflist|inhalt|\bls\b|anzeig|lesen|lese/]]},
{n:"41",p:1,q:"Was bewirkt der Befehl \"chmod g+x goo\" auf dem Verzeichnis goo?",
 a:"Die Gruppe darf das Verzeichnis betreten (cd) und durchqueren, also auf Dateien darin zugreifen, wenn sie deren Namen kennt.",
 k:[["die Gruppe",/gruppe|group/],["darf betreten/durchqueren",/betret|\bcd\b|wechseln|durchquer|durchsuch|zugreif|hinein|zugang/]]},
{n:"42",p:1,q:"Was bewirkt \"chmod go-x test.sh\" auf der Datei test.sh?",
 a:"Gruppe und Andere verlieren das Ausführrecht: Nur noch der Besitzer (falls er x hat) darf das Skript ausführen.",
 k:[["Gruppe und Andere",/(gruppe|group).*(andere|other)|(andere|other).*(gruppe|group)/],["Recht wird entzogen",/entz|weg|nicht mehr|entfern|verlier|keine? (recht|ausf)|nimmt|duerfen nicht|-x/],["ausführen",/ausf|execut|starten/]]},
{n:"43",p:1,q:"Was bewirkt der Befehl \"chmod o+r goo\" auf der Datei goo?",
 a:"Andere (alle, die nicht Besitzer oder in der Gruppe sind) dürfen die Datei lesen.",
 k:[["Andere",/andere|other|welt|rest/],["lesen",/lesen|lese|read/]]},
{n:"44",p:1,q:"Mit welcher Befehlszeile zählen Sie die HTML-Dateien im Unterverzeichnis public_html Ihres aktuellen Verzeichnisses?",
 a:"ls listet die Dateien, wc -l zählt die Zeilen. (Mit find werden auch Unterverzeichnisse mitgezählt.) Achtung: `wc -l public_html/*.html` würde die Zeilen IN den Dateien zählen.",c:"ls public_html/*.html | wc -l\nfind public_html -name '*.html' | wc -l",
 k:[["ls/find in public_html",/(ls|find)\s+\S*public_html/],["*.html",/\.html/],["| wc -l",/\|\s*wc\s+-l/]]},
{n:"45",p:1,q:"Welche Möglichkeiten des \"Remote Access\" kennen Sie? Welche ist zu bevorzugen? Warum?",
 a:"ssh, telnet, rlogin/rsh, VNC, RDP. Zu bevorzugen ist SSH, weil die ganze Verbindung samt Kennwort verschlüsselt ist (und Login per Schlüssel geht). telnet und rlogin übertragen alles im Klartext.",
 k:[["SSH",/ssh/],["mind. eine Alternative (telnet, rlogin, VNC …)",/telnet|rlogin|rsh|vnc|rdp|teamviewer|x11|remote desktop|ftp/],["Grund: verschlüsselt",/verschluessel|encrypt|sicher|klartext/]]},
{n:"46",p:3,q:"Wie finden Sie heraus, ob ein User pi auf Ihrem Unix-System lokal existiert?",
 a:"Lokale Konten stehen in /etc/passwd: `grep '^pi:' /etc/passwd`. Alternativ `id pi` oder `getent passwd pi` (prüfen aber auch Netzwerk-Konten).",c:"grep '^pi:' /etc/passwd",
 k:[["in /etc/passwd suchen (oder id/getent)",/etc\/passwd|\bid\s+pi|getent|finger/]]},
{n:"47",p:3,q:"Mit welchem Befehl stellen Sie fest, wann die Benutzerin smac das letzte Mal angemeldet war?",
 a:"`last smac` zeigt die letzten Anmeldungen, `lastlog -u smac` nur die letzte. Alternativ `finger smac`.",c:"last smac",
 k:[["last / lastlog / finger",/\blast\b|lastlog|finger/]]},
{n:"48",p:2,q:"Erklären Sie den Unterschied (gibt es einen, und wenn, warum ist das sinnvoll/unerwünscht?) zwischen \"ls -halt\" und \"ls -lath\".",
 a:"Kein Unterschied: Es sind dieselben Optionen -h (lesbare Größen), -a (alle), -l (lang), -t (nach Zeit) in anderer Reihenfolge. Sinnvoll, weil man einbuchstabige Optionen beliebig zusammenfassen kann.",
 k:[["kein Unterschied",/kein(en)? unterschied|gleich|identisch|selbe|dasselbe|egal/],["gleiche Optionen, Reihenfolge egal",/reihenfolge|optionen|buchstaben/]]},
{n:"49",p:2,q:"Erklären Sie den Unterschied zwischen \"ls -Shat\" und \"ls -taSh\".",
 a:"Es gibt einen: -S (nach Größe) und -t (nach Zeit) widersprechen sich, unter GNU/Linux gewinnt die zuletzt genannte. -Shat sortiert also nach Zeit, -taSh nach Größe. Unerwünscht, weil man es dem Befehl nicht sofort ansieht.",
 k:[["-S (Größe) und -t (Zeit) widersprechen sich",/(groesse|size).*(zeit|time|datum)|(zeit|time|datum).*(groesse|size)/],["die letzte Option gewinnt",/letzte|zuletzt|spaeter|hinten|ueberschreib|gewinnt/]]},
{n:"50",p:1,q:"Mit welchem Befehl legen Sie ein Unterverzeichnis ps25 in Ihrem Homeverzeichnis an?",
 a:"`mkdir ~/ps25` (von überall aus, wegen ~).",c:"mkdir ~/ps25",
 k:[["mkdir ~/ps25",/mkdir\s+((~|\$home)\/)?ps25/]]},
{n:"51",p:1,q:"Mit welchem Befehl löschen Sie das Unterverzeichnis vo25? Was ist die Voraussetzung?",
 a:"`rmdir vo25`. Voraussetzung: Das Verzeichnis ist leer.",c:"rmdir vo25",
 k:[["`rmdir`",/rmdir/],["muss leer sein",/leer|empty/]]},
{n:"52",p:1,q:"Mit welchem Befehl löschen Sie das Unterverzeichnis uv25 samt allen Dateien und Verzeichnissen darin? Welche Option fragt nach Bestätigung?",
 a:"`rm -r uv25` (rekursiv). -i fragt bei jedem Eintrag nach: `rm -ri uv25`.",c:"rm -r uv25\nrm -ri uv25",
 k:[["`rm -r`",/\brm\s+-\w*r/],["-i fragt nach",/-\w*i\b|-i/]]},
{n:"53",p:2,q:"Was ist der Unterschied zwischen einer Option und einem Parameter für einen Befehl?",
 a:"Eine Option verändert das Verhalten des Befehls und beginnt meist mit -. Ein Parameter (Argument) gibt an, womit der Befehl arbeitet, z. B. eine Datei. Bei `ls -l uebung` ist -l die Option, uebung der Parameter.",
 k:[["Option ändert das Verhalten (mit -)",/option.*(verhalten|aender|beeinfluss|steuer|wie|-|strich)/],["Parameter = womit gearbeitet wird",/parameter.*(datei|womit|objekt|ziel|argument|was|eingabe|verzeichnis|wert)/]]},
{n:"54",p:2,q:"Mit welchem Befehl können Sie Dateien unter Beibehaltung der Dateiattribute kopieren?",
 a:"`cp -p` (preserve: Zeitstempel, Rechte, Besitzer). `cp -a` macht das zusätzlich rekursiv.",c:"cp -p a.txt b.txt",
 k:[["cp -p (oder -a)",/\bcp\s+-\w*[pa]|--preserve|rsync\s+-\w*a/]]},
{n:"55",p:2,q:"Wenn Sie sich nicht sicher sind, welche Optionen/Argumente/Parameter ein Befehl hat, was tun Sie?",
 a:"Die Man-Page lesen: `man befehl`, oder `befehl --help` aufrufen.",c:"man ls\nls --help",
 k:[["man (oder --help)",/\bman\b|--help|\binfo\b|\bhelp\b/]]},
{n:"56",p:2,q:"Wenn Sie nicht wissen, mit welchem Befehl man eine Datei drucken kann, was tun Sie?",
 a:"In den Kurzbeschreibungen aller Man-Pages nach dem Stichwort suchen: `apropos print` oder `man -k print`.",c:"apropos print",
 k:[["apropos / man -k",/apropos|man\s+-k/]]},
{n:"57",p:2,q:"Mit welchem Editor können Sie Textdateien ändern? Beschreiben Sie die wichtigsten Befehle dieses Editors.",
 a:"Zum Beispiel nano: Ctrl+O speichern, Ctrl+X beenden, Ctrl+W suchen, Ctrl+K Zeile ausschneiden, Ctrl+U einfügen.\n(vi: i einfügen, Esc, :w speichern, :q beenden, :wq beides, :q! ohne Speichern.)",
 k:[["Editor nennen",/nano|\bvim?\b|emacs|pico|gedit|joe|mcedit/],["Speichern-Befehl",/speicher|save|ctrl\s*\+?\s*o|strg\s*\+?\s*o|\^o|:w/],["Beenden-Befehl",/beend|exit|quit|ctrl\s*\+?\s*x|strg\s*\+?\s*x|\^x|:q/]]},
{n:"58",p:2,q:"Auf einem Rechner finden Sie einen \"command prompt\". Wie stellen Sie fest, wem dieser Prompt gehört?",
 a:"`whoami` gibt den Benutzernamen aus, `id` zusätzlich UID und Gruppen.",c:"whoami",
 k:[["whoami / id",/whoami|\bid\b|who am i|\$user|logname/]]},
{n:"59",p:2,q:"Mit welchem Befehl lassen Sie sich nur alle Verzeichnisse anzeigen?",
 a:"`ls -d */` – das Muster */ passt nur auf Verzeichnisse, -d zeigt sie selbst statt ihres Inhalts. Alternativ `find . -type d`.",c:"ls -d */\nfind . -type d",
 k:[["ls -d */ oder find -type d",/ls\s+(-\w+\s+)*\*\/|find.*-type\s+d|tree\s+-d|ls\s+-\w*d/]]},
{n:"60",p:3,q:"Warum war DARPA für die Entwicklung des Internets wichtig? (lt. RFC 2235)",
 a:"Die (D)ARPA des US-Verteidigungsministeriums wurde 1957 nach dem Sputnik-Schock gegründet. Sie finanzierte die Vernetzung von Forschungsrechnern: 1969 entstand das ARPANET, der Vorläufer des Internets; später wurde TCP/IP als Protokoll eingeführt.",
 k:[["Sputnik / Militär / 1957",/sputnik|kalt|militaer|verteidigung|defen[cs]e|1957/],["ARPANET",/arpanet/],["finanzierte Forschung / TCP/IP",/finanz|foerder|geld|tcp|bezahl|forschung/]]},
{n:"61",p:3,q:"Mit welchem Befehl können Sie die Netzwerkeinstellungen prüfen/verändern?",
 a:"`ip` (z. B. `ip addr`), älter `ifconfig`.",c:"ip addr",
 k:[["ip / ifconfig",/\bip\b|ifconfig|nmcli|iwconfig/]]},
{n:"62",p:2,q:"Mit welchem Befehl können Sie die laufenden Prozesse auflisten?",
 a:"`ps aux` (alle Prozesse), laufend aktualisiert `top`.",c:"ps aux",
 k:[["ps / top",/\bps\b|\btop\b|htop|pstree/]]},
{n:"63",p:3,q:"Was ist ein daemon?",
 a:"Ein Prozess, der ohne Terminal im Hintergrund läuft und einen Dienst bereitstellt, meist ab dem Systemstart. Der Name endet oft auf d, z. B. sshd, httpd, cron.",
 k:[["Hintergrundprozess / Dienst",/hintergrund|background|dienst|service/],["ohne Terminal / dauerhaft",/terminal|benutzer|interakt|dauerhaft|staendig|automatisch|boot|systemstart|immer/]]},
{n:"64",p:3,q:"Was ist ein zombie(-process)?",
 a:"Ein schon beendeter Prozess, der noch in der Prozesstabelle steht, weil sein Elternprozess den Exit-Status noch nicht abgeholt hat (wait). In ps mit Status Z bzw. <defunct>.",
 k:[["bereits beendeter Prozess",/beendet|tot|fertig|terminiert|abgeschlossen/],["Elternprozess hat den Status nicht abgeholt",/eltern|parent|wait|exit|status|abgeholt/]]},
{n:"65",p:2,q:"Wie finden Sie heraus, mit welcher Shell Sie arbeiten?",
 a:"`echo $0` oder `ps -p $$` zeigen die laufende Shell, `echo $SHELL` die Login-Shell.",c:"echo $0",
 k:[["echo $0 / $SHELL / ps",/\$0|\$shell|ps\s+-p|\$\$|\bps\b/]]},
{n:"66",p:3,q:"Wie können Sie eine andere Shell verwenden?",
 a:"Ihren Namen eingeben, z. B. `zsh` (zurück mit exit). Dauerhaft als Login-Shell: `chsh -s /bin/zsh`.",c:"zsh\nchsh -s /bin/zsh",
 k:[["Shell-Namen eingeben",anz(SHELLS,1)],["dauerhaft mit chsh",/chsh/]]},
{n:"67",p:3,q:"Wie finden Sie heraus, welche USB-Anschlüsse verfügbar sind?",kursiv:true,
 a:"`lsusb`",c:"lsusb",k:[["`lsusb`",/lsusb/]]},
{n:"68",p:3,q:"Wie finden Sie heraus, welche PCI-Geräte verfügbar sind?",kursiv:true,
 a:"`lspci`",c:"lspci",k:[["`lspci`",/lspci/]]},
{n:"69",p:3,q:"Was ist der Unterschied zwischen den Befehlen \"ls -usb\" und \"lsusb\"?",kursiv:true,
 a:"`ls -usb` ist ein normales ls mit den Optionen -u (Zugriffszeit), -s (Größe in Blöcken) und -b (Sonderzeichen maskiert). `lsusb` ist ein eigener Befehl, der die USB-Geräte auflistet.",
 k:[["ls -usb = ls mit Optionen u, s, b",/option|-u|ls mit|zusammengefasst/],["lsusb listet USB-Geräte",/geraet|device|usb-?(geraet|anschl|port)|anschluess|listet/]]},
{n:"70",p:3,q:"Wie leitet man die Ausgabe eines Befehls in eine Datei um? Zeigen Sie das an einem Befehl, der die letzten Systemmeldungen anzeigt, und sichern Sie diese in eine Datei.",kursiv:true,
 a:"Mit `>`. dmesg zeigt die Kernel-/Systemmeldungen (evtl. mit sudo), tail die letzten davon.",c:"dmesg | tail > meldungen.txt",
 k:[["dmesg (oder journalctl)",/dmesg|journalctl|\/var\/log/],["> datei",/>\s*\S+/]]},
{n:"71",p:1,q:"Wie leitet man die Ausgabe eines Befehls in eine Datei um? Zeigen Sie das an einem Befehl, der die letzten 10 Befehlseingaben anzeigt, und sichern Sie diese in eine Datei.",
 a:"Mit `>` (überschreibt) bzw. `>>` (hängt an). `history 10` zeigt die letzten 10 Eingaben.",c:"history 10 > befehle.txt",
 k:[["history",/history|fc\s+-l/],["die letzten 10",/10|tail/],["> datei",/>\s*\S+/]]},
{n:"72",p:2,q:"Mit welchem Befehl testen Sie in einem Verzeichnis, ob Sie Schreibrechte haben, ohne das Verzeichnis aufzulisten?",
 a:"`test -w verz && echo ja` (bzw. `[ -w verz ]`). Oder einfach probieren, ob `touch verz/test` klappt.",c:"test -w . && echo ja",
 k:[["test -w / [ -w ] / touch",/test\s+-w|\[\s*-w|touch|mkdir/]]},
{n:"73",p:2,q:"Wie lassen sich Systemdateien \"verstecken\"?",
 a:"Indem der Name mit einem Punkt beginnt (z. B. .bashrc). ls zeigt sie dann nur mit -a.",
 k:[["Name beginnt mit Punkt",/punkt|\s\.\w|mit \./]]},
{n:"74",p:2,q:"Was steht in .bashrc?",
 a:"Persönliche Einstellungen, die jede neue (interaktive) bash beim Start ausführt: Aliases, Prompt (PS1), Umgebungsvariablen wie PATH, umask, Funktionen.",
 k:[["Einstellungen, die jede neue bash ausführt",/einstell|konfig|config|start|neue|interaktiv|persoenlich|beim|jede/],["Beispiele: alias, PS1, PATH, umask",/alias|ps1|path|umask|variabl|prompt|export|funktion/]]},
{n:"75",p:3,q:"Was steht in /etc/bash.bashrc?",
 a:"Dieselbe Art Einstellungen wie in .bashrc, aber systemweit für alle Benutzer:innen (wird vor der eigenen .bashrc gelesen).",
 k:[["systemweit für alle Benutzer",/systemweit|alle|global|jede/]]},
{n:"76",p:2,q:"Wie können Sie sich Ihre letzten Befehle anzeigen lassen? Wo wird das gespeichert?",
 a:"Mit `history`. Gespeichert in ~/.bash_history (beim Beenden der Shell).",c:"history",
 k:[["history",/history/],["~/.bash_history",/bash_history/]]},
{n:"77",p:1,q:"Wie können Sie den Befehl ls -halt als lh aufrufbar machen?",
 a:"Mit einem Alias: `alias lh='ls -halt'`. Dauerhaft, indem man die Zeile in die ~/.bashrc schreibt.",c:"alias lh='ls -halt'",
 k:[["alias lh='ls -halt'",/alias\s+lh=['"]?ls -halt/]]},
{n:"78",p:3,q:"Was steht in /etc/sudoers? Wie sollten Sie diese Datei editieren?",
 a:"Wer mit sudo welche Befehle als root ausführen darf. Editieren nur mit `sudo visudo`: Es prüft vor dem Speichern die Syntax, sonst könnte ein Fehler sudo komplett sperren.",c:"sudo visudo",
 k:[["wer was mit sudo darf",/sudo|recht|berechtig|darf|admin|root/],["mit visudo bearbeiten",/visudo/]]},
{n:"79",p:3,q:"Was macht der Befehl tcpdump? Was ist beim Aufruf und bei der Verwendung zu beachten?",kursiv:true,
 a:"Zeichnet den Netzwerkverkehr (Pakete) auf und zeigt ihn an. Braucht Root-Rechte. Fremden Datenverkehr mitlesen ist rechtlich heikel (Datenschutz) – nur im eigenen Netz oder mit Erlaubnis.",
 k:[["schneidet Netzwerkverkehr mit",/netzwerk|verkehr|paket|traffic|mitschneid|mitles|sniff|abhoer|aufzeichn/],["Root-Rechte",/root|sudo|admin/],["nur mit Erlaubnis / Datenschutz",/erlaub|recht|legal|datenschutz|dsgvo|eigen|genehmig|einverst|privat/]]},
{n:"80",p:3,q:"Was macht der Befehl nmap? Was ist beim Aufruf und bei der Verwendung zu beachten?",kursiv:true,
 a:"Scannt Rechner im Netz nach offenen Ports und laufenden Diensten. Manche Scans brauchen Root-Rechte. Fremde Systeme nur mit Erlaubnis scannen – sonst kann es als Angriff gelten.",
 k:[["scannt Ports/Dienste",/port|scan|dienst/],["nur mit Erlaubnis",/erlaub|recht|legal|eigen|genehmig|angriff|strafbar|illegal/]]},
{n:"81",p:3,q:"Warum ist die DSGVO für den Betrieb eines Linux-Servers relevant?",kursiv:true,
 a:"Ein Server verarbeitet personenbezogene Daten: Benutzerkonten, E-Mails, IP-Adressen in Logdateien. Dafür gelten Pflichten wie Datensparsamkeit, Schutz der Daten, begrenzte Speicherdauer, Auskunft.",
 k:[["personenbezogene Daten",/personenbezogen|persoenlich/],["z. B. Logs, IP-Adressen, Konten",/log|\bip\b|konto|benutzer|user|mail/]]},
{n:"82",p:3,q:"Was ist DNS? Wofür braucht man es?",
 a:"Domain Name System: übersetzt Rechnernamen (www.cs.sbg.ac.at) in IP-Adressen, damit man sich keine Zahlen merken muss.",
 k:[["Domain Name System",/domain name (system|service)/],["Name → IP-Adresse",/\bip\b|adresse/]]},
{n:"83",p:3,q:"Was ist URL?",
 a:"Uniform Resource Locator: die Adresse einer Ressource im Netz, aus Protokoll, Rechner und Pfad, z. B. https://student.cs.sbg.ac.at/~user/index.html.",
 k:[["Uniform Resource Locator",/uniform resource locator/],["Adresse einer Ressource (Protokoll, Host, Pfad)",/adresse|protokoll|pfad|host|server|ressource|https?:/]]},
{n:"84",p:3,q:"Was ist FQDN?",
 a:"Fully Qualified Domain Name: der vollständige Name eines Rechners mit allen Domains bis zur obersten, z. B. sshstud.cosy.sbg.ac.at.",
 k:[["Fully Qualified Domain Name",/fully qualified domain name/],["vollständiger Rechnername mit allen Domains",/vollstaendig|komplett|ganz|[a-z]+\.[a-z]+\.[a-z]+\.[a-z]+|domain/]]},
{n:"85",p:3,q:"Was bedeutet die Abkürzung LAMP?",kursiv:true,
 a:"Linux, Apache, MySQL (oder MariaDB), PHP (oder Perl/Python) – ein typischer Web-Server-Aufbau.",
 k:[["Linux",/linux/],["Apache",/apache/],["MySQL/MariaDB",/mysql|mariadb/],["PHP",/php|perl|python/]]},
{n:"86",p:2,q:"Was ist/bedeutet Shebang?",
 a:"Die Zeichen #! in der ersten Zeile eines Skripts. Dahinter steht der Interpreter, der das Skript ausführt, z. B. #!/bin/bash.",c:"#!/bin/bash",
 k:[["#! in der ersten Zeile",/#!|erste zeile|anfang/],["gibt den Interpreter an",/interpret|programm|shell|bash|ausgefuehrt|ausfuehr/]]},
{n:"87",p:3,q:"Welcher Option entspricht apropos beim man-Befehl?",
 a:"`man -k`",c:"man -k print",k:[["man -k",/-k\b/]]},
{n:"88",p:2,q:"Wofür ist der diff Befehl nützlich?",
 a:"Er vergleicht zwei Dateien und zeigt zeilenweise die Unterschiede an. Keine Ausgabe = Dateien sind gleich.",c:"diff Version1.txt Version2.txt",
 k:[["zeigt Unterschiede zwischen Dateien",/unterschied|vergleich|differenz|abweich/]]},
{n:"89",p:3,q:"Nennen Sie fünf Linux \"flavours\".",
 a:"Debian, Ubuntu, Fedora, Arch Linux, openSUSE (auch Linux Mint, Red Hat, CentOS, Gentoo …).",
 k:[["fünf Distributionen",anz(DISTROS,5)]]},
{n:"90",p:3,q:"Nennen Sie fünf unixoide Betriebssysteme. Was bedeutet unixoid?",
 a:"Linux, macOS, FreeBSD, Solaris, AIX (auch OpenBSD, HP-UX, Minix). Unixoid heißt: verhält sich wie Unix (ähnlich aufgebaut, ähnliche Befehle), ist aber nicht unbedingt davon abgeleitet oder als UNIX zertifiziert.",
 k:[["fünf unixoide Systeme",anz(UNIXOID,5)],["unixoid = verhält sich wie Unix",/wie unix|aehnlich|verhalt|angelehnt|nachgebaut|zertifiz|posix/]]},
{n:"91",p:3,q:"Was ist der Unterschied zwischen UNIX, Unix und Linux?",
 a:"UNIX (groß) ist die geschützte Marke: nur zertifizierte Systeme dürfen sich so nennen. Unix meint allgemein die Familie dieser Systeme (ursprünglich AT&T/Bell Labs). Linux ist ein freier Kernel, der sich wie Unix verhält, aber neu geschrieben wurde (Linus Torvalds) – also unixoid.",
 k:[["UNIX = Marke, zertifiziert",/marke|zertifiz|trademark|open group|warenzeichen/],["Unix = die Familie / allgemein",/familie|allgemein|ueberbegriff|sammel|original|bell|at&t/],["Linux = freier Kernel, nachgebaut",/kernel|frei|open source|torvalds|nachbau|neu geschrieben|unixoid/]]},
{n:"92",p:2,q:"Was macht der Befehl tr? Erklären Sie eine typische Befehlszeile damit.",
 a:"tr ersetzt oder löscht einzelne Zeichen. Es liest nur von der Standardeingabe (Pipe oder <). Beispiel: alles in Kleinbuchstaben umwandeln. `tr -d` löscht Zeichen.",c:"tr 'A-Z' 'a-z' < text.txt",
 k:[["ersetzt/löscht Zeichen",/ersetz|tausch|uebersetz|loesch|translat|umwandel|wandelt/],["Beispiel mit tr",/\btr\s+(-\w+\s+)?['"]?[\w\[]/]]},
{n:"93",p:2,q:"Warum ist Ihr home directory auf allen Rechnern im Rechnerübungsraum zugreifbar?",
 a:"Es liegt zentral auf einem Server und wird über das Netz auf jedem Rechner eingehängt (gemountet), typischerweise mit NFS.",
 k:[["liegt zentral auf einem Server",/server|zentral|netz/],["über das Netz eingehängt (NFS)",/nfs|mount|einhaeng|eingehaengt|netzlaufwerk|freigabe/]]},
{n:"94",p:1,q:"In welchem Unterverzeichnis befindet sich Ihr \"web space\"?",
 a:"In `~/public_html`.",k:[["~/public_html",/public_html/]]},
{n:"95",p:1,q:"Wie setzen Sie die Rechte, die index.html und Ihr public_html Verzeichnis benötigen, damit der Webserver darauf zugreifen kann?",
 a:"Der Webserver zählt als Andere. Home durchquerbar, public_html lesbar + durchquerbar, index.html lesbar.",c:"chmod o+x ~\nchmod o+rx ~/public_html\nchmod o+r ~/public_html/index.html",
 k:[["chmod o+x auf das Home",/chmod\s+(o\+x|711|755|a\+x|go\+x)\s+(~|\$home)/],["chmod o+rx auf public_html",/chmod\s+(o\+rx|755|a\+rx|go\+rx)\s+\S*public_html/],["chmod o+r auf index.html",/chmod\s+(o\+r|644|a\+r|go\+r|755|o\+rx|a\+rx)\s+\S*index\.html/]]},
{n:"96",p:1,q:"Welche Datei in Ihrem web space verhindert die Dateien-Auflistung im public_html?",
 a:"`index.html`: Liegt sie im Verzeichnis, liefert der Webserver sie aus statt der Dateiliste.",
 k:[["index.html",/index\.html?|index\.php/]]},
/* ---- Typische Aufgaben für den PS-Test ---- */
{n:"P1",p:1,ps:true,q:"Legen Sie mit man, head und tail an: Version1.txt mit 5 Zeilen Text und Version2.txt mit mindestens 2 Zeilen wie in Version1.txt, Rest beliebig.",
 a:"`>` legt an, `>>` hängt an. Version2 bekommt die ersten 2 Zeilen von Version1 und dann Text aus einer anderen Man-Page.",c:"man ls | head -n 5 > Version1.txt\nhead -n 2 Version1.txt > Version2.txt\nman cp | tail -n 3 >> Version2.txt",
 k:[["man … | head … > Version1.txt",/man\s+\S+\s*\|\s*head.*>\s*version1\.txt/],["Version2 aus head … Version1.txt",/head\s.*version1\.txt\s*>\s*version2\.txt/],["mit tail und >> anhängen",/tail.*>>\s*version2\.txt/]]},
{n:"P2",p:1,ps:true,q:"Geben Sie am Bildschirm die Unterschiede zwischen Version1.txt und Version2.txt aus. Speichern Sie die Ausgabe in die Datei diff.txt.",
 a:"tee zeigt die Ausgabe an UND schreibt sie in die Datei. (Oder zwei Befehle: einmal ohne, einmal mit > diff.txt.)",c:"diff Version1.txt Version2.txt | tee diff.txt",
 k:[["diff Version1.txt Version2.txt",/diff\s+version1\.txt\s+version2\.txt/],["| tee diff.txt",/tee\s+diff\.txt|>\s*diff\.txt/]]},
{n:"P3",p:1,ps:true,q:"Ermitteln Sie die Anzahl der Buchstaben und die Anzahl der Wörter, die insgesamt in Version1.txt und Version2.txt stehen (nur ein Befehl!).",
 a:"wc mit beiden Dateien gibt zusätzlich eine Zeile \"total\" aus. -w = Wörter, -m = Zeichen (-c = Bytes).",c:"wc -w -m Version1.txt Version2.txt",
 k:[["wc",/\bwc\b/],["-w (Wörter)",/-\w*w/],["-m oder -c (Zeichen)",/-\w*[mc]/],["beide Dateien",/version1\.txt\s+version2\.txt|version\*|version\[12\]/]]},
{n:"P4",p:1,ps:true,q:"Ermitteln Sie die Zahl der Zeilen in Version1.txt und Version2.txt insgesamt und speichern Sie diese Zahl in Statistik.txt (nur ein Befehl!).",
 a:"cat hängt beide Dateien zusammen, wc -l liefert dann nur die Zahl (ohne Dateinamen).",c:"cat Version1.txt Version2.txt | wc -l > Statistik.txt",
 k:[["cat beide | wc -l",/cat\s+(version1\.txt\s+version2\.txt|version\*)\s*\|\s*wc\s+-l/],["> Statistik.txt",/>\s*statistik\.txt/]]},
{n:"P5",p:1,ps:true,q:"Erweitern Sie Statistik.txt um die Buchstaben und Wörter (je nur ein Befehl, ohne Statistik.txt zu editieren).",
 a:"`>>` hängt an – ein einfaches `>` würde die Zeilenzahl überschreiben.",c:"cat Version1.txt Version2.txt | wc -w -m >> Statistik.txt",
 k:[[">> Statistik.txt",/>>\s*statistik\.txt/],["wc -w / -m",/wc\s+.*-\w*[wmc]/]]}
]};

/* ---------- Logik ---------- */
var PRIO={1:"A",2:"B",3:"C"}, PRIOTXT={1:"Zuerst lernen",2:"Danach",3:"Wenn Zeit bleibt"};
var ORDERED=OFFEN.fragen.slice().sort(function(a,b){return a.p-b.p||(a.ps?1:0)-(b.ps?1:0)||parseInt(a.n.replace("P",""))-parseInt(b.n.replace("P",""))});
function byId(id){for(var i=0;i<OFFEN.fragen.length;i++)if(OFFEN.fragen[i].n===id)return OFFEN.fragen[i];return null}
function ofSt(){return store("of_st")||{}}
function ofAns(){return store("of_ans")||{}}
function ofNorm(s){return String(s).toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[„“”«»]/g,'"').replace(/[‚‘’´`]/g,"'").replace(/\s+/g," ").trim()}
function ofGrade(x,ans){
  var t=ofNorm(ans), hits=x.k.map(function(k){return typeof k[1]==="function"?k[1](t):k[1].test(t)});
  var n=hits.filter(Boolean).length;
  return {hits:hits,n:n,pct:Math.round(100*n/x.k.length)};
}
function ofMode(){return window.OF_MODE||"lernen"}
/* Nächste Frage: in Prioritätsreihenfolge nach der aktuellen, die im Modus noch offen ist */
function ofNext(cur){
  var st=ofSt(), mode=ofMode(), i0=-1;
  for(var i=0;i<ORDERED.length;i++)if(ORDERED[i].n===cur)i0=i;
  for(var j=1;j<=ORDERED.length;j++){
    var x=ORDERED[(i0+j)%ORDERED.length], s=st[x.n];
    if(window.OF_PRIO&&x.p!==window.OF_PRIO) continue;
    if(mode==="fehler"? (s==="bad"||s==="part") : s!=="ok") return x.n;
  }
  return null;
}
window.ofHome=function(){
  setAccent("linux");
  var st=ofSt(), F=FACH.linux;
  var h=crumbs([[F.name,"#/linux"],["Prüfungsfragen WS26"]]);
  h+='<div class="th"><span class="tag">Offene Fragen</span><h1>Prüfungsfragen WS26</h1><p class="src">Quelle: '+esc(OFFEN.quelle)+' · 96 VO-Fragen + 5 PS-Test-Aufgaben</p></div>';
  h+='<p class="note">Du schreibst die Antwort selbst, dann wird sie auf die <b>Kernpunkte</b> geprüft und du siehst die Musterantwort. Am Ende entscheidest du: <b>gewusst</b>, <b>teilweise</b> oder <b>nicht gewusst</b>. „Gewusst“ kommt nicht mehr dran, der Rest wiederholt sich.<br>Die Prüfung sucht nur Stichworte und Befehle – sie ist eine Hilfe, kein Korrektor. Antworten und Prioritäten sind selbst erstellt, nicht offiziell.</p>';
  /* Fortschritt pro Priorität */
  h+='<div class="ofprio">';
  [1,2,3].forEach(function(p){
    var xs=ORDERED.filter(function(x){return x.p===p}), c={ok:0,part:0,bad:0};
    xs.forEach(function(x){if(c[st[x.n]]!=null)c[st[x.n]]++});
    var rest=xs.length-c.ok-c.part-c.bad;
    h+='<div class="ofp"><div class="ofph"><span class="ofbadge p'+p+'">'+PRIO[p]+'</span><b>'+PRIOTXT[p]+'</b><span class="mut sm">'+xs.length+' Fragen</span></div>'+
       '<div class="ofbar"><i class="ok" style="width:'+(100*c.ok/xs.length)+'%"></i><i class="part" style="width:'+(100*c.part/xs.length)+'%"></i><i class="bad" style="width:'+(100*c.bad/xs.length)+'%"></i></div>'+
       '<p class="sm mut">'+c.ok+' gewusst · '+c.part+' teilweise · '+c.bad+' nicht gewusst · '+rest+' offen</p>'+
       '<button class="pill" data-prio="'+p+'">Nur '+PRIO[p]+' abfragen</button></div>';
  });
  h+='</div>';
  var nOpen=ORDERED.filter(function(x){return st[x.n]!=="ok"}).length, nBad=ORDERED.filter(function(x){return st[x.n]==="bad"||st[x.n]==="part"}).length;
  h+='<div class="row actions"><button class="pill pr" id="ofgo">'+(nOpen?'▶ Abfrage starten – A vor B vor C ('+nOpen+' offen)':'Alles gewusst 🎉')+'</button>'+
     (nBad?'<button class="pill" id="ofbad">↻ Nur Fehler wiederholen ('+nBad+')</button>':'')+
     '<button class="pill" id="ofreset">Fortschritt zurücksetzen</button></div>';
  h+='<p class="sm mut" style="margin:-.4rem 0 1rem">A = Grundbefehle, Rechte, Pfade, ssh, Web-Space, PS-Test – kommt in mehreren Fragen und den Übungen vor. B = solide Befehle und Begriffe. C = Detail- und Allgemeinwissen; die im PDF <i>kursiv</i> gesetzten Fragen (67–70, 79–81, 85) sind evtl. neu oder weniger wichtig.</p>';
  [1,2,3].forEach(function(p){
    h+='<h2 class="sh"><span class="ofbadge p'+p+'">'+PRIO[p]+'</span> '+PRIOTXT[p]+'</h2><div class="oflist">';
    ORDERED.filter(function(x){return x.p===p}).forEach(function(x){
      var s=st[x.n]||"";
      h+='<a class="ofi '+s+'" href="#/linux/offen/'+x.n+'"><span class="ofn">'+(x.ps?x.n:x.n+'.')+'</span><span class="ofq">'+esc(x.q)+(x.kursiv?' <i class="mut">(kursiv)</i>':'')+'</span><span class="ofdot"></span></a>';
    });
    h+='</div>';
  });
  app.innerHTML=h;
  function go(mode,prio){window.OF_MODE=mode;window.OF_PRIO=prio||null;var n=ofNext(null);if(n)location.hash="#/linux/offen/"+n}
  document.getElementById("ofgo").onclick=function(){go("lernen")};
  var b=document.getElementById("ofbad"); if(b) b.onclick=function(){go("fehler")};
  app.querySelectorAll("[data-prio]").forEach(function(el){el.onclick=function(){go("lernen",+el.dataset.prio)}});
  document.getElementById("ofreset").onclick=function(){
    if(this.dataset.sure){store("of_st",{});store("of_ans",{});ofHome();}
    else{this.dataset.sure="1";this.textContent="Wirklich zurücksetzen?";}
  };
};
window.ofShow=function(id){
  var x=byId(id); if(!x){location.hash="#/linux/offen";return}
  setAccent("linux");
  var st=ofSt(), answers=ofAns(), pos=ORDERED.indexOf(x)+1;
  var modeTxt=ofMode()==="fehler"?"Fehler wiederholen":window.OF_PRIO?"Nur Priorität "+PRIO[window.OF_PRIO]:"Abfrage nach Priorität";
  var left=ORDERED.filter(function(y){var s=st[y.n];return (!window.OF_PRIO||y.p===window.OF_PRIO)&&(ofMode()==="fehler"?(s==="bad"||s==="part"):s!=="ok")}).length;
  var h=crumbs([[FACH.linux.name,"#/linux"],["Prüfungsfragen WS26","#/linux/offen"],[x.ps?"PS-Test "+x.n:"Frage "+x.n]]);
  h+='<div class="ofbarline"><span class="ofbadge p'+x.p+'">'+PRIO[x.p]+'</span><span class="sm mut">'+modeTxt+' · noch '+left+' offen · Nr. '+pos+' von '+ORDERED.length+'</span>'+(st[x.n]?'<span class="ofst '+st[x.n]+'">'+{ok:"gewusst",part:"teilweise",bad:"nicht gewusst"}[st[x.n]]+'</span>':'')+'</div>';
  h+='<div class="ofcard"><p class="ofqnum">'+(x.ps?'PS-Test-Aufgabe '+x.n.slice(1):'Frage '+x.n)+'</p><h1 class="ofqq">'+esc(x.q)+'</h1>';
  h+='<div class="edwrap"><textarea id="ofa" class="ed" rows="5" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Deine Antwort – Befehle so schreiben, wie du sie eintippen würdest …">'+esc(answers[x.n]||"")+'</textarea></div>';
  h+='<div class="row" style="margin-top:.7rem"><button class="btn pr" id="ofcheck">Prüfen</button><button class="btn" id="ofshow">Weiß ich nicht – Lösung zeigen</button><span class="sm mut">Ctrl/⌘ + Enter = Prüfen</span></div></div>';
  h+='<div id="offb"></div>';
  h+='<div class="row" style="justify-content:space-between;margin-top:1rem"><a class="pill" href="#/linux/offen">← Übersicht</a><button class="pill" id="ofskip">Überspringen →</button></div>';
  app.innerHTML=h;
  var ta=document.getElementById("ofa"), fb=document.getElementById("offb"), done=false;
  ta.focus();
  ta.addEventListener("input",function(){var a=ofAns();a[x.n]=ta.value;store("of_ans",a)});
  ta.addEventListener("keydown",function(e){if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();check(false)}});
  function next(){var n=ofNext(x.n); location.hash=n?"#/linux/offen/"+n:"#/linux/offen";}
  function rate(s){var o=ofSt();o[x.n]=s;store("of_st",o);next()}
  function check(giveUp){
    var g=giveUp?{hits:x.k.map(function(){return false}),n:0,pct:0}:ofGrade(x,ta.value);
    var sug=g.pct>=80?"ok":g.pct>=40?"part":"bad";
    var r='';
    if(!giveUp){
      r+='<div class="fbx '+(sug==="ok"?"good":sug==="part"?"warn":"bad")+'"><b>'+g.n+' von '+x.k.length+' Kernpunkten gefunden ('+g.pct+' %)</b><ul class="ofk">';
      x.k.forEach(function(k,i){r+='<li class="'+(g.hits[i]?"y":"n")+'">'+(g.hits[i]?"✓ ":"✗ ")+fmt(k[0])+'</li>'});
      r+='</ul></div>';
    }
    r+='<div class="fbx tip"><b>Musterantwort</b>'+fmt(x.a).replace(/\n/g,"<br>")+(x.c?'<pre class="code">'+esc(x.c)+'</pre>':'')+'</div>';
    r+='<p class="sm mut" style="margin:.2rem 0 .5rem">Wie gut wusstest du es? '+(giveUp?'':'(Vorschlag ist hervorgehoben – du entscheidest. Tasten 1 / 2 / 3)')+'</p>';
    r+='<div class="row ofrate"><button class="btn'+(sug==="ok"&&!giveUp?" sel":"")+'" data-r="ok">1 · ✓ Gewusst</button><button class="btn'+(sug==="part"&&!giveUp?" sel":"")+'" data-r="part">2 · ~ Teilweise</button><button class="btn'+(sug==="bad"||giveUp?" sel":"")+'" data-r="bad">3 · ✗ Nicht gewusst</button></div>';
    fb.innerHTML=r; done=true; ta.blur();
    fb.querySelectorAll("[data-r]").forEach(function(b){b.onclick=function(){rate(b.dataset.r)}});
    fb.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  document.getElementById("ofcheck").onclick=function(){check(false)};
  document.getElementById("ofshow").onclick=function(){check(true)};
  document.getElementById("ofskip").onclick=next;
  window.OF_KEY=function(e){
    if(!done||document.activeElement===ta) return;
    var m={"1":"ok","2":"part","3":"bad"}[e.key]; if(m){e.preventDefault();rate(m)}
  };
};
document.addEventListener("keydown",function(e){if(/^#\/linux\/offen\/./.test(location.hash)&&window.OF_KEY)window.OF_KEY(e)});
})();
