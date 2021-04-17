import responseMessages from "./responseMessages";
import HttpStatusCode from "../constants";
import i18n from 'i18n';

export default {
    joi(input) {
        let error = {};
        if (input.error) {
            error = input.error.details.reduce((a, b) => {
                const temp = {};
                temp[b.context.key] = b.message;
                return {...a, ...temp}
            }, {});
        }
        if (Object.keys(error).length > 0) {
            return responseMessages.responseError(
                HttpStatusCode.INVALID_PARAMETER,
                error,
                i18n.__("user.register.invalidParameter")
            )
        } else return null;
    }
}