<?php

class Urlslab_Gutenberg_Block {
	
	public $slug = null; 


	function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		$this->register();
	}


	function register() {

		if ( ! $this->slug ) {
			return;
		}
		
		// Skip block registration if Gutenberg is not enabled/merged.
		if ( ! function_exists( 'register_block_type_from_metadata' ) ) {
			return;
		}

		Urlslab_Blocks::register( "urlslab-{$this->slug}-block-style", "/build/{$this->slug}-style.css" );
		Urlslab_Blocks::register( "urlslab-{$this->slug}-editor", "/build/{$this->slug}-editor.css" );
		
		register_block_type_from_metadata(
			Urlslab_Blocks::$root_dir . "/build/blocks/{$this->slug}",
			array(
				'render_callback' => method_exists( $this, 'render' ) ? array( $this, 'render' ) : array(),
			) 
		);
	}


	function enqueue_block_editor_assets() {
		$deps = array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-editor',
			'wp-api-fetch',
			'wp-components',
		);
		
		Urlslab_Blocks::enqueue( "urlslab-{$this->slug}-block", "/build/{$this->slug}.js", $deps );
		Urlslab_Blocks::enqueue( 'urlslab-components-editor', '/build/components.css' );

		if ( method_exists( $this, 'frontend_vars' ) ) {
			Urlslab_Blocks::localize( "urlslab-{$this->slug}-block", '_urlslab_' . str_replace( '-', '_', $this->slug ) . '_block_vars', $this->frontend_vars() );
		}
	}

	
}
