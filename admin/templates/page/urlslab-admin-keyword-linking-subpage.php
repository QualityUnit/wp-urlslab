<?php
//# Internal Linking tab
$page_data = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'keyword-linking' == $_GET['tab'] ) ) {
	$page_data->render_subpage();
}
?>

