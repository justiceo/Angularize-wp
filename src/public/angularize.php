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
    wp_register_script('ng-script', plugin_dir_url(__FILE__) . '/app.bundle.js', array('wp-api'), '1.0.0', true);
    $translation_array = array(
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'currentUser' => wp_get_current_user(),
        'serverTime' => current_time( 'timestamp', $gmt = 1),
        'WpRestApiEnabled' => is_plugin_active('rest-api/plugin.php'),
        'FrontEndEditorEnabled' => is_plugin_active('wp-front-end-editor/plugin.php'),
        'meta' => get_post_meta( get_the_ID() ),
        'postObject' => get_post()
    );
    $translation_array = apply_filters( 'angularize_server', $translation_array );
    wp_localize_script('ng-script', 'angularize_server', $translation_array);
    wp_enqueue_script('ng-script');
}

add_action('wp_footer', 'angularize_add_app_tag');
function angularize_add_app_tag() {
    echo '<app></app>';
}

// Disables the WYSIWYG editor of tinyMce
/** It automatically removes empty elements (which strips off component tags)
 *  and can apply undesirable formatting and cleanup of newlines, br tags etc
 */
add_filter('user_can_richedit', '__return_false', 50);