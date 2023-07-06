<?php
use Elementor\Controls_Manager;
use Elementor\Widget_Base;

class Urlslab_Screenshot_Elementor extends Widget_Base {
	
	private $slug = 'screenshot'; 

	public function get_name() {
		return $this->slug;
	}

	public function get_title() {
		return __( 'Screenshot', 'urlslab' );
	}

	public function get_icon() {
		return 'eicon-image';
	}

	public function get_categories() {
		return array( 'urlslab-blocks' );
	}

	public function get_keywords() {
		return array( 'screenshot', 'urlslab' );
	}

	
	protected function register_controls() {
		
		$this->start_controls_section(
			'content_section',
			array(
				'label' => $this->get_title(),
				'tab' => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'url',
			array(
				'type' => Controls_Manager::TEXT,
				'label' => __( 'Page url', 'urlslab' ),
				'placeholder' => __( 'Insert website url', 'urlslab' ),
				'description' => __( 'Link to the page from which a screenshot should be taken.', 'urlslab' ),
				'ai' => array( 'active' => false ),
			)
		);

		$this->add_control(
			'screenshotType',
			array(
				'type' => Controls_Manager::SELECT,
				'label' => esc_html__( 'Screenshot type', 'urlslab' ),
				'options' => array(
					'carousel-thumbnail'    => esc_html__( 'Carousel thumbnail', 'urlslab' ),
					'full-page-thumbnail'   => esc_html__( 'Full page thumbnail', 'urlslab' ),
					'carousel'              => esc_html__( 'Carousel', 'urlslab' ),
					'full-page'             => esc_html__( 'Full page', 'urlslab' ),
				),
				'default' => 'carousel',
			)
		);

		$this->add_control(
			'alt',
			array(
				'type' => Controls_Manager::TEXT,
				'label' => __( 'Alt text', 'urlslab' ),
				'description' => __( 'Value of the image alt attribute.', 'urlslab' ),
				'ai' => array( 'active' => false ),
			)
		);

		$this->add_control(
			'width',
			array(
				'type' => Controls_Manager::TEXT,
				'label' => __( 'Width', 'urlslab' ),
				'description' => __( 'Insert valid value including unit. e.g. 100%', 'urlslab' ),
				'default' => '100%',
				'ai' => array( 'active' => false ),
			)
		);

		$this->add_control(
			'height',
			array(
				'type' => Controls_Manager::TEXT,
				'label' => __( 'Height', 'urlslab' ),
				'description' => __( 'Insert valid value including unit. e.g. 100%', 'urlslab' ),
				'default' => '100%',
				'ai' => array( 'active' => false ),
			)
		);

		$this->add_control(
			'defaultImage',
			array(
				'type' => Controls_Manager::MEDIA,
				'label' => __( 'Default image', 'urlslab' ),
				'description' => __( 'The URL of default image in case we don\'t have the screenshot yet.', 'urlslab' ),
				'default' => array(
					'url' => '', 
				),
				'ai' => array( 'active' => false ),
			)
		);

		$this->end_controls_section();
		
	}

	
	public function render() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'shortcode', 'url', $settings['url'] );
		$this->add_render_attribute( 'shortcode', 'alt', $settings['alt'] );
		$this->add_render_attribute( 'shortcode', 'screenshot-type', $settings['screenshotType'] );
		$this->add_render_attribute( 'shortcode', 'width', $settings['width'] );
		$this->add_render_attribute( 'shortcode', 'height', $settings['height'] );
		$this->add_render_attribute( 'shortcode', 'default-image', $settings['defaultImage']['url'] );
		
		ob_start();
		?> 
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>-elementor">
				<?php echo do_shortcode( '[urlslab-screenshot ' . $this->get_render_attribute_string( 'shortcode' ) . ']' ); ?>
			</div>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}


}
