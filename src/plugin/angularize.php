<?php
/*
Plugin Name: Angularize
Plugin URI: http://github.com/justiceo/angularize
Description: Turn wordpress widgets, menus, sidebars, ads, everything into angular components
Version: 1.0.0
Author: Justice Ogbonna
Author URI: http://justiceo.com
License: GPL2


@package angularize
@author Justice Ogbonna
@since 1.0.0
*/

/*
The only real function of the script is loading minified angular files into website,
ensuring that wp-rest-api is installed and enabled, adding, angular hooks to header.php 
and providing authentication and dumping the object for the current page in the UI
*/

if ( ! defined( 'ABSPATH' ) ) exit;

// Ensure WP-REST-API is active
include_once(ABSPATH . 'wp-admin/includes/plugin.php');


require_once( 'angularize-endpoints.php' );

register_activation_hook( __FILE__, 'angularize_rest_api_plugin_activate' );
function angularize_rest_api_plugin_activate(){
    // Require parent plugin
    if ( ! is_plugin_active( 'rest-api/plugin.php' ) and current_user_can( 'activate_plugins' ) ) {
        // Stop activation redirect and show error
        wp_die('Sorry, but this plugin requires the WP REST API to be installed and active. <br><a href="' . admin_url( 'plugins.php' ) . '">&laquo; Return to Plugins</a>');
    }
}

// Add ng-app directive to html tag
add_filter('language_attributes', 'angularize_add_ng_attribute');
function angularize_add_ng_attribute($attr) {
    return $attr . ' ng-app="angularize"';
}

// Enque scripts and styles with localization
add_action('wp_enqueue_scripts', 'angularize_enque_scripts'); 
function angularize_enque_scripts() {
    wp_register_script('angularize-script', plugin_dir_url(__FILE__) . '/main.js', array('wp-api'), '1.0.0', true);
    $translation_array = array(
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'currentUser' => wp_get_current_user(),
        'serverTime' => current_time( 'timestamp', $gmt = 1),
        'WpRestApiEnabled' => is_plugin_active('rest-api/plugin.php'),
        'FrontEndEditorEnabled' => is_plugin_active('wp-front-end-editor/plugin.php'),
        'meta' => get_post_meta( get_the_ID() ),
        'is_single' => is_single(),
        'is_page' => is_page(),
        'is_home' => is_home(),
        'is_archive' => is_archive(),
        'is_logged_in' => is_user_logged_in(),
        'is_edit_page' => get_post_field( 'post_name', get_post() ) == "new-post", // todo: hardcode alert
        'postObject' => get_post()
    );
    $translation_array = apply_filters( 'angularize_server', $translation_array );
    wp_localize_script('angularize-script', 'angularize_server', $translation_array);
    wp_enqueue_script('angularize-script');

    // enqueue app css
    wp_enqueue_style('angularize-css', plugin_dir_url(__FILE__) . '/app.css');
    // Optionally enque font-awesome css [ for now not needed ]
    if(true)
    wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
}

add_action('wp_footer', 'angularize_add_toolbar_tag');
function angularize_add_toolbar_tag() {
    echo '<toolbar></toolbar>';
}

// Disables the WYSIWYG editor of tinyMce
/** It automatically removes empty elements (which strips off component tags)
 *  and can apply undesirable formatting and cleanup of newlines, br tags etc
 */
add_filter('user_can_richedit', '__return_false', 50);

function init_angularize_endpoints() {
    $instance = new AngularizeEndpoints( __FILE__, '1.0.0' );
	return $instance;
}
init_angularize_endpoints();


// todo: not specific to this plugin
function disable_authors_publish_cap() {
    // Get author role object
    $author = get_role( 'author' );
    // Remove the post publishing capability
    $author->remove_cap( 'publish_posts' );
}
add_action( 'init', 'disable_authors_publish_cap' );