const express = require("express");

const port = 3000;
const app = express();
let body;

app.use(express.static("website"));
/*app.get('/', (req, res) => {
    if (req.method === "POST") {
        res.writeHead(200, {
            "Content-Type": "*",
            "Access-Control-Allow-Origin": "*"
        });
        req.on("data", (chunck) => {
            body += chunck.toString();
            console.log(body);
        });
    }
});
*/
app.listen(port, () => console.log("Server is running..."));