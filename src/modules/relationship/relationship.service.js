import HTTP from "../constants";
import responseMessages from "../helpers/responseMessages";
import generateErrors from "../helpers/constrainsErrors";

const { RelationshipRepository } = require('../repositories');

class RelationshipService {

    constructor(container) {
        this.relationshipRepository = container.get(RelationshipRepository);
    }

    async create(data) {
        try {
            const { id } = await this.relationshipRepository.create(data);

            return { status: HTTP.CREATED, body: responseMessages.responseSuccess({message: 'Gửi lời mời thành công'}) };
        } catch (err) {
            console.log('services-errors', err);
            if(err.errors) err = generateErrors.errors(err.errors)
            throw { status: HTTP.BAD_REQUEST, body: responseMessages.responseError(HTTP.BAD_REQUEST_MESSAGE, err) };
        }
    }
}

module.exports = RelationshipService;