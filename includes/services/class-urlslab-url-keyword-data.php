<?php

class Urlslab_Url_Keyword_Data {

	private string $kw_id;
	private string $keyword;
	private int $keyword_priority;
	private int $keyword_length;
	private string $keyword_url_lang;
	private string $keyword_url_link;
	private string $keyword_url_filter;
	private int $keyword_usage_count;

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
	public function __construct( array $data ) {
		$keyword_prio = 10;
		$keyword_lang = 'all';
		$keyword_filter = '.*';
		$keyword_usage_count = 0;

		if ( ! isset( $data['keyword'] ) || empty( $data['keyword'] ) || ! is_string( $data['keyword'] ) ) {
			throw new Exception( 'Keyword is empty' );
		}

		if ( ! isset( $data['urlLink'] ) || empty( $data['urlLink'] ) ) {
			throw new Exception( 'keyword link is empty' );
		}

		if ( isset( $data['kw_priority'] ) && null != $data['kw_priority'] ) {
			if ( ! is_numeric( $data['kw_priority'] ) ) {
				throw new Exception( 'Keyword Priority is not a number' );
			} else if ( $data['kw_priority'] < 0 ) {
				throw new Exception( 'Keyword Priority should be a number higher as 0' );
			}
			$keyword_prio = $data['kw_priority'];
		}

		if ( isset( $data['lang'] ) && null != $data['lang'] ) {
			$keyword_lang = $data['lang'];
		}

		if ( isset( $data['urlFilter'] ) && null != $data['urlFilter'] ) {
			$keyword_filter = $data['urlFilter'];
		}

		if ( isset( $data['keywordCountUsage'] ) && null != $data['keywordCountUsage'] ) {
			$keyword_usage_count = $data['keywordCountUsage'];
		}

		$this->kw_id = $data['kw_id'] ?? '';
		$this->keyword = $data['keyword'];
		$this->keyword_priority = $keyword_prio;
		$this->keyword_length = $data['kw_length'] ?? strlen( $data['keyword'] );
		$this->keyword_url_lang = $keyword_lang;
		$this->keyword_url_link = $data['urlLink'];
		$this->keyword_url_filter = $keyword_filter;
		$this->keyword_usage_count = $keyword_usage_count;
	}

	/**
	 * @return string
	 */
	public function get_kw_id(): string {
		if ( ! empty( $this->kw_id ) ) {
			return $this->kw_id;
		}
		return crc32( md5( $this->get_keyword() . '|' . $this->get_keyword_url_link() . '|' . $this->get_keyword_url_lang() ) );
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

	/**
	 * @return int
	 */
	public function get_keyword_usage_count(): int {
		return $this->keyword_usage_count;
	}

}
