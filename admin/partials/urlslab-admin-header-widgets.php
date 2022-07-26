<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		//# General settings tab
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-general' );
		if ( ! isset( $_GET['tab'] ) or ( 'meta-description' == $_GET['tab'] ) ) {
			?>
			<div class="urlslab-card-container col-12">
				<div class="urlslab-card-header">
					<h3>Explanation</h3>
				</div>
				<div class="urlslab-card-content">
					<div class="mar-bottom-1">
						Generate Meta description automatically from the content summary of page
					</div>
					<figure>
						<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/sc-meta.png' ) . 'sc-meta.png' ); ?>" alt="demo screenshot">
					</figure>
				</div>
			</div>
			<?php
		}
		//# General settings tab
		?>
	</section>
</div>

