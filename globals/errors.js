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
        else if(appendMessage) alert(currErrors+appendMessage);
        else if (typeof currErrors === 'string') alert(currErrors);
        else alert(errors.GENERALERROR);
    } else console.log('No errors in response');
    return response;
};

var errors = {
    APPENDLOGIN: ', Please Log Back In.',
    APPENDTRY: '. Please Try Again.',
    GENERALERROR: 'Something Happened. Please Try Again.',

    SAVEFAILED: {errors: 'Cannot Save Element. Please Try Again.'},
    ILLEGALPOST: {errors: 'Cannot Save Post. Please Log in First.'},
    NETWORKERR: {errors: 'Network Connection Failed'},
    BADTOKENCHECK: {errors: 'Oops, Something Happened. Please Log Back in.'},
    NETWORKPARSEERR: {errors: 'Oops, Parser Did Not Work Due to a Network Connection Fail.'},
    statusError: function(status) {
        return {errors: 'Oops, a ' + status + ' Error Occurred'};
    },
    parseStatusError: function(status) {
        return {errors: 'Oops, the Parser Did Not Work Due to a ' +
        + status + ' Error'};
    }
};