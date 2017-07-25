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

    register_rest_route( $namespace, '/', array( // schema
      'methods'         => WP_REST_Server::READABLE,
      'callback'        => array( $this, 'get_angularize_schema' ),
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

}