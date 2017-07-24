<?php
 
class AngularizeEndpoints extends WP_REST_Controller {
 
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