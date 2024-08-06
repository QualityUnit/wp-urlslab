<?php

// phpcs:disable WordPress

class Urlslab_Widget_Serp extends Urlslab_Widget {
	public const SLUG = 'serp';
	const SETTING_NAME_SERP = 'urlslab-serpapi';
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
	const SETTING_NAME_GSC_COUNTRIES = 'urlslab-gsc-countries';
	const SETTING_NAME_SERP_VOLUMES = 'urlslab-serp-volumes';
	const SETTING_NAME_SERP_VOLUMES_SYNC_FREQ = 'urlslab-serp-volumes-sync-freq';
	const SETTING_NAME_SERP_DATA_TIMESTAMP = 'urlslab-serp-data-timestamp';

	public function init_widget() {}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Serp::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'SEO Insights', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor your site\'s position in search engine results for specific keywords', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_PAID );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'google_sgc',
			function () {
				return __( 'Google Search Console Configuration', 'urlslab' );
			},
			function () {
				return __( 'Link your Google Search Console to receive the latest statistics about your URLs. Go to the URLsLab service Dashboard and connect the Google Search Console via the Integrations menu.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_IMPORT,
			true,
			false,
			function () {
				return __( 'Use Google Search Console Data', 'urlslab' );
			},
			function () {
				return __( 'Import data such as clicks, impressions, CTR, and average position for each of your URLs and queries. Data is aggregated for the past 30 days.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_LIMIT,
			1000,
			false,
			function () {
				return __( 'Limit Rows per Site', 'urlslab' );
			},
			function () {
				return __( 'Halt data import once the total rows from the Google Search Console site attain the maximum limit. This protects from overly populated database rows. The total rows might escalate if imports are occurring from multiple Google Search Console sites.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_IMPRESSIONS,
			10,
			false,
			function () {
				return __( 'Minimum Impressions in Past 30 Days', 'urlslab' );
			},
			function () {
				return __( 'Import only impressions with clicks that meet or exceed the defined limit. If set to 0, all queries will be imported even if they received no clicks in the past 30 days.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_MIN_CLICKS,
			1,
			false,
			function () {
				return __( 'Minimum Clicks in Past 30 Days', 'urlslab' );
			},
			function () {
				return __( 'Import only queries with clicks that meet or exceed the defined limit. If set to 0, all queries will be imported even if they received no clicks in the past 30 days.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'google_sgc'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GSC_COUNTRIES,
			array(),
			false,
			function () {
				return __( 'Countries to import', 'urlslab' );
			},
			function () {
				return __( 'Search console records keyword data for each country separately, what could generate a lot of duplicate queries in your database. By limiting supported list of countries you can later save amount of credits needed for processing of SERP analyses. It is wise to select just main regions for your business to reduce database size and costs linked with SERP position analyses. If no country is selected, all countries from Google Search Console are accepted.', 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			function () {
				return array(
					'AF' => 'Afghanistan',
					'AX' => 'Aland Islands',
					'AL' => 'Albania',
					'DZ' => 'Algeria',
					'AS' => 'American Samoa',
					'AD' => 'Andorra',
					'AO' => 'Angola',
					'AI' => 'Anguilla',
					'AQ' => 'Antarctica',
					'AG' => 'Antigua And Barbuda',
					'AR' => 'Argentina',
					'AM' => 'Armenia',
					'AW' => 'Aruba',
					'AU' => 'Australia',
					'AT' => 'Austria',
					'AZ' => 'Azerbaijan',
					'BS' => 'Bahamas',
					'BH' => 'Bahrain',
					'BD' => 'Bangladesh',
					'BB' => 'Barbados',
					'BY' => 'Belarus',
					'BE' => 'Belgium',
					'BZ' => 'Belize',
					'BJ' => 'Benin',
					'BM' => 'Bermuda',
					'BT' => 'Bhutan',
					'BO' => 'Bolivia',
					'BA' => 'Bosnia And Herzegovina',
					'BW' => 'Botswana',
					'BV' => 'Bouvet Island',
					'BR' => 'Brazil',
					'IO' => 'British Indian Ocean Territory',
					'BN' => 'Brunei Darussalam',
					'BG' => 'Bulgaria',
					'BF' => 'Burkina Faso',
					'BI' => 'Burundi',
					'KH' => 'Cambodia',
					'CM' => 'Cameroon',
					'CA' => 'Canada',
					'CV' => 'Cape Verde',
					'KY' => 'Cayman Islands',
					'CF' => 'Central African Republic',
					'TD' => 'Chad',
					'CL' => 'Chile',
					'CN' => 'China',
					'CX' => 'Christmas Island',
					'CC' => 'Cocos (Keeling) Islands',
					'CO' => 'Colombia',
					'KM' => 'Comoros',
					'CG' => 'Congo',
					'CD' => 'Congo, Democratic Republic',
					'CK' => 'Cook Islands',
					'CR' => 'Costa Rica',
					'CI' => 'Cote D\'Ivoire',
					'HR' => 'Croatia',
					'CU' => 'Cuba',
					'CY' => 'Cyprus',
					'CZ' => 'Czech Republic',
					'DK' => 'Denmark',
					'DJ' => 'Djibouti',
					'DM' => 'Dominica',
					'DO' => 'Dominican Republic',
					'EC' => 'Ecuador',
					'EG' => 'Egypt',
					'SV' => 'El Salvador',
					'GQ' => 'Equatorial Guinea',
					'ER' => 'Eritrea',
					'EE' => 'Estonia',
					'ET' => 'Ethiopia',
					'FK' => 'Falkland Islands (Malvinas)',
					'FO' => 'Faroe Islands',
					'FJ' => 'Fiji',
					'FI' => 'Finland',
					'FR' => 'France',
					'GF' => 'French Guiana',
					'PF' => 'French Polynesia',
					'TF' => 'French Southern Territories',
					'GA' => 'Gabon',
					'GM' => 'Gambia',
					'GE' => 'Georgia',
					'DE' => 'Germany',
					'GH' => 'Ghana',
					'GI' => 'Gibraltar',
					'GR' => 'Greece',
					'GL' => 'Greenland',
					'GD' => 'Grenada',
					'GP' => 'Guadeloupe',
					'GU' => 'Guam',
					'GT' => 'Guatemala',
					'GG' => 'Guernsey',
					'GN' => 'Guinea',
					'GW' => 'Guinea-Bissau',
					'GY' => 'Guyana',
					'HT' => 'Haiti',
					'HM' => 'Heard Island & Mcdonald Islands',
					'VA' => 'Holy See (Vatican City State)',
					'HN' => 'Honduras',
					'HK' => 'Hong Kong',
					'HU' => 'Hungary',
					'IS' => 'Iceland',
					'IN' => 'India',
					'ID' => 'Indonesia',
					'IR' => 'Iran, Islamic Republic Of',
					'IQ' => 'Iraq',
					'IE' => 'Ireland',
					'IM' => 'Isle Of Man',
					'IL' => 'Israel',
					'IT' => 'Italy',
					'JM' => 'Jamaica',
					'JP' => 'Japan',
					'JE' => 'Jersey',
					'JO' => 'Jordan',
					'KZ' => 'Kazakhstan',
					'KE' => 'Kenya',
					'KI' => 'Kiribati',
					'KR' => 'Korea',
					'KW' => 'Kuwait',
					'KG' => 'Kyrgyzstan',
					'LA' => 'Lao People\'s Democratic Republic',
					'LV' => 'Latvia',
					'LB' => 'Lebanon',
					'LS' => 'Lesotho',
					'LR' => 'Liberia',
					'LY' => 'Libyan Arab Jamahiriya',
					'LI' => 'Liechtenstein',
					'LT' => 'Lithuania',
					'LU' => 'Luxembourg',
					'MO' => 'Macao',
					'MK' => 'Macedonia',
					'MG' => 'Madagascar',
					'MW' => 'Malawi',
					'MY' => 'Malaysia',
					'MV' => 'Maldives',
					'ML' => 'Mali',
					'MT' => 'Malta',
					'MH' => 'Marshall Islands',
					'MQ' => 'Martinique',
					'MR' => 'Mauritania',
					'MU' => 'Mauritius',
					'YT' => 'Mayotte',
					'MX' => 'Mexico',
					'FM' => 'Micronesia, Federated States Of',
					'MD' => 'Moldova',
					'MC' => 'Monaco',
					'MN' => 'Mongolia',
					'ME' => 'Montenegro',
					'MS' => 'Montserrat',
					'MA' => 'Morocco',
					'MZ' => 'Mozambique',
					'MM' => 'Myanmar',
					'NA' => 'Namibia',
					'NR' => 'Nauru',
					'NP' => 'Nepal',
					'NL' => 'Netherlands',
					'AN' => 'Netherlands Antilles',
					'NC' => 'New Caledonia',
					'NZ' => 'New Zealand',
					'NI' => 'Nicaragua',
					'NE' => 'Niger',
					'NG' => 'Nigeria',
					'NU' => 'Niue',
					'NF' => 'Norfolk Island',
					'MP' => 'Northern Mariana Islands',
					'NO' => 'Norway',
					'OM' => 'Oman',
					'PK' => 'Pakistan',
					'PW' => 'Palau',
					'PS' => 'Palestinian Territory, Occupied',
					'PA' => 'Panama',
					'PG' => 'Papua New Guinea',
					'PY' => 'Paraguay',
					'PE' => 'Peru',
					'PH' => 'Philippines',
					'PN' => 'Pitcairn',
					'PL' => 'Poland',
					'PT' => 'Portugal',
					'PR' => 'Puerto Rico',
					'QA' => 'Qatar',
					'RE' => 'Reunion',
					'RO' => 'Romania',
					'RU' => 'Russian Federation',
					'RW' => 'Rwanda',
					'BL' => 'Saint Barthelemy',
					'SH' => 'Saint Helena',
					'KN' => 'Saint Kitts And Nevis',
					'LC' => 'Saint Lucia',
					'MF' => 'Saint Martin',
					'PM' => 'Saint Pierre And Miquelon',
					'VC' => 'Saint Vincent And Grenadines',
					'WS' => 'Samoa',
					'SM' => 'San Marino',
					'ST' => 'Sao Tome And Principe',
					'SA' => 'Saudi Arabia',
					'SN' => 'Senegal',
					'RS' => 'Serbia',
					'SC' => 'Seychelles',
					'SL' => 'Sierra Leone',
					'SG' => 'Singapore',
					'SK' => 'Slovakia',
					'SI' => 'Slovenia',
					'SB' => 'Solomon Islands',
					'SO' => 'Somalia',
					'ZA' => 'South Africa',
					'GS' => 'South Georgia And Sandwich Isl.',
					'ES' => 'Spain',
					'LK' => 'Sri Lanka',
					'SD' => 'Sudan',
					'SR' => 'Suriname',
					'SJ' => 'Svalbard And Jan Mayen',
					'SZ' => 'Swaziland',
					'SE' => 'Sweden',
					'CH' => 'Switzerland',
					'SY' => 'Syrian Arab Republic',
					'TW' => 'Taiwan',
					'TJ' => 'Tajikistan',
					'TZ' => 'Tanzania',
					'TH' => 'Thailand',
					'TL' => 'Timor-Leste',
					'TG' => 'Togo',
					'TK' => 'Tokelau',
					'TO' => 'Tonga',
					'TT' => 'Trinidad And Tobago',
					'TN' => 'Tunisia',
					'TR' => 'Turkey',
					'TM' => 'Turkmenistan',
					'TC' => 'Turks And Caicos Islands',
					'TV' => 'Tuvalu',
					'UG' => 'Uganda',
					'UA' => 'Ukraine',
					'AE' => 'United Arab Emirates',
					'GB' => 'United Kingdom',
					'US' => 'United States',
					'UM' => 'United States Outlying Islands',
					'UY' => 'Uruguay',
					'UZ' => 'Uzbekistan',
					'VU' => 'Vanuatu',
					'VE' => 'Venezuela',
					'VN' => 'Viet Nam',
					'VG' => 'Virgin Islands, British',
					'VI' => 'Virgin Islands, U.S.',
					'WF' => 'Wallis And Futuna',
					'EH' => 'Western Sahara',
					'YE' => 'Yemen',
					'ZM' => 'Zambia',
					'ZW' => 'Zimbabwe',
				);
			},
			null,
			'google_sgc'
		);


		$this->add_options_form_section(
			'serpapi',
			function () {
				return __( 'SERP Data Configuration', 'urlslab' );
			},
			function () {
				return __( 'Synchronizing SERP data allows tracking of competitor website\'s ranking for particular keywords and evaluation of your website\'s content clusters. This information aids in identifying potential content gaps and generating other useful reports for creating fresh content on your site.', 'urlslab' );
			},
			array( self::LABEL_PAID )
		);

		$this->add_option_definition(
			self::SETTING_NAME_SERP,
			true,
			false,
			function () {
				return __( 'Synchronization of SERP Data', 'urlslab' );
			},
			function () {
				return __( 'Regularly refresh rankings of the top 100 URLs for tracked keywords. (SERP Data means search engine results page information - Basically it is list of URLs and their positions for specific query). If deactivated, synchronization cron will not be even started.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'serpapi'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SYNC_FREQ,
			30 * 24 * 3600,
			false,
			function () {
				return __( 'Default Update Interval', 'urlslab' );
			},
			function () {
				return __( 'Set the frequency for syncing SERP data based on your content strategy needs. Each query update request incurs a fee.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					24 * 3600    => __( 'Daily', 'urlslab' ),
					7 * 24 * 3600   => __( 'Weekly', 'urlslab' ),
					30 * 24 * 3600  => __( 'Monthly', 'urlslab' ),
					365 * 24 * 3600   => __( 'Yearly', 'urlslab' ),
					5000 * 24 * 3600 => __( 'No updates, load just once', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_int( $value );
			},
			'serpapi'
		);
		$this->add_option_definition(
			self::SETTING_NAME_QUERY_TYPES,
			array(
				Urlslab_Data_Serp_Query::TYPE_USER,
				Urlslab_Data_Serp_Query::TYPE_SERP_FAQ,
				Urlslab_Data_Serp_Query::TYPE_SERP_RELATED,
			),
			false,
			function () {
				return __( 'Query Types', 'urlslab' );
			},
			function () {
				return __( 'Load SERP data just for chosen query types.', 'urlslab' );
			},
			self::OPTION_TYPE_MULTI_CHECKBOX,
			Urlslab_Data_Serp_Query::queryTypes(),
			function ( $value ) {
				if ( ! is_array( $value ) ) {
					return false;
				}

				$possible_values = Urlslab_Data_Serp_Query::queryTypes();
				foreach ( $value as $v ) {
					if ( ! isset( $possible_values[ $v ] ) ) {
						return false;
					}
				}

				return true;
			},
			'serpapi'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_VOLUMES,
			true,
			false,
			function () {
				return __( 'Synchronization of Query Volumes Data', 'urlslab' );
			},
			function () {
				return __( 'Enhance each processed SERP Query with information about search volumes, keyword difficulty, competition index, bid price, etc. Search volumes enhance SERP data, but are not required for core functionality of this module. We charged extra cent for each query to load this data. Volume data do not need to be updated so often as SERP data. Volume data are requested just for queries with status "Processed". We get the volume data inderectly from Google Ads service, where many types of queries are not supported and even we need to pay for such query, no data are returned. Not supported are queries referring to: Dangerous or derogatory content; Sexually explicit content; Compensated sexual acts; Child sexual abuse imagery; Mail-order brides; Shocking content; Sensitive events; Animal cruelty; Hacked political materials. Often we get no data about queries of type "People also ask" or "Question" intents, queries longer as 80 characters or 10 words. It can 1-2 days until volume data are loaded from URLsLab service to your WordPress database.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'serpapi'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_VOLUMES_SYNC_FREQ,
			7889229,
			false,
			function () {
				return __( 'Query Volumes Update Interval', 'urlslab' );
			},
			function () {
				return __( 'Periodically update volume data for all queries', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function () {
				return array(
					0        => __( 'Once - No additional updates', 'urlslab' ),
					2629743  => __( 'Monthly', 'urlslab' ),
					7889229  => __( 'Quarterly', 'urlslab' ),
					31556926 => __( 'Yearly', 'urlslab' ),
				);
			},
			function ( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'serpapi'
		);
		$this->add_option_definition(
			'btn_recompute_serp_data',
			'serp-queries/recompute',
			false,
			function () {
				return __( 'Recompute SERP data', 'urlslab' );
			},
			function () {
				return __( 'Some values in SERP Queries and URLs are recomputed with delay of 7 days because it is quite intensive operation for your database server (e.g. intersections with competitors, volume data, URL value, etc.). If you need data faster, click the Recompute button. Data are recomputed by cron on background, it can still take few hours until all rows are updated.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'serpapi'
		);


		$this->add_options_form_section(
			'import',
			function () {
				return __( 'Import New SERP Queries', 'urlslab' );
			},
			function () {
				return __( 'Define the method of importing new queries from SERP results. Ensure you choose a sensible number of domains and set appropriate limits, as this feature could quickly deplete your credits.', 'urlslab' );
			},
			array( self::LABEL_PAID )
		);

		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES,
			true,
			false,
			function () {
				return __( 'Import "People Also Search For" as New Query', 'urlslab' );
			},
			function () {
				return __( 'Generate a list of queries automatically by importing Related Searches from Google Results for tracked queries. Remember, by enabling this feature, you consent to the processing of an increased number of SERP API requests, which may result in additional costs for each evaluated query. If a keyword is deemed irrelevant, it will not be processed again, keeping costs low for future SERP position updates.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_SERP_IMPORT_LIMIT,
			1000,
			false,
			function () {
				return __( 'Limit import of new queries', 'urlslab' );
			},
			function () {
				return __( 'Stop importing `People also search` and `People also ask` queries once the number of queries is reached. This serves to guard against excessive costs as imported searches can increase rapidly.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && 1 <= $value;
			},
			'import'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_RELATED_QUERIES_POSITION,
			30,
			false,
			function () {
				return __( 'Evaluate Competitor Domains up to a Certain Ranking Position', 'urlslab' );
			},
			function () {
				return __( 'Entities will only be evaluated if a competitive domain ranks within the given limit in the SERP results. Lower settings improve quality, and higher settings reveal more queries.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 100;
			},
			'import',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_IRRELEVANT_QUERY_LIMIT,
			3,
			false,
			function () {
				return __( 'Unrelated Query Restriction', 'urlslab' );
			},
			function () {
				return __( 'This number refers to the least amount of competing domains (including yours) needed for top-ranking results. If the set number isn\'t reached, the query gets deemed irrelevant to your business and its updates cease. A higher number means fewer keywords, but a more accurate list. Remember, don\'t forget to input domain names of all your competitors for this setting to work correctly.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function ( $value ) {
				return is_numeric( $value ) && $value >= 1 && $value <= 10;
			},
			'import',
			array( self::LABEL_EXPERT )
		);


		$this->add_options_form_section(
			'import_faq',
			function () {
				return __( 'Import Frequently Asked Questions', 'urlslab' );
			},
			function () {
				return __( 'URLsLab can seamlessly import FAQs straight from SERP results and insert pertinent business questions into your FAQ module.', 'urlslab' );
			},
			array( self::LABEL_PAID )
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS_AS_QUERY,
			true,
			false,
			function () {
				return __( 'Import "People Also Ask" as New Query', 'urlslab' );
			},
			function () {
				return __( 'When enabled, popular queries from Google SERP results will be integrated as new inquiries. Such questions can potentially drive traffic to your website.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
		$this->add_option_definition(
			self::SETTING_NAME_IMPORT_FAQS,
			true,
			false,
			function () {
				return __( 'Import FAQ Queries as Questions Into FAQ Module', 'urlslab' );
			},
			function () {
				return __( 'Automatically import relevant FAQs for analyzed keywords and save them in the Frequently Asked Questions module if multiple competitor domains rank for this question.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'import_faq'
		);
	}

	public function register_routes() {
		( new Urlslab_Api_Serp_Queries() )->register_routes();
		( new Urlslab_Api_Serp_Urls() )->register_routes();
		( new Urlslab_Api_Serp_Domains() )->register_routes();
		( new Urlslab_Api_Serp_Gap() )->register_routes();
		( new Urlslab_Api_Serp_Competitors() )->register_routes();
		( new Urlslab_Api_Gsc_Sites() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'SEO&Content' => __( 'SEO & Content', 'urlslab' ) );
	}
}
