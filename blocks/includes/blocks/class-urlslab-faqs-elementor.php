<?php
use Elementor\Controls_Manager;
use Elementor\Widget_Base;

class Urlslab_FAQs_Elementor extends Widget_Base {
	
	private $slug = 'faqs'; 

	public function get_name() {
		return $this->slug;
	}

	public function get_title() {
		return __( 'FAQs', 'urlslab' );
	}

	public function get_icon() {
		return 'eicon-comments';
	}

	public function get_categories() {
		return array( 'urlslab-blocks' );
	}

	public function get_keywords() {
		return array( 'faq', 'urlslab' );
	}

	public function render() {
		ob_start();
		?> 
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>-elementor">
				<?php echo do_shortcode( '[urlslab-faq]' ); ?>
			</div>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}
}
