<?php
?>
<div class="urlslab-wrap">
	<?php require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		//# General settings tab
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-urls' );
		if ( ! isset( $_GET['tab'] ) or ( 'urls' == $_GET['tab'] ) ) {
			$page_data->render_screenshot_table();
		}
		//# General settings tab
		?>

		<div id="empty-url-backlinks-modal" class="modal urlslab-modal d-none">
			<div>
				<h2>Referrer</h2>
				<button data-close-modal-id="empty-url-backlinks-modal" class="modal-close">
					<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>"
						 alt="info"
						 width="17px">
				</button>
			</div>
			<div id="modal-content">
			</div>
		</div>

	</section>
</div>
