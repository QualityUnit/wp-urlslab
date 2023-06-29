<?php

class Urlslab_Blocks {

	public static $root_dir;
	private static $blocks;

	static function run() {
		
		self::$root_dir = URLSLAB_PLUGIN_DIR . 'blocks';

		self::$blocks = array( 
			'related-articles',
			'screenshot',
		);

		add_action( 'init', array( __CLASS__, 'init' ) );
	}
	
	static function init() {
		self::load_dependencies();
		self::init_gutenberg_blocks();
	}

	static function init_gutenberg_blocks() {
		add_filter( 'block_categories_all', array( __CLASS__, 'block_categories' ), 10, 2 );
		new Urlslab_Gutenberg_Blocks\Urlslab_Related_Articles;
		new Urlslab_Gutenberg_Blocks\Urlslab_Screenshot;
	}


	static function register_blocks_category() {

	}


	static function block_categories( $categories, $post ) {
		$new_categories = array(
			array(
				'slug'  => 'urlslab-blocks',
				'title' => __( 'URLsLab Blocks', 'urlslab' ),
			),
		);
		return array_merge( array_values( $new_categories ), $categories );
	}


	static function load_dependencies() {
		foreach ( self::$blocks as $slug ) {
			if ( file_exists( self::$root_dir . "/includes/gutenberg/class-urlslab-{$slug}.php" ) ) {
				require_once self::$root_dir . "/includes/gutenberg/class-urlslab-{$slug}.php";
			}
			if ( file_exists( self::$root_dir . "/includes/elementor/class-urlslab-{$slug}.php" ) ) {
				require_once self::$root_dir . "/includes/elementor/class-urlslab-{$slug}.php";
			}
		}
	}



	/*
	*	Helper functions
	*/

	static function register( $handle, $relative_url, $deps = array() ) {
		if ( file_exists( self::path( $relative_url ) ) ) {
			if ( substr( $relative_url, -3 ) === '.js' ) {
				wp_register_script( $handle, self::url( $relative_url ), $deps, URLSLAB_VERSION, true );
			} elseif ( substr( $relative_url, -4 ) === '.css' ) {
				wp_register_style( $handle, self::url( $relative_url ), $deps, URLSLAB_VERSION );
			}
		}
	}

	
	static function enqueue( $handle, $relative_url = '', $deps = array() ) {
		if ( $relative_url ) {
			self::register( $handle, $relative_url, $deps );
		}
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_enqueue_script( $handle );
		}
		if ( wp_style_is( $handle, 'registered' ) ) {
			wp_enqueue_style( $handle );
		}
	}


	static function path( $relative_path = '' ) {
		$p = trim( $relative_path, '\\/' );
		return self::$root_dir . ( $p ? "/$p" : '' );
	}


	static function url( $relative_url = '' ) {
		return plugins_url( trim( '\\/blocks\\/' . $relative_url, '\\/' ), self::$root_dir );
	}


	static function localize( $handle, $object_name, $data ) {
		wp_localize_script( $handle, $object_name, $data );
	}
}
