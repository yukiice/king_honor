const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String
    },
    parent:{
        type:mongoose.Schema.ObjectId,
        ref:'Category'
    }
})

module.exports = mongoose.model('Category',schema)