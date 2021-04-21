import {users, user, getUsers, getUsersById, findListFriends} from '../../modules/user/user.resolver';
import {getNotes} from '../../modules/note/note.resolver';

export default {
    Query: {
        users,
        getUsers,
        getUsersById,
        getNotes,
        user,
        findListFriends
    }
}