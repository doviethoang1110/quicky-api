export default {
    joi(input) {
        if (input.error) {
            return input.error.details.reduce((a, b) => {
                const temp = {};
                temp[b.context.key] = b.message;
                return {...a, ...temp}
            }, {});
        } else return {};
    }
}