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

	public function render_settings() {}

	public function set_table_screen_options() {
		$option = 'per_page';
		$args = array(
			'label' => 'Assets',
			'default' => 50,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->offloader_table = new Urlslab_Offloader_Table();
	}

	public function handle_action() {
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

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] ) ) {
					if (
						0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] ||
						! is_numeric( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] )
					) {
						wp_safe_redirect(
							$this->parent_page->menu_page(
								'media-offloader',
								array(
									'status' => 'failure',
									'urlslab-message' => 'Cache expiration time needs to be number',
								),
								$_GET['sub-tab'] ?? ''
							)
						);
						exit;
					}
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ] = $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_MEDIA_CACHE_EXPIRE_TIME ];
				}

				Urlslab_Media_Offloader_Widget::update_settings( $saving_opt );


				wp_safe_redirect(
					$this->parent_page->menu_page(
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
						$this->parent_page->menu_page(
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
						$this->parent_page->menu_page(
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

			//# Edit Image Optimisation
			if ( isset( $_POST['submit'] ) &&
				 isset( $_GET['action'] ) &&
				 'update-image-optimisation-settings' == $_GET['action'] ) {
				check_admin_referer( 'image-conversion-update' );

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ) &&
					 ( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ||
					   100 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ) ) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloader',
							array(
								'status' => 'failure',
								'urlslab-message' => 'webp quality should be a number between 0 and 100',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ) &&
					 ( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ||
					   100 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ) ) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloader',
							array(
								'status' => 'failure',
								'urlslab-message' => 'Avif quality should be a number between 0 and 100',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}

				if ( isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ) &&
					 ( 0 > $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ||
					   10 < $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ) ) {
					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloader',
							array(
								'status' => 'failure',
								'urlslab-message' => 'Avif Speed should be a number between 0 and 10',
							),
							$_GET['sub-tab'] ?? ''
						)
					);
					exit;
				}


				if ( 'Save Changes' === $_POST['submit'] &&
					 isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] ) &&
					 isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_QUALITY ] ) &&
					 isset( $_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_WEPB_QUALITY ] ) ) {
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
					$saving_opt[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ] =
						$_POST[ Urlslab_Media_Offloader_Widget::SETTING_NAME_AVIF_SPEED ];

					Urlslab_Media_Offloader_Widget::update_option_image_optimisation( $saving_opt );


					wp_safe_redirect(
						$this->parent_page->menu_page(
							'media-offloader',
							array(
								'status' => 'success',
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
			isset( $_REQUEST['_wpnonce'] ) ) {
			$this->process_file_transfer();
		}
		//# Transfer single file
	}

	private function process_file_transfer() {

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
					$this->parent_page->menu_page(
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
					$this->parent_page->menu_page(
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
					$this->parent_page->menu_page(
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
							$this->parent_page->menu_page(
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
						$this->parent_page->menu_page(
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
					$this->parent_page->menu_page(
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

}
