const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
})