<?php

class Urlslab_Blocks_TableOfContents extends Urlslab_Gutenberg_Block {

	public $slug = 'tableofcontents';

	private const HEADER_DEFAULTS = array(
		'anchor'  => '',
		'content' => '',
		'level'   => '',
	);

	public function render( $attributes ) {
		$headers           = json_decode( isset( $attributes['headers'] ) ? (string) $attributes['headers'] : '', true );
		$headers           = is_array( $headers ) ? array_filter( $headers, 'is_array' ) : array();
		$headers_max_level = $attributes['headersMaxLevel'] ?? 0;
		$minimum_level     = $attributes['minimumLevel'] ?? 2;

		ob_start();
		?>
		<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ); ?>" name="TableOfContents">
			<p class="urlslab-block-<?= esc_attr( $this->slug ); ?>-title">
				<strong><?php _e( 'Table of Contents', 'urlslab' ); ?></strong>
			</p>
			<ul class="urlslab-block-<?= esc_attr( $this->slug ); ?>-list" urlslab-skip-all>
				<?php
				foreach ( $headers as $header_array ) {
					$array_copy = $header_array;
					$header     = array_shift( $array_copy );
					if ( ! is_array( $header ) ) {
						continue;
					}
					$header = array_merge( self::HEADER_DEFAULTS, $header );

					$anchor = $header['anchor'] ? $header['anchor'] : $this->generate_anchor( $header['content'] );
					?>
					<li name="tocSecEntry"
						class="urlslab-block-<?= esc_attr( $this->slug ); ?>-level<?= esc_attr( $header['level'] ); ?>">
						<a href="#<?= esc_attr( $anchor ); ?>"
							rel="nofollow" name="sectionSubject"><?= esc_html( $header['content'] ); ?></a>
						<?php
						if ( count( $array_copy ) > 0 && $minimum_level < $headers_max_level ) {
							?>
							<ul class="urlslab-block-<?= esc_attr( $this->slug ); ?>-subList">
								<?php
								foreach ( $array_copy as $sub_header ) {
									if ( ! is_array( $sub_header ) ) {
										continue;
									}
									$sub_header = array_merge( self::HEADER_DEFAULTS, $sub_header );
									$sub_anchor = $sub_header['anchor'] ? $sub_header['anchor'] : $this->generate_anchor( $sub_header['content'] );
									?>
									<li name="tocSecEntry"
										class="urlslab-block-<?= esc_attr( $this->slug ); ?>-level<?= esc_attr( $sub_header['level'] ); ?>">
										<a href="#<?= esc_attr( $sub_anchor ); ?>"
												rel="nofollow"
										   name="sectionSubject"><?= esc_html( $sub_header['content'] ); ?></a></li>
									<?php
								}
								?>
							</ul>
							<?php
						}
						?>
					</li>
					<?php
				}
				?>
			</ul>
		</div>
		<?php
		return ob_get_clean();
	}

	private function generate_anchor( $content ) {
		if ( ! empty( $content ) ) {
			$clean_content = preg_replace( '/[^a-zA-Z0-9\-_]+/u', '', str_replace( ' ', '-', $content ) );

			return 'h-' . sanitize_title( $clean_content );
		}
		return '';
	}
}
