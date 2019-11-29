const Store = require("./../store"),
    logger = require("./../../lib/logger");

class PhotoSetsStore extends Store {
    constructor() {
        logger.debug("PhotoSetsStore created");
        super("photosets");
    }
    async getByCode(code) {
        return await this.getCollection().findOne({ code: code });
    }
    async getByCodeWithPhotos(code) {
        /*let cursor = this.getCollection().aggregate([
            { $match : { code } },
            {
                // replace photoSet.photos array of ids with related photo objects
                $lookup: {
                    from: "photos", 
                    localField: "photos", 
                    foreignField: "_id", 
                    as: "photos2"
                }
            },
        ]);*/

        let cursor = this.getCollection().aggregate([
            { $match : { code } },

            // this lookup doesn't preserve order:
            /*$lookup: {
                from: "photos", 
                localField: "photos", 
                foreignField: "_id", 
                as: "photos2"
            }*/

            // replace photoSet.photos array of ids with related photo objects
            // lookup which preserves order:
            {$lookup: {
                from: "photos",
                let: { "photosIds": "$photos" },
                pipeline: [
                    { $match: {
                        $and: [
                            { $expr: { $in: [ "$_id", "$$photosIds" ] } },
                            { deleted: {$exists: false} }
                        ]
                    }},
                    { $addFields: {
                        sort: {
                            $indexOfArray: [ "$$photosIds", "$_id" ]
                        }
                    }},
                    { $sort: { sort: 1 } },
                    { $addFields: { sort: "$$REMOVE" }}
                ],
                "as": "photos"
            }}
        ]);


        return (await cursor.toArray())[0];
    }
}

module.exports = new PhotoSetsStore();