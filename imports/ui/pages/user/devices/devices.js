import './devices.html';

DeviceEdit = new Mongo.Collection(null);

DEVICE_EDIT_ID = "device.editing";
SELECTED_VIEW = "device.editing.selected.display";

Template.Devices.onCreated(function () {
    this.editingFile = new ReactiveVar();

    this.templateStartup = new ReactiveVar(true); // flag certain variable startup once
    this.selectedDisplayView = new ReactiveVar(null);
    this.counter = new ReactiveVar(0);

    this.device = new ReactiveVar(null);
});

Template.Devices.onRendered(function () {
    Session.set(DEVICE_EDIT_ID, null);
    this.autorun(function () {
        let deviceId = Session.get(DEVICE_EDIT_ID);
        let device = Devices.findOne(deviceId);
        let view = Session.get(SELECTED_VIEW);
        if (device) {
            if (!view) view = device.published_view;

            device["selected_view"] = view;
            DeviceEdit.remove({});
            DeviceEdit.insert(device);
        }

    });

    $(document).on('deviceEdit', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let device = DeviceEdit.findOne();
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
            Session.set(SELECTED_VIEW, val);
            DeviceEdit.update(device._id, { $set: { "selected_view": val } });
            return;
        } else if (key == "interval") {
            //set the current view interval speed
            let selectedView = device.selected_view;
            if (selectedView) {
                data["views." + selectedView + ".interval"] = val;
            }
        } else if (key == "file") {
            let selectedView = device.selected_view;
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
        return DeviceEdit.findOne();
    },
    'selected_module': function () {

    },
    "modules_list": function () {
        return Modules.find().fetch();
    },
    "get_view_files": function (device) {
        //let device = Template.instance().data.device;
        if (device && device.published_view) {

            if (device.published_view in device.views) {

                if (device.published_view == "module") {
                    let module = Modules.findOne(device.views[device.published_view].id);

                    if (module) {
                        return [module.file];
                    }

                    return [];
                }

                return device.views[device.published_view].files;
            }

        }

        return [];
    },
    "getViewFiles": function () {
        let tmpl = Template.instance();
        let device = DeviceEdit.findOne();
        //let view = tmpl.selectedDisplayView.get();
        if (device && device.published_view) {
            if (device.published_view in device.views) {

                if (device.published_view == "module") {
                    let module = Modules.findOne(device.views[device.published_view].id);

                    if (module) {
                        return [module.file];
                    }

                    return [];
                }

                return device.views[device.published_view].files;
            }
        }

        return [];

    },
    "publishedDisplayView": function () {
        let device = DeviceEdit.findOne();
        if (device) {
            return device.published_view;
        }

        return "";

    },
    "displayViewEdit": function (viewType) {
        let device = DeviceEdit.findOne();
        if (device) {
            let selectedView = device.selected_view;
            return typeof selectedView != "undefined" && selectedView === viewType ? true : false;
        }

        return false;

    },
    "displayViewPublished": function (viewType) {

        let device = DeviceEdit.findOne();
        let selectedView = device.selected_view;
        return typeof selectedView != "undefined" && selectedView === device.published_view ? true : false;
    },
    "selectedInterval": function () {
        //return interval based on selected display view

        let device = DeviceEdit.findOne();
        let selectedView = device.selected_view;
        if (selectedView) {
            if (selectedView in device.views) {
                let interval = device.views[selectedView].interval;
                if (interval == 7000) {
                    return "Fast(7sec)";
                } else if (interval == 10000) {
                    return "Medium(10sec)";
                } else if (interval == 12000) {
                    return "Slow(12sec)";
                }
            }
            /* let interval = device.views[selectedView].interval;

        if (interval) {
            //console.log(interval);
            
        } */
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
            },
            {
                "key": "display_view",
                "value": "module",
                "label": "Module"
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
        Session.set(DEVICE_EDIT_ID, deviceId);
    },
    'click .js-module-select': function (e) {
        let target = $(e.currentTarget);
        let moduleId = target.data("module");
        let device = DeviceEdit.findOne();

        let data = {};
        data["views.module"] = {
            "id": moduleId,
            "files": []
        };

        Devices.update(device._id, {
            $set: data
        });
    },
    'click .js-remove-file': function (e, tmpl) {
        let target = $(e.currentTarget);
        let device = DeviceEdit.findOne();
        let view = device.selected_view
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
        let device = DeviceEdit.findOne();
        let view = device.selected_view
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
        let device = DeviceEdit.findOne();
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
