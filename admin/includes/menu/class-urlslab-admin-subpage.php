<?php

abstract class Urlslab_Admin_Subpage {

	/**
	 * @return void renders the buttons used at top for managing widget
	 */
	abstract public function render_manage_buttons();

	/**
	 * @return void renders the tables
	 */
	abstract public function render_tables();

	/**
	 * @return void renders the modals for the current subpage
	 */
	abstract public function render_modals();

	/**
	 * @return void renders the ui for editing and reading settings
	 */
	abstract public function render_settings();

	/**
	 * @return void used to specify screen options for table
	 */
	abstract public function set_table_screen_options();

	/**
	 * @return void used for handling actions related to sub page
	 */
	abstract public function handle_action();

}
