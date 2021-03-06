/**
 * Created by M on 9/15/15.
 */

var post = function(url, data) {
    return new Promise(function(resolve, reject) {
        var client = new XMLHttpRequest();
        client.open('POST', url);
        client.setRequestHeader("Content-type","application/json");
        client.onload = function() {
            // Check the status
            if (client.status == 200) {
                // Resolve the promise with the response text
                resolve(client.response);
            } else {
                // Reject if status isn't 200
                reject(errors.statusError(client.status));
            }
        };

        // Handle network errors
        client.onerror = function() {
            reject(errors.NETWORKERR);
        };

        // Make the request
        client.send(data);
    });
};

var login = function(data) {
    var url = config.DOMAIN + "/api/login/";
    post(url, data).then(JSON.parse).then(
        function(response){if(response.errors) errorHandler(response); else storage.set(keys.USERACTIVE, response);},
        function(reject){if(reject.errors) errorHandler(reject, errors.APPENDTRY);}
    );
};

var register = function(data) {
    var url = config.DOMAIN + "/api/register/";
    post(url, data).then(JSON.parse).then(
        function(response){if(response.errors) errorHandler(response); else storage.set(keys.USERACTIVE, response);},
        function(reject){if(reject.errors) errorHandler(reject, errors.APPENDTRY);}
    );
};

// Check must return response b/c init function acts upon the response according
// Same goes for the reject() call
var checkToken = function(data) {
    var url = config.DOMAIN + "/api/check_token/";
    return post(url,data).then(JSON.parse).then(
        function(response){if(response.errors) errorHandler(response); return response;},
        function(reject){if(reject.errors) {errorHandler(reject, errors.APPENDLOGIN); reject();}}
    );
};

var store = function(data, type, tabId) {
    var url = config.DOMAIN + "/api/" + type + '/';
    var id = data.url;
    data = makeDataPackage(data, type);
    if (!data.errors) {
        post(url, data, id).then(JSON.parse).then(
            function(response){
                if(response.errors) {
                    errorHandler(response);
                    sendErrorMessage(tabId, id);
                } else {
                    var typeId = type+'_id';
                    sendSuccessMessage(type, response[typeId], tabId, id);
                }
            },
            function(reject){
                errorHandler(reject, errors.APPENDTRY);
                sendErrorMessage(tabId, id);
            }
        );
    }
};

var sendSuccessMessage = function(type, id, tabId, elId) {
    var url = config.DOMAIN + '/' + type + '/' + id;
    if(tabId) chrome.tabs.sendMessage(tabId, {message: 'success', id: elId, url: url});
};

var sendErrorMessage = function(tabId, elId) {
    if(tabId) chrome.tabs.sendMessage(tabId, {message: 'post-fail', id: elId});
};

var makeDataPackage = function(data, type) {
    var newData;
    if (config.userActive) {
        newData = {
            email: config.email,
            token: config.token
        };
        newData[type] = data;
    } else {
        sendErrorMessage();
        return errorHandler(errors.ILLEGALPOST);
    }
    return JSON.stringify(newData);
};