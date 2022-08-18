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

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY ] ) &&
					 ! empty( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY ] ) ) {
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY ];
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
		require URLSLAB_PLUGIN_DIR . 'admin/templates/page/urlslab-admin-media-offloader.php';
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
		$current_default_driver = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_NEW_FILE_DRIVER );
		$settings = array(
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND,
				'Enable/Disable offloading of WordPress media attachments in the back-end',
				'Offload WordPress media on background',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMPORT_POST_ATTACHMENTS_ON_BACKGROUND )
			),
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_EXTERNAL,
				'Offload media from external urls, found on pages of your domain with the current driver',
				'Offload External media found in page',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_EXTERNAL, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_SAVE_EXTERNAL )
			),
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_INTERNAL,
				'Offload media from internal urls, found on pages of your domain with the current driver',
				'Offload Internal media found in page',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_SAVE_INTERNAL, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_SAVE_INTERNAL )
			),
			new Urlslab_Setting_Option(
				Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER,
				array(
					array(
						'value' => Urlslab_Driver::DRIVER_DB,
						'is_selected' => Urlslab_Driver::DRIVER_DB == $current_default_driver,
						'option_name' => 'Database Driver',
					),
					array(
						'value' => Urlslab_Driver::DRIVER_LOCAL_FILE,
						'is_selected' => Urlslab_Driver::DRIVER_LOCAL_FILE == $current_default_driver,
						'option_name' => 'Local File Driver',
					),
					array(
						'value' => Urlslab_Driver::DRIVER_S3,
						'is_selected' => Urlslab_Driver::DRIVER_S3 == $current_default_driver,
						'option_name' => 'S3 Driver',
					),
				),
				'Current default driver to use for offloading the media',
				'Default Driver'
			),
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3,
				'Transfer all Media stored in S3 object storage to current default driver',
				'Transfer media from S3 to default driver on background',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_S3, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_S3 )
			),
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB,
				'Transfer all Media stored in database to current default driver',
				'Transfer media from database to default driver on background',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_DB, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_DB )
			),
			new Urlslab_Setting_Switch(
				'offload-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES,
				'Transfer all Media stored in Local File Storage to current default driver',
				'Transfer media from local file system to default driver on background',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_TRANSFER_FROM_DRIVER_LOCAL_FILES, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_TRANSFER_FROM_DRIVER_LOCAL_FILES )
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY,
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_MANIPULATION_PRIORITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_MANIPULATION_PRIORITY ),
				'The priority which specifies in which order the widget should work. the higher, the priority more Media would be saved.',
				'content hook priority',
				'Content Hook Priority'
			),
		);
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-settings', 1 ) ); ?>">
			<?php wp_nonce_field( 'offloader-update' ); ?>
			<?php
			foreach ( $settings as $setting ) {
				$setting->render_setting();
			}
			?>
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

	public function render_image_optimisation_settings() {
		$conversion_webp = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT );
		$setting_conversion_webp = array();
		foreach ( Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT as $type_to_conv ) {
			$setting_conversion_webp[ $type_to_conv ] = in_array( $type_to_conv, $conversion_webp );
		}

		$conversion_avif = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT );
		$setting_conversion_avif = array();
		foreach ( Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT as $type_to_conv ) {
			$setting_conversion_avif[ $type_to_conv ] = in_array( $type_to_conv, $conversion_avif );
		}

		$settings = array(
			new Urlslab_Setting_Switch(
				'image-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE,
				'Generate the Webp version of your images and add it as alternative and let browsers choose which one to use',
				'Generate Webp Images',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE, false )
			),
			new Urlslab_Setting_Switch(
				'webp-conversion-types[]',
				$setting_conversion_webp,
				'Select to convert which file type to Webp',
				'Convert filetypes to Webp',
				false
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY,
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEPB_QUALITY ),
				'The Quality of Webp image. the less the quality, the faster is the image loading time; number between 0 and 100',
				'Webp Conversion Quality',
				'Number between 0 and 100'
			),
			new Urlslab_Setting_Switch(
				'image-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE,
				'Generate the Avif version of your images and add it as alternative and let browsers choose which one to use',
				'Generate Avif Images',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_AVIF_ALTERNATIVE, false )
			),
			new Urlslab_Setting_Switch(
				'avif-conversion-types[]',
				$setting_conversion_avif,
				'Select to convert which file type to avif',
				'Convert filetypes to Avif',
				false
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY,
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_QUALITY ),
				'The Quality of Avif image. the less the quality, the faster is the image loading time; number between 0 and 100',
				'Webp Conversion Quality',
				'Number between 0 and 100'
			),
			new Urlslab_Setting_Input(
				'number',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED,
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_SPEED ),
				'The speed of Avif conversion. An integer between 0 (slowest) and 6 (fastest)',
				'Avif conversion speed',
				'Number between 0 and 10'
			),
		);

		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-image-optimisation-settings', 2 ) ); ?>">
			<?php wp_nonce_field( 'image-conversion-update' ); ?>
			<h3>Image Conversion</h3>
			<?php
			foreach ( $settings as $setting ) {
				$setting->render_setting();
			}
			?>
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

	public function render_lazy_loading_settings() {
		$settings = array(
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_IMG_LAZY_LOADING,
				'Enable/Disable lazy loading for Images in your pages',
				'Image Lazy Loading',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMG_LAZY_LOADING, false )
			),
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_VIDEO_LAZY_LOADING,
				'Enable/Disable lazy loading for Videos in your pages',
				'Video Lazy Loading',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_VIDEO_LAZY_LOADING, false )
			),
			new Urlslab_Setting_Switch(
				'lazy-loading[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_YOUTUBE_LAZY_LOADING,
				'Enable/Disable lazy loading for Youtube Videos in your pages',
				'Video Lazy Loading',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_YOUTUBE_LAZY_LOADING, false )
			),
		);
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-lazy-loading-settings', 3 ) ); ?>">
			<?php wp_nonce_field( 'lazy-loading-update' ); ?>
			<h3>Image Conversion</h3>
			<?php
			foreach ( $settings as $setting ) {
				$setting->render_setting();
			}
			?>
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
		//# Access Key Settings
		$access_key_setting = null;
		$access_key = get_option( Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY, '' );
		if ( empty( $access_key ) ) {
			$access_key_setting = new Urlslab_Setting_Input(
				'text',
				Urlslab_Driver_S3::SETTING_NAME_S3_ACCESS_KEY,
				'',
				'',
				'AWS S3 Access Key',
				'AWS S3 Access Key...'
			);
		} else {
			$access_key_setting = new Urlslab_Setting_Disabled(
				urlslab_masked_info( $access_key ),
				'',
				'AWS S3 Access Key'
			);
		}

		//# Secret Key Settings
		$secret_key_settings = null;
		$secret_key = get_option( Urlslab_Driver_S3::SETTING_NAME_S3_SECRET, '' );
		if ( empty( $access_key ) ) {
			$secret_key_settings = new Urlslab_Setting_Input(
				'text',
				Urlslab_Driver_S3::SETTING_NAME_S3_SECRET,
				'',
				'',
				'AWS S3 Secret Key',
				'AWS S3 Secret Key...'
			);
		} else {
			$secret_key_settings = new Urlslab_Setting_Disabled(
				urlslab_masked_info( $secret_key ),
				'',
				'AWS S3 Secret Key'
			);
		}

		$settings = array(
			$access_key_setting,
			$secret_key_settings,
			new Urlslab_Setting_Input(
				'text',
				Urlslab_Driver_S3::SETTING_NAME_S3_REGION,
				get_option( Urlslab_Driver_S3::SETTING_NAME_S3_REGION, '' ),
				'',
				'AWS S3 Region',
				'AWS S3 Region...'
			),
			new Urlslab_Setting_Input(
				'text',
				Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET,
				get_option( Urlslab_Driver_S3::SETTING_NAME_S3_BUCKET, '' ),
				'',
				'AWS S3 Bucket',
				'AWS S3 Bucket...'
			),
			new Urlslab_Setting_Input(
				'text',
				Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX,
				get_option( Urlslab_Driver_S3::SETTING_NAME_S3_URL_PREFIX, '' ),
				'URL prefix for offloaded media, so that it can be used with CDN. Leave empty if CDN is not configured.',
				'AWS S3 Url Prefix',
				'https://cdn.yourdomain.com/'
			),
		);
		?>
		<form method="post" action="<?php echo esc_url( $this->menu_page( 'media-offloader', 'action=update-s3-settings', 2 ) ); ?>">
			<?php wp_nonce_field( 's3-update' ); ?>
			<h3>S3 Driver Settings</h3>
			<?php
			foreach ( $settings as $setting ) {
				$setting->render_setting();
			}
			?>
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
							value="Save Changes">

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
