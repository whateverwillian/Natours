)

// Conectando com o banco de dados, retorna uma promise
mongoose.connect(DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => console.log('DB is running...'))

const port = process.env.PORT || 3000
app.listen(port, () => {
