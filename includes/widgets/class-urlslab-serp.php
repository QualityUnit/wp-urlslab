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
			Urlslab_Serp_Query_Row::TYPE_SERP_RELATED => __( 'People also search for' ),
			Urlslab_Serp_Query_Row::TYPE_SERP_FAQ     => __( 'People also ask' ),
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
		return __( 'Monitor your site\'s position in search engine results for specific keywords' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_PAID );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'google_sgc', __( 'Google Search Console Configuration' ), __( 'Link your Google Search Console to receive the latest statistics about your URLs. Go to the URLsLab service Dashboard and connect the Google Search Console via the Integrations menu.' ), array( self::LABEL_FREE ) );
		$this->add_option_definition(
			self::SETTING_NAME_GSC_IMPORT,
			true,
			false,
			__( 'Use Google Search Console Data' ),
			__( 'Import data such as clicks, impressions, CTR, and average position for each of your URLs and queries. Data is aggregated for the past 30 days.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'google_sgc',
			array( self::LABEL_SEO )
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_LIMIT,
			10000,
			false,
			__( 'Limit Rows per Site' ),
			__( 'Halt data import once the total rows from the Google Search Console site attain the maximum limit. This protects from overly populated database rows. The total rows might escalate if imports are occurring from multiple Google Search Console sites.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc',
			array( self::LABEL_PERFORMANCE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_CLICKS,
			0,
			false,
			__( 'Minimum Clicks in Past 30 Days' ),
			__( 'Import only queries with clicks that meet or exceed the defined limit. If set to 0, all queries will be imported even if they received no clicks in the past 30 days.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'google_sgc',
			array( self::LABEL_PERFORMANCE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_IMPRESSIONS,
			10,
			false,
			__( 'Minimum Impressions in Past 30 Days' ),
			__( 'Import only impressions with clicks that meet or exceed the defined limit. If set to 0, all queries will be imported even if they received no clicks in the past 30 days.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'google_sgc',
			array( self::LABEL_PERFORMANCE )
		);


		$this->add_options_form_section( 'serpapi', __( 'SERP Data Configuration' ), __( 'Synchronizing SERP data allows tracking of competitor websites\' ranking for particular keywords and evaluation of your website\'s content clusters. This information aids in identifying potential content gaps and generating other useful reports for creating fresh content on your site.' ), array( self::LABEL_PAID ) );

		$this->add_option_definition(
			self::SETTING_NAME_SERP_API,
			false,
			false,
			__( 'Synchronization of SERP Data' ),
			__( 'Regularly refresh rankings of the top 100 URLs for tracked keywords.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'serpapi',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_FREQ,
			Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY,
			false,
			__( 'Update Interval' ),
			__( 'Set the frequency for syncing SERP data based on your content strategy needs. Remember, each query update request incurs a fee, so choose wisely.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_DAILY    => __( 'Daily' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_WEEKLY   => __( 'Weekly' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY  => __( 'Monthly' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY   => __( 'Yearly' ),
				Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_ONE_TIME => __( 'No updates, load just once' ),
			),
			function( $value ) {
				$request = new Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest();

				return in_array( $value, $request->getNotOlderThanAllowableValues() );
			},
			'serpapi',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_QUERY_TYPES,
			Urlslab_Serp_Query_Row::TYPE_USER,
			false,
			__( 'Query Types' ),
			__( 'Load SERP data just for chosen query types.' ),
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
			'serpapi',
			array( self::LABEL_SEO )
		);


		$this->add_options_form_section( 'import', __( 'Import New SERP Queries' ), __( 'Define the method of importing new queries from SERP results. Ensure you choose a sensible number of domains and set appropriate limits, as this feature could quickly deplete your credits.' ), array( self::LABEL_PAID ) );

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES,
			true,
			false,
			__( 'Import "People Also Search For" as New Query' ),
			__( 'Generate a list of queries automatically by importing Related Searches from Google Results for tracked queries. Remember, by enabling this feature, you consent to the processing of an increased number of SERP API requests, which may result in additional costs for each evaluated query. If a keyword is deemed irrelevant, it will not be processed again, keeping costs low for future SERP position updates.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_IMPORT_LIMIT,
			1000,
			false,
			__( 'Halt Import of Related Queries Upon Reaching Limit' ),
			__( 'Stop the import of new related searches when your database reaches its limit. This serves to guard against excessive costs as imported searches can increase rapidly.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'import',
			array( self::LABEL_PERFORMANCE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION,
			30,
			false,
			__( 'Evaluate Competitor Domains up to a Certain Ranking Position' ),
			__( 'Entities will only be evaluated if a competitive domain ranks within the given limit in the SERP results. Lower settings improve quality, and higher settings reveal more queries.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			'import',
			array( self::LABEL_EXPERT, self::LABEL_PERFORMANCE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_IRRELEVANT_QUERY_LIMIT,
			2,
			false,
			__( 'Unrelated Query Restriction' ),
			__( 'This number refers to the least amount of competing domains (including yours) needed for top-ranking results. If the set number isn\'t reached, the query gets deemed irrelevant to your business and its updates cease. A higher number means fewer keywords, but a more accurate list. Remember, don\'t forget to input domain names of all your competitors for this setting to work correctly.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 10;
			},
			'import',
			array( self::LABEL_EXPERT, self::LABEL_PERFORMANCE )
		);


		$this->add_options_form_section( 'import_faq', __( 'Import Frequently Asked Questions' ), __( 'URLsLab can seamlessly import FAQs straight from SERP results and insert pertinent business questions into your FAQ module.' ), array( self::LABEL_PAID ) );
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS_AS_QUERY,
			true,
			false,
			__( 'Import "People Also Ask" as New Query' ),
			__( 'When enabled, popular queries from Google SERP results will be integrated as new inquiries. Such questions can potentially drive traffic to your website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS,
			true,
			false,
			__( 'Import FAQ Queries as Questions Into FAQ Module' ),
			__( 'Automatically import relevant FAQs for analyzed keywords and save them in the Frequently Asked Questions module if multiple competitor domains rank for this question.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq',
			array( self::LABEL_SEO, self::LABEL_FREE )
		);
	}
}
