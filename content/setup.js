/**
 * Created by M on 7/9/15.
 * content.js
 */

var dropZone;
var savedElementMaster;
var dragType;
var activatedPopUp;
var currHighlighted;
var currDragState;
var currDragFunction;
var currUrlLocation;
var highlightState = true;
var beenSetup = false;
var userActive = false;
var storedElements = [];

// Dropzone Constants
var SPACING = 75;
var DRAGIMAGESIZE = 150;

// Highlight the element this function is called on / turn off the last highlighted element
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

// Turn off highlight of element called on
var unHighlightDragElement = function() {
    $(this).css({outlineStyle: 'none'});
    currHighlighted = null;
};

// If there isn't a highlighted element - highlight element this fn is called on
var checkHighlightDragElement = function() {
    if(!currHighlighted) highlightDragElement.call($(this));
};

// Check if we are on a specific type of weird event page, turns off dragging
var checkEventPageDraggable = function(dragEl) {
    if ( window.location.pathname.indexOf("/events/") != -1 && window.location.pathname.indexOf("/Events/events/") == -1 ) {
        return !(POSTDOT.includes(dragEl) || dragEl == EMBEDDOT);
    } else return true;
};

// Select proper title for popup and show
var showActiveHtml = function(show, extension) {
    if(extension) {
        if(show) showHideTitle('#active', '#de-active', '#high-active', '#high-de-active');
        else showHideTitle('#de-active', '#active', '#high-active', '#high-de-active');
    } else {
        if(show) showHideTitle('#high-active', '#active', '#de-active', '#high-de-active');
        else showHideTitle('#high-de-active', '#active', '#de-active', '#high-active');
    }
    // If onboarding disable popups
    if(!onboarding) {
        activatedPopUp.show();
        setTimeout(function (){activatedPopUp.fadeOut()}, 1000);
    }
};

// Show title and hide the rest
var showHideTitle = function(showTitle, hide1, hide2, hide3) {
    activatedPopUp.find(showTitle).show();
    activatedPopUp.find(hide1).hide();
    activatedPopUp.find(hide2).hide();
    activatedPopUp.find(hide3).hide();
};

// Iterates through elements in draggable and nondraggable array and sets them to be draggable
var setDraggables = function(drag, nondrag, select, onlyHighlight, updateElement, pause) {
    var dragElement;
    for (var dragIndex in draggable) {
        if (checkEventPageDraggable(draggable[dragIndex])) {
            // If mutation passes in updateElement than find update any draggables withing element
            // otherwise search for draggables within entire doc
            if(updateElement) {
                if (convertClassFormat(updateElement.attr('class')) == draggable[dragIndex]) dragElement = updateElement;
                else dragElement = updateElement.find(draggable[dragIndex]);
            }
            else dragElement = $(draggable[dragIndex]);
            dragElement.each(function () {
                checkAndAddDot(this);
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
            if(updateElement) {
                if (convertClassFormat(updateElement.attr('class')) == nonDraggable[nonDragIndex]) dragElement = updateElement;
                else dragElement = updateElement.find(nonDraggable[nonDragIndex]);
            }
            else dragElement = $(nonDraggable[nonDragIndex]);
            dragElement.each(function () {
                $(this).attr("draggable", nondrag);
                if($.inArray( $(this).attr('class'), nonXers) == -1 ) {
                    if(!pause) {
                        if (drag) $(this).addClass('x_cursor');
                        else $(this).removeClass('x_cursor');
                    }
                }
            });
        }
    }
};

// Pause dragging, update element only toggles specific element
var pauseDrag = function(drag, updateElement) {
    setDraggables(drag,false,drag, false, updateElement, true);
};

// Toggle dragging, update element only toggles specific element
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

// Toggle highlighting on/off
var enableHighlight = function(state) {
    highlightState = state;
    setDraggables(true, false, true, true);
    if(currHighlighted) currHighlighted.css({outlineStyle: 'none'});
    showActiveHtml(highlightState, false);
};

// Toggles extension on/off
var enableExtension = function(state) {
    if (state && !beenSetup) setup(); // If enable & hasn't been set up, full setup call
    else { // If has been setup and/or disable, turn off highlight, enableDrag with state, show correct popup
        if(currHighlighted) currHighlighted.css({outlineStyle: 'none'});
        currDragFunction = enableDrag;
        currDragState = state;
        enableDrag(currDragState);
        showActiveHtml(currDragState, true);
    }
};

// Embeded elements have weird behavior upon lazy-loading
// Without this function duplicate save bubbles appear
var checkEmbeded = function(obj, objClass) {
    var type = getType($(obj),objClass);
    if (type != EMBEDTYPE) return true;
    else {
        var id = getElementId(obj, type, objClass);
        var holder = findHolder(obj);
        var noExist = true;
        var showingDots = $(holder).find('.saved-element');
        if (showingDots.length) {
            showingDots.each(function(){
                if (this.refId == id) {
                    noExist = false;
                    turnOffDrag(obj);
                }
            });
        }
        return noExist;
    }
};

// Checks if an element should be marked as saved and adds dot if it should
var checkAndAddDot = function(obj) {
    if (!obj.dragOff) {
        var objClass = $(obj).attr('class');
        if(checkEmbeded(obj, objClass)) {
            var type = getType($(obj), objClass);
            var id = getElementId(obj, type, objClass);
            var match;
            for (var i = 0; i < storedElements.length; i++) {
                if (storedElements[i].id == id) match = storedElements[i];
            }
            if (match) addDotToEl(obj, type, id, match.url);
        }
    }
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

// Adds html to G+ and sets draggability of elements
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

    // Append the activation-popup to page
    $.get(chrome.extension.getURL('/views/activated-extension.html'), function(data) {
        activatedPopUp = $(data).appendTo('body');
        $('#gnow-logo-grey').attr('src', chrome.extension.getURL("/images/gx_logo-transparent.png"));
        showActiveHtml(true, true);
    });

    // Append the saved-element master copy to page
    $.get(chrome.extension.getURL('/views/saved-element.html'), function(data) {
        savedElementMaster = $(data).appendTo('body');
        $('#gnow-logo').attr('src', chrome.extension.getURL("/images/gnow_logo.png"));

        currDragFunction = enableDrag;
        currDragState = true;
        enableDrag(currDragState);

        // Turn on draggable observer
        observer.observe(observerTarget, observerConfig);

        beenSetup = true;
    });
};

// Notify background to show login form and display icon in address bar
chrome.runtime.sendMessage({message: 'showPage'});

// Start conversation with background to check status and get user information
var userActivePort = chrome.runtime.connect({name: "checkActiveContent"});
userActivePort.postMessage({message: 'checkLoginStatus'});
userActivePort.onMessage.addListener(function(response) {
    if (response.message == 'loginStatus') {
        if(response.onboarding) {
            startOnboarding();
        } else {
            if (response.userActive) {
                userActive = true;
                userActivePort.postMessage({message: "checkXBarContext"});
            }
        }
    } else if (response.message == keys.XBAR) {
        if(response.value) userActivePort.postMessage({message: "checkHighlightContext"});
    } else if (response.message == keys.HIGHLIGHT) {
        highlightState = response.value;
        userActivePort.postMessage({message: "checkStored"});
    } else if (response.message == 'storedArray') {
        storedElements = response.storedArr;
        setup();
    }
});

// Listens for different messages from background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'init') { // Listen for a signin event
        if (request.onboarding) {
            startOnboarding();
        } else {
            if (request.userActive) {
                if(onboarding) endOnboarding();
                storedElements = request.storedArr;
                highlightState = true;
                if (!beenSetup) {
                    setup();
                }
                else {
                    enableExtension(true);
                }
            } else if(beenSetup) {
                storedElements = [];
                enableExtension(false);
            }
        }
    }
    else if (request.message == keys.XBAR) enableExtension(request.value); // Listens for a extension toggle
    else if (request.message == keys.HIGHLIGHT) enableHighlight(request.value); // Listens for a highlight toggle
    else if (request.message == 'success') elementSaved(request.id, request.url); // Listens for a successful store
    else if (request.message == 'post-fail') elementSaveFailed(request.id); // Listens for a failed store
    else if (request.message == 'flush-dots') flushDots(); // Listens for a flushing of dots
});

// ************************************ //
//         Backlogged Functions         //
// ************************************ //