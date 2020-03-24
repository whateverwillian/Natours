const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' }) // Adicionando NODE_ENV=development

// Se houver um erro uncaught exception vai fechar o server
process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    console.log('UNCAUGHT EXCEPTION!')
    process.exit(1)
})

// Se houver um erro unhandle rejection vai fechar o server
process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION!')
    server.close(() => process.exit(0))
})

const app = require('./app')

// Pegando nossa url das variáveis de ambiente
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

// Conectando com o banco de dados, retorna uma promise
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => console.log('DB is running...'))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})


