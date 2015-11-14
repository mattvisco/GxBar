/**
 * Created by M on 10/7/15.
 */

// TODO: convert error messages into more meaningful message to user

// When calling this function response.errors should exist
var errorHandler = function(response, appendMessage) {
    console.log(response);
    if(response.errors) {
        var currErrors = response.errors;
        // TODO: instead of alerting errors, send content script error to display custom box?
        if(currErrors.email) alert(currErrors.email);
        else if(currErrors.password) alert(currErrors.password);
        else if(currErrors.error) alert(currErrors.error);
        else if(currErrors.errorsCons) console.log(currErrors.errorsCons);
        else if(appendMessage) console.log(currErrors+appendMessage);
        else if (typeof currErrors === 'string') alert(currErrors);
        else console.log(errors.GENERALERROR);
    } else console.log('No errors in response');
    return response;
};

var errors = {
    APPENDLOGIN: ', Please Log Back In.',
    APPENDTRY: '. Please Try Again.',
    GENERALERROR: 'Something Happened. Please Try Again.',

    SAVEFAILED: {errorsCons: 'Cannot Save Element. Please Try Again.'},
    ILLEGALPOST: {errors: 'Cannot Save Post. Please Log in First.'},
    NETWORKERR: {errorsCons: 'Network Connection Failed'},
    BADTOKENCHECK: {errorsCons: 'Bad token'},
    NETWORKPARSEERR: {errorsCons: 'Oops, Parser Did Not Work Due to a Network Connection Fail.'},
    statusError: function(status) {
        return {errorsCons: 'Oops, a ' + status + ' Error Occurred'};
    },
    parseStatusError: function(status) {
        return {errorsCons: 'Oops, the Parser Did Not Work Due to a ' +
        + status + ' Error'};
    }
};