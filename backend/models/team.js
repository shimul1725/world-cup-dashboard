const mongoose = require("mongoose");


const teamSchema = new mongoose.Schema({


name:String,

chance:Number,


attack:Number,

defense:Number,

midfield:Number


});



module.exports = mongoose.model(
"Team",
teamSchema
);