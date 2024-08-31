class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        let queryObject = {...this.queryStr};
        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach((el) => {
           delete queryObject[el];
       });
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);
        this.query = this.query.find(queryObj);
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortByfields = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortByfields);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    pagination() {
        const page = this.queryStr.page;
        const limit = this.queryStr.limit;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
        // if (req.query.page) {
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip >= moviesCount) {
        //         throw new Error("No more records");
        //     }
        // }
    }
}

module.exports = ApiFeatures;