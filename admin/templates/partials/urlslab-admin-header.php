<?php
$urlslab_page_title = '';
$page_tabs = array();
$activated_tab_slug = '';
if ( isset( $_GET['page'] ) ) {
	$urlslab_page_factory = Urlslab_Page_Factory::get_instance();
	$page_entity = $urlslab_page_factory->get_page( $_GET['page'] );
	if ( ! is_null( $page_entity ) ) {
		$activated_tab_slug = $page_entity->get_active_page_tab();
		$page_tabs = $page_entity->get_page_tabs();
		$urlslab_page_title = $page_entity->get_page_title();
	}
}
?>
<?php
if ( ! empty( $page_tabs ) ) {
	?>
	<div>
		<ul class="urlslab-tab-container">
			<?php
			foreach ( $page_tabs as $tab_slug => $tab_name ) {
				?>
				<li class="urlslab-tab-item<?php echo $activated_tab_slug == $tab_slug ? ' active' : ''; ?>">
					<a href="<?php echo esc_url( $page_entity->menu_page( $tab_slug ) ); ?>">
						<?php echo esc_html( $tab_name ); ?>
					</a>
				</li>
				<?php
			}
			?>
		</ul>
	</div>
	<?php

}
?>
<?php
//# notifications
if ( isset( $_REQUEST['status'] ) ) {
	echo urlslab_admin_notice( $_REQUEST['status'], $_REQUEST['urlslab-message'] ?? '' ); // phpcs:ignore
}
//# notifications
?>

<nav class="urlslab-header">
	<div class="urlslab-header-content-container">
		<figure>
			<?php $logo_url = plugin_dir_url( URLSLAB_PLUGIN ) . 'admin/assets/logo.svg'; ?>
			<img src="<?php echo esc_url( $logo_url ); ?>" width="100%" alt="URLsLab Logo">
		</figure>
		<div>
			<h1><?php echo esc_html( $urlslab_page_title ); ?></h1>
		</div>
	</div>
</nav>
