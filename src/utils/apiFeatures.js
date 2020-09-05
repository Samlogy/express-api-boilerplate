class ApiFeatures {
	constructor(query, reqQuery) {
		this.query = query // like: Model.find() (without await it will return a query )
		this.reqQuery = reqQuery // req.query object received from the browser
	}

	filter() {
		// 1- Filtering mongoDB methods that comes with req.query
		const reqQueryCopy = { ...this.reqQuery }
		const excludedQueries = ['limit', 'page', 'sort', 'fields']
		excludedQueries.forEach((element) => delete reqQueryCopy[element])

		// 2- Advanced Filtering mongoDB operators
		let reqQueryString = JSON.stringify(reqQueryCopy)
		reqQueryString = reqQueryString.replace(/\b(gte|gt|lte|lt)\b/gi, (matchedString) => `$${matchedString}`)
		this.query = this.query.find(JSON.parse(reqQueryString))

		return this
	}

	sort() {
		// 3 Sorting
		if (this.reqQuery.sort) {
			const sortBy = this.reqQuery.sort.split(',').join(' ')
			this.query = this.query.sort(sortBy)
		} else this.query = this.query.sort('-createdAt -rating')

		return this
	}

	limitingFields() {
		// 5- Limiting fields
		if (this.reqQuery.fields) {
			const fields = this.reqQuery.fields.split(',').join(' ')
			this.query = this.query.select(fields)
		}
		return this
	}

	limitContentAndOrPagination() {
		// 6- Pagination and limit content
		const page = parseInt(this.reqQuery.page, 10) || 1
		const limit = parseInt(this.reqQuery.limit, 10) || 20
		const skipValue = (page - 1) * limit
		this.query = this.query.skip(skipValue).limit(limit)

		return this
	}
}

module.exports = ApiFeatures
