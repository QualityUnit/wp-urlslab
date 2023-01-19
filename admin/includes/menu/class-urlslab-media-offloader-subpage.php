<?php

class Urlslab_Media_Offloader_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Offloader_Table $offloader_table;

	/**
	 * @param Urlslab_Admin_Page $parent_page
	 */
	public function __construct( Urlslab_Admin_Page $parent_page ) {
		$this->parent_page = $parent_page;
	}

	public function render_manage_buttons() {}

	public function render_tables() {
		?>
		<form method="get" class="float-left">
			<?php
			$this->offloader_table->views();
			$this->offloader_table->prepare_items();
			?>
			<input type="hidden" name="page" value="<?php echo esc_attr( $this->parent_page->get_menu_slug() ); ?>">
			<?php
			$this->offloader_table->search_box( 'Search', 'urlslab-offloader-input' );
			$this->offloader_table->display();
			?>
		</form>
		<?php
	}

	public function render_modals() {}

	public function render_image_optimisation_settings() {
		$conversion_webp         = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT );
		$setting_conversion_webp = array();
		foreach ( Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_WEBP_TYPES_TO_CONVERT as $type_to_conv ) {
			$setting_conversion_webp[ $type_to_conv ] = in_array( $type_to_conv, $conversion_webp );
		}

		$conversion_avif         = get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT );
		$setting_conversion_avif = array();
		foreach ( Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_AVIF_TYPES_TO_CONVERT as $type_to_conv ) {
			$setting_conversion_avif[ $type_to_conv ] = in_array( $type_to_conv, $conversion_avif );
		}

		$cron_webp = new Urlslab_Convert_Webp_Images_Cron();
		$cron_avif = new Urlslab_Convert_Avif_Images_Cron();

		$settings = array(
			new Urlslab_Setting_Switch(
				'image-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_USE_WEBP_ALTERNATIVE,
				( $cron_webp->is_format_supported() ? '' : 'IMPORTANT: WEBP file format is not supported on your server. ' ) .
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
				( $cron_avif->is_format_supported() ? '' : 'IMPORTANT: AVIF file format is not supported on your server. ' ) .
				'Generate the Avif version of your images and let browsers to choose the most effective file format.',
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
				'Avif Conversion Quality',
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
			new Urlslab_Setting_Switch(
				'image-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_IMAGE_RESIZING,
				'If image of smaller size doesn\'t exist, but image url is used in the content, create copy of original image with smaller size. e.g. if /img/myimage-340x200.jpg doesn\'t exist, but there is /img/myimage.jpg, plugin will create smaller image from original source',
				'Resize missing image sizes',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMAGE_RESIZING, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMAGE_RESIZING )
			),
			new Urlslab_Setting_Switch(
				'image-opt[]',
				Urlslab_Media_Offloader_Widget::SETTING_NAME_IMG_MIN_WIDTH,
				'Skip loading of images into browser if size of window is smaller as defined width. This feature optimize amount of transferred data for small devices and is useful in case you set by css breaking points when image is not displayed on smaller devices. Add class name urlslab-min-width-[number] on image or any parent elemenet to apply this functionality. Example: <img src="image.jpg" class="urlslab-min-width-768"> will load image just if window is wider or equal 768 pixels',
				'Skip loading image on small devices',
				get_option( Urlslab_Media_Offloader_Widget::SETTING_NAME_IMG_MIN_WIDTH, Urlslab_Media_Offloader_Widget::SETTING_DEFAULT_IMG_MIN_WIDTH )
			),
		);

		?>
		<form method="post"
			  action="<?php echo esc_url( $this->parent_page->menu_page( 'media-offloading', 'action=update-image-optimisation-settings', 3 ) ); ?>">
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


	public function set_table_screen_options() {
		$option = 'per_page';
		$args   = array(
			'label'   => 'Assets',
			'default' => 50,
			'option'  => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->offloader_table = new Urlslab_Offloader_Table();
	}

	public function handle_action() {
		if (
			isset( $_SERVER['REQUEST_METHOD'] ) and
			'POST' === $_SERVER['REQUEST_METHOD'] and
			isset( $_REQUEST['action'] ) and
			- 1 != $_REQUEST['action']
		) {
			//# Edit settings
			if (
				isset( $_POST['submit'] ) &&
				'Save Changes' === $_POST['submit'] &&
				isset( $_GET['action'] ) &&
				'update-settings' == $_GET['action']
			) {
				check_admin_referer( 'offloader-update' );

				$saving_opt = array();
				if (
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] ) &&
					! empty( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] )
				) {
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_NEW_FILE_DRIVER ];
				}

				if ( isset( $_POST['offload-opt'] ) ) {
					foreach ( $_POST['offload-opt'] as $offload_opt ) {
						$saving_opt[ $offload_opt ] = true;
					}
				}

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] ) ) {
					if (
						0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] ||
						! is_numeric( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] )
					) {
						wp_safe_redirect(
							$this->parent_page->menu_page(
								'media-offloading',
								array(
									'status'          => 'failure',
									'urlslab-message' => 'Cache expiration time needs to be number',
								),
								$_GET['sub-tab'] ?? ''
							)
						);
						exit;
					}
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] = $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ];
				}

				wp_safe_redirect(
					$this->parent_page->menu_page(
						'media-offloading',
						array(
							'status'          => 'success',
							'urlslab-message' => 'Keyword settings was saved successfully',
						),
						$_GET['sub-tab'] ?? ''
					)
				);
				exit;
			}

			//# Edit Image Optimisation
			if (
				isset( $_POST['submit'] ) &&
				isset( $_GET['action'] ) &&
				'update-image-optimisation-settings' == $_GET['action']
			) {
				check_admin_referer( 'image-conversion-update' );

				if (
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ) &&
					( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ||
					  100 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] )
				) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloading',
							array(
								'status'          => 'failure',
								'urlslab-message' => 'webp quality should be a number between 0 and 100',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}

				if (
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ) &&
					( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ||
					  100 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] )
				) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloading',
							array(
								'status'          => 'failure',
								'urlslab-message' => 'Avif quality should be a number between 0 and 100',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}

				if (
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ) &&
					( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ||
					  10 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] )
				) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloading',
							array(
								'status'          => 'failure',
								'urlslab-message' => 'Avif Speed should be a number between 0 and 10',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}


				if (
					'Save Changes' === $_POST['submit'] &&
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ) &&
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ) &&
					isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] )
				) {
					$saving_opt = array();
					if ( isset( $_POST['image-opt'] ) ) {
						foreach ( $_POST['image-opt'] as $image_opt_setting ) {
							$saving_opt[ $image_opt_setting ] = true;
						}
					}
					if ( isset( $_POST['webp-conversion-types'] ) ) {
						$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEBP_TYPES_TO_CONVERT ] =
							$_POST['webp-conversion-types'];
					}
					if ( isset( $_POST['avif-conversion-types'] ) ) {
						$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_TYPES_TO_CONVERT ] =
							$_POST['avif-conversion-types'];
					}
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ];
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ];
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ]   =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ];

					Urlslab_Media_Offloader_Widget::update_option_image_optimisation( $saving_opt );


					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloading',
							array(
								'status'          => 'success',
								'urlslab-message' => 'Image Conversion settings was saved successfully',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}
			}
			//# Edit Image Optimisation
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
			isset( $_REQUEST['_wpnonce'] )
		) {
			$this->process_file_transfer();
		}
		//# Transfer single file
	}

	private function process_file_transfer() {

		$destination_driver = '';
		//# Single transfers
		if (
			isset( $_GET['action'] ) &&
			'transfer-to-localfile' === $_GET['action'] &&
			isset( $_GET['file'] ) &&
			isset( $_REQUEST['_wpnonce'] )
		) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->parent_page->menu_page(
						'',
						array(
							'status'          => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_LOCAL_FILE;
		}

		if (
			isset( $_GET['action'] ) &&
			'transfer-to-s3' === $_GET['action'] &&
			isset( $_GET['file'] ) &&
			isset( $_REQUEST['_wpnonce'] )
		) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->parent_page->menu_page(
						'',
						array(
							'status'          => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_S3;
		}

		if (
			isset( $_GET['action'] ) &&
			'transfer-to-db' === $_GET['action'] &&
			isset( $_GET['file'] ) &&
			isset( $_REQUEST['_wpnonce'] )
		) {

			// In our file that handles the request, verify the nonce.
			$nonce = wp_unslash( $_REQUEST['_wpnonce'] );
			/*
			 * Note: the nonce field is set by the parent class
			 * wp_nonce_field( 'bulk-' . $this->_args['plural'] );
			 */
			if ( ! wp_verify_nonce( $nonce, 'urlslab_transfer_file' ) ) { // verify the nonce.
				wp_redirect(
					$this->parent_page->menu_page(
						'',
						array(
							'status'          => 'failure',
							'urlslab-message' => 'this link is expired',
						)
					)
				);
				exit();
			}
			$destination_driver = Urlslab_Driver::DRIVER_DB;
		}


		if ( ! empty( $destination_driver ) ) {
			$file = Urlslab_File_Data::get_file( $_GET['file'] );
			if ( null == $file ) {
				wp_safe_redirect(
					$this->parent_page->menu_page(
						'',
						array(
							'status'          => 'failure',
							'urlslab-message' => 'File not found',
						)
					)
				);
				exit();
			}

			try {
				if (
					$file->get_file_pointer()->get_driver()->is_connected() &&
					Urlslab_Driver::get_driver( $destination_driver )->is_connected()
				) {
					$result = Urlslab_Driver::transfer_file_to_storage(
						$file,
						$destination_driver
					);

					if ( ! $result ) {
						wp_safe_redirect(
							$this->parent_page->menu_page(
								'',
								array(
									'status'          => 'failure',
									'urlslab-message' => 'Oops something went wrong in transferring files, try again later',
								)
							)
						);
						exit();
					}
				} else {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'',
							array(
								'status'          => 'failure',
								'urlslab-message' => 'credentials not authenticated for driver',
							)
						)
					);
					exit();
				}
			} catch ( Exception $e ) {
				wp_safe_redirect(
					$this->parent_page->menu_page(
						'',
						array(
							'status'          => 'failure',
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

}
