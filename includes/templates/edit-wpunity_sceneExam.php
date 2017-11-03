<?php

function load2DSceneEditorScripts() {
	wp_enqueue_script('wpunity_scripts');
	/*wp_enqueue_script( 'tinymce_js', includes_url( 'js/tinymce/' ) . 'wp-tinymce.php', array( 'jquery' ), false, true );*/
}
add_action('wp_enqueue_scripts', 'load2DSceneEditorScripts' );



if ( get_option('permalink_structure') ) { $perma_structure = true; } else {$perma_structure = false;}
if( $perma_structure){$parameter_Scenepass = '?wpunity_scene=';} else{$parameter_Scenepass = '&wpunity_scene=';}
if( $perma_structure){$parameter_pass = '?wpunity_game=';} else{$parameter_pass = '&wpunity_game=';}

$scene_id = intval( $_GET['wpunity_scene'] );
$scene_id = sanitize_text_field( $scene_id );

$scene_type = sanitize_text_field( $_GET['scene_type'] );

$project_id = intval( $_GET['wpunity_game'] );
$project_id = sanitize_text_field( $project_id );

$game_post = get_post($project_id);
$game_type_obj = wpunity_return_game_type($project_id);

$scene_post = get_post($scene_id);
$sceneSlug = $scene_post->post_title;

$editgamePage = wpunity_getEditpage('game');
$allGamesPage = wpunity_getEditpage('allgames');

if(isset($_POST['submitted']) && isset($_POST['post_nonce_field']) && wp_verify_nonce($_POST['post_nonce_field'], 'post_nonce')) {

	if($scene_type == 'credits'){
		$post_content = esc_attr(strip_tags($_POST['scene-description']));
		$post_image =  $_FILES['scene-featured-image'];

		$scene_information = array(
			'ID' => $scene_id,
			'post_content' => $post_content,
		);

		$post_id = wp_update_post( $scene_information, true );

		if (is_wp_error($post_id)) {
			$errors = $post_id->get_error_messages();
			foreach ($errors as $error) {
				echo $error;
			}
		}

		$attachment_id = wpunity_upload_img( $post_image, $scene_id);
		set_post_thumbnail( $scene_id, $attachment_id );

		if($post_id){
			wp_redirect(esc_url( get_permalink($editgamePage[0]->ID) . $parameter_pass . $project_id ));
			exit;
		}

	}elseif($scene_type == 'menu'){

		$post_image =  $_FILES['scene-featured-image'];

		$post_options_choice =  esc_attr(strip_tags($_POST['options']));
		$post_login_choice =  esc_attr(strip_tags($_POST['login']));
		$post_help_choice =  esc_attr(strip_tags($_POST['help']));

		if($post_options_choice){update_post_meta($scene_id, 'wpunity_menu_has_options', 1);}else{update_post_meta($scene_id, 'wpunity_menu_has_options', 0);}
		if($post_login_choice){update_post_meta($scene_id, 'wpunity_menu_has_login', 1);}else{update_post_meta($scene_id, 'wpunity_menu_has_login', 0);}
		if($post_help_choice){update_post_meta($scene_id, 'wpunity_menu_has_help', 1);}else{update_post_meta($scene_id, 'wpunity_menu_has_help', 0);}

		if($post_help_choice){
			$help_desc = esc_attr(strip_tags($_POST['help-description']));
			update_post_meta($scene_id, 'wpunity_scene_help_text', $help_desc);
			$help_image =  $_FILES['help-image'];
			if($help_image['size']!=0){
				$attachment_help_id = wpunity_upload_img( $help_image, $scene_id);
				update_post_meta($scene_id, 'wpunity_scene_helpimg', $attachment_help_id);
			}
		}

		$attachment_id = wpunity_upload_img( $post_image, $scene_id);
		set_post_thumbnail( $scene_id, $attachment_id );

		wp_redirect(esc_url( get_permalink($editgamePage[0]->ID) . $parameter_pass . $project_id ));
		exit;
	}

}

wp_enqueue_media($scene_post->ID);
require_once(ABSPATH . "wp-admin" . '/includes/media.php');

$scene_title = 'Exam';
$image_size_label = $scene_type === 'credits' ? '512x256' : '350x200' ;

get_header(); ?>


    <div class="PageHeaderStyle">
        <h1 class="mdc-typography--display1 mdc-theme--text-primary-on-light">
            <a title="Back" href="<?php echo esc_url( get_permalink($editgamePage[0]->ID) . $parameter_pass . $project_id ); ?>"> <i class="material-icons" style="font-size: 36px; vertical-align: top;" >arrow_back</i> </a>
			<?php echo $game_post->post_title; ?>
        </h1>

    </div>

    <span class="mdc-typography--caption">
        <i class="material-icons mdc-theme--text-icon-on-background AlignIconToBottom" title="Add category title & icon"><?php echo $game_type_obj->icon; ?> </i>&nbsp;<?php echo $game_type_obj->string; ?></span>

    <hr class="mdc-list-divider">

    <ul class="EditPageBreadcrumb">
        <li><a class="mdc-typography--caption mdc-theme--primary" href="<?php echo esc_url( get_permalink($allGamesPage[0]->ID)); ?>" title="Go back to Project selection">Home</a></li>
        <li><i class="material-icons EditPageBreadcrumbArr mdc-theme--text-hint-on-background">arrow_drop_up</i></li>
        <li><a class="mdc-typography--caption mdc-theme--primary" href="<?php echo esc_url( get_permalink($editgamePage[0]->ID) . $parameter_pass . $project_id ); ?>" title="Go back to Project editor">Project Editor</a></li>
        <li><i class="material-icons EditPageBreadcrumbArr mdc-theme--text-hint-on-background">arrow_drop_up</i></li>
        <li class="mdc-typography--caption"><span class="EditPageBreadcrumbSelected"><?php echo $scene_title; ?> Editor</span></li>

    </ul>

    <h2 class="mdc-typography--headline mdc-theme--text-primary-on-light"><?php echo $sceneSlug; ?></h2>

    <form name="edit_scene_form" action="" id="edit_scene_form" method="POST" enctype="multipart/form-data">
        <div class="mdc-layout-grid">

            <div class="mdc-layout-grid__inner">

                <div class="mdc-layout-grid__cell--span-12">

                </div>



                <div class="mdc-layout-grid__cell--span-12">

                    <hr class="WhiteSpaceSeparator">

					<?php wp_nonce_field('post_nonce', 'post_nonce_field'); ?>
                    <input type="hidden" name="submitted" id="submitted" value="true" />

                    <button style="margin-bottom: 24px; width: 100%; height: 48px;" class="mdc-button mdc-elevation--z2 mdc-button--raised" data-mdc-auto-init="MDCRipple" type="submit">
                        Submit changes
                    </button>
                </div>
            </div>
        </div>
    </form>
    <script type="text/javascript">

        var mdc = window.mdc;
        mdc.autoInit();

        (function() {



        })();

    </script>

<?php get_footer(); ?>