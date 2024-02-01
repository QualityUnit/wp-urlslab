<?php

class Urlslab_FAQs extends Urlslab_Gutenberg_Block {
	
	public $slug = 'faqs'; 

	public function render( $attributes ) {
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>">
				<?= do_shortcode( '[urlslab-faq]' ) ?>
			</div>
		<?php
		return ob_get_clean();
	}
}
