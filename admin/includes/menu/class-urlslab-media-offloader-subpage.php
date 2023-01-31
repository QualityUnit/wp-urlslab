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
