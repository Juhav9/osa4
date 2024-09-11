const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    passwordHash: String,
    name: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.passwordHash
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('User', userSchema)