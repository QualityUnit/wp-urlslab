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
	 * @param  closeIcon
	 * @param  modalId
	 * @param  pageParam
	 * @param  tabParam
	 * @param  keywordHash
	 * @param  keyword
	 * @param  keywordLink
	 * @param  keywordPrio
	 * @param  keywordLang
	 * @param  keywordFilter
	 */
	function createHTMLPopupKeyword(
		closeIcon,
		modalId,
		pageParam,
		tabParam,
		keywordHash = '',
		keyword = '',
		keywordLink = '',
		keywordPrio = '',
		keywordLang = '',
		keywordFilter = '' ) {
		return $(
			`
			< div id = "${ modalId }" class = "urlslab-modal modal" >
			< div >
				< h2 > ${ keyword != '' ? `Edit ${ keyword }` : 'Add Keyword' } < / h2 >
				< button data - close - modal - id = "${ modalId }" class = "modal-close" >
					< img src = "${ closeIcon }" alt = "info" width = "17px" >
				< / button >
			< / div >
			< form method = "post" class = "col-12" action = "?page=${ pageParam }&tab=${ tabParam }&action=keyword-edit" >
				< input type = "hidden" name = "keywordHash" value = "${ keywordHash }" >
				< div class = "form-item mar-bottom-1" >
					< label for = "keyword" > Keyword: < / label >
					< input id = "keyword" name = "keyword" type = "text" value = "${ keyword }" placeholder = "Keyword..." >
				< / div >
				< div class = "form-item mar-bottom-1" >
					< label for = "keyword-link" > Keyword Link: < / label >
					< input id = "keyword-link" name = "keyword-link" type = "text" value = "${ keywordLink }" placeholder = "Keyword Link..." >
				< / div >
				< div class = "form-item mar-bottom-1" >
					< label for = "keyword-prio" > Keyword Priority: < / label >
					< input id = "keyword-prio" name = "keyword-prio" type = "text" value = "${ keywordPrio }" placeholder = "10" >
				< / div >
				< div class = "form-item mar-bottom-1" >
					< label for = "keyword-lang" > Keyword Lang: < / label >
					< input id = "keyword-lang" name = "keyword-lang" type = "text" value = "${ keywordLang }" placeholder = "all" >
				< / div >
				< div class = "form-item mar-bottom-1" >
					< label for = "keyword-url-filter" > Keyword Url Filter: < / label >
					< input id = "keyword-url-filter" name = "keyword-url-filter" type = "text" value = "${ keywordFilter }" placeholder = ".*" >
				< / div >
				< input type = "submit" name = "submit" class = "button" value = "${ keyword != '' ? 'Edit Keyword' : 'Add Keyword' }" >
			< / form >
			< / div >
			`
		);
	}

	function createHTMLPopupUrlRelation(
		closeIcon,
		modalId,
		pageParam,
		tabParam,
		srcUrlHash = '',
		srcUrl = '',
		destUrlHash = '',
		destUrl = '' ) {
		return $(
			`
			< div id = "${ modalId }" class = "urlslab-modal modal" >
			< div >
				< h2 > ${ srcUrlHash != '' ? 'Edit Url Relation' : 'Add Url Relation' } < / h2 >
				< button data - close - modal - id = "${ modalId }" class = "modal-close" >
					< img src = "${ closeIcon }" alt = "info" width = "17px" >
				< / button >
			< / div >
			< form method = "post" action = "?page=${ pageParam }&tab=${ tabParam }&action=url-relation-edit" >
				< input type = "hidden" name = "srcUrlHash" value = "${ srcUrlHash }" >
				< input type = "hidden" name = "destUrlHash" value = "${ destUrlHash }" >
				< label for = "src-url" > Src URL: < / label >
				< input id = "src-url" name = "srcUrl" type = "text" value = "${ srcUrl }" placeholder = "Src URL..." >
				< br class = "clear" / >
				< br class = "clear" / >
				< label for = "dest-url" > Dest URL: < / label >
				< input id = "dest-url" name = "destUrl" type = "text" value = "${ destUrl }" placeholder = "Dest URL..." >
				< br class = "clear" / >
				< br class = "clear" / >
				< input type = "submit" name = "submit" class = "button" value = "${ srcUrlHash != '' ? 'Edit Url Relation' : 'Add Url Relation' }" >
			< / form >
			< / div >
			`
		);
	}

	//# Cron
	var urlslabCronObj = {

		start: function () {
			if (urlslabCronObj.is_running()) {
				return;
			}
			urlslabCronObj.running = true;
			urlslabCronObj.callAjaxMethod();
		},

		stop: function () {
			urlslabCronObj.running = false;
		},

		is_running: function () {
			return urlslabCronObj.running;
		},

		callAjaxMethod:function(){
			if (urlslabCronObj.running) {
				wp.ajax.post( "urlslab_exec_cron", {} )
					.done(
						function(response) {
							urlslabCronObj.callAjaxMethod();
						}
					).fail(
						function( reason ) {
							urlslabCronObj.stop();
						} 
					);
			}
		}
	}


	/** Functions */

	$( document ).ready(
		function() {


			$( '#urlslab-cron-btn' ).on(
				"click",
				function () {
					if (urlslabCronObj.is_running()) {
						urlslabCronObj.stop();
						$( this ).removeClass( "cron-running" );
						$( this ).text( "Start cron" );
					} else {
						urlslabCronObj.start();
						$( this ).addClass( "cron-running" );
						$( this ).text( "Stop cron" );
					}
				}
			);

			//# Modal



			//# Modal - Keyword Modals
			$( '.keyword-edit' ).each(
				function() {
					const urlParams = new URLSearchParams( window.location.search );
					this.blur();
					const closeIcon = $( this ).data( 'close-icon' );
					const keywordHash = $( this ).data( 'keyword-hash' );
					const keyword = $( this ).data( 'keyword' );
					const keywordLink = $( this ).data( 'dest-url' );
					const keywordPrio = $( this ).data( 'prio' );
					const keywordLang = $( this ).data( 'lang' );
					const keywordFilter = $( this ).data( 'url-filter' );
					createHTMLPopupKeyword(
						closeIcon,
						'modal-k-' + keywordHash,
						urlParams.get( 'page' ),
						urlParams.get( 'tab' ) || '',
						keywordHash,
						keyword,
						keywordLink,
						keywordPrio,
						keywordLang,
						keywordFilter
					).appendTo( 'body' ).dialog(
						{
							modal: true,
							dialogClass: 'no-close',
							minWidth: 500,
							autoOpen: false,
							closeOnEscape: true,
							closeText: '',
						}
					);
					$( this ).on(
						'click',
						function() {
							$( '#modal-k-' + keywordHash ).dialog( 'open' );
						}
					);
				}
			);

			const addKeywordBtn = $( '#add-keyword-btn' );
			if ( addKeywordBtn.length ) {
				const closeIcon = addKeywordBtn.data( 'close-icon' );
				const urlParams = new URLSearchParams( window.location.search );
				createHTMLPopupKeyword( closeIcon, 'add-keyword-modal', urlParams.get( 'page' ), urlParams.get( 'tab' ) || '' )
					.appendTo( 'body' ).dialog(
						{
							modal: true,
							dialogClass: 'no-close',
							minWidth: 500,
							autoOpen: false,
							closeOnEscape: true,
							closeText: '',
						 }
					);
					addKeywordBtn.on(
						'click',
						function() {
							event.preventDefault();
							this.blur();
							$( '#add-keyword-modal' ).dialog( 'open' );
						}
					);
			}
			//# Modal - Keyword Modals

			//# Keyword import
			$( '#import-modal' ).dialog(
				{
					modal: true,
					dialogClass: 'no-close',
					minWidth: 500,
					autoOpen: false,
					closeOnEscape: true,
					closeText: '',
				}
			);
			$( '#import-btn' ).on(
				'click',
				function() {
					$( '#import-modal' ).dialog( 'open' );
				}
			);
			//# Keyword import

			//# Related resources import
			$( '#related-resources-import-modal' ).dialog(
				{
					modal: true,
					dialogClass: 'no-close',
					minWidth: 500,
					autoOpen: false,
					closeOnEscape: true,
					closeText: '',
				}
			);
			$( '#related-resources-import-btn' ).on(
				'click',
				function() {
					$( '#related-resources-import-modal' ).dialog( 'open' );
				}
			);
			//# Related resources import

			//# Modal - Related Resource Modals
			$( '.url-relation-edit' ).each(
				function() {
					const closeIcon = $( this ).data( 'close-icon' );
					const urlSrcHash = $( this ).data( 'src-url-hash' );
					const urlSrc = $( this ).data( 'src-url' );
					const urlDestHash = $( this ).data( 'dest-url-hash' );
					const urlDest = $( this ).data( 'dest-url' );
					const urlParams = new URLSearchParams( window.location.search );
					createHTMLPopupUrlRelation( closeIcon, 'modal-rr-' + urlSrcHash + urlDestHash, urlParams.get( 'page' ), urlParams.get( 'tab' ) || '', urlSrcHash, urlSrc, urlDestHash, urlDest )
					.appendTo( 'body' ).dialog(
						{
							dialogClass: 'no-close',
							minWidth: 500,
							autoOpen: false,
							closeOnEscape: true,
							closeText: '',
						}
					);
					$( this ).on(
						'click',
						function() {
							$( '#modal-rr-' + urlSrcHash + urlDestHash ).dialog( 'open' );
						}
					);
				}
			);

			const relatedResourceBtn = $( '#add-url-relation-btn' );
			if ( relatedResourceBtn.length ) {
				const closeIcon = relatedResourceBtn.data( 'close-icon' );
				const urlParams = new URLSearchParams( window.location.search );
				createHTMLPopupUrlRelation( closeIcon, 'add-url-relation-modal', urlParams.get( 'page' ), urlParams.get( 'tab' ) || '' )
					.appendTo( 'body' ).dialog(
						{
							modal: true,
							dialogClass: 'no-close',
							minWidth: 500,
							autoOpen: false,
							closeOnEscape: true,
							closeText: '',
						 }
					);
					relatedResourceBtn.on(
						'click',
						function() {
							event.preventDefault();
							this.blur();
							$( '#add-url-relation-modal' ).dialog( 'open' );
						}
					);
			}
			//# Modal - Related Resource Modals

			$( '.modal-close' ).each(
				function() {
					const closeId = '#' + $( this ).data( 'close-modal-id' );
					$( this ).on(
						'click',
						function() {
							$( closeId ).dialog( 'close' );
						}
					);
				}
			);

			//# Modal

			//# Vertical tab
			const urlParams = new URLSearchParams( window.location.search );
			let activeTab = 0;
			if ( urlParams.has( 'sub-tab' ) ) {
				activeTab = urlParams.get( 'sub-tab' );
			}
			$( '#urlslab-vertical-tabs' ).tabs(
				{
					active: activeTab,
				}
			);
			$( '#urlslab-vertical-tabs' ).removeClass( 'd-none' );
			//# Vertical tab

		}
	);
}( jQuery ) );
