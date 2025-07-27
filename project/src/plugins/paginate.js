module.exports = function paginate(schema) {
    schema.statics.paginate = async function({ filter = {}, populate, page = 1, limit = 5, sort = '-createdAt' }) {
        const skip = (page - 1) * limit;
        const data = 
            populate 
            ? await this.find(filter).skip(skip).limit(limit).sort(sort).select("-__v -password").populate(populate, "-password -__v")
            : await this.find(filter).skip(skip).limit(limit).sort(sort).select("-__v -password");
            
        const total = await this.countDocuments(filter);
        const pages = Math.ceil(total / limit);
        const hasNextPage = page < pages;
        const hasPrevPage = page > 1;

        return { 
            data, 
            total, 
            page, 
            pages, 
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null 
        };
    };
};