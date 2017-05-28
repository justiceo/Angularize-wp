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
register_activation_hook( __FILE__, 'rest_api_plugin_activate' );
function rest_api_plugin_activate(){
    // Require parent plugin
    if ( ! is_plugin_active( 'rest-api/plugin.php' ) and current_user_can( 'activate_plugins' ) ) {
        // Stop activation redirect and show error
        wp_die('Sorry, but this plugin requires the WP REST API to be installed and active. <br><a href="' . admin_url( 'plugins.php' ) . '">&laquo; Return to Plugins</a>');
    }
}

// Add ng-app directive to html tag
add_filter('language_attributes', 'add_ng_attribute');
function add_ng_attribute($attr) {
    return $attr . ' ng-app="angularize"';
}

// (Optional) Add the router holder for webpack
add_action('wp_head', 'add_meta_tags');
function add_meta_tags() {
    echo '<base href="/">';
}

// Enque scripts and styles with localization
add_action('wp_enqueue_scripts', 'enque_scripts'); 
function enque_scripts() {
    wp_register_script('ng-script', plugin_dir_url(__FILE__) . '/app.bundle.js', array(), '1.0.0', true);
    $translation_array = array(
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'currentUser' => wp_get_current_user(),
        'serverTime' => current_time( 'timestamp', $gmt = 1),
        'postObject' => get_post()
    );
    $translation_array = apply_filters( 'wp_rest_object', $translation_array );
    wp_localize_script('ng-script', 'wp_rest_object', $translation_array);
    wp_enqueue_script('ng-script');
}

add_action('wp_footer', 'add_app_tag');
function add_app_tag() {
    echo '<app></app>';
}