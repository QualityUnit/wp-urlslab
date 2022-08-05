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
			check_admin_referer( 'offloader-update' );
			//# Edit settings
			if ( isset( $_POST['submit'] ) &&
				 'Save Changes' === $_POST['submit'] &&
				 isset( $_POST['action'] ) &&
				 'update-settings' == $_POST['action'] ) {

				$saving_opt = array();
				foreach ( $_POST as $key => $val ) {
					if ( str_starts_with( $key, 'urlslab_' ) ) {
						$saving_opt[ $key ] = trim( $val );
					}
				}

				Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-media-offloader' )
										 ->update_widget_settings( $saving_opt );

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
		</div>
		<?php
	}
}
