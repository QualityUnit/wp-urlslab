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
	function createPopupHtmlEdit(
		keywordHash,
		keyword,
		keywordLink,
		keywordPrio,
		keywordLang,
		keywordFilter ) {
		return $( `
		<div>
		<h2>Edit ${ keyword }</h2>
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
				<input type="submit" name="submit" class="button" value="Edit Keyword">
			</form>
		</div>
		` );
	}

	function createPopupHtmlAdd() {
		return $( `
		<div>
		<h2>Add Keyword</h2>
			<form method="post">
				<input type="hidden" name="action" value="keyword-add">
				<label for="keyword">Keyword: </label>
				<input id="keyword" name="keyword" type="text" placeholder="Keyword...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-link">Keyword Link: </label>
				<input id="keyword-link" name="keyword-link" type="text" placeholder="Keyword Link...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-prio">Keyword Priority: </label>
				<input id="keyword-prio" name="keyword-prio" type="text" placeholder="Keyword Prio...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-lang">Keyword Lang: </label>
				<input id="keyword-lang" name="keyword-lang" type="text" placeholder="Keyword Lang...">
				<br class="clear"/>
				<br class="clear"/>
				<label for="keyword-url-filter">Keyword Url Filter: </label>
				<input id="keyword-url-filter" name="keyword-url-filter" type="text" placeholder="Keyword Url Filter...">
				<br class="clear"/>
				<br class="clear"/>
				<input type="submit" name="submit" class="button" value="Add Keyword">
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
				createPopupHtmlEdit( keywordHash, keyword, keywordLink, keywordPrio, keywordLang, keywordFilter )
					.appendTo( 'body' ).modal();
			} );
		} );

		$( '#add-keyword-btn' ).on( 'click', function( event ) {
			event.preventDefault();
			this.blur();
			createPopupHtmlAdd().appendTo( 'body' ).modal();
		} );
		//# Modal - Keyword Modals
	} );
}( jQuery ) );
