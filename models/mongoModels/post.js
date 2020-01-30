const mongoose = require('mongoose')
const Schema = mongoose.Schema

let schema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
})

module.exports = mongoose.model('Post', schema, 'post')