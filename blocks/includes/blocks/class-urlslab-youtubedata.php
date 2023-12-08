<?php

class Urlslab_YouTubeData extends Urlslab_Gutenberg_Block {
	
	public $slug = 'youtubedata'; 

	function duration_to_time( $youtube_time ) {
		if ( $youtube_time ) {
			$start = new DateTime( '@0' ); // Unix epoch
			$start->add( new DateInterval( $youtube_time ) );
			$youtube_time = ltrim( ltrim( $start->format( 'H:i:s' ), '0' ), ':' );
		}

		return $youtube_time;
	}

	function set_attribute( $videoid, $attr, $desc_length ) {
		switch ( $attr ) {
			case 'thumbnail_url':
				$url = esc_url( do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" ) );
				echo "<meta itemprop='thumbnailUrl' content='$url' />
							<div class='urlslab-block-" . esc_attr( $this->slug ) . "-thumb'>
							<img src='$url' alt='" . esc_attr( do_shortcode( "[urlslab-video videoid='$videoid' attribute='title' ]" ) ) ."' />
							</div>";
				break;
			case 'title':
				echo "<h3 itemprop='name' class='urlslab-block-" . esc_attr( $this->slug ) . "-title'>" . esc_html( do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" ) ) . "</h3>";
				break;
			case 'description':
				echo "<p itemprop='description' class='urlslab-block-" . esc_attr( $this->slug ) . "-description'>" . esc_html( wp_trim_words( do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" ) ), $desc_length ) . "</p>";
				break;
			case 'duration':
				$duration = do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" );
				echo "<meta itemprop='duration' content='$duration' />
							<p class='urlslab-block-" . esc_attr( $this->slug ) . "-duration'>
							<strong>" . esc_html( __( 'Duration:', 'urlslab' ) ) . "</strong>
							<time datetime='$duration'>" . esc_html( $this->duration_to_time( $duration ) ) . "</time>
							</p>
							";
				break;
			case 'published_at':
				$published = do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" );
				echo "
				<meta itemprop='uploadDate' content='$published' />
				<p class='urlslab-block-" . esc_attr( $this->slug ) . "-uploadDate'>
				<strong>" . esc_html( __( 'Published:', 'urlslab' ) ) . "</strong>
				<time datetime='$published'>" . esc_html( wp_date( $published ) ) . "</time>";
				break;
			default:
				echo "<div>" . esc_html( do_shortcode( "[urlslab-video videoid='$videoid' attribute='$attr' ]" ) ) . "</div>";
				break;
		}
	}

	public function render( $attributes ) {
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>"
				itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject"
			>
				<?php
					foreach ( array_keys($attributes['dataattributes']) as $attribute ) {
						if ( $attributes['dataattributes'][$attribute] === TRUE ) {
							$this->set_attribute( $attributes['videoid'], $attribute, $attributes['description_length'] );
						}
					}
				?>
			</div>
		<?php
		return ob_get_clean();
	}
}
