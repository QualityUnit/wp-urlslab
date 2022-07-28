<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-content-seo' );
$user = Urlslab_User_Widget::get_instance();
if ( isset( $_GET['tab'] ) and 'related-resource' == $_GET['tab'] ) {
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
				Generate Nice Related resources in your pages to increase your Internal Link building.
			</div>
		</div>
	</div>
	<div class="urlslab-card-container col-12">
		<div class="urlslab-card-header">
			<h3>How to Integrate?</h3>
		</div>
		<div class="urlslab-card-content">
			<div class="mar-bottom-1">
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

	<?php
	$page_data->render_subpage();
}
//# Internal Linking tab
?>

<?php
//# Modal for import/export of goods
?>
