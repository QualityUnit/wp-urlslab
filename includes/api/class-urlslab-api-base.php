<?php

abstract class Urlslab_Api_Base extends WP_REST_Controller {
	public const NAMESPACE = 'urlslab/v1';

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	public function create_item_permissions_check( $request ) {
		return $this->update_item_permissions_check( $request );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}
}
