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

	function createHTMLPopupUrlRelation(
		pageParam,
		tabParam,
		srcUrlHash = '',
		srcUrl = '',
		destUrlHash = '',
		destUrl = '' ) {
		return $( `
		<div>
			<h2>${ srcUrlHash != '' ? 'Edit Url Relation' : 'Add Url Relation' }</h2>
			<form method="post" action="?page=${ pageParam }&tab=${ tabParam }&action=url-relation-edit">
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
		//# Modal - Related Resource Modals
		$( '.url-relation-edit' ).each( function() {
			$( this ).on( 'click', function( event ) {
				event.preventDefault();
				this.blur();
				const urlSrcHash = $( this ).data( 'src-url-hash' );
				const urlSrc = $( this ).data( 'src-url' );
				const urlDestHash = $( this ).data( 'dest-url-hash' );
				const urlDest = $( this ).data( 'dest-url' );
				const urlParams = new URLSearchParams( window.location.search );
				createHTMLPopupUrlRelation( urlParams.get( 'page' ), urlParams.get( 'tab' ), urlSrcHash, urlSrc, urlDestHash, urlDest )
					.appendTo( 'body' ).modal();
			} );
		} );

		$( '#add-url-relation-btn' ).on( 'click', function( event ) {
			event.preventDefault();
			this.blur();
			createHTMLPopupUrlRelation( urlParams.get( 'page' ), urlParams.get( 'tab' ) ).appendTo( 'body' ).modal();
		} );
		//# Modal - Related Resource Modals

		//# Modal

		$( '.modal-close' ).each( function() {
			const closeId = '#' + $( this ).data( 'close-modal-id' );
			$( this ).on( 'click', function() {
				$( closeId ).dialog( 'close' );
			} );
		} );

		//# Keyword import
		$( '#import-modal' ).dialog( {
			autoOpen: false,
			closeOnEscape: true,
			closeText: '',
		} );
		$( '#import-btn' ).on( 'click', function() {
			$( '#import-modal' ).dialog( 'open' );
		} );
		//# Keyword import

		//# Keyword Edit

		$( '.keyword-edit' ).each( function() {
			const modalId = '#' + $( this ).data( 'modal-id' );
			const modal = $( modalId ).dialog( {
				autoOpen: false,
				closeOnEscape: true,
				closeText: '',
			} );
			$( this ).on( 'click', function() {
				modal.removeClass( 'd-none' );
				modal.addClass( 'urlslab-modal' );
				modal.dialog( 'open' );
			} );
		} );

		//# Keyword Edit

		//# Modal

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
