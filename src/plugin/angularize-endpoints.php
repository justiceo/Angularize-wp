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

    register_rest_route( $namespace, '/' . $files . '/cities', array( // /wp-json/angularize/v1/files/cities
      array(
        'methods'         => WP_REST_Server::READABLE,
        'callback'        => array( $this, 'get_cities_json' ),
      )      
      ));

    register_rest_route( $namespace, '/schema', array(
      'methods'         => WP_REST_Server::READABLE,
      'callback'        => array( $this, 'get_angularize_schema' ),
    ));
  }

  public function get_cities_json() {
    $cities_file = plugin_dir_url(__FILE__) . '/files/cities.json';
    /*if(!is_file($cities_file)){
      return new WP_Error( 'file not found', 'cities.json was not found in plugin root directory', array( 'status' => 404 ) );
    } */   
    $data = file_get_contents($cities_file);
    $data = json_decode($data, true);
    return new WP_REST_Response($data, 200);
  }  
}