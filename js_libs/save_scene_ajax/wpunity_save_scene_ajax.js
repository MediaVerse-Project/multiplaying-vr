function wpunity_saveSceneAjax() {

    jQuery.ajax({
        url: isAdmin == "back" ? 'admin-ajax.php' : my_ajax_object_savescene.ajax_url,
        type: 'POST',
        data: {
            'action': 'wpunity_save_scene_async_action',
            'scene_id': isAdmin == "back" ? phpmyvarC.scene_id : my_ajax_object_savescene.scene_id,
            'scene_json': document.getElementById("wpunity_scene_json_input").value
        },
        success: function (data) {
            console.log("Ajax Save Scene:" + data);
            document.getElementById('save-scene-button').style.backgroundColor = '#ff4081';
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Ajax Save Scene: ERROR: 156" + thrownError);

            document.getElementById('save-scene-button').style.backgroundColor = '#000000';
            alert("Ajax Save Scene: ERROR: 156" + thrownError);
        }
    });

}