const { TextareaControl } = wp.components;
const { useState } = wp.element;
const { __ } = wp.i18n;

const Header = ( props ) => {
	const { attributes, setAttributes } = props;
	const [ questionLong, setQuestionLong ] = useState( false );
	const { question } = attributes;
	const questionLength = 255;

	const handleQuestion = ( value ) => {
		setAttributes( { question: value } );
		setQuestionLong( false );

		if ( value.length >= questionLength ) {
			setAttributes( { question: value.substring( 0, questionLength ) } );
			setQuestionLong( true );
		}
	};

	return (
		<div className="qu-enhancedFAQ__item--question relative">
			<TextareaControl
				value={ question }
				rows="2"
				autoFocus // eslint-disable-line
				onFocus={ ( e ) => e.currentTarget.select() }
				onChange={ ( value ) => handleQuestion( value ) }
			/>
			{ questionLong ? (
				<div className="input__limit">
					{ __(
						'Maximum length of the question is 255 characters',
						'qu-enhanced-faq'
					) }
				</div>
			) : null }
		</div>
	);
};

export default Header;
