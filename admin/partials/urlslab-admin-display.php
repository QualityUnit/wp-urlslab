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

	Urlslab_Available_Widgets::list_widgets();

	?>
</div>
