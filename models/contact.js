const mongoose = require("mongoose");

const contactSchema  = new mongoose.Schema({
    user_name:{
        type:String,
        trim:true
    },
    phone:{
        type:Number
    },
    state:{
        type:String,
        trim:true,
        required:true
    },
    city:{
        type:String
    },
    pincode:{
        type:String
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model('Contact',contactSchema);