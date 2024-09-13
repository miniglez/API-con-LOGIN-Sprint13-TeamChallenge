const jwt = require("jsonwebtoken")
const hashSecret = require("../secretCode/secretCode.js")

const generateToken = (user) => {
    return jwt.sign({user: user.id}, hashSecret, {expiresIn: "2h"})
}

const verifyToken = (req, res, next) => {
    const token = req.session.token
    if(!token){
        return res.status(401).json({error: "Token no generado"})
    }
    else{
        jwt.verify(token, hashSecret, (error, decoded) => {
            if(error){
                return res.status(401).json({mensaje: "Token invalido"})
            }
            else{
                req.user = decoded.user
                next()
            }
        })
    }
}

module.exports = { generateToken, verifyToken }