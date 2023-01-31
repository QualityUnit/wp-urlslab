<?php

class Urlslab_User_Management_Api extends Urlslab_Api {

	private int $installation_id;

	public function __construct( int $installation_id ) {
		parent::__construct();
		$this->installation_id = $installation_id;
	}

	public function confirm_api_key(): bool {
		return 200 == $this->urlslab_get_response( $this->base_url . 'manage/validation/' . $this->installation_id, '' )[0];
	}

}
