module.exports = function paginate(schema) {

    schema.statics.paginate = async function ({ filter = {}, select, populatePath,populateSel, page = 1, limit = 5, sort = '-createdAt' }) {
        const skip = (page - 1) * limit;
           let baseSelect = Array.isArray(select) ? select.join(' ') : (select || '').trim();
           
           
        const data = 
             populatePath && populateSel 
             ? await this.find(filter).skip(skip).limit(limit).sort(sort).select(baseSelect).populate(populatePath,populateSel)
             : await this.find(filter).skip(skip).limit(limit).sort(sort).select(["-__v -password",baseSelect]);
            

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