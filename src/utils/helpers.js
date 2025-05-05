module.exports = {
    formatResponse: (data, message = 'Success') => {
        return {
            status: 'success',
            message: message,
            data: data
        };
    },
    formatError: (error, message = 'An error occurred') => {
        return {
            status: 'error',
            message: message,
            error: error
        };
    }
};