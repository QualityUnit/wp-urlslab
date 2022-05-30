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
	private $cntParagraphLinkReplacements = 0;


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

	function replaceKeywordWithLinks(DOMText $node, DOMDocument $document, array $keywords) {
		//TODO implement limit number of max links per page and per text paragraph
		if ($this->cntPageLinkReplacements > 10 || $this->cntParagraphLinkReplacements > 3) {
			return;
		}

		if (strlen(trim($node->nodeValue)) < 2) {
			return;
		}


		foreach ($keywords as $kw => $url) {
			if (($pos = strpos(strtolower($node->nodeValue), strtolower($kw))) !== false) {
				$this->cntPageLinkReplacements++;
				$this->cntParagraphLinkReplacements++;

				if ($pos > 0) {
					$domTextStart = $document->createTextNode(substr($node->nodeValue, 0, $pos));
					$node->parentNode->insertBefore($domTextStart, $node);
				}

				$linkDom = $document->createElement('a',
					substr($node->nodeValue, $pos, strlen($kw)) . ' LX');
				$linkDom->setAttribute('href', $url);
				$node->parentNode->insertBefore($linkDom, $node);

				if ($pos+strlen($kw) < strlen($node->nodeValue)) {
					$domTextEnd = $document->createTextNode(substr($node->nodeValue, $pos + strlen($kw)));
					$node->parentNode->insertBefore($domTextEnd, $node);
				}

				if (is_object($domTextStart)) {
					$this->replaceKeywordWithLinks($domTextStart, $document, $keywords);
				}
				if (is_object($domTextEnd)) {
					$this->replaceKeywordWithLinks($domTextEnd, $document, $keywords);
				}
				$node->parentNode->removeChild($node);
				return;
			}
			unset($keywords[$kw]);
		}
	}

	function findTextDOMElements(DOMNode $dom, DOMDocument $document) {
		if (!empty($dom->childNodes)) {
			foreach ($dom->childNodes as $node) {
				if ($node instanceof DOMText && strlen(trim($node->nodeValue)) > 1)	{
					$this->cntParagraphLinkReplacements = 0;
					//TODO: load real list of keywords
					$keywords = array(
						'help desk software' => '/help-desk-software',
						'help desk' => '/desk',
						'software' => '/',
						'customers' => '/customer-software'
					);
					$this->replaceKeywordWithLinks($node, $document, $keywords);
				} else {
					if (!in_array(strtolower($node->nodeName), array('h1', 'h2', 'h3', 'h4', 'a', 'button', 'input'))) {
						$this->findTextDOMElements($node, $document);
					}
				}
			}
		}
	}

	public function theContentHook($content)
	{
		$document = new DOMDocument();
		$document->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		$this->cntPageLinkReplacements = 0;
		$this->findTextDOMElements($document, $document);
		return $document->saveHTML();
	}
}
