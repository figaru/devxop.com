import './login.html';


Template.Login.events({
    'click #submit-login': function (event, tmpl) {
        event.preventDefault();
        $('#login-error').html("");

        var email = tmpl.find("#input-email").value;
        var pass = tmpl.find("#input-pass").value;
        console.log(email);
        console.log(pass);
        if (email && pass) {
            Meteor.loginWithPassword(email.toLowerCase(), pass, function (err, res) {
                if (err) {
                    $('#login-error').html("Denied! Please make sure the details are correct.");
                    return;
                }
                else {
                    console.log(err, res)
                    // if we are on the login route, we want to redirect the user
                    //return Router.go('user.dashboard');
                    FlowRouter.path("dashboard");
                }
            });
        } else {
            console.log("empty");
            return false;
        }

    }
});