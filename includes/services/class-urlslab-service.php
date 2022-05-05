<?php

/**
 * Abstract class for services.
 *
 * Only instances of this class's subclasses are allowed to be
 * listed on the Integration page.
 */
abstract class Urlslab_Service {

	abstract public function get_title();
	abstract public function is_active();

}

