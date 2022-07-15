<?php

class Urlslab_Url_Keyword_Data {

	private string $keyword;
	private int $keyword_priority;
	private int $keyword_length;
	private string $keyword_url_lang;
	private string $keyword_url_link;
	private string $keyword_url_filter;

	/**
	 * @param string $keyword
	 * @param int $keyword_priority
	 * @param int $keyword_length
	 * @param string $keyword_url_lang
	 * @param string $keyword_url_link
	 * @param string $keyword_url_filter
	 */
	public function __construct( string $keyword, int $keyword_priority, int $keyword_length, string $keyword_url_lang, string $keyword_url_link, string $keyword_url_filter ) {
		$this->keyword          = $keyword;
		$this->keyword_priority = $keyword_priority;
		$this->keyword_length   = $keyword_length;
		$this->keyword_url_lang = $keyword_url_lang;
		$this->keyword_url_link = $keyword_url_link;
		$this->keyword_url_filter = $keyword_url_filter;
	}

	/**
	 * @return string
	 */
	public function get_kwMd5(): string {
		return md5($this->get_keyword() . '|' . $this->get_keyword_url_link() . '|' . $this->get_keyword_url_lang());
	}

	/**
	 * @return string
	 */
	public function get_keyword(): string {
		return $this->keyword;
	}

	/**
	 * @return int
	 */
	public function get_keyword_priority(): int {
		return $this->keyword_priority;
	}

	/**
	 * @return int
	 */
	public function get_keyword_length(): int {
		return $this->keyword_length;
	}

	/**
	 * @return string
	 */
	public function get_keyword_url_lang(): string {
		return $this->keyword_url_lang;
	}

	/**
	 * @return string
	 */
	public function get_keyword_url_link(): string {
		return $this->keyword_url_link;
	}

	/**
	 * @return string
	 */
	public function get_keyword_url_filter(): string {
		return $this->keyword_url_filter;
	}

}
