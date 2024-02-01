const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://paytm:paytm@cluster1.xczpq3b.mongodb.net/paytm')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
})

const accountsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    balance: Number
})

const User = new mongoose.model('User',userSchema);
const Accounts = new mongoose.model('Accounts',accountsSchema)

module.exports = {
    User,
    Accounts,
}