<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/urlslab-widget.php';

class Urlslab_Screenshot_Widget implements Urlslab_Widget {

	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	// TODO - add services
	private Urlslab_Service $service;

	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description ) {
		$this->widget_slug = $widget_slug;
		$this->widget_title       = $widget_title;
		$this->widget_description = $widget_description;
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

}
