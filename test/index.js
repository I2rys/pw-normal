//Dependencies
const PW_Normal = require("../index.js")

//Functions
async function Main(){
    const results = await PW_Normal.search(__dirname, "./plugins", "test")

    for( i in results ){
        console.log(results[i].pretty_normal)
        require(results[i].normal).self()
    }
}

//Main
Main()
