const jwt_decode = require('jwt-decode')
const utilityFunctions = require('../../utility/utilityFunctions')
const fs = require('fs')
const shortid = require('shortid');

const storePinnedLocations = (req,res) => {

    //console.log(req.headers)
    const {userid,token} = req.headers
    const {lat, lng, desc,address} = req.body
    console.log(token,"jjjj",userid)
    console.log(lat,lng,desc,address)
    

    const parsedToken = jwt_decode(token)
   // console.log("hellos",parsedToken)
    
    fs.readFile('../db/users.json', (err,data) => {

        if(err) {
            res.status(400).json("bad request")
            return
        }

        let userData = JSON.parse(data.toString())

        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
            fs.readFile('../db/pinnedlocations.json', (err,dataLocation) => {
                let locationData = JSON.parse(dataLocation.toString())
                console.log(userid)
                if(locationData[userid]) {
                    locationData[`${userid}`].push({address : address,lat : lat,lng : lng, desc : desc , locationid : userid + shortid.generate()})
                } else {
                    locationData[`${userid}`] =[]
                    locationData[`${userid}`].push({address : address, lat : lat, lng : lng,desc : desc , locationid : userid + shortid.generate() })
                   
                }
                fs.writeFile("../db/pinnedlocations.json", JSON.stringify(locationData),(err,result) => {
                    if(err) {
                        console.log("gone dowm")
                    }

                    if(result) {
                        console.log("sucess")
                    }
                })
            
            })
        }
    
    
    
    })


    res.status(200).json("hello")
    return
    
}

exports.storePinnedLocations = storePinnedLocations;