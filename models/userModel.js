const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role : {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    // This only works CREATE and SAVE
    passwordConfirm: {
        type: String,
        required: [true, 'Please, confirm your password'],
        validate: {
            validator: function (el) { 
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

// Encripta a senha
userSchema.pre('save', async function(next) {
    
    // Only run this if the password was actually modified
    if (!this.isModified('password')) return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete password Confirm field
    this.passwordConfirm = undefined
})

// Registra quando a senha foi modificada
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangeAt = Date.now() - 1000
    next()
})

// Inactive users
userSchema.pre(/^find/, function(next) {
    this.find({ active: {$ne: false} })
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTime) {

    // Se esse parâmetro não existir o usuário nunca mudou a senha
    if (this.passwordChangeAt) {
        const changedTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10)

        return JWTTime < changedTime
    }
    
    // FALSE means NOT CHANGED
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User

