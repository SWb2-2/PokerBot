# P2 - B2   
----------
## Kode konvention


- Require skal være i toppen.
- Funktioner skal beskrives.
- Funktioner og classes skal eksporteres. 
- Variabler skal deklareres i toppen af tilhørende blok. 
- Variable og funktionsnavne
    - Skal være beskrivende
    - Skrives i småt, og med _ mellem navne 


- Koden skal formateres ud fra dette eksempel 
```js
    const Class = require("./class.js");

    //En beskrivelse af funktionen
    function eksempel_funktion(variable) {
    
        let resultat;
        
        for(let i = start; i < limit; i++) {
            console.log("Hej");
            
            if(i == variable) {
                resultat = i; 
                break;
            }
        }
        
        if(variable == i) {
            i = 10;
        } else if(variable > i) {
            i = 11;
        } else {
            i = 12;
        }
    }
    
    let k = new Class;
    console.log(k);
    
    module.exports.eksempel_funktion = eksempel_funktion;
    
```


----------

## Conventions for use of git and GitHub

- For en introduktion til GitHub, se: [Brams cheatsheet til GitHub](https://paper.dropbox.com/doc/Git-cheat-sheet-hRMHn3gcZbv485DFLHQap)
- Master branchen bruges ALDRIG til udvikling af ny kode. 
    - Den eneste måde at ændre master, er gennem pull request, som accepteres af andre. 

- Nye branches laves til udvikling af en ny feature. 
- Husk at _" git pull "_ for at være opdateret. 

----------

## Unit test

- Der vil bruges jest til test. 
    - Nemt at instalere, og simpelt at bruge
    
  
- Alle funktioner skal kunne testes
- Alle funktioner skal være gennemtestet
- En testfil kaldes "filnavn.test.js" hvor filnavn er navnet af filen, som funktionen kommer fra. 
- Alle testfiler gemmes i _test_ mappen

Eksempel::
Dette er vores main funktion
filnavn:
addition.js
```js
    function plus(x, y) {
        return x + y;
    }
     module.exports.plus = plus;
```
Test filnavn:
addition.test.js
```js
    const plus = require("../addition.js");
    
    test("Beskrivende tekst - test af plus, forventer summet af to tal, () => {
    
    //Opsætter testmiljøet
    let j = 3, k = 4;
    
    //Kalder funktionen
    let svar_fra_funktion = plus(j, k);
    
    //Gennemgår testen
    expect(svar_fra_funktion).toBe(7);
    
    //Alternativ
    expect(plus(j,k)).toStrictEqual(7);
    }
```
For at køre testene skal "jest" installeres. 
I konsolen skriv:
    npm install jest

For at køre testene skriv:
    npm test
    
