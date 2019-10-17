/**
 * Create Game:
 *  1. Create Game Project
 *  2. Create Default scenes
  *
 *  All the above are encompassed in     wpunity_create_gameproject_frontend($game_id)
 */
function wpunity_createGameAjax(game_project_title, game_project_type_radio) {




    jQuery.ajax({
        url: isAdmin == "back" ? 'admin-ajax.php' : my_ajax_object_creategame.ajax_url,
        type: 'POST',
        data: {
            'action': 'wpunity_create_game_action',
            'game_project_title': game_project_title,
            'game_project_type_radio': game_project_type_radio
        },
        success: function (res) {

            console.log("Game project has been successfully created");
            // ajax add project to list

            location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {

            // jQuery('#delete-dialog-progress-bar').hide();
            //
            // jQuery( "#deleteGameBtn" ).removeClass( "LinkDisabled" );
            // jQuery( "#cancelDeleteGameBtn" ).removeClass( "LinkDisabled" );

            //alert("Could not create game");

            console.log("Ajax Create Game: ERROR: 169" + thrownError);
        }
    });

}