/**
 * Created by M on 7/9/15.
 */
// background-init.js

// For testing -- if need to clear local storage uncomment
window.chrome.storage.local.clear();

// ******************************** //
// *******  Context Menus   ******* //
// ******************************** //

// Only show full context menu on these pages aka Google Plus
var showForPages = ["https://plus.google.com/*", "http://plus.google.com/*"];

// Create drop down context if on G+
chrome.contextMenus.create({
    type: 'separator',
    "documentUrlPatterns": showForPages
});

// Create a link to G+Now always
chrome.contextMenus.create({
    'title': 'Go to G+Now',
    'contexts': ['all'],
    'onclick': function() {
        window.chrome.tabs.create({
            url: config.DOMAIN
        });
    }
});

// Separate link from enabling/disable actions
window.chrome.contextMenus.create({
    type: 'separator',
    "documentUrlPatterns": showForPages
});

// Disable highlighting button
var disableHighlight = chrome.contextMenus.create({
    "title": "Disable highlighting",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.HIGHLIGHT, values.CONTEXTOFF,disableHighlight,enableHighlight);
    }
});

// Enable highlighting option
var enableHighlight = chrome.contextMenus.create({
    "title": "Enable highlighting",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.HIGHLIGHT, values.CONTEXTON,disableHighlight,enableHighlight);
    }
});

// Disable extension option
var disableXbar = chrome.contextMenus.create({
    "title": "Disable GX Extension",
    "documentUrlPatterns": showForPages,
    'onclick': function() {
        contextMenuSetState(keys.XBAR, values.CONTEXTOFF,disableXbar,enableXbar);
    }
});

// Enable extension option
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

// Helper function for local storage
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

// Takes in context type & value and the appropriate disable/enable functions
// Sets key, value pair and sends message accordingly
var contextMenuSetState = function(key, value, disable, enable) {
    // Sets the key, value in local storage
    storage.set(key,value);
    // Updates the context menus state -- e.g. if disable highlight clicked, turn on the enable highlight option
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

    // Send the new state to content scripts
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: key, value: context});
    });
};

// Finds locally stored state of context menu, sets context menu appropriately and sends message to content script
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
        // Send state to content scripts
        if(port) port.postMessage({message: key, value: context});
    });
};

// Disable all context menus
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

// Set configurations -- user active boolean, email, token, first/last name
// Send configuration message to content and login form
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

        // Get the saved elements associated with user and send to content script
        storage.get(keys.STORED+config.email,function(value){sendInit(value)});

    } else {
        config.userActive = false;
        config.email = null;
        config.token = null;
        config.firstName = null;
        config.lastName = null;

        // Disable context menu
        disableContextMenu();

        // If this app was just downloaded, take user to G+ and begin onboarding
        storage.get(keys.ONBOARDING, function(value){
            if (!value) chrome.tabs.create({ url: "https://plus.google.com/" }); // auto take to G+ if first time
        });

    }
    var dataToSend = {
        message: 'init',
        userActive: config.userActive,
        firstName: config.firstName
    };
    // Send config to login.js
    chrome.extension.sendMessage(dataToSend);
};

// Sends configuration data to content script
var sendInit = function(storedArr) {
    if (!storedArr) {
        storedArr = [];
        storage.set(keys.STORED+config.email, storedArr);
    }
    var dataToSend = {
        message: 'init',
        userActive: config.userActive,
        storedArr: storedArr
    };
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, dataToSend);
    });
};

// Log user out by removing all storage
// TODO: Think about how to remove saveEl[]
var logout = function() {
    storage.remove(keys.USERACTIVE);
    storage.remove(keys.HIGHLIGHT);
    storage.remove(keys.XBAR);
};

// Store a saved element in local storage
var storeSavedElement = function(stored) {
    storage.get(keys.STORED+config.email,function(value){
        if (!value) value = [];
        value.push(stored);
        storage.set(keys.STORED+config.email, value);
    });
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.message == 'showPage') chrome.pageAction.show(sender.tab.id); // enable popup
    else if ( request.message == 'error' ) errorHandler(request); // Error occured
    else if ( request.message == 'login' ) login(request.data); // Log user in
    else if ( request.message == 'register' ) register(request.data); // Register user
    else if ( request.message == 'logout' ) { // Log user out
        logout();
        sendResponse({userActive: config.userActive}); // Send state back to login form
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { // Send state to content scripts
            if(tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, {message: 'flush-dots'});
        });
    }
    else if ( request.message == 'store' ) store(request.data, request.type, sender.tab.id); // Store on our server
    else if ( request.message == 'checkActive' ) sendResponse({userActive: config.userActive, firstName: config.firstName}); // Check if current user is active
    else if ( request.message == 'storedElement' ) storeSavedElement(request.stored); // Store an element locally
});

// Connect with content script, communicate settings between -- occurs upon opening G+
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "checkActiveContent"); // Start active check communications
    port.onMessage.addListener(function(request) {
        if (request.message == "checkLoginStatus") { // Check if user is logged in
            if(config.userActive) {
                var loginData = {email: config.email, token: config.token};
                // If logged in check if the token is valid
                checkToken(JSON.stringify(loginData)).then(
                    function(response) {
                        if(response.token == 'valid') port.postMessage({message: 'loginStatus', userActive: config.userActive});
                        else {
                            // Log user out if token invalid
                            port.postMessage({message: 'loginStatus', userActive: false});
                            logout();
                        }
                    },
                    function(reject) {logout();} // Log out on error
                );
            } else {
                // If user isn't log in check if onboarding has happened
                storage.get(keys.ONBOARDING, function(value){
                    var doOnboard = false;
                    if (!value) { // If value is false, onboarding hasn't happened, tell content script to do onboarding
                        doOnboard = true;
                        storage.set(keys.ONBOARDING, doOnboard);
                    }
                    port.postMessage({message: 'loginStatus', userActive: config.userActive, onboarding: doOnboard});
                });
            }
        }
        else if (request.message == "checkXBarContext") contextMenuFindState(keys.XBAR, disableXbar, enableXbar, port); // Check enable status of GX
        else if (request.message == "checkHighlightContext") contextMenuFindState(keys.HIGHLIGHT, disableHighlight, enableHighlight, port); // Check highlight status of GX
        else if (request.message == "checkStored") storage.get(keys.STORED+config.email,function(value){
            port.postMessage({message: 'storedArray', storedArr: value}); // Get stored elements
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