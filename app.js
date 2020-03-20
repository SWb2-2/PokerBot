let http = require('http');
const fs = require ('fs')
const port = 3000 
//ip adress 46.30.215.207
// domain peter3010.dk
// port 200
 
const server = http.createServer((req, res) => {
    res.writeHead(200,{ 'content-type': 'text/html' });
    fs.readFile('index.html', (error, data) => {
        if(error === null) {
            res.write(data);
            res.end();
        } else {
            res.writeHead(404);
            res.write('error: fil ikke fundet');
            res.end();
        }
    });
});

server.listen(port, function(error){
    if(error){
        console.log('Noget gik galt',error);
    } else {
      console.log('serveren svarer' + port);
    }
});
