/**
 * Created by M on 7/9/15.
 */
// background-init.js

// ******************************** //
// *******  Context Menus   ******* //
// ******************************** //

var showForPages = ["https://plus.google.com/*", "http://plus.google.com/*"];

chrome.contextMenus.create({
    type: 'separator',
    "documentUrlPatterns": showForPages
});

chrome.contextMenus.create({
    'title': 'Go to G+Now',
    'contexts': ['all'],
    'onclick': function() {
        window.chrome.tabs.create({
            url: config.DOMAIN
        });
    }
});

window.chrome.contextMenus.create({
    type: 'separator',
    "documentUrlPatterns": showForPages
});

var disableHighlight = chrome.contextMenus.create({
    "title": "Disable highlighting",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.HIGHLIGHT, values.CONTEXTOFF,disableHighlight,enableHighlight);
    }
});

var enableHighlight = chrome.contextMenus.create({
    "title": "Enable highlighting",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.HIGHLIGHT, values.CONTEXTON,disableHighlight,enableHighlight);
    }
});

var disableXbar = chrome.contextMenus.create({
    "title": "Disable GX Extension",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.XBAR, values.CONTEXTOFF,disableXbar,enableXbar);
    }
});

var enableXbar = chrome.contextMenus.create({
    "title": "Enable GX Extension",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.XBAR, values.CONTEXTON,disableXbar,enableXbar);
    }
});

// ******************************** //
// **********  Storage   ********** //
// ******************************** //

storage = {
    get: function(key, callback) {
        window.chrome.storage.local.get(key, function(outObj) {
            callback(outObj[key] || false);
        });
    },
    set: function(key, value) {
        var obj = {};
        obj[key] = value;

        window.chrome.storage.local.set(obj);

        if (key == keys.USERACTIVE && value.email) {
            initialize(value);
        }
    },
    remove: function(key) {
        chrome.storage.local.remove(key);
        if (key == keys.USERACTIVE) {
            initialize(false);
        }
    }
};

// ******************************** //
// ***********  Setup   *********** //
// ******************************** //

var contextMenuSetState = function(key, value, disable, enable) {
    storage.set(key,value);
    if(value == values.CONTEXTON) {
        window.chrome.contextMenus.update(disable, {
            enabled: true
        });
        if(key == keys.XBAR) {
            contextMenuFindState(keys.HIGHLIGHT,disableHighlight,enableHighlight);
        }
        window.chrome.contextMenus.update(enable, {
            enabled: false
        });
    } else {
        window.chrome.contextMenus.update(enable, {
            enabled: true
        });
        window.chrome.contextMenus.update(disable, {
            enabled: false
        });
        if(key == keys.XBAR) {
            window.chrome.contextMenus.update(disableHighlight, {
                enabled: false
            });
            window.chrome.contextMenus.update(enableHighlight, {
                enabled: false
            });
        }
    }
    var context = true;
    if(value == values.CONTEXTOFF) context = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: key, value: context});
    });
};

var contextMenuFindState = function(key, disable, enable, port) {
    storage.get(key, function(value){
        if(value) {
            if(value == values.CONTEXTON) {
                window.chrome.contextMenus.update(disable, {
                    enabled: true
                });
                if(key == keys.XBAR) {
                    window.chrome.contextMenus.update(disableHighlight, {
                        enabled: true
                    });
                }
                window.chrome.contextMenus.update(enable, {
                    enabled: false
                });
            } else {
                window.chrome.contextMenus.update(enable, {
                    enabled: true
                });
                window.chrome.contextMenus.update(disable, {
                    enabled: false
                });
                if(key == keys.XBAR) {
                    window.chrome.contextMenus.update(disableHighlight, {
                        enabled: false
                    });
                    window.chrome.contextMenus.update(enableHighlight, {
                        enabled: false
                    });
                }
            }
        } else {
            storage.set(key, values.CONTEXTON);
            window.chrome.contextMenus.update(disable, {
                enabled: true
            });
            window.chrome.contextMenus.update(enable, {
                enabled: false
            });
        }
        var context = true;
        if(value == values.CONTEXTOFF) context = false;
        if(port) port.postMessage({message: key, value: context});
    });
};

var disableContextMenu = function() {
    window.chrome.contextMenus.update(disableHighlight, {
        enabled: false
    });
    window.chrome.contextMenus.update(enableHighlight, {
        enabled: false
    });
    window.chrome.contextMenus.update(disableXbar, {
        enabled: false
    });
    window.chrome.contextMenus.update(enableXbar, {
        enabled: false
    });
};

var initialize = function(userInfo) {
    if (userInfo) {
        // Set user data
        config.userActive = true;
        config.email = userInfo.email;
        config.token = userInfo.token;
        config.firstName = userInfo.first_name;
        config.lastName = userInfo.last_name;

        // NOTE: context menu default to be highlight & xBar active upon login
        // Check value of highlight toggling variable
        contextMenuFindState(keys.HIGHLIGHT, disableHighlight, enableHighlight);
        // Check value of xBar toggling variable
        contextMenuFindState(keys.XBAR, disableXbar, enableXbar);

        storage.get(keys.STORED+config.email,function(value){sendInit(value)});

    } else {
        config.userActive = false;
        config.email = null;
        config.token = null;
        config.firstName = null;
        config.lastName = null;

        // Disable context menu
        disableContextMenu();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if(tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, {message: 'init', userActive: config.userActive});
        });
    }
    var dataToSend = {
        message: 'init',
        userActive: config.userActive,
        firstName: config.firstName
    };
    chrome.extension.sendMessage(dataToSend);
};

var sendInit = function(storedArr) {
    if (!storedArr) {
        storedArr = [];
        storage.set(keys.STORED+config.email, storedArr);
    }
    var dataToSend = {
        message: 'init',
        userActive: config.userActive,
        storedArr: storedArr
    }; // TODO: add stored Array to dataToSend
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, dataToSend);
    });
};
var logout = function() {
    storage.remove(keys.USERACTIVE);
    storage.remove(keys.HIGHLIGHT);
    storage.remove(keys.XBAR);
    // Think about how to remove saveEl[]
};

var storeSavedElement = function(stored) {
    storage.get(keys.STORED+config.email,function(value){
        if (!value) value = [];
        value.push(stored);
        storage.set(keys.STORED+config.email, value);
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.message == 'showPage') chrome.pageAction.show(sender.tab.id);
    else if ( request.message == 'error' ) errorHandler(request);
    else if ( request.message == 'login' ) login(request.data);
    else if ( request.message == 'register' ) register(request.data);
    else if ( request.message == 'logout' ) {
        logout();
        sendResponse({userActive: config.userActive});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if(tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, {message: 'flush-dots'});
        });
    }
    else if ( request.message == 'storePost' ) storePost(request.data, sender.tab.id);
    else if ( request.message == 'checkActive' ) sendResponse({userActive: config.userActive, firstName: config.firstName});
    else if ( request.message == 'storedElement' ) storeSavedElement(request.stored);
});

// Connect with content script, communicate settings between
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "checkActiveContent");
    port.onMessage.addListener(function(request) {
        if (request.message == "checkLoginStatus") {
            if(config.userActive) {
                var loginData = {email: config.email, token: config.token};
                checkToken(JSON.stringify(loginData)).then(
                    function(response) {
                        if(response.token == 'valid') port.postMessage({message: 'loginStatus', userActive: config.userActive});
                        else {
                            // Log user out
                            port.postMessage({message: 'loginStatus', userActive: false});
                            logout();
                        }
                    },
                    function(reject) {logout();}
                );
            } else port.postMessage({message: 'loginStatus', userActive: config.userActive});
        }
        else if (request.message == "checkXBarContext") contextMenuFindState(keys.XBAR, disableXbar, enableXbar, port);
        else if (request.message == "checkHighlightContext") contextMenuFindState(keys.HIGHLIGHT, disableHighlight, enableHighlight, port);
        else if (request.message == "checkStored") storage.get(keys.STORED+config.email,function(value){
            port.postMessage({message: 'storedArray', storedArr: value});
        });
    });
});

storage.get(keys.USERACTIVE, function(value){
    // Check if token is active -- logout if not
    if(value) {
        checkToken(JSON.stringify(value)).then(
            function(response) {
                if(response.token == 'valid') initialize(value);
                else logout();
            },
            function(reject) {logout();}
        );
    } else initialize(value); // Initialize sets user info to false if value evaluates to false
});