import _ from "lodash";
import {sequelize} from '../models';

// tìm tương đối
const makeStringFilterRelatively = async (keys, filter, tableName) => {
    const keysFilter = _.pick(filter, keys);
    let filterNew = _.omit(filter, keys);
    let jsonWhere = [];
    await keys.forEach(key => {
        let keyword = keysFilter[key];
        if (new RegExp(/[^A-Za-z0-9]/).test(keyword))
            keyword = keyword
                .split('')
                .map(e => (new RegExp(/[^A-Za-z0-9]/).test(e) ? '\\' + e : e))
                .join('');
        if (keysFilter[key]) {
            if (tableName) {
                keysFilter[key] = sequelize.where(
                    sequelize.fn('lower', sequelize.col(`${tableName}.${key}`)), 'LIKE',
                    sequelize.literal(`CONCAT('%',CONVERT(LOWER('${keyword}') USING BINARY),'%')`)
                )
            } else {
                keysFilter[key] = sequelize.where(
                    sequelize.fn('lower', sequelize.col(`${key}`)), 'LIKE',
                    sequelize.literal(`CONCAT('%',CONVERT(LOWER('${keyword}') USING BINARY),'%')`)
                )
            }
            jsonWhere.push(keysFilter[key]);
        }
    });
    filterNew = {...filterNew, ...jsonWhere};
    return filterNew;
}

// tìm nhiều id
const transStringToArray = (obj, key) => {
    const arr = obj[key].split(',');
    if (arr.length === 1) {
        obj[key] = parseInt(obj[key]);
    } else {
        obj[key] = arr.map(n => parseInt(n));
        obj[key] = {
            "$in": obj[key]
        };
    }

    return obj;
}

export default {
    makeStringFilterRelatively,
    transStringToArray
}