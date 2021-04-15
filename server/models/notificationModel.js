const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    plantStatus: Number,
    date: { type: Date, default: Date.now },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    plantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"plants"
    },
    type:String,
    seen:Boolean

})


module.exports = mongoose.model('notifications', notificationSchema);