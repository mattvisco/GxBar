/**
 * Created by M on 10/13/15.
 */

// Constants
var SAVEDSIZE = 14;
var SAVEDHOVERSIZE = 292;
var SAVEDCOLOR = '#76cb69';
var FAILEDCOLOR = '#242424';
var INNERFAILEDCOLOR = '#202020';
var LITTLEZ = 2;
var BIGZ = 999999999999999;
var COMINGSOONDELAY = 5000;
var COLORINTERVAL = 200;
var ANIMATEDOWNSPEED = 500;
var HOVERANIMATE = 300;


var waitingDots = [];
var parsedElements = [];
var failedDots = [];
var saveFailed = false;
var comingSoon = [COMMUNITYTYPE, EMBEDTYPE, USERTYPE]; //HANGOUTTYPE, EVENTTYPE,

var removeFromArray = function(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
};

var getElementById = function(array, key) {
    var value = false;
    array.forEach(function(el){
        if(el.refId == key) value = el;
    });
    return value;
};

var getAndRemoveById = function(array, key) {
    var value = getElementById(array,key);
    if(value) removeFromArray(array,value);
    return value;
};

var toggleXCursor = function(el, add) {
    nonDraggable.forEach(function(nonDrag){
        $(el).find(nonDrag).each(function(){
            if(add) $(this).addClass('x_cursor');
            else $(this).removeClass('x_cursor');
        });
    });
};

var turnOffDrag = function(dragElement) {
    $(dragElement)
        .attr("draggable", false)
        .off('mouseenter', highlightDragElement)
        .off('mouseleave', unHighlightDragElement)
        .off('mouseover', checkHighlightDragElement)
        .removeClass('x_cursor')
        .enableSelection();
    toggleXCursor(dragElement, false);
    dragElement.dragOff = true;
    parsedElements.push(dragElement);
};

var turnOnDrag = function(dragElement) {
    $(dragElement)
        .attr("draggable", true)
        .on('mouseenter', highlightDragElement)
        .on('mouseleave', unHighlightDragElement)
        .on('mouseover', checkHighlightDragElement)
        .addClass('x_cursor')
        .enableSelection();
    toggleXCursor(dragElement, true);
    dragElement.dragOff = false;
};

var findHolder = function(dragElement) {
    var className = $(dragElement).attr('class').replace(' x_cursor', '');
    if (className == USERIMAGEPAGE) return $(dragElement).parents(USERPAGEPARENTPINDOT).get(0);
    if (className == COMMUNITYJOINED) return $(dragElement).parents(COMMUNITYJOINPARENTDOT).get(0);
    if (className == USERIMAGESINGLEPOST) {
        if ( window.location.pathname.indexOf("/events/") != -1 ) return $(dragElement).parents(USERSINGLEEVENTPARENTFORSAVEDOT).get(0);
        else return $(dragElement).parents(USERSINGLEPOSTPARENTFORSAVEDOT).get(0);
    }
    var parents = $(dragElement).parents(POSTDOT);
    if(parents.length) return parents.get(0);
    else return dragElement;
};

var getShift = function(dragElement) {
    var shift = {left: 0, top: 0};
    var className = $(dragElement).attr('class').replace('x_cursor', '');
    if (className == COMMUNITYPOST) shift.left = $(dragElement).width();
    else if (className == USERIMAGESINGLEPOST) {
        shift.left = 15;
        shift.top = 15;
    } else if (className == USERIMAGEPOST) {
        shift.left = 5;
        shift.top = 5;
    } else if (className == USERIMAGEPAGE) {
        // Hacky positioning...
        shift.left = $(dragElement).parents('.k5.U9b.kXa').get(0).offsetLeft;
        shift.top = $(dragElement).parents('.k5.U9b.kXa').get(0).offsetTop + 100;
    }
    return shift;
};

var setDotPosition = function(dragElement) {
    var className = $(dragElement).attr('class');
    var type = getType(dragElement, className);
    if (type == COMMUNITYTYPE || type == EMBEDTYPE) {
        var id = getElementId(dragElement, type, className);
        var dotHolder = findHolder(dragElement);
        var stored = dotHolder.stored;
        if (stored) {
            var dragsDot;
            stored.forEach(function(dot) {
                if(dot.refId == id) dragsDot = dot;
            });
            if (dragsDot) {
                var shift = getShift(dragElement);
                var initTop = dragElement.offsetTop - SAVEDSIZE/2 + shift.top;
                var initLeft = dragElement.offsetLeft - SAVEDSIZE/2 + shift.left;
                $(dragsDot).css({top: initTop, left: initLeft});
            }
        }
    }
};

var addDotToEl = function(dragElement, type, id, url) {
    dragElement.refId = id;
    turnOffDrag(dragElement);
    var dotHolder = findHolder(dragElement);
    var currSavedDot = savedElementMaster.clone();

    var holderPos = $(dotHolder).offset();
    var dragElPos = $(dragElement).offset();
    var shift = getShift(dragElement);
    var initTop = dragElement.offsetTop - SAVEDSIZE/2 + shift.top;
    if (type == USERTYPE) initTop = dragElPos.top - holderPos.top - SAVEDSIZE/2 + shift.top;
    var initLeft = dragElement.offsetLeft - SAVEDSIZE/2 + shift.left;

    $(dotHolder).append(currSavedDot);
    if (!dotHolder.stored) dotHolder.stored = [];
    dotHolder.stored.push(currSavedDot.get(0));

    currSavedDot.find('.type').text(findTitle(type));

    currSavedDot.css({
        display: 'block',
        height: SAVEDSIZE,
        width: SAVEDSIZE,
        top: initTop,
        left: initLeft,
        zIndex: LITTLEZ,
        background: SAVEDCOLOR,
        cursor: 'default'
    });
    currSavedDot = currSavedDot.get(0);
    currSavedDot.isAnimatingSave = false;
    currSavedDot.refId = id;
    currSavedDot.inEvent = ( $(dragElement).attr('class').replace(' x_cursor', '') == EVENT );

    $(currSavedDot).find('a').attr('href', url);
    if($.inArray(type, comingSoon) != -1 ) {
        $(currSavedDot).find('.inner-circle').addClass('half-circle');
        $(currSavedDot).find('.viewable .small').text('Not Yet Viewable');
    }

    activateListeners.call($(currSavedDot));
};

var storedElement = function(dragElement,type) {
    var id = getElementId(dragElement, type, $(dragElement).attr('class'));
    dragElement.refId = id;
    turnOffDrag(dragElement);
    var dotHolder = findHolder(dragElement);

    var currSavedDot = savedElementMaster.clone();

    var currPos = dropZone.position();
    var currColor = dropZone.css('background');
    var holderPos = $(dotHolder).offset();
    var dragElPos = $(dragElement).offset();
    var scrollAmt = $('body').scrollTop();
    var shift = getShift(dragElement);
    var initTop = dragElement.offsetTop - SAVEDSIZE/2 + shift.top;
    if (type == USERTYPE) initTop = dragElPos.top - holderPos.top - SAVEDSIZE/2 + shift.top;
    var initLeft = dragElement.offsetLeft - SAVEDSIZE/2 + shift.left;

    $(dotHolder).append(currSavedDot);

    if (!dotHolder.stored) dotHolder.stored = [];
    dotHolder.stored.push(currSavedDot.get(0));

    currSavedDot.find('.type').text(findTitle(type));
    currSavedDot.css({
        display: 'block',
        cursor: 'wait',
        background: currColor,
        top: currPos.top - holderPos.top + dotHolder.offsetTop + scrollAmt ,
        left: currPos.left - holderPos.left + dotHolder.offsetLeft
    });

    currSavedDot = currSavedDot.get(0);
    currSavedDot.isAnimatingSave = false;
    currSavedDot.refId = id;
    currSavedDot.inEvent = ( $(dragElement).attr('class').replace(' x_cursor', '') == EVENT );
    waitingDots.push(currSavedDot);

    $(currSavedDot).animate({height: SAVEDSIZE, width: SAVEDSIZE,top: initTop, left: initLeft}, ANIMATEDOWNSPEED, function(){
        currSavedDot.index = 0;
        savingInProgress(currSavedDot);
        currSavedDot.interval = setInterval(function(){savingInProgress(currSavedDot)}, COLORINTERVAL);
        $(this).css({zIndex: LITTLEZ});
        var minScroll = holderPos.top - $('.Uc').height() + initTop; // Uc is the banner height
        if($('body').scrollTop() > minScroll) $('body').animate({scrollTop: minScroll});
        if (saveFailed) {
            saveFailed = false;
            elementSaveFailed(id);
        }
        if($.inArray(type, comingSoon) != -1 ) {
            setTimeout(function() {
                var dotData = {id: id};
                storedElements.push(dotData);
                chrome.runtime.sendMessage({message: 'storedElement', stored: dotData});
                initDotComplete(currSavedDot, true, true);
            }, COMINGSOONDELAY); // Delay for style
        }
    });
};

var savingInProgress = function(dot) {
    var type = types[dot.index];
    if (type == HANGOUTTYPE) {
        dot.index++;
        type = types[dot.index];
    }
    $(dot).css({background: typeToColor[type]});
    dot.index++;
    if(dot.index >= types.length) dot.index = 0;
};

var enterSavedDot = function() {
    if (!this.isAnimatingSave) {
        this.isAnimatingSave = true;
        var currPos = $(this).position();
        var posFactor;
        if ( this.inEvent ) posFactor = 10;
        else posFactor = 2;
        $(this).css({zIndex: BIGZ});
        $(this).animate({
            width: SAVEDHOVERSIZE,
            height: SAVEDHOVERSIZE,
            top: currPos.top - SAVEDHOVERSIZE/posFactor,
            left: currPos.left - SAVEDHOVERSIZE/posFactor
        }, HOVERANIMATE, function() {
            $(this).find('.content').show();
            completeAnimation(this, enterSavedDot);
        });
    }
    this.callBackFn = enterSavedDot;
};

var leaveSavedDot = function() {
    if(!this.isAnimatingSave) {
        this.isAnimatingSave = true;
        var currPos = $(this).position();
        $(this).find('.content').hide();
        var posFactor;
        if ( this.inEvent ) posFactor = 10;
        else posFactor = 2;
        $(this).animate({
            width: SAVEDSIZE,
            height: SAVEDSIZE,
            top: currPos.top + SAVEDHOVERSIZE/posFactor,
            left: currPos.left + SAVEDHOVERSIZE/posFactor,
            zIndex: LITTLEZ
        }, HOVERANIMATE,function(){
            completeAnimation(this, leaveSavedDot);
        });
    } else this.callBackFn = leaveSavedDot;
};

var completeAnimation = function(saveDot, fn) {
    saveDot.isAnimatingSave = false;
    if(saveDot.callBackFn) {
        if (saveDot.callBackFn != fn) saveDot.callBackFn();
        saveDot.callBackFn = null;
    }
};

var activateListeners = function() {
    $(this).off('mouseenter', activateListeners);
    // TODO: add count on enter/leave -- don't trigger immediately
    $(this).on('mouseenter',enterSavedDot);
    $(this).on('mouseleave',leaveSavedDot);
    this.listenersActivated = true;
};

var initDotComplete = function(dot, complete, coming) {
    clearInterval(dot.interval);
    $(dot).css({background: SAVEDCOLOR, cursor: 'default'});
    if(!complete) {
        $(dot).css({background: FAILEDCOLOR});
        $(dot).find('.inner-circle').css({background: INNERFAILEDCOLOR});
    } else if (coming) {
        $(dot).find('.inner-circle').addClass('half-circle');
        $(dot).find('.viewable .small').text('Not Yet Viewable');
    }
    enterSavedDot.call(dot);
    $(dot).on('mouseenter',activateListeners);
    setTimeout(function(){
        if(!dot.listenersActivated) {
            leaveSavedDot.call(dot);
            activateListeners.call(dot);
        }
    }, 2000);
    enableDrag(true);
};

var elementSaved = function(id,url) {
    var dotData = {id: id, url: url};
    storedElements.push(dotData);
    chrome.runtime.sendMessage({message: 'storedElement', stored: dotData});
    var savedElDot = getAndRemoveById(waitingDots,id);
    initDotComplete(savedElDot, true);
    $(savedElDot).find('a').attr('href', url);
};

var elementSaveFailed = function(id) {
    var savedElDot = getAndRemoveById(waitingDots,id);
    if(savedElDot) {
        failedDots.push(savedElDot);
        initDotComplete(savedElDot, false);
        savedElDot = $(savedElDot);
        savedElDot.find('.success').hide();
        savedElDot.find('.fail').css({display: 'table-cell'});
        savedElDot.find('.remove').on('click', function(e) {preventDefault(e);removeDot(id);});
        savedElDot.find('.try-again').on('click', function(e) {preventDefault(e);reParse(id);});
    } else saveFailed = true;
};

var reParse = function(id) {
    var savedElDot = getAndRemoveById(failedDots, id);
    waitingDots.push(savedElDot);
    var savedElement = getElementById(parsedElements, id);

    // Reset dot to initial settings
    leaveSavedDot.call(savedElDot);
    $(savedElDot).off('mouseenter');
    $(savedElDot).off('mouseleave');
    $(savedElDot).find('.remove').off('click');
    $(savedElDot).find('.try-again').off('click');
    $(savedElDot).css({cursor: 'wait'});
    savedElDot.interval = setInterval(function(){savingInProgress(savedElDot)}, COLORINTERVAL);

    // Re-attempt parsing flow
    var targetClass = $(savedElement).attr('class');
    var type = getType($(savedElement), targetClass);
    var reParseEl = new DragElement({target: $(savedElement), targetClass: targetClass, type: type, id: id});
    reParseEl.parser().then(sendToServer);
};

var removeDot = function(id) {
    var savedElDot = getAndRemoveById(failedDots,id);
    var savedElement = getAndRemoveById(parsedElements,id);
    turnOnDrag(savedElement);
    removeFromArray(findHolder(savedElement).stored,savedElDot);
    savedElDot.remove();
};

var flushDots = function() {
    parsedElements.forEach(function(el) {
        el.dragOff = false;
        var stored = findHolder(el).stored;
        stored.forEach(function(dot){
            dot.remove();
            removeFromArray(stored, dot);
        });
    });
    parsedElements = [];
};

$(window).resize(function(){
    parsedElements.forEach(function(el) {
        setDotPosition(el);
    });
});