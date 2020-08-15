UserRouter.route('/modules', {
    name: "modules",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Modules' });
    }
});