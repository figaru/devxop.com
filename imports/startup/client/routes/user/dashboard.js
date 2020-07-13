UserRouter.route('/dashboard', {
    name: "dashboard",
    action: function () {
        /* BlazeLayout.render('User_layout', { main: 'Dashboard' }); */
        /* BlazeLayout.render('User_layout', { main: 'Devices' }); */
        var path = FlowRouter.path("devices", {}, {});
        //console.log(path);
        FlowRouter.go(path);
    }
});