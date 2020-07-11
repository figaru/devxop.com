UserRouter.route('/media', {
    name: "media",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Media' });
    }
});

UserRouter.route('/media/drive/:type', {
    name: "media.drive",
    subscriptions: function(params, queryParams){
        // using Fast Render
        //this.register('filesByType', Meteor.subscribe('files.allByType', params.type));
    },
    action: function (params, queryParams) {
        BlazeLayout.render('User_layout', { main: 'Media_drive', params: params });
    }
});

UserRouter.route('/media/collections', {
    name: "media.collections",
    subscriptions: function(params, queryParams){
        // using Fast Render
        //this.register('filesByType', Meteor.subscribe('files.allByType', params.type));
    },
    action: function (params, queryParams) {
        BlazeLayout.render('User_layout', { main: 'Media_collections', params: params });
    }
});