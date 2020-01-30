const mongoose = require('mongoose')
const Schema = mongoose.Schema

let schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    // posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
})

module.exports = mongoose.model('Author', schema, 'author')