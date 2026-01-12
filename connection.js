//connection.js file
const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;
// console.log("URL: ",MONGODB_URL);

mongoose.connect(MONGODB_URL)
    .then((result) => 
        console.log("Connected SuccessFully ")
    )

    .catch(() => {
        console.log("Not Connected To MongoDataBase")
    })

module.exports = mongoose;


// //connection.js file
// const mongoose = require("mongoose");


// mongoose.connect("url")
//     .then((result) => 
//         console.log("Connected SuccessFully ")
//     )

//     .catch(() => {
//         console.log("Not Connected To MongoDataBase")
//     })

// module.exports = mongoose;
