# Pokerbot

## Purpose
To see the difference bluff makes in Heads Up No Limit Texas Holdem played by a pokerbot.

## Installation

In case program asks for modules, install the required modules with command: 'npm install'.

## Running program
There are two ways for the poker bot to play, either against a human player or against itself. To play against pokerbot, run program 'node app.js' and access website through 'localhost:3000/'. The default pokerbot is without bluff. If you want to activate bluff, run program with command 'node app.js --bluff'.

To run pokerbot vs pokerbot simulation, run program 'node collectData.js'. The default simulation is pokerbot without bluff against pokerbot without bluff. To run pokerbot with bluff vs pokerbot without bluff, run program 'node collectData.js --bluff'. 

## Data logging of performance of pokerbot
Data is stored in txt files on the computer, specifically in the logFiles directory.

## Running unit tests
The program is tested using jest. To run the tests, use command 'npm test'.

## About us
2nd semester group SWB2-2
