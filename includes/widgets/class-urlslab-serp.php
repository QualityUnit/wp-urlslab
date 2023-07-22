<?php

// phpcs:disable WordPress

class Urlslab_Serp extends Urlslab_Widget {
	public const SLUG = 'serp';
	const SETTING_NAME_SERP_API = 'urlslab-serpapi';
	const SETTING_NAME_IMPORT_FAQS = 'urlslab-import-faqs';
	const SETTING_NAME_IMPORT_RELATED_QUERIES = 'urlslab-import-rel-queries';

	public function init_widget() {
	}

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
			self::SETTING_NAME_IMPORT_FAQS,
			false,
			false,
			__( 'Import FAQs' ),
			__( 'Import FAQS for analyzed keywords automatically and store them to Frequently Asked Questions module.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'serpapi'
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
			'serpapi'
		);


	}
}
