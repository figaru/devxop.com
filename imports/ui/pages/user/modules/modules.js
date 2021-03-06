import './modules.html';

EDITING_MODULE = "modules.editing";

Template.Modules.onRendered(function () {

    $("#module-iframe").attr("src", "/modules/" + Session.get(EDITING_MODULE));

    $(document).on('moduleEditEvent', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();
        let data = {};

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        data[key] = val;

        if (!$.isEmptyObject(data)) {
            Modules.update(module._id, {
                $set: data
            });
        }
    });
})

Template.Modules.helpers({
    'list_modules': function () {
        return Modules.find().fetch();
    },
    'list_collections': function () {
        return Collections.find().fetch();
    },
    'editing_module': function () {
        return Modules.findOne({ "_id": Session.get(EDITING_MODULE) });
    },
    'get_collection': function (id) {
        return Collections.findOne(id);
    },
    'module_list_collections': function () {
        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

        if (module) {
            return Collections.find({ _id: { $in: module.collections } }).fetch();
        }
    },
    "is_two_column": function (id, returnClass) {
        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

        if (module) {
            return module.two_column.includes(id);
        }

        return false;
    }

});


Template.Modules.events({
    'change .js-two-column': function (e) {
        let target = $(e.target);
        let key = target.data("key");
        let collection = target.data("collection");
        let checked = target.is(":checked");
        let data = {};

        if (key) {

            let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

            let array = module.two_column;

            if (checked) {



                if (array.includes(collection)) {
                    //do nothing
                } else {
                    array.push(collection);
                }

            } else {
                if (array.includes(collection)) {
                    array.splice(array.indexOf(collection), 1);
                }
            }

            data["two_column"] = array;
            Modules.update(module._id, {
                $set: data
            });
        }

    },
    'change .js-visible': function (e) {
        let target = $(e.target);
        let key = target.data("key");
        let checked = target.is(":checked");
        let data = {};

        if (key) {
            data[key] = checked;

            let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

            Modules.update(module._id, {
                $set: data
            });
        }

    },
    'click .js-generate': function () {
        let elem = $("#module-iframe").contents().find('#canvas');

        let width = 1080,
            height = 1920;

        $("#module-iframe").css({ "width": width + "px", "height": height + "px", "transform": "translateX(-1000%)" });
        toCanvas(elem[0], { width: width, height: height }).then(function (canvas) {
            $("#module-iframe").css({ "width": "278px", "height": "483px", "transform": "translateX(0)" });

            /* console.log(canvas.toDataURL()); */

            canvas.toBlob(function (blob) {
                const img_from_canvas = document.getElementById("image");
                let url = URL.createObjectURL(blob);
                /* img_from_canvas.src = url; */



                Jimp.read(url)
                    .then(image => {
                        // Do stuff with the image.
                        image.rotate(-90);
                        image.resize(height, width); //with rotation height becomes width size and vice versa
                        image.getBase64Async(Jimp.MIME_JPEG).then(data => {

                            fetch(data)
                                .then(res => {
                                    res.blob().then(blob => {
                                        /* let blobUrl = URL.createObjectURL(blob);
                                        console.log(blobUrl);
                                        img_from_canvas.src = blobUrl; */

                                        const file = new File([blob], "File name", { type: "image/jpeg" });

                                        var form_data = new FormData(); // Creating object of FormData class
                                        form_data.append("file", file); // Appending parameter named file with properties of file_field to form_data
                                        form_data.append("user_id", Meteor.userId()); // Adding extra parameters to form_data
                                        form_data.append("hidden", true);//flag hidden has it is used to has module
                                        form_data.append("module", Session.get(EDITING_MODULE));
                                        $.ajax({
                                            url: Meteor.settings.public.api.storage + "/files", // Upload Script
                                            dataType: 'json',
                                            cache: false,
                                            contentType: false,
                                            processData: false,
                                            data: form_data, // Setting the data attribute of ajax with file_data
                                            type: 'post',
                                            xhr: function () {
                                                var xhr = $.ajaxSettings.xhr();
                                                xhr.upload.onprogress = function (e) {
                                                    // For uploads
                                                    if (e.lengthComputable) {
                                                        //(e.loaded / e.total) * 100;
                                                        //tmpl.uploadPercent.set((e.loaded / e.total) * 100);

                                                        console.log((e.loaded / e.total) * 100);
                                                    }
                                                };
                                                return xhr;
                                            },
                                            success: function (data) {
                                                // Do something after Ajax completes
                                                /* if ("eventId" in tmpl.data) {
                                                    data["not_element"] = true;
                                                    data["key"] = "file";
                                                    data["value"] = ""
                                                    $(document).trigger(tmpl.data.eventId, data);
                                                } */

                                                //tmpl.uploading.set(false);
                                                console.log(data);

                                                let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

                                                Modules.update(module._id, {
                                                    $set: {
                                                        "file": data._id
                                                    }
                                                });

                                                if (module.file) {
                                                    Meteor.call("files.remove", module.file, function (err, result) {
                                                        if (err) {
                                                            //console.log(err);
                                                        } else {
                                                            //console.log(result);
                                                            //tmpl.$(".close").click();
                                                            console.log("old file removed");
                                                        }
                                                    });
                                                }


                                            },
                                            error: function (err) {
                                                //tmpl.uploading.set(false);
                                                console.log(err);
                                            }
                                        });


                                    });

                                })
                        });
                    })
                    .catch(err => {
                        // Handle an exception.
                    });
            });
        });
    },
    'click .js-edit-module': function (e) {
        let moduleId = $(e.currentTarget).data("module");

        let old = Modules.findOne({ editing: true });
        if (old) {
            Modules.update(old._id, {
                $set: {
                    editing: false
                }
            })
        }


        Modules.update(moduleId, {
            $set: {
                editing: true
            }
        });

        Session.set(EDITING_MODULE, moduleId);
    },
    'click .js-create-module': function (e) {
        Modules.insert({ title: "New", type: "menu", collections: [], two_column: [] });
    },
    'click .js-collection-select': function (e) {
        let target = $(e.target);

        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });
        let val = target.data("collection");
        let data = {}

        let collections = module.collections;

        if (!collections.includes(val)) {
            collections.push(val);

            data["collections"] = collections;

            Modules.update(module._id, {
                $set: data
            })
        }


    },
    'click .js-remove-collection': function (e) {
        let target = $(e.target);

        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

        if (!module)
            return;

        let index = target.data("index");
        let collections = module.collections;
        let data = {};
        collections.splice(index, 1);

        data["collections"] = collections;

        Modules.update(module._id, {
            $set: data
        })

    }
});


Template.Modules_preview.helpers({
    'editing_module': function () {
        return Modules.findOne({ "editing": true });
    },
    'module_list_collections': function () {
        let module = Modules.findOne({ "editing": true });

        if (module) {
            return Collections.find({ _id: { $in: module.collections } }).fetch();
        }
    },
    'get_collection': function (id) {
        return Collections.findOne(id);
    },
    'get_product': function (id) {
        return Products.findOne(id);
    },
    "is_two_column": function (id) {
        let module = Modules.findOne({ "editing": true });

        if (module) {
            return module.two_column.includes(id) ? "two-column" : "";
        }

        return;


    }

});
