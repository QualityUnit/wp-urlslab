<?php

abstract class Urlslab_Cache_Driver {

	abstract public function is_active();

	abstract public function set( $key, $content, $group = '' ): bool;

	abstract public function get( $key, $group = '', &$found = null, $allowed_classes = false );

	abstract public function delete( $key, $group = '' ): bool;

	abstract public function delete_group( $group = '' ): bool;
}
