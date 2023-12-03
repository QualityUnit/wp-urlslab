<?php

class Urlslab_TableOfContents extends Urlslab_Gutenberg_Block {
	
	public $slug = 'table-of-contents'; 

	public function render( $attributes ) {
		$shortcode_atts = array(
			// 'headers' => $attributes['headers'],
			// 'headersTypes' => $attributes['headersTypes'],
		);

		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?= do_shortcode( "[urlslab-toc $shortcode_params ]" ) ?>
			</div>
		<?php
		return ob_get_clean();
	}
}
