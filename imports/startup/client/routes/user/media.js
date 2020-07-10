UserRouter.route('/media', {
    name: "media",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Media' });
    }
});