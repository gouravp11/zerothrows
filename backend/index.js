const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./routes/auth');

const corsOptions = {
    origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions));

app.use('/auth', authRoutes);


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
})