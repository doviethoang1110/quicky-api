import REPOSITORY from "../../repositories";
import {conversations, participants} from "../../models";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import {logger} from "../../helpers/customLogger";
import _ from 'lodash';

export const store = async (param) => {
    try {
        const paramConversation = _.omit(param, ['participants']);
        let paramParticipants = _.pick(param, ['participants']);
        const conversation = await REPOSITORY.create(conversations, paramConversation);
        if (paramParticipants.participants) {
            paramParticipants = paramParticipants.participants.map(p => (
                {
                    usersId: p,
                    conversationsId: conversation.id
                }
            ));
        }
        if (paramParticipants && paramParticipants.length >= 2)
            await REPOSITORY.bulkCreate(participants, paramParticipants)
        return responseMessages.responseSuccess(HttpStatusCode.OK, conversation);
    } catch (err) {
        logger.error(`Error in store conversation service ${err.message}`);
        throw err;
    }
}