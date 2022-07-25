<?php
?>
<div class="urlslab-wrap">
	<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<div class="urlslab-card-container col-12">
			<div class="urlslab-card-header">
				<h3>API Key</h3>
			</div>
			<div class="urlslab-card-content">
				<?php
				$page_data = new Urlslab_General_Settings_Page();
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
	</section>
</div>
