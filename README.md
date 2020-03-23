# P2 - B2   

----------

## Kode konvention


- Require skal være i toppen.
- Funktioner skal beskrives. 
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
    
```


- Source files, header files and files containg tests are seperated into different directories to keep the project organized.
- Source files goes in the directory "source".
- Header files goes in the directory "headers".
  - These can be included in the source files by writing: `#include "../headers/example.h"`
- Test files goes in the directory "tests".

- In order to keep compilation easy and structured a Makefile has been created and MUST be updated, whenever new files are added to the project.
  - For a simple tutorial of the use of our Makefile see [Kurt's video about Makefiles](https://laml.cs.aau.dk/cgi-bin/video2/get/show-video.cgi?video-id=video-make-rettet&course-id=impr&lecture-number=5&course-year=2019&video-width=640&lang=dk&user-name=rhebsg19&crypted-password=not-used&video-start-time=00:00&auto-play=0)

----------

## Conventions for use of git and GitHub

- For an introduction to GitHub see: [Brams file about GitHub](https://paper.dropbox.com/doc/Git-cheat-sheet-hRMHn3gcZbv485DFLHQap)
- The master branch of the repository is NEVER for development of new code.
  - The only way for the master branch to change, is through pull requests of tested code.

- A new branch should be created for each new feature.
- Remember to "git pull" at regular intervals, and at least every time you have been away from development.
- Each pull request should at least explain, what has been added or changed.
- Refactoring should in general not happen as part of development, but as a seperate 'feature'.

- It is at the discretion of Rasmus, whether or not a branch may be merged into the master.

----------

## Unit testing

- The testing framework in use is CuTest.
  - Easy to install and simple to use
  - Does not offer much advanced information (e. g. runtime and code coverage)
  - Does what it needs to do for this relatively simple piece of software

- All functions should be testable.
- All functions should be fully covered by unit tests.
