import {logger} from '../helpers/customLogger';

/**
 * ModelEntity Class
 */
class ModelEntity {
    /**
     *
     * @param {Model} model
     * @param {Object} options
     */
    static count(model, options) {
        return model.count(options).catch(error => {
            logger.error(`${model} entity count error`, error)
            throw error;
        });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} options
     */
    static findAndCountAll(model, options) {
        return model.findAndCountAll(options)
            .catch(error => {
                logger.error(`${model} entity get list error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} entity
     */
    static create(model, entity) {
        return model.create(entity)
            .catch(error => {
                logger.error(`${model} entity create error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} entity
     */
    // static createOrUpdate(model, entity) {
    //   return Promise.try(() => {
    //     console.log("entity in model: ", entity);
    //
    //     return model.createOrUpdate(entity);
    //   }).catch(error => {
    //     throw new ApiErrors.BaseError({
    //       statusCode: 202,
    //       type: 'crudError',
    //       error,
    //       name: model + 'Entity'
    //     });
    //   });
    // }

    /**
     *
     * @param {Object} model
     * @param {Object} entity
     */
    static bulkCreate(model, entity) {
        return model.bulkCreate(entity)
            .catch(error => {
                logger.error(`${model} entity bulk create error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} entity
     * @param {Object} options
     */
    static update(model, entity, options) {
        return model.update(entity, options)
            .catch(error => {
                console.log(error)
                logger.error(`${model} entity update error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} options
     */
    static destroy(model, options) {
        return model.destroy(options)
            .catch(error => {
                console.log(error);
                logger.error(`${model} entity delete error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} options
     */
    static findOne(model, options) {
        return model.findOne(options)
            .catch(error => {
                logger.error(`${model} entity find one error`, error)
                throw error;
            });
    }

    /**
     *
     * @param {Model} model
     * @param {Object} options
     */
    static findAll(model, options) {
        return model.findAll(options)
            .catch(error => {
                logger.error(`${model} entity find all error`, error)
                throw error;
            });
    }

    // /**
    //  *
    //  * @param {Model} model
    //  * @param {*} options
    //  */
    // static findOrCreate(model, options) {
    //     return Promise.try(() => {
    //         return model.findOrCreate(options);
    //         // .spread(async (findReportImExCreate, created) => {
    //     }).catch(error => {
    //         throw new ApiErrors.BaseError({
    //             statusCode: 202,
    //             type: 'getListError',
    //             error,
    //             name: model + 'Entity'
    //         });
    //     });
    // }
    //
    // /**
    //  *
    //  * @param {Model} model
    //  * @param {Object} entity
    //  * @param {Object} options
    //  */
    // static createOrUpdate(model, entity, options) {
    //     return new Promise((resolve, reject) => {
    //         return model.findOne(options).then(foundItem => {
    //             // console.log( "options", options)
    //
    //             // console.log( "entity", entity)
    //
    //             // console.log( "foundItem==================", foundItem)
    //             if (!foundItem) {
    //                 // console.log("tao moi==============",entity)
    //
    //                 return model
    //                     .create(entity)
    //                     .then(data1 => {
    //                         // console.log('item create: ', data1.dataValues);
    //
    //                         const output = {
    //                             item: data1.dataValues,
    //                             created: true
    //                         }
    //
    //                         resolve(output);
    //                     })
    //                     .catch(error => {
    //                         throw new ApiErrors.BaseError({
    //                             statusCode: 202,
    //                             type: 'crudError',
    //                             error,
    //                             name: model + 'Entity'
    //                         });
    //                     });
    //             }
    //
    //
    //             return model
    //                 .update(entity, options)
    //                 .then(async data1 => {
    //                     // console.log("update foundItem.id ",foundItem.id);
    //                     await model
    //                         .findOne({
    //                             where: {
    //                                 id: foundItem.id
    //                             }
    //                         })
    //                         .then(data2 => {
    //                             // console.log('data find khi update 2: ');
    //                             // console.log('data find khi update: ', data2.dataValues);
    //                             const output = {
    //                                 item: data2.dataValues,
    //                                 created: false
    //                             }
    //
    //                             resolve(output)
    //                         })
    //                         .catch(error => {
    //                             throw new ApiErrors.BaseError({
    //                                 statusCode: 202,
    //                                 type: 'crudError',
    //                                 error,
    //                                 name: model + 'Entity'
    //                             });
    //                         });
    //                 })
    //                 .catch(error => {
    //                     throw new ApiErrors.BaseError({
    //                         statusCode: 202,
    //                         type: 'crudError',
    //                         error,
    //                         name: model + 'Entity'
    //                     });
    //                 });
    //         });
    //         // .spread(async (findReportImExCreate, created) => {
    //     }).catch(error => {
    //         throw new ApiErrors.BaseError({
    //             statusCode: 202,
    //             type: 'getListError',
    //             error,
    //             name: model + 'Entity'
    //         });
    //     });
    // }

}

export default ModelEntity;
