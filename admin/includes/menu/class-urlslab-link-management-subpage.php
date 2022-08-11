<?php

class Urlslab_Link_Management_Subpage extends Urlslab_Admin_Subpage {

	private Urlslab_Admin_Page $parent_page;
	private string $subpage_slug;

	public function __construct( $parent_page ) {
		$this->parent_page = $parent_page;
		$this->subpage_slug = 'link-management';
	}

	public function handle_action() {
		if ( isset( $_SERVER['REQUEST_METHOD'] ) and
			 'POST' === $_SERVER['REQUEST_METHOD'] and
			 isset( $_REQUEST['action'] ) and
			 - 1 != $_REQUEST['action'] ) {

			//# Widget Settings
			if ( isset( $_POST['submit'] ) &&
				'Save Changes' === $_POST['submit'] ) {
				check_admin_referer( 'link-management-settings' );

				if ( isset( $_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] ) &&
				! empty( $_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] ) ) {
					update_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, $_POST[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] );
				}

				if ( ! isset( $_POST['link-management'] ) ) {
					update_option( Urlslab_Link_Enhancer::SETTING_NAME_URLS_MAP, 0 );
					update_option( Urlslab_Link_Enhancer::SETTING_NAME_REMOVE_LINKS, 0 );
				} else {
					$link_enhancer = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
					$widgets = $link_enhancer->get_widget_settings();
					unset( $widgets[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ] );
					foreach ( $widgets as $setting => $setting_val ) {
						update_option( $setting, in_array( $setting, $_POST['link-management'] ) ? 1 : 0 );
					}
				}           
			}
			//# Widget Settings

		}
	}

	public function render_manage_buttons() {}

	public function render_tables() {}

	public function render_modals() {}

	public function render_settings() {
		$widget_settings = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' )
																	->get_widget_settings();
		?>
		<div class="col-8 mar-top-1">
			<form method="post">
				<?php wp_nonce_field( 'link-management-settings' ); ?>
				<input type="hidden" name="action" value="update-settings">
				<div class="col-3 float-left">
					<label for="remove-links">
						Hide Links
					</label>
				</div>
				<div class="col-3 float-left">
					<input id="remove-links"
						   name="link-management[]"
						   value="<?php echo esc_attr( Urlslab_Link_Enhancer::SETTING_NAME_REMOVE_LINKS ); ?>"
						   type="checkbox"
						<?php
						if ( 1 == $widget_settings[ Urlslab_Link_Enhancer::SETTING_NAME_REMOVE_LINKS ] ) {
							echo 'checked';
						}
						?>
					>
				</div>
				<br class="clear"/>
				<br class="clear"/>
				<div class="col-3 float-left">
					<label for="url-map">
						Generate Url Map
					</label>
				</div>
				<div class="col-3 float-left">
					<input id="url-map"
						   name="link-management[]"
						   value="<?php echo esc_attr( Urlslab_Link_Enhancer::SETTING_NAME_URLS_MAP ); ?>"
						   type="checkbox"
						<?php
						if ( 1 == $widget_settings[ Urlslab_Link_Enhancer::SETTING_NAME_URLS_MAP ] ) {
							echo 'checked'; }
						?>
					>
				</div>
				<br class="clear"/>
				<br class="clear"/>
				<div class="col-3 float-left">
					<label for="desc-replacement">
						Description generation
					</label>
				</div>
				<div class="col-3 float-left">
					<?php $current_replacement_strategy = $widget_settings[ Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ]; ?>
					<select name="<?php echo esc_attr( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY ); ?>" id="desc-replacement">
						<option value="<?php echo esc_attr( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ); ?>"
							<?php
							if ( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY == $current_replacement_strategy ) {
								echo ' selected';}
							?>
						>Generate descriptions with summaries</option>
						<option value="<?php echo esc_attr( Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION ); ?>"
							<?php
							if ( Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION == $current_replacement_strategy ) {
								echo ' selected';
							}
							?>
						>Generate descriptions with meta description</option>
						<option value="<?php echo esc_attr( Urlslab_Link_Enhancer::DESC_TEXT_TITLE ); ?>"
							<?php
							if ( Urlslab_Link_Enhancer::DESC_TEXT_TITLE == $current_replacement_strategy ) {
								echo ' selected';
							}
							?>
						>Generate descriptions with Url title</option>
						<option value="<?php echo esc_attr( Urlslab_Link_Enhancer::DESC_TEXT_URL ); ?>"
							<?php
							if ( Urlslab_Link_Enhancer::DESC_TEXT_URL == $current_replacement_strategy ) {
								echo ' selected';
							}
							?>
						>Generate descriptions with Url path</option>
					</select>
				</div>
				<br class="clear"/>
				<br class="clear"/>
				<input class="button button-primary" type="submit" name="submit" value="Save Changes">
			</form>
		</div>
		<?php
	}

	public function set_table_screen_options() {}

}
