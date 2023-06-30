<?php

class Urlslab_Screenshot extends Urlslab_Gutenberg_Block {
	
	public $slug = 'screenshot'; 

	public function render( $attributes ) {
		$shortcode_atts = array(
			'url' => $attributes['url'],
			'screenshot-type' => $attributes['screenshotType'],
			'alt' => $attributes['alt'],
			'width' => $attributes['width'],
			'height' => $attributes['height'],
			'default-image' => $attributes['defaultImage'],
		);

		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?= do_shortcode( "[urlslab-screenshot $shortcode_params ]" ) ?>
			</div>
		<?php
		return ob_get_clean();
	}
}
