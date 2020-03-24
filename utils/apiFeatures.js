
class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        // Clona a query da requisição
        const queryObj = {...this.queryString}

        // 1A) FILTERING - filtra o que vai entrar na busca
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 1B) ADVANCED FILTERING - conserta o gte por $gte
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` )

        // Cria a query inicial - Depois do filtering
        // let query = Tour.find(JSON.parse(queryStr))
        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1 // Diz qual página vai ser acessada
        const limit = this.queryString.limit * 1 || 100 // Limite de itens por página
        const skip = (page - 1) * limit // Faz o cálculo de quais itens aparecem em qual pag

        this.query = this.query.skip(skip).limit(limit) // Itens de determinada página e o limite

        return this
    }
}

module.exports = APIfeatures