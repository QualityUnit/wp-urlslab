<?php

class Urlslab_Setting_Disabled implements Urlslab_Admin_Setting_Element {
	private string $input_value;
	private string $input_desc;
	private string $setting_headline;

	public function __construct(
		string $input_value,
		string $input_desc,
		string $setting_headline
	) {
		$this->input_value      = $input_value;
		$this->input_desc       = $input_desc;
		$this->setting_headline = $setting_headline;
	}

	public function render_setting() {
		?>
		<div class="urlslab-setting-item">
			<div>
				<h4>
					<?php echo esc_html( $this->setting_headline ); ?>
				</h4>
			</div>
			<div>
				<p>
					<span><?php echo esc_html( $this->input_value ); ?></span>
				</p>
				<?php if ( ! empty( $this->input_desc ) ) { ?>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						<?php echo esc_html( $this->input_desc ); ?>
					</span>
				<?php } ?>
			</div>
		</div>
		<?php
	}

}
