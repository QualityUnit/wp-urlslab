<?php

use Elementor\Controls_Manager;
use Elementor\Widget_Base;

class Urlslab_Blocks_YouTubeData_Elementor extends Widget_Base {

	private $slug = 'youtubedata';

	public function get_name() {
		return $this->slug;
	}

	public function get_title() {
		return __( 'YouTube Data by URLslab', 'urlslab' );
	}

	public function get_icon() {
		return 'eicon-youtube';
	}

	public function get_categories() {
		return array( 'urlslab-blocks' );
	}

	public function get_keywords() {
		return array( 'youtube data', 'youtube description', 'duration', 'captions', 'urlslab' );
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
			'videoid',
			array(
				'type'        => Controls_Manager::TEXT,
				'label'       => __( 'YouTube video ID', 'urlslab' ),
				'description' => __( 'YouTube video ID from which data should be taken.', 'urlslab' ),
				'ai'          => array( 'active' => false ),
			)
		);

		$this->add_control(
			'thumbnail_url',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show thumbnail', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'title',
			array(
				'type'    => Controls_Manager::SWITCHER,
				'label'   => __( 'Show title', 'urlslab' ),
				'default' => 'yes',
				'ai'      => array( 'active' => false ),
			)
		);

		$this->add_control(
			'description',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show description', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'description_length',
			array(
				'type'    => Controls_Manager::NUMBER,
				'label'   => __( 'Description length (words)', 'urlslab' ),
				'default' => 50,
				'ai'      => array( 'active' => false ),
			)
		);

		$this->add_control(
			'channel_title',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show channel title', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'published_at',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show published date', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'duration',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show duration', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'captions',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show captions', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);

		$this->add_control(
			'captions_text',
			array(
				'type'  => Controls_Manager::SWITCHER,
				'label' => __( 'Show captions without timestamps', 'urlslab' ),
				'ai'    => array( 'active' => false ),
			)
		);


		$this->end_controls_section();
	}

	public function duration_to_time( $youtube_time ) {
		if ( is_numeric( $youtube_time ) ) {
			$youtube_time = 'PT' . $youtube_time . 'S';
		}
		if ( $youtube_time ) {
			$start = new DateTime( '@0' ); // Unix epoch
			$start->add( new DateInterval( $youtube_time ) );
			$youtube_time = ltrim( ltrim( $start->format( 'H:i:s' ), '0' ), ':' );
		}

		return $youtube_time;
	}

	public function set_attribute( $videoid, $attr, $desc_length ) {
		$obj_video = Urlslab_Data_Youtube::get_video_obj( $videoid );

		switch ( $attr ) {
			case 'thumbnail_url':
				$url = $obj_video->get_thumbnail_url();
				echo "<meta itemprop='thumbnailUrl' content='" . esc_attr( $url ) . "' />
							<div class='urlslab-block-" . esc_attr( $this->slug ) . "-thumb'>
							<img src='" . esc_url( $url ) . "' alt='" . esc_attr( $obj_video->get_title() ) . "' />
							</div>";
				break;
			case 'title':
				echo "<h3 itemprop='name' class='urlslab-block-" . esc_attr( $this->slug ) . "-title'>" . esc_html( $obj_video->get_title() ) . "</h3>"; // @codingStandardsIgnoreLine
				break;
			case 'description':
				echo "<p itemprop='description' class='urlslab-block-" . esc_attr( $this->slug ) . "-description'>" . esc_html( wp_trim_words( $obj_video->get_description(), ( int ) $desc_length ) ) . "</p>"; // @codingStandardsIgnoreLine
				break;
			case 'channel_title':
				echo "<p itemprop='author' class='urlslab-block-" . esc_attr( $this->slug ) . "-channel'>" . esc_html( $obj_video->get_channel_title() ) . "</p>"; // @codingStandardsIgnoreLine
				break;
			case 'published_at':
				$published = $obj_video->get_published_at_in_iso8601();
				echo "<meta itemprop='uploadDate' content='" . esc_attr( $published ) . "' />
				<p class='urlslab-block-" . esc_attr( $this->slug ) . "-uploadDate'>
				<strong>" . esc_html( __( 'Published:', 'urlslab' ) ) . "</strong>
				<time datetime='" . esc_attr( $published ) . "'>" . esc_html( wp_date( $published ) ) . '</time>';
				break;
			case 'duration':
				$duration = $obj_video->get_duration_in_iso8601();
				echo "<meta itemprop='duration' content='" . esc_attr( $duration ) . "' />
							<p class='urlslab-block-" . esc_attr( $this->slug ) . "-duration'>
							<strong>" . esc_html( __( 'Duration:', 'urlslab' ) ) . "</strong>
							<time datetime='" . esc_attr( $duration ) . "'>" . esc_html( $this->duration_to_time( $duration ) ) . '</time>
							</p>
							';
				break;
			case ( 'captions' ):
			case ( 'captions_text' ):
				$captions = nl2br( $obj_video->get_captions() );
				echo "<div itemprop='transcript' class='urlslab-block-" . esc_attr( $this->slug ) . "-captions'>" . $captions . "</div>"; // @codingStandardsIgnoreLine
				break;
			default:
				break;
		}
	}

	public function render() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute(
			'schema',
			array(
				'itemscope' => '',
				'itemprop'  => 'VideoObject',
				'itemtype'  => 'https://schema.org/VideoObject',
			)
		);

		ob_start();
		?>
		<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ); ?> urlslab-block-<?= esc_attr( $this->slug ); ?>-elementor" <?= esc_attr( $this->get_render_attribute_string( 'schema' ) ); ?>>
			<?php
			foreach ( array_keys( $settings ) as $attribute ) {
				if ( 'yes' === $settings[ $attribute ] ) {
					$this->set_attribute( $settings['videoid'], $attribute, $settings['description_length'] );
				}
			}
			?>
		</div>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}
}
