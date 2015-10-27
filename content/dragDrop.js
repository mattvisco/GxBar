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

var preventDefault = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};

var findTitle = function(type) {
    switch(type) {
        case USERTYPE:
            return 'Save User';
        case POSTTYPE:
            return 'Save Post';
        case EVENTTYPE:
            return 'Save Event';
        case HANGOUTTYPE:
            return 'Save Hangout Event';
        case EMBEDTYPE:
            return 'Save Embeded Content';
        case COMMUNITYTYPE:
            return 'Save Community';
        default:
            return 'Whoa, you have succesfully hacked the mainframe';
    }
};

var setDropPosition = function(dropZone, target, e) {
    var minTop = 0;
    var maxTop = $(window).height() - dropZone.outerHeight();
    var top = e.originalEvent.clientY - dropZone.outerHeight() / 2; // Vertically center dropzone around cursor
    var left = e.originalEvent.clientX - DRAGIMAGESIZE/2 - dropZone.outerWidth() - SPACING; // Position dropzone to the left of target

    // Ensure dropzone isn't out of screen left
    if ( left < 0 ) left = e.originalEvent.clientX + DRAGIMAGESIZE/2 + SPACING; // TODO: get drag image size from curr drag image
    // Ensure dropzone isn't out of screen (top or bottom)
    top = Math.min(maxTop, Math.max(minTop, top));

    return {'left': left, 'top': top};
};

var showDropZone = function(target, e, type) {
    // Set position
    var position = setDropPosition(dropZone, target, e);
    dropZone.css({ left: position['left'], top: position['top'] });

    // Set title
    dragType.text(findTitle(type));

    dropZone.show();
};

// ******************************** //
// ********* Drag Events ********** //
// ******************************** //

var onDragStart = function(e) {
    var target = $(e.target);
    var targetClass = target.attr('class');
    var type = getType(target,targetClass);
    if (type && !currDragged) {
        successBox.hide();
        targetClass = targetClass.replace(' x_cursor', '');
        currDragged = new DragElement({target: target, targetClass: targetClass, type: type, id: getElementId(target,type)});
        console.log(e.originalEvent.dataTransfer);
        console.log(typeToImage[type]);
        e.originalEvent.dataTransfer.setDragImage(typeToImage[type], 75, 75);
        showDropZone(target, e, type);
        currDragFunction = pauseDrag;
        currDragState = false;
        pauseDrag(currDragState);
        if(currHighlighted) unHighlightDragElement.call(currHighlighted);
    }

};

var getObjectType = function(obj) {
    if(obj instanceof Post) return 'Post';
    else if(obj instanceof User) return 'User';
    else if(obj instanceof Community) return 'Community';
    else if(obj instanceof Hangout) return 'Hangout';
    else if(obj instanceof Event) return 'Event';
    else if(obj instanceof EmbededElement) return 'EmbededElement';
};

var sendToServer = function(parsedObj) {
    // Testing Logs
    console.log("Parsed:");
    console.log(parsedObj);

    if(parsedObj) {
        chrome.runtime.sendMessage({
            message: 'store' + getObjectType(parsedObj),
            data: parsedObj
        });
    }
};

var resetDragDefaults = function() {
    currDragFunction = enableDrag;
    currDragState = true;
    pauseDrag(currDragState);
    $(this).css({ backgroundColor: DROPZONE });
    entered = false;
    currDragged = null;
};

var onDrop = function(e) {
    var dragElement = currDragged.target.get(0);
    var type = currDragged.type;
    var target = $(e.target);

    currDragged.parser().then(sendToServer); // Parse current element

    // Change to drop color and display 'saved' (upon callback of successful upload)
    target.css({ backgroundColor: typeToColor[type] });
    dragType.text("Saving...");
    setTimeout(function() {
        storedElement(dragElement,type);
        dropZone.hide(0, resetDragDefaults);
    }, 1000);

    return preventDefault(e);
};

var onDragEnter = function(e) {
    entered = true;
    // Highlight box
    $(e.target).css({ backgroundColor: DROPZONEENTER });
    return preventDefault(e);
};

var onDragLeave = function(e) {
    entered = false;
    // Unhighlight box
    $(e.target).css({ backgroundColor: DROPZONE });
    return preventDefault(e);
};

var onDragEnd = function(e) {
    if ( !entered && currDragged ) {
        dropZone.hide();
        currDragged = null;
        currDragFunction = enableDrag;
        currDragState = true;
        pauseDrag(currDragState);
    }
    return preventDefault(e);
};