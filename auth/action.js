document.addEventListener('DOMContentLoaded', function() {
  function getParameterByName(name) {
    var res = new RegExp(
        // Parameter names always start after a ? or &.
        '[\?&]' +

        // Make sure any [ or ] are escaped in the name.
        name.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]') +

        // Either match a =... or match an empty value.
        // Values can be terminated by an & a # or the end of the string ($).
        '(?:=([^&#]*))?(?:[&#]|$)'
    ).exec(window.location.search);

    return res ?
      (res[1] ? // res[1] will be undefined for a parameter without value.
        decodeURIComponent(res[1].replace(/\+/g, ' ')) : ''
      ) : null;
  }

  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode');
  // (Optional) Get the API key from the query parameter.
  var apiKey = getParameterByName('apiKey');
  // (Optional) Get the continue URL from the query parameter if available.
  var continueUrl = getParameterByName('continueUrl');
  // (Optional) Get the language code if available.
  var lang = getParameterByName('lang') || 'en';

  // Configure the Firebase SDK.
  // This is the minimum configuration required for the API to be used.
  var config = {
    'apiKey': apiKey  // This key could also be copied from the web
                      // initialization snippet found in the Firebase console.
  };
  var app = firebase.initializeApp(config);
  var auth = app.auth();

  // Handle the user management action.
  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode, continueUrl, lang);
      break;
    case 'recoverEmail':
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode, lang);
      break;
    case 'verifyEmail':
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode, continueUrl, lang);
      break;
    default:
      // Error: invalid mode.
  }
}, false);

function handleRecoverEmail(auth, actionCode, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  var restoredEmail = null;
  // Confirm the action code is valid.
  auth.checkActionCode(actionCode).then(function(info) {
    // Get the restored email address.
    restoredEmail = info['data']['email'];

    // Revert to the old email.
    return auth.applyActionCode(actionCode);
  }).then(function() {
    // Account email reverted to restoredEmail

    // TODO: Display a confirmation message to the user.

    // You might also want to give the user the option to reset their password
    // in case the account was compromised:
    auth.sendPasswordResetEmail(restoredEmail).then(function() {
      // Password reset confirmation sent. Ask user to check their email.
    }).catch(function(error) {
      // Error encountered while sending password reset code.
    });
  }).catch(function(error) {
    // Invalid code.
  });
}

function handleResetPassword(auth, actionCode, continueUrl, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  var accountEmail;
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then(function(email) {
    var accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);

      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    }).catch(function(error) {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
    });
  }).catch(function(error) {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}

function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  // Try to apply the email verification code.
  auth.applyActionCode(actionCode).then(function(resp) {
    // Email address has been verified.

    document.write("Your email has been verified")
    // You could also provide the user with a link back to the app.

    // TODO: If a continue URL is available, display a button which on
    // click redirects the user back to the app via continueUrl with
    // additional state determined from that URL's parameters.
  }).catch(function(error) {
    // Code is invalid or expired. Ask the user to verify their email address
    // again.
  });
}