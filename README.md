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
    
```

- Alle tests ligger i _"test "_ mappen. 


----------

## Conventions for use of git and GitHub

- For en introduktion til GitHub, se: [Brams cheatsheet til GitHub](https://paper.dropbox.com/doc/Git-cheat-sheet-hRMHn3gcZbv485DFLHQap)
- Master branchen bruges ALDRIG til udvikling af ny kode. 
    - Den eneste måde at ændre master, er gennem pull request, som accepteres af andre. 

- Branches laves ved udvikling af en ny feature. 
- Husk at _" git pull "_ for at være opdateret. 

----------

## Unit test

- Der vil bruges jest til test. 
    - Nemt at instalere, og simpelt at bruge
    

- Alle funktioner skal kunne testes
- Alle funktioner skal være gennemtestet
- En testfil kaldes "filnavn.test.js" hvor filnavn er hvor funktionen der testes kommerfra 
