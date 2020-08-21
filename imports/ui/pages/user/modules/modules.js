import './modules.html';

EDITING_MODULE = "modules.editing";

Template.Modules.onRendered(function () {
    console.log("template rendered");


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

            let array = module.two_column

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

        $("#module-iframe").css({ "width": "1080px", "height": "1920px" });
        toCanvas(elem[0], { width: 1080, height: 1920 }).then(function (canvas) {
            $("#module-iframe").css({ "width": "278px", "height": "483px" });

            /* console.log(canvas.toDataURL()); */

            canvas.toBlob(function (blob) {
                const img_from_canvas = document.getElementById("image");
                let url = URL.createObjectURL(blob);
                img_from_canvas.src = url;
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
