<?php

class Urlslab_Blocks_Related_Articles extends Urlslab_Gutenberg_Block {

	public $slug = 'related-articles';

	public function render( $attributes ) {
		global $post;
		$shortcode_atts   = array(
			'url'           => $attributes['url'] ? $attributes['url'] : get_permalink( $post ),
			'related-count' => $attributes['relatedCount'],
			'image-size'    => $attributes['imageSize'],
			'show-image'    => $attributes['showImage'],
			'show-summary'  => $attributes['showSummary'],
			'default-image' => $attributes['defaultImage'] ? $attributes['defaultImage'] : get_option( 'urlslab-relres-def-img' ),
		);
		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );

		return '<div class="urlslab-block urlslab-block-' . esc_attr( $this->slug ) . '">' . do_shortcode( "[urlslab-related-resources $shortcode_params ]" ) . '</div>';
	}


	public function frontend_vars() {
		return array( 'generalDefaultImage' => get_option( 'urlslab-relres-def-img' ) );
	}
}
