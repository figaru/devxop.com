import './devices.html';

Template.Devices.helpers({
    'devices_list': function () {
        return Devices.find().fetch();
    },
    'editingFile': function () {
        let tmpl = Template.instance();
        return tmpl.editingFile.get();
    },
    "getViewFiles": function (device) {
        //let device = Template.instance().data.device;
        if (device && device.published_view !== undefined) {
            return device.views[device.published_view].files;
        }

        return [];
    },
});