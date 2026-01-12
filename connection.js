//connection.js file
const mongoose = require("mongoose");

// mongodb+srv://pratikkumar5750:mheekd9tSQqWF3ui@cluster0.x12xsyl.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://apple1fond:Qm409eH7wg1NSgMS@cluster0.smraf8h.mongodb.net/?appName=Cluster0")
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