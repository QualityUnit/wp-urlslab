<?php

abstract class Urlslab_Cache_Driver {

	public abstract function is_active();

	public abstract function set( $key, $content, $group = '' ): bool;

	public abstract function get( $key, $group = '', &$found = null, $allowed_classes = false );

	public abstract function delete( $key, $group = '' ): bool;

	public abstract function delete_group( $group = '' ): bool;

}
