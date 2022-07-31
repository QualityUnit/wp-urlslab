<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/driver/class-urlslab-driver.php';

class Urlslab_Driver_S3 extends Urlslab_Driver {

	function get_file_content( Urlslab_File_Data $file_obj ) {
		return '';
		// TODO: read file content from S3
	}

	function output_file_content( Urlslab_File_Data $file_obj ) {
		// TODO: Implement output_file_content() method.
	}

	function save_to_storage( Urlslab_File_Data $file_obj, string $local_file_name ) {
		// TODO: Implement save_to_storage() method.
	}

	public function get_url( Urlslab_File_Data $file ) {
		// TODO: Implement get_url() method.
	}
}
