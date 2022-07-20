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
				$user = Urlslab_User_Widget::get_instance();
				if ( ! $user->has_api_key() ) {

					?>
					<p>input your API Key here!</p>
					<?php
				}

				$available_widgets = Urlslab_Available_Widgets::get_instance();
				$current_action = '';
				if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
					$current_action = $_REQUEST['action'];
				}
				$user->render_form();
				?>
			</div>
		</div>
	</section>
</div>
