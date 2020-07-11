import './login.html';


Template.Login.events({
    'click #submit-login': function (event, tmpl) {
        event.preventDefault();
        $('#login-error').html("");

        var email = tmpl.find("#input-email").value;
        var pass = tmpl.find("#input-pass").value;
        if (email && pass) {
            Meteor.loginWithPassword(email.toLowerCase(), pass, function (err, res) {
                if (err) {
                    $('#login-error').html("Denied! Please make sure the details are correct.");
                    return;
                }
                else {
                    // if we are on the login route, we want to redirect the user
                    //return Router.go('user.dashboard');
                    let path = FlowRouter.path("dashboard");
                    FlowRouter.go(path);
                }
            });
        } else {
            console.log("empty");
            return false;
        }

    }
});