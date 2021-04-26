import {AuthenticationError} from "apollo-server-express";
import filterHelpers from "../../helpers/filterHelpers";
import {findListMessages} from "../message/message.service";
import {logger} from "../../helpers/customLogger";


export const findMessages = async (root, {conversationsId, attributes, page, limit}, context) => {
    try {
        if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập")
        if (attributes) attributes = filterHelpers.atrributesHelper(attributes)
        return await findListMessages({conversationsId}, attributes, page, limit);
    } catch (e) {
        logger.error(`error in find conversation ${e.message}`);
        throw e;
    }
}