<?php

class Urlslab_Setting_Input implements Urlslab_Admin_Setting_Element {

	private string $input_type;
	private string $input_name;
	private string $input_value;
	private string $input_desc;
	private string $setting_headline;
	private string $placeholder;

	public function __construct(
		string $input_type,
		string $input_name,
		string $input_value,
		string $input_desc,
		string $setting_headline,
		string $placeholder
	) {
		if ( 'text' != $input_type &&
			 'number' != $input_type ) {
			throw new Exception( 'Unsupported input' );
		}

		$this->input_name       = $input_name;
		$this->input_value      = $input_value;
		$this->input_type       = $input_type;
		$this->input_desc       = $input_desc;
		$this->setting_headline = $setting_headline;
		$this->placeholder = $placeholder;
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
					<input id="<?php echo esc_attr( $this->input_name ); ?>"
						   name="<?php echo esc_attr( $this->input_name ); ?>"
						   value="<?php echo esc_attr( $this->input_value ); ?>"
						   placeholder="<?php echo esc_attr( $this->placeholder ); ?>"
						   type="<?php echo esc_attr( $this->input_type ); ?>"
					>
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
