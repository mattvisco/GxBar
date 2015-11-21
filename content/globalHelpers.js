/**
 * Created by M on 9/10/15.
 */

jQuery.fn.extend({
    disableSelection : function() {
        return this.each(function() {
            this.onselectstart = function() { return false; };
            $(this).css({
                'user-select': 'none',
                '-o-user-select': 'none',
                '-moz-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none'
            });
        });
    },
    enableSelection : function () {
        return this.each(function() {
            this.onselectstart = function() { return true; };
            $(this).css({
                'user-select': 'all',
                '-o-user-select': 'all',
                '-moz-user-select': 'all',
                '-khtml-user-select': 'all',
                '-webkit-user-select': 'all'
            });
        });
    }
});

// Converts class from 'x y z' to 'x.y.z'
var convertClassFormat = function(str) {
    return '.' + str.split(' ').join('.');
};

var lowerFirstLetter = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};

var dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var getType = function(target, targetClass) {
    target = $(target);
    targetClass = targetClass.replace(' x_cursor', '');
    var type = classToType[targetClass];
    if (type == POSTTYPE) {
        if ( target.parents(EVENTPARENTDOT).length || target.find(HANGOUTCHECKDOT).length ) {
            if ( target.find(HANGOUTCHECKDOT).length == 1 ) return HANGOUTTYPE;
            else return EVENTTYPE;
        } else if ( target.find(POSTHANGOUTCHECKDOT).length ) return HANGOUTTYPE;
    } else if ( type == EVENTTYPE && target.find(INEVENTHANGOUTCHECKDOT).length == 1 ) return HANGOUTTYPE;
    else if ( type == EMBEDTYPE && ( target.parents(EVENTPARENTDOT).length || target.next().find(POSTHANGOUTCHECKDOT).length) ) return null;
    return type;
};

var getElementId = function(element, type, targetClass) {
    element = $(element);
    targetClass = targetClass.replace(' x_cursor', '');
    var id;
    switch (type) {
        case POSTTYPE:
            if (targetClass == REPOST) id = element.find(REPOSTURLDOT).prop('href');
            else id = element.find(POSTURLDOT).prop('href');
            break;
        case USERTYPE:
            if ( findLinkOfUser.indexOf(targetClass) > -1 ) {
                element = getUserTarget(element, targetClass, userParent[targetClass]);
            }
            if ( targetClass == USERIMAGEPAGE ) {
                id = window.location.href;
                if ( id.indexOf('/about') == -1 ) id = id.substring(0,id.lastIndexOf('/')) + '/about';
            } else id = element.prop('href') + '/about';
            break;
        case COMMUNITYTYPE:
            if ( targetClass == COMMUNITYPOST || targetClass == COMMUNITYLINKPOST ) {
                if (targetClass == COMMUNITYPOST) element = element.find(COMMUNITYLINKPOSTDOT);
                id = element.prop('href');
            } else {
                if ( communityLinks.indexOf(targetClass) > -1 ) id = element.prop('href');
                else {
                    var parentName = communityParentNames[targetClass];
                    if (parentName) element = element.parents(parentName);
                    var communityOptionsClass = communityFieldToClass[targetClass];
                    if (communityOptionsClass) {
                        if ( targetClass == COMMUNITY ) id = element.parent().prop('href');
                        else id = element.find(communityOptionsClass.url).prop('href');
                    }
                }
            }
            break;
        case EMBEDTYPE:
            if(getEmbedUrlTitle(element)) id = getEmbedUrlTitle(element)[0][1];
            else id = 'no-id-found';
            break;
        case EVENTTYPE:
        case HANGOUTTYPE:
            var inEvent = ( targetClass == EVENT );
            if (inEvent) id = window.location.href;
            else {
                var eventLink = element.find(EVENTLINKDOT);
                if (!eventLink.length) eventLink = element.find(POSTEVENTLINKDOT);
                id = eventLink.prop('href');
            }
            break;
        default:
            id = 'no-id-found';
    }
    return id;
};