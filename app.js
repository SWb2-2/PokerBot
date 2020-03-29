const express = require("express");

const port = 3000;
const app = express();
let body = [];

app.use(express.static("website"));
app.use(express.urlencoded({extended:false}));

app.get("/index", (req, res) => {
    res.redirect("game.html");
});

app.post('/balance', (req, res) => {
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

app.post('/player_move', (req, res) => {
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
        res.end(JSON.stringify({pot_size: 15, player_balance: 90, whose_turn: "robot"}));
    }
});

app.get('/player_object', (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});

app.get('/setup_object', (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});

app.get('/ai_move', (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});

app.get('/table_update', (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});

app.get('/winner', (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "*",
        });
        res.statusCode = 200;
        res.end("request accepted");
    }
});
app.listen(port, () => console.log("Server is running..."));