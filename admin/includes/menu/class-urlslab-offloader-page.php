<?php

class Urlslab_Offloader_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;

	public function __construct() {
		$this->menu_slug = 'urlslab-media-offloader';
		$this->page_title = 'Media Offloader';
	}

	public function on_page_load( string $action, string $component ) {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] ) {
			//# Edit settings
			if ( isset( $_POST['submit'] ) &&
				 'Save Changes' === $_POST['submit'] &&
				 isset( $_POST['action'] ) &&
				 'update-settings' == $_POST['action'] ) {
				check_admin_referer( 'offloader-update' );

				$saving_opt = array();
				foreach ( $_POST as $key => $val ) {
					if ( str_starts_with( $key, 'urlslab_' ) ) {
						$saving_opt[ $key ] = trim( $val );
					}
				}

				$all_widget_settings = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' )
										 ->get_widget_settings();
				foreach ( $all_widget_settings as $widget_setting => $widget_setting_val ) {
					if ( ! isset( $saving_opt[ $widget_setting ] ) ) {
						$saving_opt[ $widget_setting ] = 0;
					}
				}

				update_option(
					'urlslab-media-offloader',
					$saving_opt
				);


				wp_safe_redirect(
					$this->menu_page(
						'media-offloader',
						array(
							'status' => 'success',
							'urlslab-message' => 'Keyword settings was saved successfully',
						)
					)
				);
				exit;
			}
			//# Edit settings

			//# Edit AWS settings
			if ( isset( $_POST['submit'] ) &&
				 'Save Changes' === $_POST['submit'] &&
				 isset( $_POST['action'] ) &&
				 'update-s3-settings' == $_POST['action'] ) {
				check_admin_referer( 's3-update' );

				$saving_opt = array();
				if (
						isset( $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET ] ) &&
						isset( $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_REGION ] ) &&
						isset( $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ] ) &&
						isset( $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ] ) &&
						isset( $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX ] )
				) {
					$saving_opt[ Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET ] = $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET ];
					$saving_opt[ Urlslab_Driver_S3::SETTING_NAME_S3_REGION ] = $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_REGION ];
					$saving_opt[ Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ] = $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ];
					$saving_opt[ Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ] = $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ];
					$saving_opt[ Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX ] = $_POST[ Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX ];
				}

				update_option(
					'urlslab_s3driver_configuration',
					$saving_opt
				);


				wp_safe_redirect(
					$this->menu_page(
						'media-offloader',
						array(
							'status' => 'success',
							'urlslab-message' => 'AWS S3 settings was saved successfully',
						)
					)
				);
				exit;
			}
			//# Edit AWS settings


		}
	}

	public function on_screen_load() {
		// TODO: Implement on_screen_load() method.
	}

	public function register_submenu( string $parent_slug ) {
		$hook = add_submenu_page(
			$parent_slug,
			'Urlslab Media Offloader',
			'Media Offloader',
			'manage_options',
			$this->menu_slug,
			array( $this, 'load_page' )
		);
		add_action( "load-$hook", array( $this, 'on_screen_load' ) );
	}

	public function get_menu_slug(): string {
		return $this->menu_slug;
	}

	public function get_page_tabs(): array {
		return array(
			'media-offloader' => 'Media Offloader',
		);
	}

	public function get_page_title(): string {
		return $this->page_title;

	}

	public function load_page() {
		require URLSLAB_PLUGIN_DIR . 'admin/partials/urlslab-admin-media-offloader.php';
	}

	public function get_active_page_tab(): string {
		return 'media-offloader';
	}

	public function render_subpage() {
		// TODO: Implement render_subpage() method.
	}

	public function render_settings() {
		$widget_settings = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' )->get_widget_settings();
		switch ( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] ) {
			case Urlslab_Driver::DRIVER_DB:
				unset( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB ] );
				break;

			case Urlslab_Driver::DRIVER_S3:
				unset( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 ] );
				break;

			case Urlslab_Driver::DRIVER_LOCAL_FILE:
				unset( $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES ] );
				break;
		}
		?>
		<div class="col-8 mar-top-1">
			<form method="post">
				<input type="hidden" name="action" value="update-settings">
				<?php foreach ( $widget_settings as $setting => $setting_val ) { ?>
					<?php wp_nonce_field( 'offloader-update' ); ?>
					<div class="col-3 float-left">
						<label for="<?php echo esc_attr( $setting ); ?>">
							<?php echo esc_html( implode( ' ', explode( '_', str_replace( 'urlslab_', '', $setting ) ) ) ); ?>:
						</label>
					</div>
					<?php if ( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER == $setting ) { ?>
						<div class="col-3 float-left">
								<select name="<?php echo esc_attr( $setting ); ?>" id="<?php echo esc_attr( $setting ); ?>">
									<?php $db_driver_selected = Urlslab_Driver::DRIVER_DB == $setting_val; ?>
									<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_DB ); ?>"
									<?php
									if ( $db_driver_selected ) {
										echo ' selected';}
									?>
									>Database Driver</option>
									<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_LOCAL_FILE ); ?>"
										<?php
										$local_file_selected = Urlslab_Driver::DRIVER_LOCAL_FILE == $setting_val;
										if ( $local_file_selected ) {
											echo ' selected';
										}
										?>
									>Local File Driver</option>
									<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_S3 ); ?>"
										<?php
										$s3_selected = Urlslab_Driver::DRIVER_S3 == $setting_val;
										if ( $s3_selected ) {
											echo ' selected';
										}
										?>
									>S3 Driver</option>
								</select>
						</div>
					<?php } else { ?>
						<div class="col-3 float-left">
							<input id="<?php echo esc_attr( $setting ); ?>"
								   name="<?php echo esc_attr( $setting ); ?>"
								   value="1"
								   type="checkbox"
								   <?php 
									if ( 1 == $setting_val ) {
										echo 'checked'; }
									?>
							>
						</div>
				<?php } ?>
					<br class="clear"/>
					<br class="clear"/>
				<?php } ?>
				<input class="button button-primary" type="submit" name="submit" value="Save Changes">
			</form>
			<?php
			if ( Urlslab_Driver::DRIVER_S3 == $widget_settings[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] ) {
				$s3_settings = Urlslab_Driver_S3::get_driver_settings();
				?>
				<form method="post">
					<input type="hidden" name="action" value="update-s3-settings">
					<?php wp_nonce_field( 's3-update' ); ?>
					<?php foreach ( $s3_settings as $setting => $setting_val ) { ?>
						<div class="col-3 float-left">
							<label for="<?php echo esc_attr( $setting ); ?>">
								<?php echo esc_html( implode( ' ', explode( '_', str_replace( 'urlslab_', '', $setting ) ) ) ); ?>:
							</label>
						</div>
						<div class="col-3 float-left">
							<input id="<?php echo esc_attr( $setting ); ?>"
								   name="<?php echo esc_attr( $setting ); ?>"
								   value="<?php echo esc_attr( urlslab_masked_info( $setting_val ?? '' ) ); ?>"
								   type="text"
							>
						</div>
					<?php } ?>
					<?php if ( empty( $s3_settings[ Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ] ) ) { ?>
						<input class="button button-primary" type="submit" name="submit" value="Save Changes">
					<?php } else { ?>
                        <input class="button button-primary" type="submit" name="submit" value="Save Changes">
                        <input class="urlslab-btn-error" type="submit" name="submit" value="Remove Credentials">
					<?php } ?>
				</form>
			<?php } ?>
		</div>
		<?php
	}
}
