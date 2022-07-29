<?php
?>
<?php
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'link-enhancer' == $_GET['tab'] ) {

	?>
	<div class="urlslab-card-container col-12">
		<?php
		$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
		require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
		?>
		<div class="urlslab-card-content">
			<div class="mar-bottom-1">
				Enhance all your links in your pages with Link Enhancer widget with one click:
				<ul>
					<li>
						Add title attribute to all your links in the pages automatically based on the destination
						url that the link is point to.
					</li>
				</ul>
			</div>
		</div>
	</div>
<?php } ?>
