const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const app = express();
const PORT = process.env.PORT || 3000 

app.use(cors());
app.use(helmet());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.get("/", (req, res) => {
    res.json({message: "i am working"})
})



app.listen(PORT, () => {
    console.log(`Server Listening on PORT ${PORT}`)
})
