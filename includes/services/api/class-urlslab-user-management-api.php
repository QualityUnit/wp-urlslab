<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/services/api/class-urlslab-api.php';

class Urlslab_User_Management_Api extends Urlslab_Api {

	public function confirm_api_key(): bool {
		return 200 == $this->urlslab_get_response(
			$this->base_url . 'manage/validation',
			''
		)[0];
	}

}
