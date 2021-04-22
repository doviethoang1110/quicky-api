import {store} from "../conversations/conversation.service";
import {logSystemError} from "../../helpers/customLogger";

export const conversationStore = async (req, res) => {
    try {
        const {name, lastMessageId = null, type = 'single', image, creatorId, participants} = req.body;
        const param = {name, lastMessageId, type, image, creatorId, participants};
        const response = await store(param);
        res.json(response);
    } catch (e) {
        return logSystemError(res, e, 'create conversation controller');
    }
}