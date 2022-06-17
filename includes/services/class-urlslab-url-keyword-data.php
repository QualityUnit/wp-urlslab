<?php

class Urlslab_Url_Keyword_Data {

	private string $keyword;
	private string $keyword_priority;
	private int $keyword_length;
	private int $keyword_url_lang;
	private string $keyword_url_link;

	/**
	 * @param string $keyword
	 * @param string $keyword_priority
	 * @param int $keyword_length
	 * @param int $keyword_url_lang
	 * @param string $keyword_url_link
	 */
	public function __construct( string $keyword, string $keyword_priority, int $keyword_length, int $keyword_url_lang, string $keyword_url_link ) {
		$this->keyword          = $keyword;
		$this->keyword_priority = $keyword_priority;
		$this->keyword_length   = $keyword_length;
		$this->keyword_url_lang = $keyword_url_lang;
		$this->keyword_url_link = $keyword_url_link;
	}

	/**
	 * @return string
	 */
	public function get_keyword(): string {
		return $this->keyword;
	}

	/**
	 * @return string
	 */
	public function get_keyword_priority(): string {
		return $this->keyword_priority;
	}

	/**
	 * @return int
	 */
	public function get_keyword_length(): int {
		return $this->keyword_length;
	}

	/**
	 * @return int
	 */
	public function get_keyword_url_lang(): int {
		return $this->keyword_url_lang;
	}

	/**
	 * @return string
	 */
	public function get_keyword_url_link(): string {
		return $this->keyword_url_link;
	}

}
