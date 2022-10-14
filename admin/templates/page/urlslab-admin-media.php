<?php
?>
<div class="urlslab-wrap">
	<?php require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-offloading-subpage.php'; ?>
		<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-lazyload-subpage.php'; ?>
	</section>
	<div id="empty-url-backlinks-modal" class="modal urlslab-modal d-none">
		<div>
			<h2>Where is keyword generated?</h2>
			<button data-close-modal-id="empty-url-backlinks-modal" class="modal-close">
				<img src="<?php echo esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ); ?>"
					 alt="info"
					 width="17px">
			</button>
		</div>
		<div id="modal-content">
		</div>
	</div>

</div>

