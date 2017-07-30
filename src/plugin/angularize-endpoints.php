<?php


if ( ! defined( 'ABSPATH' ) ) exit;
 
class AngularizeEndpoints extends WP_REST_Controller {
 
 public function __construct ( $file = '', $version = '1.0.0' ) {
   add_action( 'rest_api_init',[$this, 'register_routes'] );
 }
  /**
   * Register the routes for the objects of the controller.
   */
  public function register_routes() {
    $version = '1';
    $namespace = 'angularize/v' . $version;
    $base = 'route';
    $files = 'files';

    // Angularize Schema
    register_rest_route( $namespace, '/', array( 
      'methods'         => WP_REST_Server::READABLE,
      'callback'        => array( $this, 'get_angularize_schema' ),
    ));

    // /files endpoints
    register_rest_route( $namespace, '/files', array( // /wp-json/angularize/v1/files/cities
      array(
        'methods'         => WP_REST_Server::READABLE,
        'callback'        => array( $this, 'get_files' ),
      )      
    ));

    register_rest_route( $namespace, '/files/(?P<filename>[\\w.-]+)', array(      
      'methods'         => WP_REST_Server::READABLE,
      'callback'        => array( $this, 'get_file' ),
    ));

    // /auth endpoints
    register_rest_route( $namespace, '/auth/login', array(      
      'methods'         => WP_REST_Server::CREATABLE,
      'callback'        => array( $this, 'auth_login' ),
    ));
    register_rest_route( $namespace, '/auth/logout', array(      
      'methods'         => WP_REST_Server::READABLE,
      'callback'        => array( $this, 'auth_logout' ),
    ));
    register_rest_route( $namespace, '/auth/forgot_password', array(      
      'methods'         => WP_REST_Server::CREATABLE,
      'callback'        => array( $this, 'auth_forgot_password' ),
    ));
  }

  public function get_files() {
    $dir = plugin_dir_path(__FILE__) . 'files/';
    // Open a directory, and read its contents
    $data = array();
    if (is_dir($dir)){
      if ($dh = opendir($dir)){
        while (($file = readdir($dh)) !== false){
          if ($file != "." && $file != "..") {
            array_push($data,$file);
          }          
        }
        closedir($dh);
      }
    }
    return new WP_REST_Response($data, 200);
  }

  public function get_file($request) {
    $filename = $request['filename'];
    $file = plugin_dir_path(__FILE__) . '/files/' . $filename;
    if(!is_file($file)) {
      return new WP_Error( 'file not found',  $filename . ' was not found in the files directory', array( 'status' => 404 ) );
    }
    $data = file_get_contents($file);
    $data = json_decode($data, true);
    return new WP_REST_Response($data, 200);
  }

  public function get_angularize_schema() {
    $schema_file = plugin_dir_url(__FILE__) . '/files/schema.json';
    $data = file_get_contents($schema_file);
    $data = json_decode($data, true);
    return new WP_REST_Response($data, 200);
  }

  public function auth_login($request) {
    $user = wp_authenticate($request['username'], $request['password']);
    if( is_wp_error($user) ) {
      return new WP_Error('Authentication Error', $user, array('status' => 403) );
    }
    return new WP_REST_Response($user, 200);
  }

  public function auth_logout($request) {
    wp_logout();
    return new WP_REST_Response('', 200);
  }

  public function auth_forgot_password($request) {
    // for now, we'll just return the lost_password_url and the client would redirect user
    $url =  wp_lostpassword_url( get_permalink() ); // redirects to current page afterwards
    return new WP_REST_Response($url, 200);
  }

}