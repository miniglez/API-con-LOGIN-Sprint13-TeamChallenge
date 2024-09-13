const bycrypt = require("bcrypt")
const crypto = require("crypto")

const secret = crypto.randomBytes(64).toString("hex")
const hashSecret = bycrypt.hashSync(secret, 10)

module.exports = hashSecret