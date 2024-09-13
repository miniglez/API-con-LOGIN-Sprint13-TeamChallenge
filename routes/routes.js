const express = require("express")

const router = express.Router()
const users = require("../userData/users.js")
const { generateToken, verifyToken } = require("../middlewares/middlewares.js")
const findCharacters = require("../findCharacters/findCharacters.js")
const session = require("express-session")

const url = "https://rickandmortyapi.com/api/character"
const urlCharacter = url + "/?name="


router.get("/", (req, res) => {
    const token = req.session.token
    if(!token){
        const template = 
        `
            <h1>RICK AND MORTY API</h1>
            <form action="/login" method="post">
                <label for="username">Usuario</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Iniciar sesion</button>
            </form>
        `
        res.send(template)
    }
    else{
        res.redirect("/search")
    }
})

router.post("/login", (req, res) => {
    const {username, password} = req.body
    const user = users.find(user => user.username === username && user.password === password)

    if(!user){
        res.status(401).json({error: "Credenciales incorrectas"})
    }
    else{
        const token = generateToken(user)
        req.session.token = token
        res.redirect("/search")
    }
})

router.get("/search", verifyToken, (req, res) => {
    const userID = req.user
    const user = users.find(user => user.id === userID)

    if(!user){
        res.status(401).json({mensaje: "usuario no encontrado"})
    }
    else{
        const template = 
        `
            <h1>BUSCADOR PERSONAJES RICK AND MORTY API</h1>
            <form action="/findCharacter" method="post">
                <label for="character">Personaje</label>
                <input type="text" id="name" name="name" required>
                <button type="submit">Iniciar sesion</button>
            </form>
            <form action="/logout" method="post">
                <button type="submit">Log out</button>
            </form>
        `
        res.send(template)
    }
})

router.post("/findCharacter", (req, res) => {
    const name = req.query.name
    res.redirect(`/characters/`+name)
})

router.get("/characters", verifyToken, async (req, res) => {
    const userID = req.user
    const user = users.find(user => user.id === userID)

    if(!user){
        res.status(401).json({mensaje: "usuario no encontrado"})
    }
    else{
        const data = await findCharacters(url, false)
        res.json(data)
    }
})


router.get("/characters/:name",verifyToken, async (req, res) => {
    const userID = req.user
    const user = users.find(user => user.id === userID)
    

    const data = await findCharacters((urlCharacter + req.params.name), true)

    if(!user){
        res.status(401).json({mensaje: "usuario no encontrado"})
    }
    else{
        const template = data.map(character => {
            templateChar = 
            `
                <h2>${character.name}</h2>
                <img src="${character.image}" alt="${character.name} image"/>
                <ul>
                    <li>Genero: ${character.gender}</li>
                    <li>Estado: ${character.status}</li>
                    <li>Origen: ${character.origin.name}</li>
                    <li>Especie: ${character.species}</li>
                </ul>
            `
            return templateChar
        }).join("")
        
        res.send(template)
    }
    
})

router.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router