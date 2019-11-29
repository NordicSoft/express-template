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

        let cursor = this.getCollection().aggregate([
            { $match : { code } },

            // this lookup doesn't preserve order:
            /*$lookup: {
                from: "photos", 
                localField: "photos", 
                foreignField: "_id", 
                as: "photos"
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
                            { deleted: { $exists: false } }
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
                as: "photos"
            }}
        ]);

        return (await cursor.toArray())[0];
    }

    async getNotEmpty() {
        let cursor = this.getCollection().aggregate([
            {
                $lookup: {
                    from: "photos",
                    let: { "photosIds": "$photos" },
                    pipeline: [
                        { $match: {
                            $and: [
                                { $expr: { $in: [ "$_id", "$$photosIds" ] } },
                                { deleted: { $exists: false } }
                            ]
                        }},
                    ],
                    as: "photosObjects"
                }
            },
            {
                //$match: { $expr: { $gt: [ { $size: "$photosObjects"}, 0 ] } }
                // better:
                $match: { photosObjects: { $exists: true, $ne: [] } } 
            },
            { 
                $addFields: { photosObjects: "$$REMOVE" }
            }
        ]);

        return cursor.toArray();
    }
}

module.exports = new PhotoSetsStore();