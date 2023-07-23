<?php

// phpcs:disable WordPress

class Urlslab_Serp extends Urlslab_Widget {
	public const SLUG = 'serp';
	const SETTING_NAME_SERP_API = 'urlslab-serpapi';
	const SETTING_NAME_IMPORT_FAQS = 'urlslab-import-faqs';
	const SETTING_NAME_IMPORT_RELATED_QUERIES = 'urlslab-import-rel-queries';
	const SETTING_NAME_SYNC_FREQ = 'urlslab-serp-sync-freq';
	const SETTING_NAME_IMPORT_RELATED_QUERIES_DOMAINS = 'urlslab-import-rel-q-domains';
	const SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION = 'urlslab-import-rel-q-position';

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


		$this->add_options_form_section( 'import', __( 'Import' ), __( 'Specify how new queries and FAQs are imported from SERP results. Make sure you select reasonable amount of domains and other limits, because this feature can eat your credits fast.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_DOMAINS,
			'',
			false,
			__( 'Your and Direct competitor Domains' ),
			__( 'Comma or new line separated list of domains. It is wise to include here not just your domains, but also all domains of your direct competitors. Automatically import related queries just in case organic results for current query contains one of specified domains. If it is empty, all related queries are imported - this could lead to eccessive amount of queries.' ),
			self::OPTION_TYPE_TEXTAREA,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION,
			30,
			false,
			__( 'Filter TOP results' ),
			__( 'Query entities will be processed only in case one of specified domains ranks for keyword in TOP results' ),
			self::OPTION_TYPE_NUMBER,
			function( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS,
			false,
			false,
			__( 'Import FAQs' ),
			__( 'Import FAQS for analyzed keywords automatically and store them to Frequently Asked Questions module.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES,
			false,
			false,
			__( 'Import Related Queries' ),
			__( 'Automatically build list of queries by importing Related Searches from Google Results for monitored queries' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
	}
}
