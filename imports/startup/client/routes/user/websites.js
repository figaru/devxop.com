UserRouter.route('/website', {
    name: "website",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Website' });
    }
});