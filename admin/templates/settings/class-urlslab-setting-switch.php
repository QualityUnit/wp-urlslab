<?php

class Urlslab_Setting_Switch implements Urlslab_Admin_Setting_Element {
	private string $input_name;
	private $input_value;
	private string $input_desc;
	private string $setting_headline;
	private bool $is_checked;

	public function __construct(
		string $input_name,
		$input_value,
		string $input_desc,
		string $setting_headline,
		bool $is_checked
	) {
		$this->input_name       = $input_name;
		$this->input_value      = $input_value;
		$this->input_desc       = $input_desc;
		$this->setting_headline = $setting_headline;
		$this->is_checked = $is_checked;
	}

	public function render_setting() {
		?>
		<div class="urlslab-setting-item">
			<div>
				<h4><?php echo esc_html( $this->setting_headline ); ?></h4>
			</div>
			<div>
				<p>
				<?php if ( is_string( $this->input_value ) ) { ?>
				<div class="urlslab-switch">
					<input class="urlslab-switch-input"
						   type="checkbox"
						   id="<?php echo esc_attr( $this->input_value ); ?>"
						   name="<?php echo esc_attr( $this->input_name ); ?>"
						   value="<?php echo esc_attr( $this->input_value ); ?>"
						<?php echo $this->is_checked ? 'checked' : ''; ?>>
					<label for="<?php echo esc_attr( $this->input_value ); ?>" class="urlslab-switch-label">switch</label>
				</div>
					<?php 
				} elseif ( is_array( $this->input_value ) ) {
					?>
						<div class="urlslab-multi-switch">
							<?php
							foreach ( $this->input_value as $key => $val ) {
								?>
								<div>
									<span><?php echo esc_html( $key ); ?></span>
									<div class="mar-left-1 urlslab-switch">
										<input class="urlslab-switch-input"
											   type="checkbox"
											   id="<?php echo esc_attr( $this->input_name . $key ); ?>"
											   name="<?php echo esc_attr( $this->input_name ); ?>"
											   value="<?php echo esc_attr( $key ); ?>"
											<?php echo $val ? 'checked' : ''; ?>>
										<label for="<?php echo esc_attr( $this->input_name . $key ); ?>" class="urlslab-switch-label">switch</label>
									</div>
								</div>
								<?php
							}
							?>
						</div>
						<?php
				}
				?>
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
