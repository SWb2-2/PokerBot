const express = require("express");

const port = 3000;
const app = express();
let body = [];

app.use(express.static("website"));
app.use(express.urlencoded({extended:false}));
app.get("/index", (req, res) => {
    res.redirect("game.html");
});

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