import { users, user, getUsers } from '../../modules/user/user.resolver';

export default {
    Query: {
        users,
        getUsers,
        user
    }
}