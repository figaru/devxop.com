UserRouter.route('/collections', {
    name: "collections",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Collections' });
    }
});