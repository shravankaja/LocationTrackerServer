const utilityFunctions = require('../../utility/utilityFunctions')
const jwt_decode = require('jwt-decode')
const fs = require('fs')



const editPinnedLocation = (req,res) => {


    const {userid, token} = req.headers
    const { lat,lng,desc,address,locationid} = req.body
  

    const parsedToken = jwt_decode(token)
    
    if(userid !== " " && token !== " " && locationid !== " ") {

        fs.readFile('../db/users.json', (err,data) => {

            if(err) {
                res.status(400).json("bad request")
                return
            }
    
            let userData = JSON.parse(data.toString())


        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {

            fs.readFile('../db/pinnedlocations.json', (err,dataLocation) => {
                
                if(err) {
                    res.status(500).json("internal server error")
                    return
                }  
            
                let locationData = JSON.parse(dataLocation.toString())
                if(locationData[userid]) {
                locationData[userid].map(function(loc) {
                        if(loc.locationid === locationid) {
                            loc.lat = lat
                            loc.lng = lng
                            loc.desc = desc
                            loc.address = address
                        }
                        return loc
                    })

                    fs.writeFile("../db/pinnedlocations.json", JSON.stringify(locationData),(err,result) => {
                        if(err) {
                            console.log("gone dowm")
                        }
    
                        if(result) {
                            console.log("sucess")
                        }
                        
                    })
                    res.status(200).json("Location edidted successfully")
                    
                } else {
                    res.status(404).json("location not found")
                    return
                }

            })

        } else {
            res.stats(401).json("unauthorized")
            return
        }

    })

} else {

    res.status(400).json("bad request")
    return

}


}

exports.editPinnedLocation = editPinnedLocation;