<?php

class Urlslab_Related_Articles extends Urlslab_Gutenberg_Block {
	
	public $slug = 'related-articles'; 

	public function render( $attributes ) {
		global $post;
		$shortcode_atts = array(
			'url' => $attributes['url'] ? $attributes['url'] : get_permalink( $post ),
			'related-count' => $attributes['relatedCount'],
			'image-size' => $attributes['imageSize'],
			'show-image' => $attributes['showImage'],
			'show-summary' => $attributes['showSummary'],
			'default-image' => $attributes['defaultImage'] ? $attributes['defaultImage'] : get_option( 'urlslab-relres-def-img' ),
		);

		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?php echo do_shortcode( "[urlslab-related-resources $shortcode_params ]" ); ?>
			</div>
		<?php
		return ob_get_clean();
	}
	

	public function frontend_vars() {
		$settings = array(
			'generalDefaultImage' => get_option( 'urlslab-relres-def-img' ),
		);
		return $settings;
	}
}
