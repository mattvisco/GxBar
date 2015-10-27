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

var getElementId = function(element, type) {
    if(type == POSTTYPE) return $(element).parent().attr('id');
    else return 'tmpID';
};