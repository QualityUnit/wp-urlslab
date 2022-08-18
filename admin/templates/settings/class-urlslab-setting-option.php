<?php

class Urlslab_Setting_Option implements Urlslab_Admin_Setting_Element {
	private string $input_name;
	private array $input_options;
	private string $input_desc;
	private string $setting_headline;

	/**
	 * @param string $input_name
	 * @param array $input_options
	 * @param string $input_desc
	 * @param string $setting_headline
	 */
	public function __construct(
		string $input_name,
		array $input_options,
		string $input_desc,
		string $setting_headline
	) {
		$this->input_name       = $input_name;
		$this->input_options      = $input_options;
		$this->input_desc       = $input_desc;
		$this->setting_headline = $setting_headline;
	}

	public function render_setting() {
		?>
		<div class="urlslab-setting-item">
			<div>
				<h4><?php echo esc_html( $this->setting_headline ); ?></h4>
			</div>
			<div>
				<p>
					<select name="<?php echo esc_attr( $this->input_name ); ?>"
							id="<?php echo esc_attr( $this->input_name ); ?>">
						<?php 
						foreach ( $this->input_options as $option ) {
							?>
						<option value="<?php echo esc_attr( $option['value'] ); ?>"
							<?php
							if ( $option['is_selected'] ) {
								echo ' selected';
							}
							?>
						><?php echo esc_html( $option['option_name'] ); ?>
						</option>
			<?php } ?>
					</select>
				</p>
				<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						<?php echo esc_html( $this->input_desc ); ?>
						</span>
			</div>
		</div>
		<?php
	}

}
