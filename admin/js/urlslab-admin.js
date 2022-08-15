( function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	/**
	 * Functions
	 *
	 * @param  keywordHash
	 * @param  keyword
	 * @param  keywordLink
	 * @param  keywordPrio
	 * @param  keywordLang
	 * @param  keywordFilter
	 */
	function createHTMLPopupKeyword(
		keywordHash = '',
		keyword = '',
		keywordLink = '',
		keywordPrio = '',
		keywordLang = '',
		keywordFilter = '' ) {
		return $( `
		<div>
		<h2>${ keyword != '' ? `Edit ${ keyword }` : 'Add Keyword' }</h2>
			<form method="post">
				<input type="hidden" name="action" value="keyword-edit">
				<input type="hidden" name="keywordHash" value="${ keywordHash }">
				<label for="keyword">Keyword: </label>
				<input id="keyword" name="keyword" type="text" value="${ keyword }" placeholder="Keyword...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-link">Keyword Link: </label>
				<input id="keyword-link" name="keyword-link" type="text" value="${ keywordLink }" placeholder="Keyword Link...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-prio">Keyword Priority: </label>
				<input id="keyword-prio" name="keyword-prio" type="text" value="${ keywordPrio }" placeholder="Keyword Prio...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-lang">Keyword Lang: </label>
				<input id="keyword-lang" name="keyword-lang" type="text" value="${ keywordLang }" placeholder="Keyword Lang...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-url-filter">Keyword Url Filter: </label>
				<input id="keyword-url-filter" name="keyword-url-filter" type="text" value="${ keywordFilter }" placeholder="Keyword Url Filter...">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" class="button" value="${ keyword != '' ? 'Edit Keyword' : 'Add Keyword' }">
			</form>
		</div>
		` );
	}

	function createHTMLPopupUrlRelation(
		srcUrlHash = '',
		srcUrl = '',
		destUrlHash = '',
		destUrl = '' ) {
		return $( `
		<div>
			<h2>${ srcUrlHash != '' ? 'Edit Url Relation' : 'Add Url Relation' }</h2>
			<form method="post">
				<input type="hidden" name="action" value="url-relation-edit">
				<input type="hidden" name="srcUrlHash" value="${ srcUrlHash }">
				<input type="hidden" name="destUrlHash" value="${ destUrlHash }">
				<label for="src-url">Src URL: </label>
				<input id="src-url" name="srcUrl" type="text" value="${ srcUrl }" placeholder="Src URL...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="dest-url">Dest URL: </label>
				<input id="dest-url" name="destUrl" type="text" value="${ destUrl }" placeholder="Dest URL...">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" class="button" value="${ srcUrlHash != '' ? 'Edit Url Relation' : 'Add Url Relation' }">
			</form>
		</div>
		` );
	}
	/** Functions */

	$( document ).ready( function() {
		//# Modal - Keyword Modals
		$( '.keyword-edit' ).each( function() {
			$( this ).on( 'click', function( event ) {
				event.preventDefault();
				this.blur();
				const keywordHash = $( this ).data( 'keyword-hash' );
				const keyword = $( this ).data( 'keyword' );
				const keywordLink = $( this ).data( 'dest-url' );
				const keywordPrio = $( this ).data( 'prio' );
				const keywordLang = $( this ).data( 'lang' );
				const keywordFilter = $( this ).data( 'url-filter' );
				createHTMLPopupKeyword( keywordHash, keyword, keywordLink, keywordPrio, keywordLang, keywordFilter )
					.appendTo( 'body' ).modal();
			} );
		} );

		$( '#add-keyword-btn' ).on( 'click', function( event ) {
			event.preventDefault();
			this.blur();
			createHTMLPopupKeyword().appendTo( 'body' ).modal();
		} );
		//# Modal - Keyword Modals

		//# Modal - Related Resource Modals
		$( '.url-relation-edit' ).each( function() {
			$( this ).on( 'click', function( event ) {
				event.preventDefault();
				this.blur();
				const urlSrcHash = $( this ).data( 'src-url-hash' );
				const urlSrc = $( this ).data( 'src-url' );
				const urlDestHash = $( this ).data( 'dest-url-hash' );
				const urlDest = $( this ).data( 'dest-url' );
				createHTMLPopupUrlRelation( urlSrcHash, urlSrc, urlDestHash, urlDest )
					.appendTo( 'body' ).modal();
			} );
		} );

		$( '#add-url-relation-btn' ).on( 'click', function( event ) {
			event.preventDefault();
			this.blur();
			createHTMLPopupUrlRelation().appendTo( 'body' ).modal();
		} );
		//# Modal - Related Resource Modals

		//# Vertical tab
		const urlParams = new URLSearchParams( window.location.search );
		let activeTab = 0;
		if ( urlParams.has( 'sub-tab' ) ) {
			activeTab = urlParams.get( 'sub-tab' );
		}
		$( '#urlslab-vertical-tabs' ).tabs( {
			active: activeTab,
		} );
		//# Vertical tab
	} );
}( jQuery ) );
