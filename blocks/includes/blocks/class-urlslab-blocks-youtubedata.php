<?php

class Urlslab_Blocks_YouTubeData extends Urlslab_Gutenberg_Block {

	public $slug = 'youtubedata';

	public function duration_to_time( $youtube_time ) {
		if ( $youtube_time ) {
			$start = new DateTime( '@0' ); // Unix epoch
			$start->add( new DateInterval( $youtube_time ) );
			$youtube_time = ltrim( ltrim( $start->format( 'H:i:s' ), '0' ), ':' );
		}

		return $youtube_time;
	}

	public function set_attribute( $videoid, $attr, $desc_length ): void {
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
				echo "<h3 itemprop='name' class='urlslab-block-" . esc_attr( $this->slug ) . "-title'>" . esc_html( $obj_video->get_title() ) . '</h3>';
				break;
			case 'description':
				echo "<p itemprop='description' class='urlslab-block-" . esc_attr( $this->slug ) . "-description'>" . esc_html( wp_trim_words( $obj_video->get_description(), (int) $desc_length ) ) . '</p>';
				break;
			case 'channel_title':
				echo "<p itemprop='author' class='urlslab-block-" . esc_attr( $this->slug ) . "-channel'>" . esc_html( $obj_video->get_channel_title() ) . '</p>';
				break;
			case 'published_at':
				$published = $obj_video->get_published_at();
				echo "<meta itemprop='uploadDate' content='" . esc_attr( $published ) . "' />
				<p class='urlslab-block-" . esc_attr( $this->slug ) . "-uploadDate'>
				<strong>" . esc_html( __( 'Published:', 'urlslab' ) ) . "</strong>
				<time datetime='" . esc_attr( $published ) . "'>" . esc_html( wp_date( $published ) ) . '</time>';
				break;
			case 'duration':
				$duration = $obj_video->get_duration();
				echo "<meta itemprop='duration' content='" . esc_attr( $duration ) . "' />
							<p class='urlslab-block-" . esc_attr( $this->slug ) . "-duration'>
							<strong>" . esc_html( __( 'Duration:', 'urlslab' ) ) . "</strong>
							<time datetime='" . esc_attr( $duration ) . "'>" . esc_html( $this->duration_to_time( $duration ) ) . '</time>
							</p>
							';
				break;
			case ( 'captions' ):
				$captions = nl2br( $obj_video->get_captions() );
				echo "<div itemprop='transcript' class='urlslab-block-" . esc_attr( $this->slug ) . "-captions'>" . $captions . "</div>"; // @codingStandardsIgnoreLine
				break;
			case ( 'captions_text' ):
				$captions = nl2br( $obj_video->get_captions_as_text() );
				echo "<div itemprop='transcript' class='urlslab-block-" . esc_attr( $this->slug ) . "-captions'>" . $captions . "</div>"; // @codingStandardsIgnoreLine
				break;
			default:
				break;
		}
	}

	public function render( $attributes ): string {
		ob_start();
		?>
		<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ); ?>" itemscope itemprop="VideoObject" itemtype="https://schema.org/VideoObject">
			<?php
			foreach ( array_keys( $attributes['dataattributes'] ) as $attribute ) {
				if ( true === $attributes['dataattributes'][ $attribute ] ) {
					$this->set_attribute( $attributes['videoid'], $attribute, $attributes['description_length'] );
				}
			}
			?>
		</div>
		<?php
		return ob_get_clean();
	}
}
