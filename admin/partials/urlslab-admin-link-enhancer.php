<?php
?>
<?php
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'link-enhancer' == $_GET['tab'] ) {

	?>
	<div class="urlslab-card-container col-12">
		<div class="urlslab-card-header">
			<h3>Settings</h3>
			<?php
			if ( $user->is_widget_activated( 'urlslab-keywords-links' ) ) {
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
