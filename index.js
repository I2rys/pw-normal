//Dependencies
const Path = require("path")
const Fs = require("fs")

//Variables
var Self = {}

//Functions
Self.directory_files = async function(dir){
    return new Promise((resolve)=>{
        var results = []

        Fs.readdir(dir, function (err, list) {
            if (err) return resolve(err)

            var list_length = list.length

            if (!list_length) return resolve(results)

            list.forEach(function (file) {
                file = Path.resolve(dir, file)

                Fs.stat(file, async function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        const res = await Self.directory_files(file)

                        results = results.concat(res)

                        if (!--list_length) resolve(results)
                    } else {
                        results.push(file)
                        
                        if (!--list_length) resolve(results)
                    }
                })
            })
        })
    })
}

Self.pretty_and_search = function(base_directory, files, to_search){
    var results = []

    files.forEach(file =>{
        var result = {
            normal: file,
            pretty_normal: ""
        }

        file = file.replace(`${Path.resolve(base_directory, "plugins")}\\`, "")
        file = file.replace(/\\/g, "/")

        if(file.indexOf(to_search) == -1){
            return
        }

        if(file.indexOf("main.js") == -1){
            return
        }
        
        result.pretty_normal = file.replace(/.\w+.js/g, "")
        results.push(result)
    })
    
    return results
}

//Main
async function search(base_directory = String, plugins_directory = String, to_search = String){
    return new Promise(async(resolve)=>{
        const files = await Self.directory_files(plugins_directory)
        const results = Self.pretty_and_search(base_directory, files, to_search)

        resolve(results)
    })
}

//Exporter
module.exports = {
    search: search
}
