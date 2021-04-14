const responseSuccess = (code, data, message = 'Success') => {
    return {
        code,
        message,
        result: data,
        success: true,
    };
}

const responseError = (code, data = {}, message = 'Error') => {
    return {
        code,
        message,
        errors: data,
        success: false
    };
}

export default {
    responseSuccess,
    responseError
}