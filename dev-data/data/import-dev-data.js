const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')
const User = require('../../models/userModel')
const Review = require('../../models/reviewModel')

dotenv.config({ path: '../../config.env' })

// Pegando nossa url das variáveis de ambiente
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

// Conectando com o banco de dados, retorna uma promise
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB is running...'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`))

const deleteAllData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Delete successfully!')
        process.exit(1)
    } catch (err) {
        console.log(err)
    }
}

const readAllData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users, {validateBeforeSave: false })
        await Review.create(reviews)
        console.log('Oh yeah, data')
        process.exit(1)
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === '--import') {
    readAllData()
} else if (process.argv[2] === '--delete') {
    deleteAllData()
}

