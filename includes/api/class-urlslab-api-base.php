<?php

abstract class Urlslab_Api_Base extends WP_REST_Controller {
	public const NAMESPACE = 'urlslab/v1';

	public const CAPABILITY_ADMINISTRATION = 'urlslab_administration';
	public const CAPABILITY_READ = 'urlslab_read';
	public const CAPABILITY_WRITE = 'urlslab_write';
	public const CAPABILITY_DELETE = 'urlslab_delete';
	public const CAPABILITY_TRANSLATE = 'urlslab_translate';
	public const CAPABILITY_AUGMENT = 'urlslab_augment';

	public const URLSLAB_ROLE_ADMIN = 'urlslab_admin';
	public const URLSLAB_ROLE_EDITOR = 'urlslab_editor';

	public function register_public_routes() {}

	public function get_items_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_READ ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_WRITE ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function create_item_permissions_check( $request ) {
		return $this->update_item_permissions_check( $request );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'activate_plugins' ) || current_user_can( self::CAPABILITY_DELETE ) || current_user_can( self::CAPABILITY_ADMINISTRATION );
	}

	public function admin_permission_check( $request ) {
		return current_user_can( self::CAPABILITY_ADMINISTRATION ) || current_user_can( 'administrator' );
	}

	protected function get_headers_no_cache(): array {
		return array(
			'Expires'       => 'Wed, 15 Oct 1976 05:00:00 GMT',
			'Last-Modified' => gmdate( 'D, d M Y H:i:s' ) . ' GMT',
			'Cache-Control' => 'no-cache, must-revalidate, max-age=0',
			'Content-Type'  => 'application/json',
		);
	}
}
