<?php
use Elementor\Controls_Manager;
use Elementor\Widget_Base;

class Urlslab_Related_Articles_Elementor extends Widget_Base {
	
	private $slug = 'related-articles'; 

	public function get_name() {
		return $this->slug;
	}

	public function get_title() {
		return __( 'Related Articles', 'urlslab' );
	}

	public function get_icon() {
		return 'eicon-post-list';
	}

	public function get_categories() {
		return array( 'urlslab-blocks' );
	}

	public function get_keywords() {
		return array( 'related', 'articles', 'resources', 'urlslab' );
	}


	protected function register_controls() {
		global $post;
		$general_default_image_url = get_option( 'urlslab-relres-def-img' );

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
				'label' => __( 'Show articles related to url', 'urlslab' ),
				'placeholder' => get_permalink( $post ),
				'description' => __( 'Leave empty to use current page url, or type any other internal or external url.', 'urlslab' ),
				'default' => '',
				'ai' => array( 'active' => false ),
			)
		);
		
		$this->add_control(
			'relatedCount',
			array(
				'type' => Controls_Manager::NUMBER,
				'label' => __( 'Articles count', 'urlslab' ),
				'description' => __( 'Number of displayed related articles.', 'urlslab' ),
				'default' => 6,
				'min' => 0,
			)
		);

		$this->add_control(
			'showSummary',
			array(
				'type' => Controls_Manager::SWITCHER,
				'label' => __( 'Show summary', 'urlslab' ),
				'label_on' => __( 'Show', 'urlslab' ),
				'label_off' => __( 'Hide', 'urlslab' ),
				'return_value' => '1',
				'default' => '1',
			)
		);

		$this->add_control(
			'showImage',
			array(
				'type' => Controls_Manager::SWITCHER,
				'label' => __( 'Show image', 'urlslab' ),
				'label_on' => __( 'Show', 'urlslab' ),
				'label_off' => __( 'Hide', 'urlslab' ),
				'return_value' => '1',
				'default' => '1',
			)
		);

		$this->add_control(
			'imageSize',
			array(
				'type' => Controls_Manager::SELECT,
				'label' => esc_html__( 'Image size', 'urlslab' ),
				'options' => array(
					'carousel-thumbnail'    => esc_html__( 'Carousel thumbnail', 'urlslab' ),
					'full-page-thumbnail'   => esc_html__( 'Full page thumbnail', 'urlslab' ),
					'carousel'              => esc_html__( 'Carousel', 'urlslab' ),
					'full-page'             => esc_html__( 'Full page', 'urlslab' ),
				),
				'default' => 'carousel-thumbnail',
			)
		);

		$this->add_control(
			'defaultImage',
			array(
				'type' => Controls_Manager::MEDIA,
				'label' => __( 'Default image', 'urlslab' ),
				'description' => '' === $general_default_image_url ? '' : __( 'If no image selected, used will be default image from URLsLab Related Articles settings.', 'urlslab' ),
				'default' => array(
					'url' => '' === $general_default_image_url ? '' : $general_default_image_url,
				),
				'ai' => array( 'active' => false ),
			)
		);

		$this->end_controls_section();

	}

	
	public function render() {
		global $post;
		$settings = $this->get_settings_for_display();
		$general_default_image_url = get_option( 'urlslab-relres-def-img' );

		$this->add_render_attribute( 'shortcode', 'url', $settings['url'] ? $settings['url'] : get_permalink( $post ) );
		$this->add_render_attribute( 'shortcode', 'related-count', $settings['relatedCount'] );
		$this->add_render_attribute( 'shortcode', 'show-summary', $settings['showSummary'] );
		$this->add_render_attribute( 'shortcode', 'show-image', $settings['showImage'] );
		$this->add_render_attribute( 'shortcode', 'image-size', $settings['imageSize'] );
		$this->add_render_attribute( 'shortcode', 'default-image', $settings['defaultImage']['url'] ? $settings['defaultImage']['url'] : $general_default_image_url );
		
		ob_start();
		?> 
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>-elementor">
				<?php echo do_shortcode( '[urlslab-related-resources ' . $this->get_render_attribute_string( 'shortcode' ) . ']' ); ?>
			</div>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}


}
