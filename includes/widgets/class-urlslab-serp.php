<?php

// phpcs:disable WordPress

class Urlslab_Serp extends Urlslab_Widget {
	public const SLUG = 'serp';
	const SETTING_NAME_SERP_API = 'urlslab-serpapi';
	const SETTING_NAME_IMPORT_FAQS = 'urlslab-import-faqs';
	const SETTING_NAME_IMPORT_RELATED_QUERIES = 'urlslab-import-rel-queries';
	const SETTING_NAME_SYNC_FREQ = 'urlslab-serp-sync-freq';
	const SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION = 'urlslab-import-rel-q-position';
	const SETTING_NAME_SERP_IMPORT_LIMIT = 'urlslab-import-limit';
	const SETTING_NAME_GSC_IMPORT = 'urlslab-import-gsc';
	const SETTING_NAME_GSC_LIMIT = 'urlslab-gsc-limit';
	const SETTING_NAME_QUERY_TYPES = 'urlslab-query-types';
	const SETTING_NAME_GSC_MIN_IMPRESSIONS = 'urlslab-gsc-min-impressions';
	const SETTING_NAME_GSC_MIN_CLICKS = 'urlslab-gsc-min-clicks';
	const SETTING_NAME_IRRELEVANT_QUERY_LIMIT = 'urlslab-irrelevant-query-limit';
	const SETTING_NAME_IMPORT_FAQS_AS_QUERY = 'urlslab-import-faqs-as-query';

	public static function get_available_query_types() {
		return array(
			Urlslab_Serp_Query_Row::TYPE_GSC          => __( 'Google Search Console' ),
			Urlslab_Serp_Query_Row::TYPE_USER         => __( 'Manually created by User' ),
			Urlslab_Serp_Query_Row::TYPE_SERP_RELATED => __( 'Suggested by Google' ),
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
		$this->add_options_form_section( 'google_sgc', __( 'Google Search Console' ), __( 'Integrate your Google Search Console to get most up to date stats about your urls. Visit https://www.urlslab.com/dashboard/ and connect Google Search Console in Integrations menu.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_GSC_IMPORT,
			true,
			false,
			__( 'Import Google Search Console Data' ),
			__( 'Import stats like clicks, impressions, CTR and average position about each of your URL and query. Data are agregated for last 30 days!' ),
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
			__( 'Limit Rows per GSC Site' ),
			__( 'Cease importing new data once the total number of rows from Google Search Console site reaches the limit. This acts as a safeguard against excessive number of rows in your database. If you are importing multiple sites from your Google Search Console, it could multiply the total number of rows.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_CLICKS,
			1,
			false,
			__( 'Min Clicks in 30 days' ),
			__( 'Import just queries with clicks higher or equal as defined limit. 0 means all queries will be imported even if query had 0 clicks in last 30 days' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_IMPRESSIONS,
			10,
			false,
			__( 'Min Impressions in 30 days' ),
			__( 'Import just queries with impressions higher or equal as defined limit. 0 means all queries will be imported even if query had 0 impressions in last 30 days.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc'
		);


		$this->add_options_form_section( 'serpapi', __( 'SERP Data' ), __( 'SERP data synchronization helps you to monitor position of competitor websites for specific keywords and analyze content clusters of your website. Thanks to these data we can predict content gaps or other reports to help you with building new content on your website.' ) );
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
			__( 'Define how often we should sync SERP data and how up to data data you need to make good content strategy. Each query update request is charged, choose wisely. To make good content startegy decissions, you do not need updates too often as the average compettitor SERP positions are not chaning so rapidly. Updates once a month are good start, but even yearly updates could be enough to save you some costs' ),
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
			'serpapi'
		);


		$this->add_options_form_section( 'import', __( 'Import new SERP queries' ), __( 'Specify how new queries are imported from SERP results. Make sure you select reasonable amount of domains and other limits, because this feature can eat your credits fast.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES,
			false,
			false,
			__( 'Discover and Import Related Queries' ),
			__( 'Automatically build list of queries by importing Related Searches from Google Results for monitored queries. IMPORTANT: by activating this option you agree with processing of higher amount of SERP api requests leading to extra costs for evaluation of each relevant/irrelevant query. Once the keyword is marked as irelevant, it will not be processed again, so the cost will not be high in next recurring updates of SERP positions.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_IMPORT_LIMIT,
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
			__( 'Evaluate competing domains up to position' ),
			__( 'Enter number 1 - 100. Reasonable value will be between 5 - 50. Query entities will be processed only in case one of competing domains (your domains or competitors) ranks for keyword in TOP X results. Setting this number lower will improve quality, but higher number will discover more new queries.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IRRELEVANT_QUERY_LIMIT,
			2,
			false,
			__( 'Irrelevant query limit' ),
			__( 'The number pertains to the minimum count of competing domains (including your own), required to rank in top results. If this number is not achieved, the query will be perceived as irrelevant to your business and will no longer be updated. The higher the specified number, the fewer keywords you will discern, but the accuracy of the list will increase. IMPORTANT: Remember to specify domain names of all your competitors, to ensure the proper functioning of this setting.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 10;
			},
			'import'
		);


		$this->add_options_form_section( 'import_faq', __( 'Import Frequently Asked Questions' ), __( 'URLsLab can automatically import FAQ entries from SERP results and relevant questions to your business can be added into FAQ module. This will help you to build new content in your website.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS_AS_QUERY,
			true,
			false,
			__( 'Import FAQs from SERP Results as new Queries' ),
			__( 'If active, frequently asked questions from google serp results will be added as new queries. Questions could be source of traffic for your website and it is good to know the position you are ranking for.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS,
			true,
			false,
			__( 'Import FAQs query as Question into FAQ module' ),
			__( 'Import FAQS for analyzed keywords automatically and store them to Frequently Asked Questions module if the question is relevant query (more competitor domains rank for this question).' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
	}
}
