/**
 * Created by M on 8/6/15.
 */

// Stores currently dragged element
var currDragged;
// Stores if dropzone has been entered
var entered = false;

// ******************************** //
// *********** Helpers ************ //
// ******************************** //

// Prevent all the defaults for events
var preventDefault = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

// Find the proper display title associated with a type
var findTitle = function(type) {
    switch(type) {
        case USERTYPE:
            return 'Person';
        case HANGOUTTYPE:
            return 'On Air Video';
        case EMBEDTYPE:
            return 'Media from Post';
        default:
            return type;
    }
};

// Set the position of the dropzone on screen
var setDropPosition = function(dropZone, target, e) {
    var minTop = 0;
    var maxTop = $(window).height() - dropZone.outerHeight();
    var top = e.originalEvent.clientY - dropZone.outerHeight() / 2; // Vertically center dropzone around cursor
    var left = e.originalEvent.clientX - DRAGIMAGESIZE/2 - dropZone.outerWidth() - SPACING; // Position dropzone to the left of target

    // Ensure dropzone isn't out of screen left
    if ( left < 0 ) left = e.originalEvent.clientX + DRAGIMAGESIZE/2; // TODO: get drag image size from curr drag image
    // Ensure dropzone isn't out of screen right
    if ( left + dropZone.outerWidth() > $(window).width() ) {
        left = e.originalEvent.clientX;
        top = e.originalEvent.clientY;
    }

    // Ensure dropzone isn't out of screen (top or bottom)
    top = Math.min(maxTop, Math.max(minTop, top));

    return {'left': left, 'top': top};
};

// Show the dropzone after setting layout, style, etc
var showDropZone = function(target, e, type) {
    // Set position
    var position = setDropPosition(dropZone, target, e);
    dropZone.css({left: position['left'], top: position['top'], color: typeToColor[type]});
    dropZone.find('.inner-circle').css({background: typeToInner[type]});

    // Set title
    dragType.find('.type').text(findTitle(type));

    dropZone.show();
};

// ******************************** //
// ********* Drag Events ********** //
// ******************************** //

// On drag start, check if its a type, pick drag image, show dropzone
var onDragStart = function(e) {
    var target = $(e.target);
    var targetClass = target.attr('class');
    var type = getType(target,targetClass);
    if (type && !currDragged) {
        if(onboarding) showDropTitle();
        targetClass = targetClass.replace(' x_cursor', '');
        currDragged = new DragElement({target: target, targetClass: targetClass, type: type, id: getElementId(target,type,targetClass)});
        e.originalEvent.dataTransfer.setDragImage(typeToImage[type], 75, 75);
        showDropZone(target, e, type);
        currDragFunction = pauseDrag;
        currDragState = false;
        pauseDrag(currDragState);
        if(currHighlighted) unHighlightDragElement.call(currHighlighted);
    }
};

// Get the type from our own classes
var getObjectType = function(obj) {
    if(obj instanceof Post) return POSTTYPE;
    else if(obj instanceof User) return USERTYPE;
    else if(obj instanceof Community) return COMMUNITYTYPE;
    else if(obj instanceof Hangout) return HANGOUTTYPE;
    else if(obj instanceof Event) return EVENTTYPE;
    else if(obj instanceof EmbededElement) return EMBEDTYPE;
};

// Send parsed data to server
var sendToServer = function(parsedObj) {
    // Testing Logs
    console.log("Parsed:");
    console.log(parsedObj);

    var type = getObjectType(parsedObj);
    if(parsedObj && $.inArray(type, comingSoon) == -1) {
        chrome.runtime.sendMessage({
            message: 'store',
            type: config.typeToApi(type),
            data: parsedObj
        });
    }
};

// Reset page to defaults once dragging is done
var resetDragDefaults = function() {
    currDragFunction = enableDrag;
    currDragState = true;
    pauseDrag(currDragState);
    $(this).find('.inner-circle').removeClass('saving');
    dragType.html("Drag <span class='type'></span> Here");
    entered = false;
    currDragged = null;
};

// Start the parsing and send to server once complete
var onDrop = function(e) {
    var dragElement = currDragged.target.get(0);
    var type = currDragged.type;
    if(onboarding) showHoverTitle();
    else currDragged.parser().then(sendToServer); // Parse current element

    // Change to drop color and display 'saved' (upon callback of successful upload)
    dragType.text("Saving");
    setTimeout(function() {
        storedElement(dragElement,type);
        dropZone.hide(0, resetDragDefaults);
    }, 1000);

    return preventDefault(e);
};

// Change dropzone if user has entered it
var onDragEnter = function(e) {
    entered = true;
    dragType.text("release to save");
    // Highlight box
    $(e.target).find('.inner-circle').addClass('saving');
    return preventDefault(e);
};

// Change dropzone if user has left it
var onDragLeave = function(e) {
    entered = false;
    // Unhighlight box
    dragType.html("Drag <span class='type'></span> Here");
    dragType.find('.type').text(findTitle(currDragged.type));
    $(e.target).find('.inner-circle').removeClass('saving');
    return preventDefault(e);
};

// If drop doesn't occur reset to original state
var onDragEnd = function(e) {
    if ( !entered && currDragged ) {
        if(onboarding) showDragTitle();
        dropZone.hide();
        currDragged = null;
        currDragFunction = enableDrag;
        currDragState = true;
        pauseDrag(currDragState);
    }
    return preventDefault(e);
};