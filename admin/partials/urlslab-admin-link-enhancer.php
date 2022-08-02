<?php
?>
<?php
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'link-enhancer' == $_GET['tab'] ) {

	?>


	<div id="urlslab-active-accordion" class="accordion col-12">

		<!-- Section 1 -->
		<div class="urlslab-accordion-header col-12">
			<div>
				<h3>Explanation</h3>
				<?php
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
				require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
				?>
			</div>
		</div>
		<div class="urlslab-card-container">
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

		<!-- Section 2 -->
		<div class="urlslab-accordion-header col-12">
			<h3>Settings</h3>
		</div>
		<div class="urlslab-card-container"></div>

	</div>
<?php } ?>
