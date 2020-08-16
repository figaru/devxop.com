UserRouter.route('/modules', {
    name: "modules",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Modules' });
    }
});


UserRouter.route('/modules/:id', {
    name: "modules",
    action: function (data) {
        BlazeLayout.render('User_empty_layout', { main: 'Modules_preview' });
    }
});

/* 
Router.route('/modules/:id', {
    template: "emptyBase",
    waitOn: function () {
      return [
        Meteor.subscribe("templates"),
      ];
    },
    action: function () {
      if (this.ready()) {
        let template = Templates.findOne({ "_id": this.params.id });
        Session.set("template-edit", template);
  
        this.render("templa");
      }
      uiInfo(false);
    },
    onStop: function () {
      uiInfo(true);
    }
  }); */
  