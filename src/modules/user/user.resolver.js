import UserService, {paginate} from './user.service';
import {AuthenticationError} from 'apollo-server-express';
import graphqlFields from 'graphql-fields';
import filterHelpers from "../../helpers/filterHelpers";

export const users = async (root, args, context, info) => {
    const selections = Object.keys(graphqlFields(info)).join(' ');
    if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập");
    const filter = JSON.parse(args.filter);
    const options = {is_actived: true};
    options[Object.keys(filter)[0]] = {$regex: ".*" + Object.values(filter)[0] + ".*", $options: 'i'}
    return await UserService.find(options, selections, 5);
}

export const getUsers = async (root, {filter, page, limit}, context, info) => {
    try{
        if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập")
        const condition = JSON.parse(filter);
        const options = await filterHelpers.makeStringFilterRelatively(['name'], condition, 'users');
        options.isActive = true;
        options.id = {$ne: condition.id};
        return await paginate(options, limit, page);
    }catch (e) {
        console.log(e)
    }
}

export const user = async (root, {id: _id}, context, info) => {
    if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập");
    const selections = Object.keys(graphqlFields(info)).join(' ');
    return await UserService.findOne({_id}, selections);
}