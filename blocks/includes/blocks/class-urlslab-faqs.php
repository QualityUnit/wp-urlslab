<?php

class Urlslab_FAQs extends Urlslab_Gutenberg_Block {
	
	public $slug = 'faqs'; 

	public function render( $attributes ) {
		$shortcode_atts = array(
			'url'   => $attributes['url'],
			'count' => $attributes['count'],
		);

		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );

		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?= do_shortcode( "[urlslab-faq $shortcode_params]" ) ?>
			</div>
		<?php
		return ob_get_clean();
	}
}
