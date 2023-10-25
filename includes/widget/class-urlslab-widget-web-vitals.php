<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Widget_Web_Vitals extends Urlslab_Widget {
	public const SLUG = 'web-vitals';
	const SETTING_NAME_WEB_VITALS = 'urlslab-web-vitals';
	const SETTING_NAME_WEB_VITALS_ATTRIBUTION = 'urlslab-web-vitals-attr';
	const SETTING_NAME_WEB_VITALS_CLS = 'urlslab-web-vitals-cls';
	const SETTING_NAME_WEB_VITALS_FID = 'urlslab-web-vitals-fid';
	const SETTING_NAME_WEB_VITALS_FCP = 'urlslab-web-vitals-fcp';
	const SETTING_NAME_WEB_VITALS_INP = 'urlslab-web-vitals-inp';
	const SETTING_NAME_WEB_VITALS_LCP = 'urlslab-web-vitals-lcp';
	const SETTING_NAME_WEB_VITALS_TTFB = 'urlslab-web-vitals-ttfb';
	const SETTING_NAME_WEB_VITALS_LOG_LEVEL = 'urlslab-web-vitals-level';
	const SETTING_NAME_WEB_VITALS_URL_REGEXP = 'urlslab-web-vitals-url-regexp';
	const SETTING_NAME_WEB_VITALS_SCREENSHOT = 'urlslab-web-vitals-scr';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_head_content_raw', $this, 'raw_head_content', 1 );
		Urlslab_Loader::get_instance()->add_action( 'rest_api_init', $this, 'register_routes' );
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Web_Vitals::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Web Vitals' );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_FREE );
	}

	public function get_widget_description(): string {
		return __( 'Measure web vitals of your website and analyze impact of your changes on performance of your pages.' );
	}

	public function raw_head_content( $content ) {
		if (
			$this->get_option( self::SETTING_NAME_WEB_VITALS ) &&
			(
				$this->get_option( self::SETTING_NAME_WEB_VITALS_CLS ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_FID ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_FCP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_INP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_LCP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_TTFB )
			) &&
			@preg_match( '|' . str_replace( '|', '\\|', $this->get_option( self::SETTING_NAME_WEB_VITALS_URL_REGEXP ) ) . '|uim', Urlslab_Url::get_current_page_url()->get_url_with_protocol() )
		) {
			$content .= '<script>';
			$content .= 'const queue=new Set();var scr_lib=false;';
			$content .= 'function addToQueue(metric) {';
			$content .= "let rating_level=metric.rating=='good'?0:metric.rating=='poor'?2:1;";
			$content .= 'if (rating_level<' . $this->get_option( self::SETTING_NAME_WEB_VITALS_LOG_LEVEL ) . '){return;}';
			//			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_SCREENSHOT ) ) {
			//				$content .= "
			//				console.log(metric);
			//				if (rating_level>0&&scr_lib&&metric.hasOwnProperty('attribution') && metric.attribution.hasOwnProperty('element')){
			//
			//				var el=document.querySelector(metric.attribution.element);
			//				if(!el){return;}
			//				const rect = el.getBoundingClientRect();
			//					getScreenshotOfElement(el,0,0,rect.width,rect.height,
			//						function(scr){
			//							const api_url='" . esc_js( rest_url( 'urlslab/v1/web-vitals/wvimg' ) ) . "/'+metric.id;
			//							(navigator.sendBeacon && navigator.sendBeacon(api_url,scr))||fetch(api_url,{body:scr,method:'POST',keepalive:true}).then(function(response){console.log(response);});
			//						});
			//				}";
			//			}
			$content .= 'queue.add(metric);';
			$content .= '}';
			$content .= 'function flushQueue(){if(queue.size>0){';
			$content .= "const body=JSON.stringify({url: window.location.href, entries:[...queue]});const api_url='" . esc_js( rest_url( 'urlslab/v1/web-vitals/wvmetrics' ) ) . "';";
			$content .= "(navigator.sendBeacon && navigator.sendBeacon(api_url,body))||fetch(api_url,{body,method:'POST',keepalive:true,headers:{'content-type':'application/json'}});queue.clear();}}";
			//			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_SCREENSHOT ) ) {
			//				$content .= "(function(){var script=document.createElement('script');script.src='https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';script.onload=function(){scr_lib=true;console.log('loaded html2canvas');};document.head.appendChild(script);})();";
			//				$content .= 'function getScreenshotOfElement(element, posX, posY, width, height, callback) {html2canvas(element, {width: width,height: height,useCORS: true,taintTest: false,allowTaint: false}).then(function(canvas) {document.body.appendChild(canvas);';
			//				$content .= 'callback(canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""));});}';
			//			}
			$content .= "(function(){var script=document.createElement('script');script.src='";
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_ATTRIBUTION ) ) {
				$content .= 'https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.iife.js';
			} else {
				$content .= 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
			}
			$content .= "';script.onload=function(){";
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_CLS ) ) {
				$content .= 'webVitals.onCLS(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_FID ) ) {
				$content .= 'webVitals.onFID(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_FCP ) ) {
				$content .= 'webVitals.onFCP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_INP ) ) {
				$content .= 'webVitals.onINP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_LCP ) ) {
				$content .= 'webVitals.onLCP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_TTFB ) ) {
				$content .= 'webVitals.onTTFB(addToQueue);';
			}
			$content .= '};document.head.appendChild(script);})();';
			$content .= "addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){flushQueue();}});addEventListener('pagehide',flushQueue);</script>";
		}

		return $content;
	}


	protected function add_options() {
		$this->add_options_form_section( 'vitals', __( 'Web Vitals' ), __( 'Web vitals module helps to measure performance data of real users, in a way that accurately matches how they are measured by Google tools. By analyzing detailed log entries you can find out reasons, why your Core Web Vitals are not performing well. Log is stored in your WordPress database. We do not recommend to log all data longterm on production installation. It should be used just for short term monitoring to identify the problem.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS,
			false,
			true,
			__( 'Activate Web Vitals measurement' ),
			__( 'Plugin will include in head tag of your page small javascript library to measure web vitals in browser of your visitor during browsing of your page.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_LOG_LEVEL,
			1,
			true,
			__( 'Min Log Level' ),
			__( 'Store just entries with rating equal or worst. Possible values: good, needs-improvement, poor.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				0 => __( 'Good' ),
				1 => __( 'Needs Improvement' ),
				2 => __( 'Poor' ),
			),
			function( $value ) {
				return is_numeric( $value ) && $value >= 0 && $value <= 2;
			},
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_URL_REGEXP,
			'.*',
			true,
			__( 'URL Filter' ),
			__( 'Measure performance just for URLs matching given regular expression. Use https://regex101.com/ to test your regular expression if you experience any problem with defining your own expression or contact our support team. To include measurements to all pages on your website enter value: .*' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				if ( ! is_string( $value ) ) {
					return false;
				}
				@preg_match( '|' . str_replace( '|', '\\|', $value ) . '|uim', '' );
				if ( PREG_NO_ERROR !== preg_last_error() ) {
					return false;
				}

				return true;
			},
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_ATTRIBUTION,
			false,
			true,
			__( 'Attribution measurements' ),
			__( 'Attribution measurements are more complex and need to transfer and store more data about browser events. It is not recommended to use it long term in production, but it is the only way how to identify root cause of poor performance on specific pages. Once you identify the root problem, we recommend to switch off this option and just monitor performance metrics without logging detailed data.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);
		//		$this->add_option_definition(
		//			self::SETTING_NAME_WEB_VITALS_SCREENSHOT,
		//			false,
		//			true,
		//			__( 'Take screenshots' ),
		//			__( 'Take screenshots of elements responsible for poor performance. Screenshots increase significantly size of each tracking request and needs much more storage in your database. Activate this feature just for debugging reasons, minimize usage in production. Plugin use external library to take screenshots: https://github.com/niklasvh/html2canvas  (Note: Screenshots will not be taken for logs with good rating.)' ),
		//			self::OPTION_TYPE_CHECKBOX,
		//			false,
		//			null,
		//			'vitals'
		//		);

		$this->add_options_form_section( 'cls', __( 'Cumulative Layout Shift (CLS)' ), __( 'CLS is a Core Web Vital that measures the cumulative score of all unexpected layout shifts within the viewport that occur during a page\'s entire lifecycle. Its aim is to measure a page\'s “visual stability,” as that heavily influences the user experience.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_CLS,
			true,
			true,
			__( 'Activate CLS measurements' ),
			__( 'Activate logging of Cumulative Layout Shift (CLS)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'cls'
		);

		$this->add_options_form_section( 'fid', __( 'First Input Delay (FID)' ), __( 'FID is a Core Web Vital metric for measuring load responsiveness because it quantifies the experience users feel when trying to interact with unresponsive pages—a low FID helps ensure that the page is usable.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_FID,
			true,
			true,
			__( 'Activate FID measurements' ),
			__( 'Activate logging of First Input Delay (FID)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'fid'
		);

		$this->add_options_form_section( 'fcp', __( 'First Contentful Paint (FCP)' ), __( 'The First Contentful Paint (FCP) metric measures the time from when the page starts loading to when any part of the page\'s content is rendered on the screen. For this metric, content refers to text, images (including background images), svg elements, or non-white canvas elements.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_FCP,
			true,
			true,
			__( 'Activate FCP measurements' ),
			__( 'Activate logging of First Contentful Paint (FCP)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'fcp'
		);

		$this->add_options_form_section( 'inp', __( 'Interaction to Next Paint (INP)' ), __( 'Interaction to Next Paint (INP) is a pending Core Web Vital metric that will replace First Input Delay (FID) in March 2024. INP assesses responsiveness using data from the Event Timing API. When an interaction causes a page to become unresponsive, that is a poor user experience.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_INP,
			true,
			true,
			__( 'Activate INP measurements' ),
			__( 'Activate logging of Interaction to Next Paint (INP)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'inp'
		);

		$this->add_options_form_section( 'lcp', __( 'Largest Contentful Paint (LCP)' ), __( 'Largest Contentful Paint (LCP) is an important, stable Core Web Vital metric for measuring perceived load speed because it marks the point in the page load timeline when the page\'s main content has likely loaded—a fast LCP helps reassure the user that the page is useful.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_LCP,
			true,
			true,
			__( 'Activate LCP measurements' ),
			__( 'Activate logging of Largest Contentful Paint (LCP)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'lcp'
		);

		$this->add_options_form_section( 'ttfb', __( 'Time to First Byte (TTFB)' ), __( 'Time to First Byte refers to the time it takes for a browser to receive the first byte of response after a it made a request to the server. It sums up the time associated with each request phase like: DNS lookup.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_TTFB,
			true,
			true,
			__( 'Activate TTFB measurements' ),
			__( 'Activate logging of Time to First Byte (TTFB)' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'ttfb'
		);

	}

	public function register_routes() {
		( new Urlslab_Api_Web_Vitals() )->register_routes();
	}
}
