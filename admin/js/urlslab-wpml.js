jQuery(document).ready(function ($) {
    if (typeof WPML_TM != "undefined" && typeof WPML_TM.editorJobFieldView != "undefined") {
        WPML_TM.editorJobFieldView.prototype.copyField = function () {
            var self = this;
            self.setTranslation("Translating...");

            fetch(wpApiSettings.root + 'urlslab/v1/generator/translate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'X-WP-Nonce': wpApiSettings.nonce
                },
                body: JSON.stringify({
                    source_lang: WpmlTmEditorModel.languages.source_lang,
                    target_lang: WpmlTmEditorModel.languages.target_lang,
                    original_text: self.getOriginal()
                }),
                credentials: 'include',
            }).then((response) => {
                if (response.status) {
                    return response.json();
                } else {
                    throw new Error('Translation request failed');
                }
            }).then((data) => {
                self.setTranslation(data.translation);
            }).catch((post) => {
                self.setTranslation(self.getOriginal());
            });
        }
    }
});