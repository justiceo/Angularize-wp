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

    register_rest_route( $namespace, '/' . $files . '/cities', array(
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
    $data = array();
    return new WP_REST_Response($data, 200);
  }  
}