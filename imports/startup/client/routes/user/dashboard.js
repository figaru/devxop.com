UserRouter.route('/dashboard', {
    name: "dashboard",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Dashboard' });
    }
});