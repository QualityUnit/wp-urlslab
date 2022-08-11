<?php
?>

<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php
		//# General settings tab
		$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-integrations' );
		if ( ! isset( $_GET['tab'] ) or ( 'api-key' == $_GET['tab'] ) ) {
			?>
			<div class="urlslab-card-container col-12">
				<div class="urlslab-card-header">
					<h3>API Key</h3>
				</div>
				<div class="urlslab-card-content">
					<?php
					$user = Urlslab_User_Widget::get_instance();
					if ( ! $user->has_api_key() ) {
						?>
						<p>input your API Key here!</p>
						<?php
					} else {
						?>
						<p>There is already an API Key</p>
						<?php
					}
					$page_data->render_apikey_form();
					?>
				</div>
			</div>
			<?php
		}
		//# General settings tab
		?>
	</section>
</div>

