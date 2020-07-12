import "./select.files.html";

Template.select_files.helpers({
    'filesList': function(){
        let tmpl = Template.instance();
        let fileType = tmpl.data.fileType;

        return Files.find({"file.mimetype": { $regex: ".*"+ fileType +".*" }});
    }
})

Template.select_files.events({
    'click .js-file': function(e, tmpl){
        let elem = $(e.currentTarget);
        elem.data("key", tmpl.data.key);
        $(document).trigger(tmpl.data.eventId, [elem]);

        tmpl.$(".js-close-modal").click();
    },
    'click .js-close-modal':function(){
        var myModalEl = document.getElementById('modalFileSelect');
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    }
})