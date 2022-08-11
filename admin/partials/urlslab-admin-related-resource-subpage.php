<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'related-resource' == $_GET['tab'] ) {
	?>



	<div id="urlslab-collapsed-accordion" class="accordion col-12">

		<!-- Section 1 -->
		<div class="urlslab-accordion-header col-12">
			<div>
				<h3>Explanation</h3>
			</div>
		</div>
		<div class="urlslab-card-container">
			<div class="urlslab-card-content">
				Generate Nice Related resources in your pages to increase your Internal Link building.
			</div>
		</div>

		<!-- Section 2 -->
		<div class="urlslab-accordion-header col-12">
			<h3>How to Integrate?</h3>
		</div>
		<div class="urlslab-card-container">
			<div class="urlslab-card-content">
				<div class="mar-bottom-1">
					<?php
					$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-related-resources' );
					require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
					?>
					<br class="clear">
					<br class="clear">
					<div>
						Use one of the following shortcodes to generate the related resources automatically.
					</div>
					<code>
						<?php echo esc_html( '[urlslab-related-resources url="<URL-HERE>" related-count="<COUNT-OF-RELATED-RESOURCE>" show-image="<TRUE|FALSE>" default-image=""]' ); ?>
					</code>
					<h2>Attributes:</h2>
					<ul>
						<li>
							url => url that the user wants the related resources of (it usually should be current url, user doesn't have to usually set this) => by default its the current url where the shortcode is integrated
						</li>
						<li>
							related-count => the count of maximum related resources that the user wants to embed in the page => by default its 8
						</li>
						<li>
							show-image => whether to show a thumbnail of the destination URL next to each related resource => by default false
						</li>
						<li>
							default-image => default image shown as thumbnail in case the destination URL still doesn't exist => by default its empty
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<?php
	$page_data->render_subpage();
}
//# Internal Linking tab
?>

<?php
//# Modal for import/export of goods
?>
