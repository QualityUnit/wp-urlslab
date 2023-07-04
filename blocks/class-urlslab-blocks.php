<?php

class Urlslab_Blocks {

	public static $plugin_dir;
	public static $root_dir;
	public static $is_elementor;
	private static $blocks;


	static function run() {
		
		self::$plugin_dir = URLSLAB_PLUGIN_DIR;
		self::$root_dir = URLSLAB_PLUGIN_DIR . 'blocks';
		self::$is_elementor = class_exists( 'Elementor\Plugin' );

		self::$blocks = array( 
			'related-articles',
			'screenshot',
		);

		add_action( 'init', array( __CLASS__, 'init' ) );
	}
	

	static function init() {
		self::load_dependencies();
		self::init_gutenberg_blocks();

		if ( self::$is_elementor ) {
			self::init_elementor_blocks();
		}
	}


	static function init_gutenberg_blocks() {
		add_filter( 'block_categories_all', array( __CLASS__, 'block_categories' ), 10, 2 );
		new Urlslab_Related_Articles;
		new Urlslab_Screenshot;
	}


	static function init_elementor_blocks() {
		add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'block_categories_elementor' ), 10, 1 );
		add_action(
			'elementor/widgets/widgets_registered',
			function ( $manager ) {
				$manager->register_widget_type( new Urlslab_Related_Articles_Elementor() );
				$manager->register_widget_type( new Urlslab_Screenshot_Elementor() );
			}
		);
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


	static function block_categories_elementor( $elements_manager ) {
		$elements_manager->add_category(
			'urlslab-blocks',
			array(
				'title' => __( 'URLsLab', 'urlslab' ),
			),
			0
		);
	}


	static function load_dependencies() {
		require_once self::$root_dir . '/includes/class-urlslab-gutenberg-block.php';
		
		foreach ( self::$blocks as $slug ) {
			if ( file_exists( self::$root_dir . "/includes/blocks/class-urlslab-{$slug}.php" ) ) {
				require_once self::$root_dir . "/includes/blocks/class-urlslab-{$slug}.php";
			}
			
			if ( self::$is_elementor && file_exists( self::$root_dir . "/includes/blocks/class-urlslab-{$slug}-elementor.php" ) ) {
				require_once self::$root_dir . "/includes/blocks/class-urlslab-{$slug}-elementor.php";
			}
		}
	}



	/*
	*	Helper functions
	*/

	static function shortcode_params( $params ) {
		$shortcode_params = '';
		foreach ( $params as $param => $value ) {
			$shortcode_params .= " {$param}=\"{$value}\"";
		}
		return $shortcode_params;
	}

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
