<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Keywords_Links extends Urlslab_Widget {
	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	private $cntPageLinkReplacements = 0;
	private $cntPageLinks = 0;
	private $cntParagraphLinkReplacements = 0;
	private $linkCounts = array();
	private $kwPageReplacementCounts = array();

	const MAX_REPLACEMENTS_PER_KEYWORD = 2;
	const MAX_LINKS_ON_PAGE = 200;
	const MAX_REPLACEMENTS_PER_PAGE = 30;
	const MAX_REPLACEMENTS_PER_PARAGRAPH = 3;


	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 * @param string $landing_page_link
	 * @param Urlslab_Screenshot_Api $urlslab_screenshot_api
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description,
		string $landing_page_link,
		Urlslab_Screenshot_Api $urlslab_screenshot_api
	) {
		$this->widget_slug            = $widget_slug;
		$this->widget_title           = $widget_title;
		$this->widget_description     = $widget_description;
		$this->landing_page_link      = $landing_page_link;
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
	}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return 'Urlslab ' . $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_url(): string {
		return $this->menu_page_url( URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php' );
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Keywords Links';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Keywords Links';
	}

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args           = wp_parse_args( $args, array() );
		$url            = $this->menu_page_url( $main_menu_slug );
		$url            = add_query_arg( array( 'component' => $this->widget_slug ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	private function replaceKeywordWithLinks(DOMText $node, DOMDocument $document, array $keywords) {
		//TODO load all limits from widget settings and not from constants
		if ($this->cntPageLinks > self::MAX_LINKS_ON_PAGE ||
			$this->cntPageLinkReplacements > self::MAX_REPLACEMENTS_PER_PAGE ||
			$this->cntParagraphLinkReplacements > self::MAX_REPLACEMENTS_PER_PARAGRAPH) {
			return;
		}

		if (strlen(trim($node->nodeValue))) {
			return; //empty node
		}

		foreach ($keywords as $kw => $url) {
			if (($pos = strpos(strtolower($node->nodeValue), strtolower($kw))) !== false) {
				$this->cntPageLinks++;
				$this->cntPageLinkReplacements++;
				$this->cntParagraphLinkReplacements++;
				if (isset($this->kwPageReplacementCounts[$kw])) {
					$this->kwPageReplacementCounts[$kw]++;
				} else {
					$this->kwPageReplacementCounts[$kw] = self::MAX_REPLACEMENTS_PER_KEYWORD;
				}

				//if we reached maximum number of replacements with this kw, skip next processing
				if ($this->kwPageReplacementCounts[$kw] > self::MAX_REPLACEMENTS_PER_KEYWORD) {
					unset($keywords[$kw]);
					return;
				}

				//add text before keyword
				if ($pos > 0) {
					$domTextStart = $document->createTextNode(substr($node->nodeValue, 0, $pos));
					$node->parentNode->insertBefore($domTextStart, $node);
				} else {
					$domTextStart = null;
				}

				//add keyword as link
				$linkDom = $document->createElement('a',
					substr($node->nodeValue, $pos, strlen($kw)));
				$linkDom->setAttribute('href', $url[0]);
				$linkDom->setAttribute('title', $url[1]);
				$node->parentNode->insertBefore($linkDom, $node);

				//add text after keyword
				if ($pos+strlen($kw) < strlen($node->nodeValue)) {
					$domTextEnd = $document->createTextNode(substr($node->nodeValue, $pos + strlen($kw)));
					$node->parentNode->insertBefore($domTextEnd, $node);
				} else {
					$domTextEnd = null;
				}

				//process other keywords in text
				if (is_object($domTextStart)) {
					$this->replaceKeywordWithLinks($domTextStart, $document, $keywords);
				}
				if (is_object($domTextEnd)) {
					$this->replaceKeywordWithLinks($domTextEnd, $document, $keywords);
				}

				//remove processed node
				$node->parentNode->removeChild($node);
				return;
			}
			unset($keywords[$kw]);
		}
	}

	private function getKeywords() {
		//TODO: load real list of keywords from DB, cache it to memory,
		// so it will be loaded just once from DB for all calls
		$keywords = array(
			'help desk software' => array('/help-desk-software', 'Title about help desk software'),
			'help desk' => array('/desk', 'Title about help desk'),
			'software' => array('/', 'Title about any software'),
			'customers' => array('/customers-software', 'Title about customers'),
			'customer' => array('/customer', 'Title about customer'),
			'ticketing system' => array('/ticketing-system', 'Title about ticketing system'),
		);

		//don't return keywords, where we reached limit of replacements - optimisation
		foreach ($this->kwPageReplacementCounts as $kw => $cnt) {
			if ($cnt > MAX_REPLACEMENTS_PER_KEYWORD) {
				unset($keywords[$kw]);
			}
		}

		return $keywords;
	}

	private function findTextDOMElements(DOMNode $dom, DOMDocument $document) {
		if (!empty($dom->childNodes)) {
			foreach ($dom->childNodes as $node) {

				//TODO implement attribute for skipping replacements
				// (e.g. in breadcrumbs or similar elements we don't want it) ...
				// designer can add this special attribute and we will not replace the keywords with links there
				// attribute name can be e.g. urlslab-no-keyword-links

				if ($node instanceof DOMText && strlen(trim($node->nodeValue)) > 1)	{
					$this->replaceKeywordWithLinks($node, $document, $this->getKeywords());
				} else {
					if (count($this->linkCounts) > 0 && preg_match('/^[hH][0-9]$/', $node->nodeName)) {
						$this->cntParagraphLinkReplacements = array_shift($this->linkCounts);
					}

					//skip processing some types of HTML elements
					if (!in_array(strtolower($node->nodeName), array('a', 'button', 'input')) &&
						!preg_match('/^[hH][0-9]$/', $node->nodeName)) {
						$this->findTextDOMElements($node, $document);
					}
				}
			}
		}
	}

	public function theContentHook($content)
	{
		$document = new DOMDocument();
		$document->strictErrorChecking = false;
		try {
			$document->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
			$this->initLinkCounts($document);
			$this->findTextDOMElements($document, $document);
			return $document->saveHTML();
		} catch (Exception $e) {
			return $content . "\n" . "<!---\n Error:" . str_replace(">", ' ', $e->getMessage()) . "\n--->";
		}
	}

	private function initLinkCounts(DOMDocument $document) {
		$this->cntPageLinkReplacements = 0;
		$this->cntPageLinks = 0;
		$this->kwPageReplacementCounts = array();
		$this->linkCounts = array();
		$cnt = 0;
		$xpath = new DOMXPath($document);
		$table_data =$xpath->query("//a|//*[starts-with(name(),'h')]");
		$hasLinksBeforeH1 = false;
		$hadHAlready = false;
		foreach ($table_data as $element) {
			if ($element->nodeName == 'a') {
				if (!$hadHAlready) {
					$hasLinksBeforeH1 = true;
				}
				$this->cntPageLinks++;
				$cnt++;
			}
			if (substr($element->nodeName, 0, 1) == 'h') {
				$hadHAlready = true;
				$this->linkCounts[] = $cnt;
				$cnt = 0;
			}
		}
		$this->linkCounts[] = $cnt;

		if ($hasLinksBeforeH1) {
			$this->cntParagraphLinkReplacements = array_shift($this->linkCounts);
		}
	}
}
