/**
 * Created by M on 7/9/15.
 * content.js
 */

var dropZone;
var savedElementMaster;
var dragType;
var activatedPopUp;
var successBox;
var currHighlighted;
var currDragState;
var currDragFunction;
var currUrlLocation;
var highlightState = true;
var beenSetup = false;
var userActive = false;

// Dropzone Constants
var DROPZONE = '#f2faf7';
var DROPZONEENTER = '#424f55';
var SPACING = 75;
var DRAGIMAGESIZE = 150;

var highlightDragElement = function() {
    var currClass = $(this).attr('class');
    var type = getType($(this),currClass);
    if (type) {
        if( currHighlighted ) {
            if(!currHighlighted.parents( convertClassFormat(currClass) ).length && currHighlighted != $(this) ) {
                unHighlightDragElement.call(currHighlighted);
                currHighlighted = $(this);
                currHighlighted.css({outlineStyle: 'solid', outlineWidth: 2, outlineColor: typeToColor[type]});
            }
        } else {
            currHighlighted = $(this);
            currHighlighted.css({outlineStyle: 'solid', outlineWidth: 2, outlineColor: typeToColor[type]});
        }
    }
};

var unHighlightDragElement = function() {
    $(this).css({outlineStyle: 'none'});
    currHighlighted = null;
};

var checkHighlightDragElement = function() {
    if(!currHighlighted) highlightDragElement.call($(this));
};

var checkEventPageDraggable = function(dragEl) {
    if ( window.location.pathname.indexOf("/events/") != -1 && window.location.pathname.indexOf("/Events/events/") == -1 ) {
        return !(POSTDOT.includes(dragEl) || dragEl == EMBEDDOT);
    } else return true;
};

var showActiveHtml = function(show, extension) {
    if(extension) {
        if(show) showHideTitle('#active', '#de-active', '#high-active', '#high-de-active');
        else showHideTitle('#de-active', '#active', '#high-active', '#high-de-active');
    } else {
        if(show) showHideTitle('#high-active', '#active', '#de-active', '#high-de-active');
        else showHideTitle('#high-de-active', '#active', '#de-active', '#high-active');
    }
    activatedPopUp.show();
    setTimeout(function(){activatedPopUp.fadeOut()}, 1000);
};

var showHideTitle = function(showTitle, hide1, hide2, hide3) {
    activatedPopUp.find(showTitle).show();
    activatedPopUp.find(hide1).hide();
    activatedPopUp.find(hide2).hide();
    activatedPopUp.find(hide3).hide();
};

var pauseDrag = function(drag, updateElement) {
    setDraggables(drag,false,drag, false, updateElement);
};

var enableDrag = function(drag, updateElement) {
    setDraggables(drag, !drag, true, false, updateElement);
    if (drag) {
        // Turn on Drag Listeners
        $(document)
            .on('dragstart', onDragStart)
            .on('dragend', onDragEnd);
    } else {
        // Turn off Drag Listeners
        $(document)
            .off('dragstart', onDragStart)
            .off('dragend', onDragEnd);
    }
};

var setDraggables = function(drag, nondrag, select, onlyHighlight, updateElement) {
    for (var dragIndex in draggable) {
        if (checkEventPageDraggable(draggable[dragIndex])) {
            // If mutation passes in updateElement than find update any draggables withing element
            // otherwise search for draggables within entire doc
            var dragElement;
            if(updateElement) {
                if (convertClassFormat(updateElement.attr('class')) == draggable[dragIndex]) dragElement = updateElement;
                else dragElement = updateElement.find(draggable[dragIndex]);
            }
            else dragElement = $(draggable[dragIndex]);
            dragElement.each(function () {
                var type = getType($(this), $(this).attr('class'));
                if (type && !$(this).get(0).dragOff) {
                    if(!onlyHighlight) {
                        $(this).attr("draggable", drag);
                        if(drag) $(this).addClass('x_cursor');
                        else $(this).removeClass('x_cursor');
                    }
                    if(drag && highlightState) {
                        $(this)
                            .on('mouseenter', highlightDragElement)
                            .on('mouseleave', unHighlightDragElement)
                            .on('mouseover', checkHighlightDragElement);
                    } else {
                        $(this)
                            .off('mouseenter', highlightDragElement)
                            .off('mouseleave', unHighlightDragElement)
                            .off('mouseover', checkHighlightDragElement);
                    }
                    if (select) {
                        for(var selIndex in selectables) {
                            var selectable = $(this).find(selectables[selIndex]);
                            if (selectable.length) selectable.css({cursor: 'text'});
                        }
                        $(this).enableSelection();
                    }
                    else $(this).disableSelection();
                }
            });
        }
    }
    if(!onlyHighlight){
        for( var nonDragIndex in nonDraggable ) {
            var dragElement;
            if(updateElement) {
                if (convertClassFormat(updateElement.attr('class')) == nonDraggable[nonDragIndex]) dragElement = updateElement;
                else dragElement = updateElement.find(nonDraggable[nonDragIndex]);
            }
            else dragElement = $(nonDraggable[nonDragIndex]);
            dragElement.each(function () {
                $(this).attr("draggable", nondrag);
                if($.inArray( $(this).attr('class'), nonXers) == -1 ) {
                    if (drag) $(this).addClass('x_cursor');
                    else $(this).removeClass('x_cursor');
                }
            });
        }
    }
};

// TODO: store saved elements in chrome storage -- open page with bubbles
var turnOffDrag = function(dragElement) {
    $(dragElement)
        .attr("draggable", false)
        .off('mouseenter', highlightDragElement)
        .off('mouseleave', unHighlightDragElement)
        .off('mouseover', checkHighlightDragElement)
        .removeClass('x_cursor')
        .enableSelection();
    dragElement.dragOff = true;
    savedElements.push(dragElement);
};

var turnOnDrag = function(dragElement) {
    $(dragElement)
        .attr("draggable", true)
        .on('mouseenter', highlightDragElement)
        .on('mouseleave', unHighlightDragElement)
        .on('mouseover', checkHighlightDragElement)
        .addClass('x_cursor')
        .enableSelection();
    dragElement.dragOff = false;
};

// ************************************ //
// ************** Setup *************** //
// ************************************ //

// Set up the mutation observer so lazy loaded elements still are draggable
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(currUrlLocation != window.location.href) {
            currDragFunction(currDragState);
            currUrlLocation = window.location.href
        } else if($.inArray( $(mutation.addedNodes).attr('class'), mutationUpdates) != -1 ) {
            currDragFunction(currDragState,$(mutation.addedNodes));
        }
    });
});
var observerConfig = {childList: true, subtree: true};
var observerTarget = document.querySelector('body');

var setup = function() {
    currUrlLocation = window.location.href;

    // Append the drop-zone to page
    $.get(chrome.extension.getURL('/views/dropzone.html'), function(data) {
        dropZone = $(data)
            .appendTo('body')
            .on('dragenter', onDragEnter)
            .on('dragleave', onDragLeave)
            .on('drop', onDrop);
        dragType = dropZone.find('#drag-element');
    });

    // Append the saved-element master copy to page
    $.get(chrome.extension.getURL('/views/saved-element.html'), function(data) {
        savedElementMaster = $(data).appendTo('body');
    });

    // Append the activation-popup to page
    $.get(chrome.extension.getURL('/views/activated-extension.html'), function(data) {
        activatedPopUp = $(data).appendTo('body');
        showActiveHtml(true, true);
    });

    // Append the success-box to page
    $.get(chrome.extension.getURL('/views/success-box.html'), function(data) {
        successBox = $(data).appendTo('body');
    });

    currDragFunction = enableDrag;
    currDragState = true;
    enableDrag(currDragState);

    // Turn on draggable observer
    observer.observe(observerTarget, observerConfig);

    beenSetup = true;
};

chrome.runtime.sendMessage({message: 'showPage'});

var userActivePort = chrome.runtime.connect({name: "checkActiveContent"});
userActivePort.postMessage({message: 'checkLoginStatus'});
userActivePort.onMessage.addListener(function(response) {
    if (response.message == 'loginStatus') {
        if(response.userActive) {
            userActive = true;
            userActivePort.postMessage({message: "checkXBarContext"});
        }
    } else if (response.message == keys.XBAR) {
        if(response.value) userActivePort.postMessage({message: "checkHighlightContext"});
    } else if (response.message == keys.HIGHLIGHT) {
        highlightState = response.value;
        setup();
    }
});

var enableExtension = function(state) {
    if (state && !beenSetup) setup();
    else{
        if(currHighlighted) currHighlighted.css({outlineStyle: 'none'});
        currDragFunction = enableDrag;
        currDragState = state;
        enableDrag(currDragState);
        showActiveHtml(currDragState, true);
    }
};

var enableHighlight = function(state) {
    highlightState = state;
    setDraggables(true, false, true, true);
    if(currHighlighted) currHighlighted.css({outlineStyle: 'none'});
    showActiveHtml(highlightState, false);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'init') {
        if (request.userActive) {
            highlightState = true;
            if (!beenSetup) setup();
            else {
                enableExtension(true);
            }
        } else if(beenSetup) {
            enableExtension(false);
        }
    }
    else if (request.message == keys.XBAR) enableExtension(request.value);
    else if (request.message == keys.HIGHLIGHT) enableHighlight(request.value);
    else if (request.message == 'success') elementSaved(request.id, request.url);
    else if (request.message == 'post-fail') elementSaveFailed(request.id); //TODO: receive id
    else if (request.message == 'flush-dots') flushDots();
});

// ************************************ //
//         Backlogged Functions         //
// ************************************ //