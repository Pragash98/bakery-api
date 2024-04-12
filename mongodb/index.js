const entityRoute = require("../config/resource");

exports.findAllRows = async (entity,populateArr,queryObj,limit,offset,sortObj) => {
    const result = {};
    return new Promise((resolve, reject) => {
        entityRoute[entity]
            .find(queryObj, null, {
                sort: sortObj,
                limit: limit,
                skip: offset,
                collation: {
                    locale: 'en'
                }
            })
            .populate(populateArr)
            .select(["-hashed_pwd", "-salt"])
            .then((rows) => {
                if (rows.length > 0) {
                    return entityRoute[entity]
                        .countDocuments(queryObj)
                        .then((count) => {
                            result.count = count;
                            result.rows = rows;
                            return resolve(result);
                        })
                        .catch((error) => {
                            console.log("Error:::", error);
                            return reject(error);
                        });
                }
                result.count = 0;
                result.rows = rows;
                return resolve(result);
            })
            .catch((error) => {
                console.log("Error:::", error);
                reject(error);
            });
    });
};