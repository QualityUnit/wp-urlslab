import { useState, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import SingleSelectMenu from './SingleSelectMenu';
import Switch from './Switch';
import Button from '@mui/joy/Button';
import InputField from './InputField';

export const browsers = {
	'': 'Any', Chrome: 'Chrome', ChromeWebView: 'ChromeWebView', Firefox: 'Firefox', Edg: 'Microsoft Edge', Safari: 'Safari', MSIE: 'Internet Explorer', baiduboxapp: 'Baidubox', SamsungBrowser: 'Samsung Browser', Opera: 'Opera', Brave: 'Brave', Vivaldi: 'Vivaldi',
};

const systems = {
	'': 'Any', Windows: 'Windows', Macintosh: 'macOs', Android: 'Android', iOS: 'iOS', iPad: 'iPadOS', Linux: 'Linux',
};

const bots = {
	Ahrefs: 'Ahrefs', Amazon: 'Amazon', Bing: 'Bing', Facebook: 'Facebook', Google: 'Google', Semrush: 'Semrush', Seznam: 'Seznam', WordPress: 'WordPress', Yandex: 'Yandex',
};

export default function BrowserSelect( { defaultValue, onChange } ) {
	const [ isBot, setIsBot ] = useState( defaultValue?.bot );
	const [ manual, setManual ] = useState( defaultValue?.manual );
	const [ browser, setBrowser ] = useState( defaultValue?.browser && defaultValue?.browser[ 0 ] );
	const [ system, setSystem ] = useState( defaultValue?.system );
	const [ bot, setBot ] = useState( defaultValue?.bot );

	const handleTypeChange = ( val ) => {
		setIsBot( val );
		setManual( false );
	};

	const browserValue = useMemo( ( ) => {
		/* Values set inside array with ! in front of string means:
    First value: {col: 'browser', op: 'LIKE', val: 'somebrowser'}
    Other values with ! in front: {col: 'browser', op: 'NOTLIKE', val: 'somebrowser'}
    This is to prevent searching for unwanted browsers with same LIKE keyword in UA string
    */

		if ( browser === 'Safari' ) {
			return [ browser, '!Chrome', '!CriOS', '!FxiOS', '!Edg' ]; // Not chrome, not Chrome on iOS
		}
		if ( browser === 'Chrome' ) {
			return [ browser, '!SamsungBrowser', '!baiduboxapp', '!Edg', '!Opera', '!Vivaldi', '!Brave' ];
		}
		return [ browser ];
	}, [ browser ] );

	const handleBrowser = ( browserval ) => {
		setBrowser( browserval );
		onChange( { browser: browserValue, system } );
	};

	const handleSystem = ( systemval ) => {
		setSystem( systemval );
		onChange( { browser: browserValue, system: systemval } );
	};

	const handleBot = ( botval ) => {
		setBot( botval );
		onChange( { bot: botval } );
	};

	const handleInput = ( val ) => {
		setBrowser( val );
		onChange( { browser: [ val ], manual: true } );
	};

	return <>
		{ ! isBot
			? ! manual && <div className="flex mb-m">
				<SingleSelectMenu
					className="mr-s"
					items={ browsers }
					name="browsers"
					defaultAccept
					autoClose
					defaultValue={ browser || Object.keys( browsers )[ 0 ] }
					onChange={ handleBrowser }
				>
					{ __( 'Browser' ) }
				</SingleSelectMenu>
				<SingleSelectMenu
					className="ml-s"
					items={ systems }
					name="systems"
					defaultAccept
					autoClose
					defaultValue={ system || Object.keys( systems )[ 0 ] }
					onChange={ handleSystem }
				>
					{ __( 'Operating System' ) }
				</SingleSelectMenu>
			</div>
			: ! manual && <SingleSelectMenu
				className="mb-m"
				items={ bots }
				name="bots"
				defaultAccept
				autoClose
				defaultValue={ bot || Object.keys( bots )[ 0 ] }
				onChange={ handleBot }
			>
				{ __( 'Bot/Crawler' ) }
			</SingleSelectMenu>
		}
		{ manual &&
			<InputField className="mb-m" label={ __( 'User agent string' ) } autoFocus defaultValue={ browser } placeholder={ __( 'Enter search term' ) } onKeyUp={ ( event ) => handleInput( event.target.value ) } />
		}
		<div className="flex">
			<Switch label={ __( 'Browser is bot' ) } defaultValue={ isBot } key={ manual } onChange={ handleTypeChange } textAfter />
			<Button
				variant="text"
				color="primary"
				onClick={ () => {
					setIsBot( false );
					setManual( ( mode ) => ! mode );
				} }
				sx={ { ml: 'auto', paddingRight: 0 } }
				size="xs"
			>{ manual ? __( 'Hide search field' ) : __( 'Show search field' ) }</Button>
		</div>
	</>;
}
