<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-header-seo' );
		$user = Urlslab_User_Widget::get_instance();
		?>

		<div id="urlslab-active-accordion" class="accordion col-12">

			<!-- Section 1 -->
			<div class="urlslab-accordion-header col-12">
				<div>
					<h3>Settings</h3>
				</div>
			</div>
			<div class="urlslab-card-container">
				<div class="urlslab-card-content">
					<?php
					$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-meta-tag' );
					require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
					?>
					<br class="clear">
					<br class="clear">
					<?php $page_data->render_widget_form(); ?>
				</div>
			</div>

			<!-- Section 2 -->
			<div class="urlslab-accordion-header col-12">
				<h3>Explanation</h3>
			</div>
			<div class="urlslab-card-container">
				<div class="urlslab-card-content">
					<div class="mar-bottom-1">
						Generate Meta tags automatically from the content summary of your pages. Activate the plugin
						and sit back. never worry about a missing meta description or OG tags.
					</div>
					<figure style="display: flex">
						<img width="60%"
							 src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/sc-meta.png' ) . 'sc-meta.png' ); ?>"
							 alt="demo screenshot">
						<img width="40%"
							 src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/og-demo.png' ) . 'og-demo.png' ); ?>"
							 alt="demo screenshot">
					</figure>
				</div>
			</div>
		</div>
	</section>
</div>

