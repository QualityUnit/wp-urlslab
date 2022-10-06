<?php
?>
<div class="urlslab-wrap">
	<?php require URLSLAB_PLUGIN_DIR . '/admin/templates/partials/urlslab-admin-header.php'; ?>
	<section class="urlslab-content-container">
		<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-keyword-linking-subpage.php'; ?>
		<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-related-resource-subpage.php'; ?>
		<?php require plugin_dir_path( __FILE__ ) . 'urlslab-admin-link-management.php'; ?>
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

