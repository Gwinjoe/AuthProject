const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000
const router = require("./routers/authRouter")
const path = require("path")
app.use(cors({
  corsOptions: ["https://google.com", "http://localhost:3000"]
}));
app.use(helmet());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Database Connected")
}).catch((err) => {
  console.error(err)
})


app.use("/api/auth", router)
app.get("/", (req, res) => {
  res.json({ message: "i am working" })
})
app.get("/views", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})


app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`)
  console.log(process.env.MONGO_URI)
})
