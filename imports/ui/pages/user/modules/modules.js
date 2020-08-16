import './modules.html';

EDITING_MODULE = "modules.editing";

Template.Modules.onRendered(function () {
    console.log("template rendered");


    $("#module-iframe").attr("src", "/modules/" + Session.get(EDITING_MODULE));
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
    'module_list_collections': function () {
        let module = Modules.findOne({ "_id": Session.get(EDITING_MODULE) });

        if (module) {
            return Collections.find({ _id: { $in: module.collections } }).fetch();
        }
    }

});


Template.Modules.events({
    'click .js-generate': function () {
        let elem = $("#canvas");

        elem.css({ "width": "1080px", "height": "1920px" });
        toCanvas(elem[0], { width: 1080, height: 1920 }).then(function (canvas) {
            elem.css({ "width": "inherit", "height": "inherit" });

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
        Modules.insert({ title: "New", type: "menu", collections: [] });
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
});


Template.Modules_preview.helpers({
    'editing_module': function () {
        return Modules.findOne({ "editing": true });
    },
    'module_list_collections': function () {
        let module = Modules.findOne({ "editing": true});

        if (module) {
            return Collections.find({ _id: { $in: module.collections } }).fetch();
        }
    }

});
