<?php

class Urlslab_TableOfContents extends Urlslab_Gutenberg_Block {
	
	public $slug = 'tableofcontents'; 

	public function render( $attributes ) {
		$headers = json_decode( $attributes['headers'], true );
		$headers_max_level = $attributes['headersMaxLevel'];
		$minimum_level = $attributes['minimumLevel'];
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>" name="TableOfContents">
				<p class="urlslab-block-<?= esc_attr( $this->slug ) ?>-title">
					<strong><?php _e( 'Table of Contents', 'urlslab' ); ?></strong>
				</p>
				<ul class="urlslab-block-<?= esc_attr( $this->slug ) ?>-list">
				<?php
				foreach ( $headers as $header_array ) {
						$array_copy = $header_array;
						$header = array_shift( $array_copy );
					?>
						<li name="tocSecEntry" class="urlslab-block-<?= esc_attr( $this->slug ) ?>-level<?= esc_attr( $header['level'] ); ?>">
							<a href="#<?= esc_attr( $header['anchor'] ); ?>" name="sectionSubject"><?= esc_html( $header['content'] ); ?></a>
							<?php
							if ( count( $array_copy ) > 0 && $minimum_level < $headers_max_level ) {
								?>
									<ul class="urlslab-block-<?= esc_attr( $this->slug ) ?>-subList">
										<?php
										foreach ( $array_copy as $sub_header ) {
											?>
												<li name="tocSecEntry" class="urlslab-block-<?= esc_attr( $this->slug ) ?>-level<?= esc_attr( $sub_header['level'] ); ?>"><a href="#<?= esc_attr( $sub_header['anchor'] ); ?>"  name="sectionSubject"><?= esc_html( $sub_header['content'] ); ?></a></li>
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
}
