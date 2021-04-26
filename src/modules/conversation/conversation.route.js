import {conversationChangeImage, conversationCreate} from "./conversation.validate";
import {conversationStore} from "./conversation.controller";

export const conversationRoutes = (router) => {
    router.post('/', conversationCreate, conversationStore)
    // .put('/:id', conversationUpdate, updateconversation)
    // .patch('/change-password/:id', conversationChangePassword, changePassword)
    // .patch('/change-avatar/:id', conversationChangeImage, changeImage);
    return router;
}