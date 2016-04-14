Villes Framework version 1.0
Se ytterligare projektbeskrivning och dylikt i dev/index.html


#### 1\. Vad är det här?

Det här är mitt försök att skapa ett ultra-lightweight ramverk. Egentligen är "ramverk" ett alldeles för generöst ord. Det här är snarare bara allt som jag annars spenderar den första timmen med att strukturera upp som jag till slut tröttnade på att göra om och om och om igen. Dock så kommer den med ett Gridsystem med eller utan gutters. Eftersom det oftast är det man (eller i allafall jag) framförallt är ute efter när man laddar ner ett ramverk. Den kommer även med en färdig Gulp-fil som gör allt det där tråkiga och nödvända såsom att minifiera CSS och JS, Kicka upp en Webbserver, optimera bilder, "watcha" din sass etc. Mer om det längre ner.

#### 2\. Komma igång

Du behöver ha SASS, Node (helst version 4.2.1) och Ruby installerat. Om du inte har det, så googla hur man gör det och fortsätt här när du är klar med det. Behöver du installera en äldre version av Node, exempelvis om du har version 5.0 installerat nu kan du [kika på det här.](https://github.com/tj/n) När du är klar så kan du öppna rotmappen, dvs. den som heter "ville framework-master" i din terminal. Skriv sen:

sudo npm install gulp -g // Sudo behövs bara om du är en macanvändare

För att installera gulp. Eftersom det finns en färdig jSon-fil som säger vilka versioner av respektive Dependencies som behövs samt en färdig gulpfil så behöver du efter det endast skriva

npm install

Förhoppningsvis så börjar din terminal då tanka ned alla Node-modules. Kan ta en stund så gå och ta en kopp kaffe då. När allt är nere så skriver du bara i samma terminalfönster

gulp

Gulp är alltså vårt default-kommando. Jag har lagt in en massa bra tasks som jag inte orkar beskriva men som du kan läsa mer om på [den här länken.](https://css-tricks.com/gulp-for-beginners/) Dock så har lagt till några som inte återfinns där. Bland annat.

*   **Autoprefixer** = Gör så att vi inte behöver skriva exempelvs <xmp>-moz-transition: all 0.3s ease; -webkit-transition: all 0.3s ease; transition: all 0.3s ease;</xmp> Utan endast transition: all 0.3s ease;
*   **Sourcemaps** = När vi granskar komponenten berättar den vilken SASS fil som innehåller den specifika regeln som elementet påverkas av

Eftersom jag inte vill committa upp tomma folders så behöver du göra lite jobb själv.

1.  Lägg till en mapp som heter dist i rotmappen. dvs. brevid mappen som heter dev
2.  Lägg till en mapp som heter images i dev mappen.
3.  Lägg till en mapp fil som heter fonts i dev mappen.

#### 3\. Vad ingår?

1.  En färdig väl beprövad mappstruktur
2.  Senaste versionen av jQuery
3.  En mycket användbar gulpfil och tillhörande Json-fil (som ovan beskrivet)
4.  Senaste versionen av Normalize.css
5.  Några sassfiler för att snabbare komma igång med kodandet. Filnamnen är självförklarande
6.  Några hjälpklasser.
7.  Ett basic gridsystem. Se nedan.

        
        

