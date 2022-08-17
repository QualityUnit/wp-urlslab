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
	 *
	 * @throws Exception
	 */
	public function __construct( $keyword, $keyword_priority, $keyword_length, $keyword_url_lang, $keyword_url_link, $keyword_url_filter ) {
		if ( empty( $keyword ) && ! is_string( $keyword ) ) {
			throw new Exception( 'Keyword is empty' );}
		if ( ! is_numeric( $keyword_priority ) ) {
			throw new Exception( 'Keyword Priority is not a number' );
		} else if ( $keyword_priority < 0 ) {
			throw new Exception( 'Keyword Priority should be a number higher as 0' );
		}
		if ( ! is_numeric( $keyword_length ) ) {
			throw new Exception( 'Keyword length is not a number' );
		}

		if ( empty( $keyword_url_lang ) ) {
			throw new Exception( 'Keyword language is empty' );
		}
		if ( empty( $keyword_url_link ) ) {
			throw new Exception( 'keyword link is empty' );
		}
		if ( empty( $keyword_url_filter ) ) {
			throw new Exception( 'keyword Url Filter is empty' );
		}

		$this->keyword = $keyword;
		$this->keyword_priority = $keyword_priority;
		$this->keyword_length = $keyword_length;
		$this->keyword_url_lang = $keyword_url_lang;
		$this->keyword_url_link = $keyword_url_link;
		$this->keyword_url_filter = $keyword_url_filter;
	}

	/**
	 * @return string
	 */
	public function get_kw_md5(): string {
		return md5( $this->get_keyword() . '|' . $this->get_keyword_url_link() . '|' . $this->get_keyword_url_lang() );
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
