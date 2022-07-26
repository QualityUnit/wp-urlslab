<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		//# meta description tab
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-header-widgets' );
		$user = Urlslab_User_Widget::get_instance();
		if ( ! isset( $_GET['tab'] ) or ( 'meta-tags' == $_GET['tab'] ) ) {
			?>
			<div class="urlslab-card-container col-12">
				<div class="urlslab-card-header">
					<h3>Explanation</h3>
					<?php
					if ( $user->is_widget_activated( 'urlslab-meta-tag' ) ) {
						?>
						<a class="urlslab-btn-error" href="#">Deactivate</a>
						<?php
					} else {
						?>
						<a class="urlslab-btn-success" href="#">Activate</a>
						<?php
					}
					?>
				</div>
				<div class="urlslab-card-content">
					<div class="mar-bottom-1">
						Generate Meta tags automatically from the content summary of your pages. Activate the plugin
						and sit back. never worry about a missing meta description or OG tags.
					</div>
					<figure style="display: flex">
						<img width="60%" src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/sc-meta.png' ) . 'sc-meta.png' ); ?>" alt="demo screenshot">
						<img width="40%" src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/og-demo.png' ) . 'og-demo.png' ); ?>" alt="demo screenshot">
					</figure>
				</div>
			</div>
			<?php
		}
		//# meta description tab

		//# meta OG tab
		?>
			<div class="urlslab-card-container col-12">
				<div class="urlslab-card-header">
					<h3>Settings</h3>
				</div>
				<div class="urlslab-card-content">
					<?php $page_data->render_widget_form(); ?>
				</div>
			</div>
			<?php
			//# meta OG tab
			?>
	</section>
</div>

