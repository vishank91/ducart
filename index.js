const express = require("express")
const cors = require("cors")
const path = require("path")

require("dotenv").config()

const MainRouter = require("./routes/MainRouter")

const app = express()

var whitelist = ['http://localhost:3000', 'http://localhost:8000',] 
var corsOptions = {
    origin: function (origin, callback) {
        // console.log("Origin",origin)
        if (whitelist.includes(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error, You Are not authenciated to access this api'))
        }
    }
}

app.use(cors(corsOptions))

require("./dbConnect")

app.use(express.static("./public"))//set this path use upload files like images etc
app.use("/public", express.static("./public"))//set this path to serve uploaded files
app.use(express.static(path.join(__dirname, 'build')))

app.use(express.json())

app.use("/api", MainRouter)
app.use('*', express.static(path.join(__dirname, 'build')))

let port = process.env.PORT || 8000
app.listen(port, console.log(`Server is Running at port ${port}`))



