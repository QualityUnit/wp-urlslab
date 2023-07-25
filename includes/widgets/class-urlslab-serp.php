<?php

// phpcs:disable WordPress

class Urlslab_Serp extends Urlslab_Widget {
	public const SLUG = 'serp';
	const SETTING_NAME_SERP_API = 'urlslab-serpapi';
	const SETTING_NAME_IMPORT_FAQS = 'urlslab-import-faqs';
	const SETTING_NAME_IMPORT_RELATED_QUERIES = 'urlslab-import-rel-queries';
	const SETTING_NAME_SYNC_FREQ = 'urlslab-serp-sync-freq';
	const SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION = 'urlslab-import-rel-q-position';
	const SETTING_NAME_IMPORT_LIMIT = 'urlslab-import-limit';
	const SETTING_NAME_SERP_COMPETITOR_DOMAINS = 'urlslab-serp-comp-domains';
	const SETTING_NAME_SERP_MY_DOMAINS = 'urlslab-serp-my-domains';

	private $competitor_domains = array();
	private $my_domains = array();

	public function init_widget() {}

	public function get_widget_slug(): string {
		return Urlslab_Serp::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'SERP Monitoring' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor position of your website in search engine results for specific keywords.' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_PAID );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	private function get_domains_from_string( string $str_domains ): array {
		$arr_domains = preg_split( '/(,|\n|\t)\s*/', $str_domains );
		$domains     = array();
		foreach ( $arr_domains as $domain ) {
			$domain = trim( $domain );
			if ( strlen( $domain ) ) {
				try {
					$domain_url                              = new Urlslab_Url( $domain, true );
					$domains[ $domain_url->get_domain_id() ] = $domain_url->get_domain_name();
				} catch ( Exception $e ) {
				}
			}
		}

		return $domains;
	}

	public function get_competitor_domains(): array {
		if ( empty( $this->competitor_domains ) ) {
			$this->competitor_domains = $this->get_domains_from_string( $this->get_option( Urlslab_Serp::SETTING_NAME_SERP_COMPETITOR_DOMAINS ) );
		}

		return $this->competitor_domains;
	}

	public function get_my_domains(): array {
		if ( empty( $this->my_domains ) ) {
			$this->my_domains = $this->get_domains_from_string( $this->get_option( Urlslab_Serp::SETTING_NAME_SERP_MY_DOMAINS ) );
		}

		return $this->my_domains;
	}

	protected function add_options() {
		$this->add_options_form_section( 'serpapi', __( 'SERP Data' ), __( 'SERP data synchronization helps you to monitor position of websites for specific keywords and analyze content clusters of your website.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_SERP_API,
			false,
			false,
			__( 'SERP data synchronization' ),
			__( 'Periodically update positions of top 100 urls for monitored keywords' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'serpapi'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_FREQ,
			Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY,
			false,
			__( 'Update Frequency' ),
			__( 'Define how often we should sync SERP data. Each query update request is charged, choose wisely.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_DAILY    => __( 'Daily' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_WEEKLY   => __( 'Weekly' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY  => __( 'Monthly' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_ONE_TIME => __( 'No updates, load just once' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY   => __( 'Yearly' ),
			),
			function( $value ) {
				$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();

				return in_array( $value, $request->getNotOlderThanAllowableValues() );
			},
			'serpapi'
		);


		$this->add_options_form_section( 'import', __( 'Import SERP queries' ), __( 'Specify how new queries are imported from SERP results. Make sure you select reasonable amount of domains and other limits, because this feature can eat your credits fast.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_SERP_MY_DOMAINS,
			'',
			false,
			__( 'My Domains' ),
			__( 'Comma or new line separated list of my domains. If none of domains ranks in top 100 for specific query, query is marked as Skipped - means it is not relevant query to your business.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_COMPETITOR_DOMAINS,
			'',
			false,
			__( 'Competitor Domains' ),
			__( 'Comma or new line separated list of domains. Recommendation: Include all domains of your direct competitors. It will help you to discover new keywords and FAQs you should include into your website content. If none of these domains ranks in top 100 for specific query, query is marked as Skipped - means it is not relevant query to your business.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION,
			15,
			false,
			__( 'Filter TOP X results' ),
			__( 'Enter number 1 - 100. Reasonable value will be between 5 - 30. Query entities will be processed only in case one of defined domains ranks for keyword in TOP X results. Setting this number lower will improve quality, but higher number will discover more new queries.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_LIMIT,
			300,
			false,
			__( 'Limit queries' ),
			__( 'Cease importing new queries once the total number in your database reaches the limit. This acts as a safeguard against excessive costs, as the volume of imported queries can escalate quickly.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'import'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES,
			false,
			false,
			__( 'Import Related Queries' ),
			__( 'Automatically build list of queries by importing Related Searches from Google Results for monitored queries. IMPORTANT: by activating this option you agree with processing of huge amount of SERP api requests leading to extra costs for evaluation of each relevant query.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import',
			array( self::LABEL_EXPERT )
		);

		$this->add_options_form_section( 'import_faq', __( 'Import Frequently Asked Questions' ), __( 'URLsLab can automatically import FAQ entries from SERP results' ) );
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS,
			false,
			false,
			__( 'Import FAQs' ),
			__( 'Import FAQS for analyzed keywords automatically and store them to Frequently Asked Questions module.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
	}
}
