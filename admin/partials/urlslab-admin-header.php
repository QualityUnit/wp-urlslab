<?php
$urlslab_page_title = '';
if ( isset( $_GET['page'] ) ) {
	$urlslab_page_factory = new Urlslab_Page_Factory();
	$page_entity = $urlslab_page_factory->get_page( $_GET['page'] );
	if ( ! is_null( $page_entity ) ) {
		$urlslab_page_title = $page_entity->get_page_title();
	}
}

?>
<header class="urlslab-header">
	<div class="urlslab-header-content-container">
		<figure>
			<?php $logo_url = plugin_dir_url( URLSLAB_PLUGIN ) . 'admin/assets/logo.svg'; ?>
			<img src="<?php echo esc_url( $logo_url ); ?>" alt="URLsLab Logo">
		</figure>
		<div>
			<h1>Dashboard</h1>
		</div>
	</div>
</header>
