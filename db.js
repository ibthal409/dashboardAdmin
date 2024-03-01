const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({ path: './config.env' })
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABAS_PASSWORD)
function connect() {
  mongoose.connect(DB)
    .then(() => {
      console.log("ok data is connect")
    }).catch((err) => {
      console.log(err)
    })
}



module.exports = {
  connect
}