<?php
use Elementor\Controls_Manager;
use Elementor\Widget_Base;

class Urlslab_Blocks_Faqs_Elementor extends Widget_Base {
	
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

	protected function register_controls() {
		
		$this->start_controls_section(
			'content_section',
			array(
				'label' => $this->get_title(),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'url',
			array(
				'type'        => Controls_Manager::TEXT,
				'label'       => __( 'Page url', 'urlslab' ),
				'placeholder' => __( 'Insert website url', 'urlslab' ),
				'description' => __( 'Link to the page for which a FAQs should be generated.', 'urlslab' ),
				'ai'          => array( 'active' => false ),
			)
		);

		$this->add_control(
			'count',
			array(
				'type'        => Controls_Manager::NUMBER,
				'label'       => __( 'Number of FAQs', 'urlslab' ),
				'description' => __( 'Define how many questions should show.', 'urlslab' ),
				'default'     => 10,
				'ai'          => array( 'active' => false ),
			)
		);

		$this->end_controls_section();
	}

	public function render() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'shortcode', 'url', $settings['url'] );
		$this->add_render_attribute( 'shortcode', 'count', $settings['count'] );
		ob_start();
		?> 
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>-elementor">
				<?php echo do_shortcode( '[urlslab-faq ' . $this->get_render_attribute_string( 'shortcode' ) . ']' ); ?>
			</div>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}
}
