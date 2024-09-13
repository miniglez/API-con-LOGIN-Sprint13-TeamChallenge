const axios = require("axios")

module.exports = async (url, filtrado) => {
    try{
        const response = await axios.get(url)
        const data = response.data.results

        if(filtrado){
            const characters = data.map(character => {
                return {name, gender, image, species, status, origin} = character
            })
            console.log(characters[1].origin)
            return characters
        }
        else{
            return data
        }
    }
    catch(error){
        console.log(error)
    }
}