import {users, user, getUsers, getUsersById, findListFriends} from '../../modules/user/user.resolver';
import {getNotes} from '../../modules/note/note.resolver';
import {findConversations} from '../../modules/conversation/conversation.resolver'

export default {
    Query: {
        users,
        getUsers,
        getUsersById,
        getNotes,
        user,
        findListFriends,
        findConversations
    }
}