/**
 * Created by M on 9/16/15.
 */

// Submission Listener
$('#login-form').submit(function( event ) {
    event.preventDefault();
    var email = $('input[name=email]').val();
    var password = $('input[name=password]').val();
    var data = {'email': email, 'password': password}; // TODO: take out first_name
    // If submitType is undefined, it is assumed that user is logging in (i.e. for enter press)
    chrome.runtime.sendMessage({
        message: 'login',
        data: JSON.stringify(data)
    });
});

$('#register-form').submit(function( event ) {
    event.preventDefault();
    var password = $('input[name=reg_password]').val();
    var passwordCheck = $('input[name=reg_password_check]').val();
    if(password == passwordCheck) {
        var email = $('input[name=reg_email]').val();
        var firstName = $('input[name=first_name]').val();
        var lastName = $('input[name=last_name]').val();
        var data = {'email': email, 'password': password, 'first_name': firstName, 'last_name': lastName};
        // If submitType is undefined, it is assumed that user is logging in (i.e. for enter press)
        chrome.runtime.sendMessage({
            message: 'register',
            data: JSON.stringify(data)
        });
    } else {
        chrome.runtime.sendMessage({
            message: 'error',
            errors: "Passwords Don't Match Please Try Again."
        });
    }
});

$('#logout').click(function( event ) {
    event.preventDefault();
    chrome.runtime.sendMessage({message: 'logout'}, function(response) { if(!response.userActive) setPopupDisplay() });
});

var setPopupDisplay = function(name) {
    var login = $('#logged-out');
    var loggedIn = $('#logged-in');
    if(name) {
        login.hide();
        loggedIn.show();
        loggedIn.find('#user-name').text(name);
    } else {
        login.show();
        // Clear Login Form
        $('input[name=email]').val('');
        $('input[name=password]').val('');
        // Clear Register Form
        $('input[name=reg_email]').val('');
        $('input[name=reg_password]').val('');
        $('input[name=reg_password_check]').val('');
        $('input[name=first_name]').val('');
        $('input[name=last_name]').val('');
        loggedIn.hide();
    }
};

chrome.runtime.sendMessage({message: 'checkActive'}, function(response) {
    if(response.userActive) setPopupDisplay(response.firstName);
    else setPopupDisplay();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if ( request.message == 'init' && request.userActive ) setPopupDisplay(request.firstName);
});