/* eslint-disable import/no-extraneous-dependencies */
import { UAParser } from 'ua-parser-js';

import Chrome from '@browser-logos/chrome/chrome_48x48.png';
import Firefox from '@browser-logos/firefox/firefox_48x48.png';
import Edge from '@browser-logos/edge/edge_48x48.png';
import Safari from '@browser-logos/safari/safari_48x48.png';
import MobileSafari from '@browser-logos/safari-ios/safari-ios_48x48.png';
import WebKit from '@browser-logos/webkit/webkit_48x48.png';
import IE from '@browser-logos/internet-explorer_9-11/internet-explorer_9-11_48x48.png';
import SamsungBrowser from '@browser-logos/samsung-internet/samsung-internet_48x48.png';
import Opera from '@browser-logos/opera/opera_48x48.png';
import Brave from '@browser-logos/brave/brave_48x48.png';
import Vivaldi from '@browser-logos/vivaldi/vivaldi_48x48.png';
import Generic from '@browser-logos/fake/fake_48x48.png';

// OS Icons
import Windows from '../assets/images/os/WIN.png';
import macOs from '../assets/images/os/MAC.png';
import iOS from '../assets/images/os/IOS.png';
import iPadOS from '../assets/images/os/IPA.png';
import Linux from '../assets/images/os/LIN.png';
import Android from '../assets/images/os/AND.png';

// Bots Icons
import Ahrefs from '../assets/images/bots/ahrefs.png';
import Amazon from '../assets/images/bots/amazon.png';
import Bing from '../assets/images/bots/bing.png';
import Facebook from '../assets/images/bots/facebook.png';
import Googlebot from '../assets/images/bots/google.png';
import SemrushBot from '../assets/images/bots/semrush.png';
import SeznamBot from '../assets/images/bots/seznam.png';
import WordPress from '../assets/images/bots/wordpress.png';
import YandexBot from '../assets/images/bots/yandex.png';

export default function BrowserIcon( { uaString } ) {
	const { browser, os, ua } = UAParser( uaString );
	const osName = os.name || ua;
	let botName;
	const browserNameOk = browser.name?.replaceAll( ' ', '' );
	const osNameOk = os.name?.replaceAll( ' ', '' );

	const browserIcons = {
		Chrome, ChromeWebView: Chrome, Firefox, Edge, Safari, IE, baiduboxapp: Chrome, WebKit, MobileSafari, SamsungBrowser, Opera, Brave, Vivaldi,
	};

	const osIcons = {
		Windows, macOs, MacOS: macOs, iOS, iPadOS, iPadOs: iPadOS, Linux, Android,
	};

	const botIcons = {
		Ahrefs, AhrefsSiteAudit: Ahrefs, Amazon, 'Amazon CloudFront': Amazon, bingbot: Bing, Bing, Facebook, 'Google Bot': Googlebot, 'Semrush Bot': SemrushBot, SeznamBot, WordPress, YandexBot,
	};

	if ( osName === ua ) {
		botName = ua.replace( /.+?(S|s)emrush.+/g, 'Semrush Bot' );
		botName = botName.includes( 'Google' ) ? 'Google Bot' : botName;
		botName = botName.includes( 'facebook' ) ? 'Facebook' : botName;
		botName = botName.includes( 'WordPress' ) ? 'WordPress' : botName;
		botName = botName.replace( /(.+?compatible; ?)?([^\/]*)\/.+?$/g, '$2' );
	}

	return (
		<div className="flex flex-align-center">
			{
				browserIcons[ browserNameOk ] && ! botName
					? <img className="browserIcon" src={ browserIcons[ browserNameOk ] } alt={ browser.name } />
					: <img className="browserIcon" src={ botIcons[ botName ] || Generic } alt={ botName } />
			}
			{
				osIcons[ osNameOk ]
					? <img className="ml-s browserIcon" src={ osIcons[ osNameOk ] || Generic } alt={ osName } />
					: <strong className="limit">&nbsp;{ botName }</strong>
			}
		</div>
	);
}
