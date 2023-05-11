( function() {
	if ( typeof window.WPML_TM !== 'undefined' && typeof window.WPML_TM.editorJobFieldView !== 'undefined' ) {
		window.WPML_TM.editorJobFieldView.prototype.copyField = function() {
			const self = this;
			self.setTranslation( 'Translating...' );

			fetch( window.wpApiSettings.root + 'urlslab/v1/content-generator/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					'X-WP-Nonce': window.wpApiSettings.nonce,
				},
				body: JSON.stringify( {
					source_lang: window.WpmlTmEditorModel.languages.source_lang,
					target_lang: window.WpmlTmEditorModel.languages.target_lang,
					original_text: self.getOriginal(),
				} ),
				credentials: 'include',
			} ).then( ( response ) => {
				if ( response.status ) {
					return response.json();
				}
				throw new Error( 'Translation request failed' );
			} ).then( ( data ) => {
				self.setTranslation( data.translation );
			} ).catch( ( ) => {
				self.setTranslation( self.getOriginal() );
			} );
		};
	}
}() );
