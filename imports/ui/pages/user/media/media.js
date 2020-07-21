import './media.html';


Template.Media.helpers({
    'stats': function () {
        let files = Files.find({ "deleting": { $exists: false } }).fetch();
        // do something
        let data = {
            "storage_used": 0,
            "total_files": 0,
            "video_items": 0,
            "image_items": 0,
            "collection_items": 0,
            "other_items": 0,
        };

        /* GET FILES COUNT */
        data.total_files = files.length;
        for (let i = 0; i < files.length; i++) {
            const doc = files[i];

            if (doc.file) {
                data.storage_used += doc.file.size;

                let type = doc.file.mimetype.substring(0, 3);
                if (type == "ima") {
                    data.image_items += 1;
                } else if (type == "vid") {
                    data.video_items += 1;
                } else if (doc.is_collection) {
                    data.collection_items += 1;
                }
                else {
                    data.other_items += 1;
                }
            }

        }

        return data;
    },
});

