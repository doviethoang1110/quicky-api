import {get_list} from './note.service';
import {AuthenticationError} from 'apollo-server-express';
import filterHelpers from "../../helpers/filterHelpers";

export const getNotes = async (root, {filter, sort, attributes}, context, info) => {
    try{
        if (!context.loggedIn) throw new AuthenticationError("Bạn chưa đăng nhập")
        let condition = typeof filter === 'string' ? JSON.parse(filter) : filter;
        if (condition.title) condition = await filterHelpers.makeStringFilterRelatively(['title'], condition, 'notes');
        if (attributes) attributes = filterHelpers.atrributesHelper(attributes)
        return await get_list({
            attributes,
            filter: condition,
            sort: filterHelpers.parseSort(sort, 'notes'),
            usersId: context.usersId
        });
    }catch (e) {
        console.log(e)
    }
}