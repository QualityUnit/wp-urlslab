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
	const SETTING_NAME_GSC_IMPORT = 'urlslab-import-gsc';
	const SETTING_NAME_GSC_LIMIT = 'urlslab-gsc-limit';
	const SETTING_NAME_QUERY_TYPES = 'urlslab-query-types';

	public static function get_available_query_types() {
		return array(
			Urlslab_Serp_Query_Row::TYPE_GSC    => __( 'Google Search Console' ),
			Urlslab_Serp_Query_Row::TYPE_USER   => __( 'Manually created by User' ),
			Urlslab_Serp_Query_Row::TYPE_SYSTEM => __( 'Suggested by Google' ),
		);
	}

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

		$this->add_options_form_section( 'google_sgc', __( 'Google Search Console' ), __( 'Integrate your Google Search Console to get most up to date stats about your urls. Visit https://www.urlslab.com/dashboard/ and connect Google Search Console in Integrations menu.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_GSC_IMPORT,
			true,
			false,
			__( 'Import Google Search Console Data' ),
			__( 'Import daily stats like clicks, impressions, CTR and average position about each of your URL and query' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'google_sgc',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_LIMIT,
			10000,
			false,
			__( 'Stop importing GSC data if reached limit' ),
			__( 'Cease importing new queries once the total number of queries in your database reaches the limit. This acts as a safeguard against excessive number of rows in your database.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc'
		);


		$this->add_options_form_section( 'import', __( 'Import SERP queries' ), __( 'Specify how new queries are imported from SERP results. Make sure you select reasonable amount of domains and other limits, because this feature can eat your credits fast.' ) );

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
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_LIMIT,
			300,
			false,
			__( 'Stop importing from SERP API related queries if reached limit' ),
			__( 'Cease importing new related queries once the total number of queries in your database reaches the limit. This acts as a safeguard against excessive costs, as the volume of imported queries can escalate quickly.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION,
			15,
			false,
			__( 'Process Google results up to position' ),
			__( 'Enter number 1 - 100. Reasonable value will be between 5 - 30. Query entities will be processed only in case one of defined domains ranks for keyword in TOP X results. Setting this number lower will improve quality, but higher number will discover more new queries.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_QUERY_TYPES,
			array( Urlslab_Serp_Query_Row::TYPE_USER ),
			false,
			__( 'Process Query Types' ),
			__( 'Load SERP data just for selected query types.' ),
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function() {
				return self::get_available_query_types();
			},
			function( $value ) {
				if ( ! is_array( $value ) ) {
					return false;
				}

				$possible_values = self::get_available_query_types();
				foreach ( $value as $v ) {
					if ( ! isset( $possible_values[ $v ] ) ) {
						return false;
					}
				}

				return true;
			},
			'import'
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
