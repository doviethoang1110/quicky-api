import {updateUser, changePassword, changeImage} from './user.controller';
import {userChangeImage, userChangePassword, userUpdate} from "./user.validate";

export const userRoutes = (router) => {
    router.put('/:id', userUpdate, updateUser)
        .patch('/change-password/:id', userChangePassword, changePassword)
        .patch('/change-avatar/:id', userChangeImage, changeImage);
    return router;
}