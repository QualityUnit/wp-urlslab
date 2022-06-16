<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
?>

<div class="wrap">

	<h1>
	<?php

	echo esc_html( 'URLSLAB Widgets' );
	?>
		</h1>

	<p>
		<?php
		echo esc_html( 'Integrate URLSLAB widgets into your webpage' );
		?>
	</p>

	<?php

	$available_widgets = Urlslab_Available_Widgets::get_instance();
	$current_action = '';
	if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
		$current_action = $_REQUEST['action'];
	}

	$user = Urlslab_User_Widget::get_instance();
	?>
	<div class="card<?php echo $user->has_api_key() ? ' active' : ''; ?>">
		<h2 class="title"><?php echo esc_html( 'API Key' ); ?></h2>
	<div class="infobox">
		<?php echo $user->has_api_key() ? 'API Key inserted' : esc_html( 'To start, enter API Key' ); ?>.
		for more details see <a href="https://www.urlslab.com" target="_blank">
			Urlslab
		</a>
	</div>
	<br class="clear"/>
	<?php
	if ( 'setup' == $current_action and
					 isset( $_REQUEST['component'] ) and
				 'api-key' == $_REQUEST['component'] ) {
					$user->render_form();
	} else {
		?>
				<a class="button"
				   href="<?php echo esc_url( $user->get_api_conf_page_url( 'action=setup' ) ); ?>">
			<?= $user->has_api_key() ? esc_html( __( 'Change API Settings', 'urlslab' ) ) : esc_html( __( 'Setup Widget', 'urlslab' ) ); ?></a>

				<?php
	}
	?>
	</div>


<?php

if ( isset( $_REQUEST['component'] ) ) {
	$message = $_REQUEST['message'] ?? '';
	$user->admin_notice( $message );
}

?>
</div>
