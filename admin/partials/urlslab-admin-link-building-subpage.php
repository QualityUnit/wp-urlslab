<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-content-seo' );
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'link-building' == $_GET['tab'] ) ) {
	?>

    <div id="urlslab-collapsed-accordion" class="accordion col-12">

        <!-- Section 1 -->
        <div class="urlslab-accordion-header col-12">
            <div>
                <h3>Settings</h3>
				<?php
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-keywords-links' );
				require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
				?>
            </div>
        </div>
        <div class="urlslab-card-container">
            <div class="urlslab-card-content">
	            <?php $this->link_building_subpage->render_settings(); ?>
            </div>
        </div>

        <!-- Section 2 -->
        <div class="urlslab-accordion-header col-12">
            <h3>Explanation</h3>
        </div>
        <div class="urlslab-card-container">
            <div class="urlslab-card-content">
                <div class="mar-bottom-1">
                    Generate Internal links automatically based on the keywords you provide in here
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
