import {AuthenticationError} from "apollo-server-express";
import {findListConversation} from "./conversation.service";
import {logger} from "../../helpers/customLogger";
import filterHelpers from "../../helpers/filterHelpers";

export const findConversations = async (root, {filter, attributes, page, limit}, context) => {
    try {
        if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập")
        const condition = typeof filter === 'string' ? JSON.parse(filter) : filter;
        if (attributes) attributes = filterHelpers.atrributesHelper(attributes)
        return await findListConversation(condition, attributes, page, limit);
    } catch (e) {
        logger.error(`error in find conversation ${e.message}`);
        throw e;
    }
}