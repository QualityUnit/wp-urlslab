<?php

class Urlslab_TableOfContents extends Urlslab_Gutenberg_Block {
	
	public $slug = 'table-of-contents'; 

	public function render( $attributes ) {
		$headers = json_decode( $attributes['headers'], true );
		$headersMaxLevel = $attributes['headersMaxLevel'];
		$minimumLevel = $attributes['minimumLevel'];
		
		ob_start();
		?>
			<div class="urlslab-block urlslab-block-<?= esc_attr( $this->slug ) ?>" name="TableOfContents">
				<p class="urlslab-block-<?= esc_attr( $this->slug ) ?>-title">
					<strong><?php _e( 'Table of Contents', 'urlslab' ); ?></strong>
				</p>
				<ul class="urlslab-block-<?= esc_attr( $this->slug ) ?>-list">
				<?php
					foreach( $headers as $headerArray ) {
						$arrayCopy = $headerArray;
						$header = array_shift( $arrayCopy );
						?>
						<li name="tocSecEntry">
							<a href="#<?= $header['anchor']; ?>" name="sectionSubject"><?= $header['content']; ?></a>
							<?php
								if ( count( $arrayCopy ) > 0 && $minimumLevel < $headersMaxLevel ) {
								?>
									<ul class="urlslab-block-<?= esc_attr( $this->slug ) ?>-subList">
										<?php
											foreach( $arrayCopy as $subHeader ) {
											?>
												<li name="tocSecEntry"><a href="#<?= $subHeader['anchor'] ?>"  name="sectionSubject"><?= $subHeader['content'] ?></a></li>
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
