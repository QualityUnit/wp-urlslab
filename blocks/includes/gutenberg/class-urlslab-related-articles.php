<?php
namespace Urlslab_Gutenberg_Blocks;

class Urlslab_Related_Articles {
	
	private $slug = 'related-articles'; 

	function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
		$this->register();
	}

	function register() {

		// Skip block registration if Gutenberg is not enabled/merged.
		if ( ! function_exists( 'register_block_type_from_metadata' ) ) {
			return;
		}

		\Urlslab_Blocks::register( "urlslab-{$this->slug}-block-style", "/build/{$this->slug}-style.css" );
		\Urlslab_Blocks::register( "urlslab-{$this->slug}-editor", "/build/{$this->slug}-editor.css" );
		
		register_block_type_from_metadata(
			\Urlslab_Blocks::$root_dir . "/build/blocks/{$this->slug}",
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
		
		\Urlslab_Blocks::enqueue( "urlslab-{$this->slug}-block", "/build/{$this->slug}.js", $deps );
		\Urlslab_Blocks::localize( "urlslab-{$this->slug}-block", '_urlslab_' . str_replace( '-', '_', $this->slug ) . '_block_vars', $this->block_vars() );
	}

	
	function render( $attributes ) {
		global $post;
		
		$shortcode_atts = array(
			'url' => $attributes['url'] ? $attributes['url'] : get_permalink( $post ),
			'related-count' => $attributes['relatedCount'],
			'image-size' => $attributes['imageSize'],
			'show-image' => $attributes['showImage'],
			'show-summary' => $attributes['showSummary'],
			'default-image' => $attributes['defaultImage'] ? $attributes['defaultImage'] : get_option( 'urlslab-relres-def-img' ),
		);

		$shortcode_params = '';
		foreach ( $shortcode_atts as $param => $value ) {
			$shortcode_params .= " {$param}=\"{$value}\"";
		}
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?= do_shortcode( "[urlslab-related-resources $shortcode_params ]" ) ?>
			</div>

		<?php
		return ob_get_clean();
	}
	
	function block_vars() {
		$settings = array(
			'generalDefaultImage' => get_option( 'urlslab-relres-def-img' ),
		);
		return $settings;
	}
}
