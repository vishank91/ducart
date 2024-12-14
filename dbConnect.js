const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/we_9_30_am_october_2024_server")
// .then(()=>{
//     console.log("Database is Connected")
// })
// .catch((error)=>{
//     console.log(error)
// })


async function getConnect() {
    try {
        await mongoose.connect(process.env.DB_KEY)
        console.log("Database is Connected")
    } catch (error) {
        console.log(error)
    }
}
getConnect()
