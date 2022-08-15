<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'related-resource' == $_GET['tab'] ) {
	?>
	<div id="urlslab-vertical-tabs" class="urlslab-container-shadow urlslab-ui-tabs-vertical">
		<ul class="urlslab-tab-topic">
			<li><a href="#fragment-1"><span>Overview</span></a></li>
		</ul>
		<div id="fragment-1">
			<div class="urlslab-tab-content-heading">
				<h3>How it Works?</h3>
				<?php
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-related-resources' );
				require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
				?>
			</div>
			<p>Generate Nice Related resources in your pages to increase your Internal Link building.</p>
			<div class="urlslab-accordion-header col-12">
				<h3>How to Integrate?</h3>
			</div>
			<div class="urlslab-card-container">
				<div class="urlslab-card-content">
					<div class="mar-bottom-1">
						<div>
							Use one of the following shortcodes to generate the related resources automatically.
						</div>
						<code>
							<?php echo esc_html( '[urlslab-related-resources url="<URL-HERE>" related-count="<COUNT-OF-RELATED-RESOURCE>" show-image="<TRUE|FALSE>" default-image=""]' ); ?>
						</code>
						<h4>Attributes:</h4>
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
	</div>
	<?php
	$page_data->render_subpage();
}
//# Internal Linking tab
?>

<?php
//# Modal for import/export of goods
?>
