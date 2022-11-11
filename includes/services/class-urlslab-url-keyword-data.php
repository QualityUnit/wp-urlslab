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
	private int $link_usage_count;
	private string $kw_type;

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
		$keyword_prio        = 10;
		$keyword_lang        = 'all';
		$keyword_filter      = '.*';
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
		if ( isset( $data['linkCountUsage'] ) && null != $data['linkCountUsage'] ) {
			$link_usage_count = $data['linkCountUsage'];
		}

		$this->kw_id               = $data['kw_id'] ?? '';
		$this->keyword             = $data['keyword'];
		$this->keyword_priority    = $keyword_prio;
		$this->keyword_length      = $data['kw_length'] ?? strlen( $data['keyword'] );
		$this->keyword_url_lang    = $keyword_lang;
		$this->keyword_url_link    = $data['urlLink'];
		$this->keyword_url_filter  = $keyword_filter;
		$this->keyword_usage_count = $keyword_usage_count;
		$this->link_usage_count    = $link_usage_count ?? 0;
		$this->kw_type              = $data['kwType'] ?? Urlslab_Keywords_Links::KW_MANUAL;
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
	public function get_keyword_type(): string {
		return $this->kw_type;
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

	/**
	 * @return int
	 */
	public function get_link_usage_count(): int {
		return $this->link_usage_count;
	}

	public static function create_keywords( array $keywords ): int {
		global $wpdb;
		$insert_placeholders = array();
		$insert_values       = array();
		foreach ( $keywords as $keyword ) {
			array_push(
				$insert_values,
				$keyword->get_kw_id(),
				$keyword->get_keyword(),
				$keyword->get_keyword_priority(),
				$keyword->get_keyword_length(),
				$keyword->get_keyword_url_lang(),
				$keyword->get_keyword_url_link(),
				$keyword->get_keyword_url_filter(),
				$keyword->get_keyword_type(),
			);
			$insert_placeholders[] = '(%d,%s,%d,%d,%s,%s,%s,%s)';
		}

		$insert_query = 'INSERT IGNORE INTO ' . URLSLAB_KEYWORDS_TABLE . ' (
                   kw_id,
                   keyword,
                   kw_priority,
                   kw_length,
                   lang,
                   urlLink,
                   urlFilter,
                   kwType)
                   VALUES ' . implode( ', ', $insert_placeholders ) . '
                   ON DUPLICATE KEY UPDATE
                   kw_priority = VALUES(kw_priority),
                   kw_length = VALUES(kw_length),
                   lang = VALUES(lang),
                   urlLink = VALUES(urlLink),
                   urlFilter = VALUES(urlFilter),
                   kwType = VALUES(kwType)';

		$result = $wpdb->query( $wpdb->prepare( $insert_query, $insert_values ) ); // phpcs:ignore

		Urlslab_Keywords_Links::keywords_changed();

		return $result;
	}

}
