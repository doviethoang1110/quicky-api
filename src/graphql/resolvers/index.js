import {users, user, getUsers} from '../../modules/user/user.resolver';
import {getNotes} from '../../modules/note/note.resolver';

export default {
    Query: {
        users,
        getUsers,
        getNotes,
        user
    }
}