<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		//# General settings tab
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-urls' );
		if ( ! isset( $_GET['tab'] ) or ( 'urls' == $_GET['tab'] ) ) {
			$page_data->render_screenshot_table();
		}
		//# General settings tab
		?>
	</section>
</div>
