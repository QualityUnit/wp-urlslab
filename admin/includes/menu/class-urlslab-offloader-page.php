<?php

class Urlslab_Offloader_Page extends Urlslab_Admin_Page {

	private string $menu_slug;
	private string $page_title;
	private Urlslab_Offloader_Table $offloader_table;

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
				 isset( $_POST['action'] ) &&
				 'update-s3-settings' == $_POST['action'] ) {
				check_admin_referer( 's3-update' );

				//# Saving/updating the credentials
				if ( 'Save Changes' === $_POST['submit'] ) {
					$saving_opt = array();
					foreach ( array_keys( Urlslab_Driver_S3::get_driver_settings() ) as $setting_name ) {
						if ( isset( $_POST[ $setting_name ] ) ) {
							$saving_opt[ $setting_name ] = $_POST[ $setting_name ];
						}
					}

					Urlslab_Driver_S3::update_options( $saving_opt );


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
				//# Saving/updating the credentials

				//# Deleting the credentials
				if ( 'Remove Credentials' === $_POST['submit'] ) {
					$saving_opt = array();
					foreach ( array_keys( Urlslab_Driver_S3::get_driver_settings() ) as $setting_name ) {
						if ( isset( $_POST[ $setting_name ] ) ) {
							$saving_opt[ $setting_name ] = $_POST[ $setting_name ];
						}
					}

					Urlslab_Driver_S3::remove_options();


					wp_safe_redirect(
						$this->menu_page(
							'media-offloader',
							array(
								'status' => 'success',
								'urlslab-message' => 'AWS S3 settings was removed successfully',
							)
						)
					);
					exit;
				}
				//# Deleting the credentials
			}
			//# Edit AWS settings

		}

		//# Transfer single file
		if (
			isset( $_GET['action'] ) &&
			(
				'transfer-to-localfile' === $_GET['action'] ||
				'transfer-to-s3' === $_GET['action'] ||
				'transfer-to-db' === $_GET['action']
			) &&
			isset( $_GET['file'] ) &&
			isset( $_REQUEST['_wpnonce'] ) ) {
			$this->process_file_transfer();
		}
		//# Transfer single file
	}

	private function get_file_data( string $fileid ): Urlslab_File_Data {
		global $wpdb;
		$table = URLSLAB_FILES_TABLE;

		return new Urlslab_File_Data(
			$wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM $table WHERE fileid=%s", // phpcs:ignore
					$fileid
				),
				ARRAY_A
			)
		);
	}

	public function process_file_transfer() {

		$destination_driver = '';
		//# Single transfers
		if ( isset( $_GET['action'] ) &&
			 'transfer-to-localfile' === $_GET['action'] &&
			 isset( $_GET['file'] ) &&
			 isset( $_REQUEST['_wpnonce'] ) ) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_LOCAL_FILE;
		}

		if ( isset( $_GET['action'] ) &&
			 'transfer-to-s3' === $_GET['action'] &&
			 isset( $_GET['file'] ) &&
			 isset( $_REQUEST['_wpnonce'] ) ) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_S3;
		}

		if ( isset( $_GET['action'] ) &&
			 'transfer-to-db' === $_GET['action'] &&
			 isset( $_GET['file'] ) &&
			 isset( $_REQUEST['_wpnonce'] ) ) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_DB;
		}


		if ( ! empty( $destination_driver ) ) {
			$file = $this->get_file_data( $_GET['file'] );
			$dummy_obj = clone $file;
			$dummy_obj->set_driver( $destination_driver );
			try {
				if (
					Urlslab_Driver::get_driver( $file )->is_connected() &&
					Urlslab_Driver::get_driver( $dummy_obj )->is_connected()
				) {
					$result = Urlslab_Driver::transfer_file_to_storage(
						$this->get_file_data( $_GET['file'] ),
						$destination_driver
					);

					if ( ! $result ) {
						wp_safe_redirect(
							$this->menu_page(
								'',
								array(
									'status' => 'failure',
									'urlslab-message' => 'Oops something went wrong in transferring files, try again later',
								)
							)
						);
						exit();
					}
				} else {
					wp_safe_redirect(
						$this->menu_page(
							'',
							array(
								'status' => 'failure',
								'urlslab-message' => 'credentials not authenticated for driver',
							)
						)
					);
					exit();
				}
			} catch ( Exception $e ) {
				wp_safe_redirect(
					$this->menu_page(
						'',
						array(
							'status' => 'failure',
							'urlslab-message' => 'credentials not authenticated for driver - ' . $e->getMessage(),
						)
					)
				);
				exit();
			}

			wp_safe_redirect(
				$this->menu_page(
					'',
					array(
						'status' => 'success',
						'urlslab-message' => 'transfer was done successfully',
					)
				)
			);
			exit();
		}
		//# Single transfers
	}


	public function on_screen_load() {
		$option = 'per_page';
		$args = array(
			'label' => 'Assets',
			'default' => 50,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->offloader_table = new Urlslab_Offloader_Table();
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
		$this->render_tables();
	}

	private function render_tables() {
		?>
		<form method="get" class="float-left">
			<?php
			$this->offloader_table->views();
			$this->offloader_table->prepare_items();
			?>
			<input type="hidden" name="page" value="<?php echo esc_attr( $this->get_menu_slug() ); ?>">
			<?php
			$this->offloader_table->search_box( 'Search', 'urlslab-offloader-input' );
			$this->offloader_table->display();
			?>
		</form>
		<?php
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
							<?php
							if (
								( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY != $setting || empty( $setting_val ) ) &&
								( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET != $setting || empty( $setting_val ) )
							) {
								?>
								<label for="<?php echo esc_attr( $setting ); ?>">
									<?php echo esc_html( implode( ' ', explode( '_', str_replace( 'urlslab_', '', $setting ) ) ) ); ?>:
								</label>
								<?php
							}
							?>
						</div>
						<div class="col-3 float-left">
							<?php
							$value = $setting_val ?? '';
							if (
								( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY == $setting && ! empty( $setting_val ) ) ||
								( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET == $setting && ! empty( $setting_val ) )
							) {
								$value = urlslab_masked_info( $value );
								?>

								<span id="<?php echo esc_attr( $setting ); ?>">
									<?php echo esc_html( implode( ' ', explode( '_', str_replace( 'urlslab_', '', $setting ) ) ) ); ?>:
									<?php echo esc_html( $value ); ?>
								</span>
								<?php
							} else {
								?>
								<input id="<?php echo esc_attr( $setting ); ?>"
									   name="<?php echo esc_attr( $setting ); ?>"
									   value="<?php echo esc_attr( $value ); ?>"
									   type="text"
								>
								<?php
							}
							?>
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
