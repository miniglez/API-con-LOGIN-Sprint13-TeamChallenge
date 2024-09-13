const express = require("express")
const session = require("express-session")

const hashSecret = require("./secretCode/secretCode.js")
const router = require("./routes/routes.js")

const app = express()
const PORT = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
    secret: hashSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use("/", router)

app.listen(PORT, () => {
    console.log(`El servidor esta en http://localhost:${PORT}`)
})