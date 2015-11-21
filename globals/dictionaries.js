/**
 * Created by M on 9/16/15.
 */

var config = {
    DOMAIN: "http://gplusnow.com",
    typeToApi: function(type) {
        switch(type) {
            case POSTTYPE:
                return 'post';
            case USERTYPE:
                return 'user';
            case HANGOUTTYPE:
                return 'hangout';
            case EVENTTYPE:
                return 'event';
            case EMBEDTYPE:
                return 'embed';
            case COMMUNITYTYPE:
                return 'community';
        }
    }
};

var keys = {
    USERACTIVE: 'UserActive',
    XBAR: 'xbar',
    HIGHLIGHT: 'highlight',
    STORED: 'storedArr',
    ONBOARDING: 'onboard'
};

var values = {
    CONTEXTOFF: 1,
    CONTEXTON: 2
};