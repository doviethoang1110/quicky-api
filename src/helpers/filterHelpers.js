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

const parseSort = (sort, table) => {
    let isPass = true;
    const defaultValue = [['id', 'asc']];
    const regexSort = /(asc|desc|ASC|DESC)/g;

    try {
        sort = (typeof sort === 'string') ? JSON.parse(sort).map((e, i) => i % 2 === 0 ? (e.includes('.') ? sequelize.literal(`\`${e}\``) : sequelize.col(`${table}.${e}`)) : e) : defaultValue;
        if (sort.length % 2 === 0) {
            sort = _.chunk(sort, 2) || defaultValue;
            sort.map(element => {
                if (!element[1].match(regexSort)) {
                    isPass = false;
                }
            });
        } else {
            isPass = false;
        }
        if (isPass) {
            return sort;
        } else {
            return defaultValue
        }
    } catch (e) {
        return defaultValue
    }
};

const atrributesHelper = (attributes, exclude) => {
    let att = [];
    if (attributes) {
        att = attributes.split(',');
        if (exclude)
            exclude.forEach(e => {
                const index = att.indexOf(e);

                if (index !== -1)
                    att.splice(index, 1);
            })
        att = att.length > 0 ? att : {exclude: exclude};
        return att;
    } else {
        att = {exclude: []};
        return att;
    }
}

const filterPickKey = (param) => _.pickBy(param, prop => prop !== undefined);

export default {
    makeStringFilterRelatively,
    transStringToArray,
    parseSort,
    atrributesHelper,
    filterPickKey
}