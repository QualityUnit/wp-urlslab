<?php

class Urlslab_Blocks_AI_Content extends Urlslab_Gutenberg_Block {

	public $slug = 'ai-content';

	public function render( $attributes ) {
		$shortcode_atts = array(
			'id'    => $attributes['shortcodeId'],
			'input' => isset( $attributes['input'] ) ? $attributes['input'] : '',
		);

		$shortcode_params = Urlslab_Blocks::shortcode_params( $shortcode_atts );

		ob_start();
		?>
		<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ); ?>">
			<?php echo do_shortcode( "[urlslab-generator $shortcode_params]" ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
