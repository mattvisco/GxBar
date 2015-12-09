/**
 * Created by M on 11/18/15.
 */

var onboarding = false;
var onboardPopup;
var dragDone = false;
var hoverDone = false;
var doneDone = false;

// Set onboarding, append onboarding html
var startOnboarding = function() {
    onboarding = true;
    enableExtension(true);
    $.get(chrome.extension.getURL('/views/onboarding.html'), function(data) {
        onboardPopup = $(data).appendTo('body');
    });
};

// End onboarding, hide title, flush dots
var endOnboarding = function() {
    onboarding = false;
    onboardPopup.hide();
    flushDots();
};

// Onboarding show titles
var showDragTitle = function() {
    if(!hoverDone) {
        dragDone = false;
        $('#onboard-drop').hide();
        $('#logo-drop').hide();
        $('#pager-drop').removeClass('active');
        $('#logo-corner').removeClass('drop');
        $('#onboard-start-drag').show();
        $('#logo-start').show();
        $('#pager-start').addClass('active');
        $('#logo-corner').addClass('start');
    }
};

var showDropTitle = function() {
    if(!dragDone) {
        dragDone = true;
        $('#onboard-start-drag').hide();
        $('#logo-start').hide();
        $('#pager-start').removeClass('active');
        $('#logo-corner').removeClass('start');
        $('#onboard-drop').show();
        $('#logo-drop').show();
        $('#pager-drop').addClass('active');
        $('#logo-corner').addClass('drop');
    }
};

var showHoverTitle = function() {
    if(!hoverDone) {
        hoverDone = true;
        $('#onboard-drop').hide();
        $('#logo-drop').hide();
        $('#pager-drop').removeClass('active');
        $('#logo-corner').removeClass('drop');
        $('#onboard-go-to-element').show();
        $('#logo-go-to-element').show();
        $('#pager-go-to-element').addClass('active');
        $('#logo-corner').addClass('go-to-element');
    }
};

var showDoneTitle = function() {
    if(!doneDone) {
        doneDone = true;
        $('#onboard-go-to-element').hide();
        $('#logo-go-to-element').hide();
        $('#pager-go-to-element').removeClass('active');
        $('#logo-corner').removeClass('go-to-element');
        $('#onboard-done').show();
        $('#logo-done').show();
        $('#pager-done').addClass('active');
        $('#logo-corner').addClass('done');
    }
};
