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
				 isset( $_GET['action'] ) &&
				 'update-settings' == $_GET['action'] ) {
				check_admin_referer( 'offloader-update' );

				$saving_opt = array();
				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] ) &&
					 ! empty( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] ) ) {
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ];
				}

				if ( isset( $_POST['offload-opt'] ) ) {
					foreach ( $_POST['offload-opt'] as $offload_opt ) {
						$saving_opt[ $offload_opt ] = true;
					}
				}

				Urlslab_Media_Offloader_Widget::update_settings( $saving_opt );


				wp_safe_redirect(
					$this->menu_page(
						'media-offloader',
						array(
							'status' => 'success',
							'urlslab-message' => 'Keyword settings was saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			}
			//# Edit settings

			//# Edit AWS settings
			if ( isset( $_POST['submit'] ) &&
				 isset( $_GET['action'] ) &&
				 'update-s3-settings' == $_GET['action'] ) {
				check_admin_referer( 's3-update' );

				//# Saving/updating the credentials
				if ( 'Save Changes' === $_POST['submit'] ) {
					Urlslab_Driver_S3::update_options( $_POST );


					wp_safe_redirect(
						$this->menu_page(
							'media-offloader',
							array(
								'status' => 'success',
								'urlslab-message' => 'AWS S3 settings was saved successfully',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}
				//# Saving/updating the credentials

				//# Deleting the credentials
				if ( 'Remove Credentials' === $_POST['submit'] ) {
					Urlslab_Driver_S3::remove_options();

					wp_safe_redirect(
						$this->menu_page(
							'media-offloader',
							array(
								'status' => 'success',
								'urlslab-message' => 'AWS S3 settings was removed successfully',
							),
							$_GET['sub-tab'] ?? ''
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
				remove_query_arg(
					array(
						'action',
						'file',
					),
					add_query_arg(
						'status=success',
						'urlslab-message=AWS S3 settings was saved successfully',
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
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-settings', 1 ) ); ?>">
			<?php wp_nonce_field( 'offloader-update' ); ?>
			<div class="urlslab-setting-item">
				<div>
					<h4>Offload WordPress media on background</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="attachment-import"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND ) ? 'checked' : ''; ?>>
						<label for="attachment-import" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Enable/Disable offloading of WordPress media attachments in the back-end
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Offload External media found in page</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="external-resources"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_EXTERNAL ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_EXTERNAL, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_SAVE_EXTERNAL ) ? 'checked' : ''; ?>>
						<label for="external-resources" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Offload media from external urls, found on pages of your domain with the current driver
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Offload Internal media found in page</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="internal-resources"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_INTERNAL ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_INTERNAL, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_SAVE_INTERNAL ) ? 'checked' : ''; ?>>
						<label for="internal-resources" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Offload media from internal urls, found on pages of your domain with the current driver
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Default Driver</h4>
				</div>
				<div>
					<p>
						<?php $current_default_driver = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER ); ?>
						<select name="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ); ?>"
								id="default-file-driver">
							<?php $db_driver_selected = Urlslab_Driver::DRIVER_DB == $current_default_driver; ?>
							<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_DB ); ?>"
								<?php
								if ( $db_driver_selected ) {
									echo ' selected';
								}
								?>
							>Database Driver
							</option>
							<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_LOCAL_FILE ); ?>"
								<?php
								$local_file_selected = Urlslab_Driver::DRIVER_LOCAL_FILE == $current_default_driver;
								if ( $local_file_selected ) {
									echo ' selected';
								}
								?>
							>Local File Driver
							</option>
							<option value="<?php echo esc_attr( Urlslab_Driver::DRIVER_S3 ); ?>"
								<?php
								$s3_selected = Urlslab_Driver::DRIVER_S3 == $current_default_driver;
								if ( $s3_selected ) {
									echo ' selected';
								}
								?>
							>S3 Driver
							</option>
						</select>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Current default driver to use for offloading the media
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Transfer media from S3 to default driver on background</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="transfer-s3"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3 ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3 ) ? 'checked' : ''; ?>>
						<label for="transfer-s3" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Transfer all Media stored in S3 object storage to current default driver
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Transfer media from database to default driver on background</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="transfer-db"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB ) ? 'checked' : ''; ?>>
						<label for="transfer-db" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Transfer all Media stored in database to current default driver
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>Transfer media from local file system to default driver on background</h4>
				</div>
				<div>
					<p>
					<div class="urlslab-switch">
						<input class="urlslab-switch-input"
							   type="checkbox"
							   id="transfer-local-file"
							   name="offload-opt[]"
							   value="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES ); ?>"
							<?php echo get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES ) ? 'checked' : ''; ?>>
						<label for="transfer-local-file" class="urlslab-switch-label">switch</label>
					</div>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						Transfer all Media stored in Local File Storage to current default driver
						</span>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>content hook priority</h4>
				</div>
				<div>
					<p>
						<input id="prio"
							   name="<?php echo esc_attr( Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY ); ?>"
							   value="<?php echo esc_attr( get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_MANIPULATION_PRIORITY ) ); ?>"
							   type="number"
						>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						The priority which specifies in which order the widget should work. the higher, the priority more Media would be saved.
						</span>
				</div>
			</div>
			<p>
				<input
						type="submit"
						name="submit"
						id="save-sub-widget"
						class="urlslab-btn-primary"
						value="Save Changes">
			</p>
		</form>
		<?php
	}

	public function render_driver_settings() {
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-s3-settings', 2 ) ); ?>">
			<?php wp_nonce_field( 's3-update' ); ?>
			<h3>S3 Driver Settings</h3>
			<div class="urlslab-setting-item">
				<div>
					<h4>
						AWS S3 Access Key
					</h4>
				</div>
				<div>
					<p>
						<?php
						$access_key = get_option( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY, '' );
						if ( ! empty( $access_key ) ) {
							$value = urlslab_masked_info( $access_key );
							?>
							<span id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ); ?>">
								<?php echo esc_html( $value ); ?>
								</span>
							<?php
						} else {
							?>
							<input id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ); ?>"
								   name="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY ); ?>"
								   value=""
								   placeholder="AWS S3 Access Key..."
								   type="text"
							>
							<?php
						}
						?>
					</p>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>
						AWS S3 Secret Key
					</h4>
				</div>
				<div>
					<p>
						<?php
						$secret_key = get_option( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET, '' );
						if ( ! empty( $secret_key ) ) {
							$value = urlslab_masked_info( $secret_key );
							?>
							<span id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ); ?>">
								<?php echo esc_html( $value ); ?>
								</span>
							<?php
						} else {
							?>
							<input id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ); ?>"
								   name="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET ); ?>"
								   value=""
								   placeholder="AWS S3 Secret Key..."
								   type="text"
							>
							<?php
						}
						?>
					</p>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>
						AWS S3 Region
					</h4>
				</div>
				<div>
					<p>
						<input id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_REGION ); ?>"
							   name="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_REGION ); ?>"
							   value="<?php echo esc_attr( get_option( Urlslab_Driver_S3::SETTING_NAME_S3_REGION, '' ) ); ?>"
							   placeholder="AWS S3 Region..."
							   type="text"
						>
					</p>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>
						AWS S3 Bucket
					</h4>
				</div>
				<div>
					<p>
						<input id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET ); ?>"
							   name="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET ); ?>"
							   value="<?php echo esc_attr( get_option( Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET, '' ) ); ?>"
							   placeholder="AWS S3 Bucket..."
							   type="text"
						>
					</p>
				</div>
			</div>
			<div class="urlslab-setting-item">
				<div>
					<h4>
						AWS S3 Url Prefix
					</h4>
				</div>
				<div>
					<p>
						<input id="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX ); ?>"
							   name="<?php echo esc_attr( Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX ); ?>"
							   value="<?php echo esc_attr( get_option( Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX, '' ) ); ?>"
							   placeholder="https://cdn.yourdomain.com/"
							   type="text"
						>
					</p>
					<span class="urlslab-info">
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/information.png' ) . 'information.png' ); ?>"
							 alt="info"
							 width="10px">
						URL prefix for offloaded media, so that it can be used with CDN. Leave empty if CDN is not configured.
					</span>
				</div>
			</div>
			<?php if ( empty( $secret_key ) && empty( $access_key ) ) { ?>
				<p>
					<input
							type="submit"
							name="submit"
							id="save-sub-widget"
							class="urlslab-btn-primary"
							value="Save Changes">
				</p>
			<?php } else { ?>
				<p>
					<input
							type="submit"
							name="submit"
							id="save-sub-widget"
							class="urlslab-btn-primary"
							value="Save changes">

					<input
							type="submit"
							name="submit"
							id="save-sub-widget"
							class="urlslab-btn-error"
							value="Remove Credentials">
				</p>
			<?php } ?>
		</form>
		<?php
	}
}
