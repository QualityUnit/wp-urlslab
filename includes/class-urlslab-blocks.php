<?php

class Urlslab_Blocks {

	public static $plugin_dir;
	public static $root_dir;
	public static $is_elementor;
	private static $blocks;


	public static function run() {
		
		self::$plugin_dir   = URLSLAB_PLUGIN_DIR;
		self::$root_dir     = URLSLAB_PLUGIN_DIR . 'blocks';
		self::$is_elementor = class_exists( 'Elementor\Plugin' );

		self::$blocks = array( 
			'related-articles',
			'screenshot',
			'tableofcontents',
			'youtubedata',
			'ai-content',
			'faqs',
		);

		add_action( 'init', array( __CLASS__, 'init' ) );
	}
	

	public static function init() {
		self::load_dependencies();
		self::init_gutenberg_blocks();

		if ( self::$is_elementor ) {
			self::init_elementor_blocks();
		}
	}


	public static function init_gutenberg_blocks() {
		add_filter( 'block_categories_all', array( __CLASS__, 'block_categories' ), 10, 2 );
			new Urlslab_Blocks_Related_Articles();
			new Urlslab_Blocks_Screenshot();
			new Urlslab_Blocks_TableOfContents();
			new Urlslab_Blocks_YouTubeData();
			new Urlslab_Blocks_AI_Content();
			new Urlslab_Blocks_Faqs();
	}


	public static function init_elementor_blocks() {
		add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'block_categories_elementor' ), 10, 1 );
		add_action(
			'elementor/widgets/widgets_registered',
			function ( $manager ) {
				if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Related_Resources::SLUG ) ) {
					$manager->register_widget_type( new Urlslab_Blocks_Related_Articles_Elementor() );
				}
				if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Urls::SLUG ) ) {
					$manager->register_widget_type( new Urlslab_Blocks_Screenshot_Elementor() );
				}
				if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Lazy_Loading::SLUG ) ) {
					$manager->register_widget_type( new Urlslab_Blocks_YouTubeData_Elementor() );
				}
				if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Faq::SLUG ) ) {
					$manager->register_widget_type( new Urlslab_Blocks_Faqs_Elementor() );
				}
			}
		);
	}

	public static function block_categories( $categories, $post ) {
		$new_categories = array(
			array(
				'slug'  => 'urlslab-blocks',
				'title' => __( 'URLsLab Blocks', 'wp-urlslab' ),
			),
		);
		return array_merge( array_values( $new_categories ), $categories );
	}


	public static function block_categories_elementor( $elements_manager ) {
		$elements_manager->add_category(
			'urlslab-blocks',
			array(
				'title' => __( 'URLsLab', 'wp-urlslab' ),
			),
			0
		);
	}


	public static function load_dependencies() {
		require_once self::$root_dir . '/includes/class-urlslab-gutenberg-block.php';
		
		foreach ( self::$blocks as $slug ) {
			if ( file_exists( self::$root_dir . "/includes/blocks/class-urlslab-blocks-{$slug}.php" ) ) {
				require_once self::$root_dir . "/includes/blocks/class-urlslab-blocks-{$slug}.php";
			}
			
			if ( self::$is_elementor && file_exists( self::$root_dir . "/includes/blocks/class-urlslab-blocks-{$slug}-elementor.php" ) ) {
				require_once self::$root_dir . "/includes/blocks/class-urlslab-blocks-{$slug}-elementor.php";
			}
		}
	}



	/*
	*   Helper functions
	*/

	public static function shortcode_params( $params ) {
		$shortcode_params = '';
		foreach ( $params as $param => $value ) {
			$shortcode_params .= " {$param}=\"{$value}\"";
		}
		return $shortcode_params;
	}

	public static function register( $handle, $relative_url, $deps = array() ) {
		if ( file_exists( self::path( $relative_url ) ) ) {
			if ( substr( $relative_url, -3 ) === '.js' ) {
				wp_register_script( $handle, self::url( $relative_url ), $deps, URLSLAB_VERSION, true );
			} elseif ( substr( $relative_url, -4 ) === '.css' ) {
				wp_register_style( $handle, self::url( $relative_url ), $deps, URLSLAB_VERSION );
			}
		}
	}


	public static function enqueue( $handle, $relative_url = '', $deps = array() ) {
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


	public static function path( $relative_path = '' ) {
		$p = trim( $relative_path, '\\/' );
		return self::$root_dir . ( $p ? "/$p" : '' );
	}


	public static function url( $relative_url = '' ) {
		return plugins_url( trim( '\\/blocks\\/' . $relative_url, '\\/' ), self::$root_dir );
	}


	public static function localize( $handle, $object_name, $data ) {
		wp_localize_script( $handle, $object_name, $data );
	}
}
