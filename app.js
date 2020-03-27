const express = require("express");

const port = 3000;
const app = express();
let body = [];

app.use(express.static("website"));
//app.use(express.json({limit:"1mb"}));

app.post('/', (req, res) => {
    if (req.method === "POST") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        req.on("data", (chunck) => {
            body.push(chunck);
        }).on("end", () => {
            body = Buffer.concat(body).toString();
            console.log(body);
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});

app.listen(port, () => console.log("Server is running..."));

/*

const express = require('express');
const fs = require('fs');
const path = require('path');
const directory = "website/";
 
// process.cwd returnerer current working directory...
const rootFile = process.cwd();
console.log(rootFile);
 
function findPath(reqPath) {
    reqPath = directory + reqPath;
    //sætter de to stier sammen, nemlig fra serveren og ned til anmodede sti, som gerne skal ligge i directory Public
    let pathFromServer = path.join(rootFile, path.normalize(reqPath));
    return pathFromServer;
}
 
// Når et bestemt filnavn anmodes bruges denne funktion til at frembringe den til klienten fra serveren
function fileResponse(fileReq, response) {
    // find stien til den anmodede side...
    reqPath = findPath(fileReq);
    // Læs siden og se om alt er okay.
    fs.readFile(reqPath, (error, data) => {
        // Hvis ikke, returner en respons der siger, at siden ej kunne findes.
        if (error) {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/txt');
            response.write("Sorry, could not find the requested site " + reqPath + ". Error: " + error);
            response.end();
        }
        // Ellers, hvis alt kører som det skal, skal klienten nu have siden. 
        // Dette gøres ved at udskrive data læst gennem fs via response.write
        else {
            response.statusCode = 200;
            response.setHeader('Content-Type', defineFileType(fileReq));
            response.write(data);
            response.end('\n');
        }
    });
}
// Finder ud af hvilken filtype der søges og sætter respons content-type som følge deraf
function defineFileType(fileName) {
    // Objekt med mulige filtyper:
    let listOfTypes = {
        'txt': 'text/txt',
        'css': 'text/css',
        'js': 'text/js',
        'html': 'text/html',
        'json': 'application/json'
    };
    // Filtype defineres af bogstaver efter punktum. Derfor søges index af dette i filnavnet.
    let startPoint = String(fileName).indexOf(".");
    let end = String(fileName).length;
    // Her laves subarray med slice, hvor kun fildefinitionen, altså det efter punktummet er med. 
    let fileEndName = Array.from(fileName).slice(startPoint + 1, end);
    console.log(fileEndName.join(""));
    // Slutteligt bruges metoden join til at slutte arrayet sammen igen, således der ikke er kommaer.
    // Og der søges i objektet, om der er en filtype der passer.
    return (listOfTypes[fileEndName.join('')] || console.log("Should not be here"));
}
// Modtager expenses og gemmer dem på serveren, mens den er aktiv.
let expenses = [];
let objOfNames = {};
let server = express();
server.use(express.json({limit: '1mb'}));
server.use(express.static("website"));
server.post('/', (request, response) => {

    //expenses.push(request.body);
    //console.log();
    
    response.json({
        status: 201,
        note: "Post was successful",
        message: "Added: " + JSON.stringify(request.body)
    });
    response.end();
});

server.listen(3000, () => console.log("server is running"));*/