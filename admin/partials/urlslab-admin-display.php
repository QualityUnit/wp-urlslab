<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-available-widgets.php';
?>

<div class="wrap">

	<h1>
	<?php

	function urlslab_load_add_widgets_page() {
		$current_action = '';
		if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
			$current_action = $_REQUEST['action'];
		}

		$available_widgets = Urlslab_Available_Widgets::get_instance();

		if ( isset( $_REQUEST['widget'] )
			 and $available_widgets->widget_exists( $_REQUEST['widget'] ) ) {
			$widget = $available_widgets->get_widget( $_REQUEST['widget'] );
			$widget->widget_configuration_response( $current_action );
		}
	}

	urlslab_load_add_widgets_page();
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

	$widget = isset( $_REQUEST['widget'] )
		? $available_widgets->get_widget( $_REQUEST['widget'] )
		: null;


	if ( $widget ) {
		$message = isset( $_REQUEST['message'] ) ? $_REQUEST['message'] : '';
		$widget->admin_notice( $message );

		$available_widgets->list_widgets( $current_action, $widget );
	} else {
		$available_widgets->list_widgets( $current_action );
	}

	?>
</div>
