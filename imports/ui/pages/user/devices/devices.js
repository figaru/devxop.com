import './devices.html';

DEVICE_EDIT = "device.editing";
DEVICE_EDIT_SELECTED_DISPLAY = "device.editing.selected.display";

Template.Devices.onCreated(function () {
    this.editingFile = new ReactiveVar();

    this.templateStartup = new ReactiveVar(true); // flag certain variable startup once
    this.selectedDisplayView = new ReactiveVar(null);
    this.counter = new ReactiveVar(0);

    this.device = new ReactiveVar(null);
});

Template.Devices.onRendered(function(){
    $(document).on('deviceEdit', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let device = Session.get(DEVICE_EDIT);
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();
        let data = {};

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if (key == "display_view") {
            //set the current display view in edit mode
            //self.selectedDisplayView.set(val);
            Session.set(DEVICE_EDIT_SELECTED_DISPLAY, val);
            
            return;
        } else if (key == "interval") {
            //set the current view interval speed
            let selectedView = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
            if (selectedView) {
                data["views." + selectedView + ".interval"] = val;
            }
        } else if (key == "file") {
            let selectedView = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
            let fileId = target.data("file");

            if (selectedView && fileId && device.views !== undefined && device.views[selectedView] !== undefined) {
                let deviceFilesList = device.views[selectedView].files;

                if (selectedView == "video") {
                    data["views." + selectedView + ".files"] = [fileId];
                } else {
                    if (Array.isArray(deviceFilesList)) {
                        if (!deviceFilesList.includes(fileId)) {
                            deviceFilesList.push(fileId);
                            data["views." + selectedView + ".files"] = deviceFilesList;
                        }
                    } else {
                        //nothing exists -> create array
                        data["views." + selectedView + ".files"] = [fileId];
                    }
                }

            } else {
                //nothing exists -> create array
                data["views." + selectedView] = {
                    "files": [fileId],
                    "interval": 9000
                };
            }
        } else {
            data[key] = val;
        }

        if (!$.isEmptyObject(data)) {
            Devices.update(device._id, {
                $set: data
            });
        }


    });
});

Template.Devices.helpers({
    'devices_list': function () {
        return Devices.find().fetch();
    },
    'editing_device': function () {
        return Session.get(DEVICE_EDIT);
    },
    "getViewFiles": function (device) {
        //let device = Template.instance().data.device;
        if (device && device.published_view !== undefined) {
            return device.views[device.published_view].files;
        }

        return [];
    },
    "getViewFiles": function () {
        let tmpl = Template.instance();
        let device = Session.get(DEVICE_EDIT);
        //let view = tmpl.selectedDisplayView.get();
        if (device && device.published_view !== undefined) {
            return device.views[device.published_view].files;
        }

        return [];

    },
    "publishedDisplayView": function () {
        let device = Session.get(DEVICE_EDIT);
        if (device) {
            return device.published_view;
        }

        return "";

    },
    "displayViewExists": function () {
        return Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
    },
    "displayViewEdit": function (viewType) {
        let selectedView = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
        console.log(selectedView);
        return typeof selectedView != "undefined" && selectedView === viewType ? true : false;
    },
    "displayViewPublished": function (viewType) {
        let selectedView = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
        let device = Session.get(DEVICE_EDIT);
        return typeof selectedView != "undefined" && selectedView === device.published_view ? true : false;
    },
    "selectedInterval": function () {
        //return interval based on selected display view
        let selectedView = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
        let device = Session.get(DEVICE_EDIT);
        let interval = device.views[selectedView].interval;

        if (interval) {
            //console.log(interval);
            if (interval == 7000) {
                return "Fast(7sec)";
            } else if (interval == 10000) {
                return "Medium(10sec)";
            } else if (interval == 12000) {
                return "Slow(12sec)";
            }
        }
    },
    "dropdownViewList": function () {
        return [
            {
                "key": "display_view",
                "value": "video",
                "label": "Video"
            },
            {
                "key": "display_view",
                "value": "image",
                "label": "Image"
            }
        ];
    },
    "dropdownIntervalList": function () {
        return [
            {
                "key": "interval",
                "value": 7000,
                "label": "Fast(7sec)"
            },
            {
                "key": "interval",
                "value": 10000,
                "label": "Medium(10sec)"
            },
            {
                "key": "interval",
                "value": 12000,
                "label": "Slow(12sec)"
            }
        ];
    }
});

Template.Devices.events({
    'click .js-device-edit': function (e, tmpl) {
        let deviceId = $(e.currentTarget).data("device");
        let device = Devices.findOne(deviceId);

        if(device){
            Session.set(DEVICE_EDIT, device);
        }
    },
    'click .js-remove-file': function (e, tmpl) {
        let target = $(e.currentTarget);
        let device = Session.get(DEVICE_EDIT);
        let view = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
        let fileId = target.data("file");
        let index = target.data("index");

        if (device && view) {
            let deviceFilesList = device.views[view].files;
            //remove item index
            deviceFilesList.splice(index, 1);

            Devices.update(device._id, {
                $set: { ["views." + view + ".files"]: deviceFilesList }
            });


        }

    },
    'click .js-publish-displayView': function (e, tmpl) {
        let device = Session.get(DEVICE_EDIT);
        let view = Session.get(DEVICE_EDIT_SELECTED_DISPLAY);
        if (view && device) {
            Devices.update(device._id, {
                $set: {
                    "published_view": view
                }
            });
        }

    },
    'click .js-force-restart': function (e, tmpl) {
        let target = $(e.target);
        let device = Session.get(DEVICE_EDIT);
        if (device) {
            target.attr("disabled", true);

            setTimeout(function () {
                Meteor.call("devices.emit.restart", device._id, function (err) {
                    if (err) {
                        console.log("an error ocurred");
                    }

                    target.removeAttr("disabled");
                });
            }, 2000)

        }

    }
});
