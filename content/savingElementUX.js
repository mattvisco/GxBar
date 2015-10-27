/**
 * Created by M on 10/13/15.
 */

// Constants
var SAVEDSIZE = 20;
var SAVEDHOVERSIZE = 200;
var SAVEDPADDING = 15;
var LITTLEZ = 1;
var BIGZ = 999999999999999;
var WAITTILLERROR = 8000;//30000;
var COLORINTERVAL = 800;
var ANIMATEDOWNSPEED = 500;
var HOVERANIMATE = 300;


var currWait = [];
var savedElements = [];

// check dictionary for the correct holder parent
// TODO: build out for all draggable elements
var findHolderParent = function(dragElement) {
    var parents = $(dragElement).parents(POSTDOT);
    if(parents.length) return parents.get(0);
    else return dragElement;
};

var storedElement = function(dragElement,type) {
    // TODO: user card will need to turn off both on post img and card -- store id as post img
    var id = getElementId(dragElement,type);
    dragElement.refId = id;
    turnOffDrag(dragElement);
    dragElement = findHolderParent(dragElement);

    var currSavedDot = savedElementMaster.clone();

    var currPos = dropZone.position();
    var currColor = dropZone.css('backgroundColor');
    var targetPos = $(dragElement).offset();
    var scrollAmt = $('body').scrollTop();

    $(dragElement).append(currSavedDot);

    var lastStoreBottom = 0;
    if (dragElement.stored && dragElement.stored.length) {
        var topMax = 0;
        for(var i = 0; i < dragElement.stored.length; i++){
            var currTop = $(dragElement.stored[i]).position().top;
            if(currTop > topMax) topMax = currTop ;
        }
        lastStoreBottom = topMax + SAVEDSIZE + SAVEDPADDING;
    } else dragElement.stored = [];
    dragElement.stored.push(currSavedDot.get(0));


    currSavedDot.find('.type').text(type);
    currSavedDot.css({
        display: 'block',
        cursor: 'wait',
        backgroundColor: currColor,
        top: currPos.top - targetPos.top + scrollAmt ,
        left: currPos.left - targetPos.left
    });
    currSavedDot.animate({height: SAVEDSIZE, width: SAVEDSIZE,top: lastStoreBottom, left: -10}, ANIMATEDOWNSPEED, function(){
        currSavedDot.index = 0;
        currSavedDot.interval = setInterval(function(){savingInProgress(currSavedDot)}, COLORINTERVAL);
        currSavedDot.timeout = setTimeout(function(){elementSaveFailed(id);}, WAITTILLERROR);
        $(this).css({zIndex: 1});
        var minScroll = targetPos.top - $('.Uc').height() + lastStoreBottom; // Uc is the banner height
        if($('body').scrollTop() > minScroll) $('body').animate({scrollTop: minScroll});
    });


    currSavedDot = currSavedDot.get(0);
    currSavedDot.isAnimatingSave = false;
    currSavedDot.color = currColor;
    currSavedDot.refId = id;
    currWait.push(currSavedDot);
};

var savingInProgress = function(dot) {
    var type = types[dot.index];
    if (type == HANGOUTTYPE) {
        dot.index++;
        type = types[dot.index];
    }
    $(dot).css({backgroundColor: typeToColor[type]});
    dot.index++;
    if(dot.index >= types.length) dot.index = 0;
};

var enterSavedDot = function() {
    if (!this.isAnimatingSave) {
        this.isAnimatingSave = true;
        var currPos = $(this).position();
        $(this).css({zIndex: BIGZ});
        $(this).animate({
            width: SAVEDHOVERSIZE,
            height: SAVEDHOVERSIZE,
            top: currPos.top - SAVEDHOVERSIZE/2,
            left: currPos.left - SAVEDHOVERSIZE/2
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
        $(this).animate({
            width: SAVEDSIZE,
            height: SAVEDSIZE,
            top: currPos.top + SAVEDHOVERSIZE/2,
            left: currPos.left + SAVEDHOVERSIZE/2,
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

var initDotComplete = function(dot, color) {
    clearTimeout(dot.timeout);
    clearInterval(dot.interval);
    $(dot).css({backgroundColor: color, cursor: 'default'});
    enterSavedDot.call(dot);
    $(dot).on('mouseenter',activateListeners);
    setTimeout(function(){
        if(!dot.listenersActivated) {
            leaveSavedDot.call(dot);
            activateListeners.call(dot);
        }
    }, 2000);
};

// TODO: add catch statement?
var elementSaved = function(id,url) {
    var savedElDot = getAndRemoveById(currWait,id);
    initDotComplete(savedElDot, savedElDot.color);
    $(savedElDot).find('a').attr('href', url);
};

// TODO: specify exact element that failed -- turn dot bad color with message -- try again & delete option
var elementSaveFailed = function(id) {
    var savedElDot = getElementById(currWait,id);
    initDotComplete(savedElDot, typeToColor[FAILTYPE]);
    savedElDot = $(savedElDot);
    savedElDot.find('.success').hide();
    savedElDot.find('.fail').show();
    savedElDot.find('.remove').on('click', function() {removeDot(id);});
    savedElDot.find('.try-again').on('click', function() {reParse(id);});
};

var reParse = function(id) {
    var savedElDot = getElementById(currWait, id);
    var savedElement = getElementById(savedElements, id);

    // Reset dot to initial settings
    leaveSavedDot.call(savedElDot);
    $(savedElDot).off('mouseenter');
    $(savedElDot).off('mouseleave');
    $(savedElDot).find('.remove').off('click');
    $(savedElDot).find('.try-again').off('click');
    $(savedElDot).css({cursor: 'wait'});
    savedElDot.interval = setInterval(function(){savingInProgress(savedElDot)}, COLORINTERVAL);
    savedElDot.timeout = setTimeout(function(){elementSaveFailed(id);}, WAITTILLERROR);

    // Re-attempt parsing flow
    var targetClass = $(savedElement).attr('class');
    var type = getType($(savedElement), targetClass);
    var reParseEl = new DragElement({target: $(savedElement), targetClass: targetClass, type: type, id: id});
    reParseEl.parser().then(sendToServer);
};

var removeDot = function(id) {
    var savedElDot = getAndRemoveById(currWait,id);
    var savedElement = getAndRemoveById(savedElements,id);
    turnOnDrag(savedElement);

    // TODO: if there are elements beneath savedElDot animate upwards
    removeFromArray(findHolderParent(savedElement).stored,savedElDot);
    savedElDot.remove();
};

var flushDots = function() {
    savedElements.forEach(function(el) {
        el.dragOff = false;
        var stored = findHolderParent(el).stored;
        stored.forEach(function(dot){
            dot.remove();
            removeFromArray(stored, dot);
        });
    });
};

var removeFromArray = function(array, value) {
    var index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
};

var getElementById = function(array, key) {
    var value;
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