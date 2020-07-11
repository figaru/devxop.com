UserRouter.route('/devices', {
    name: "devices",
    subscriptions: function(){
        this.register('allDevices', Meteor.subscribe('devices.all'));
    },
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Devices' });
    }
});