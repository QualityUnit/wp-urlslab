/* eslint-disable import/no-extraneous-dependencies */

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
import Windows from '@egoistdeveloper/operating-system-logos/src/48x48/WIN.png';
import macOs from '@egoistdeveloper/operating-system-logos/src/48x48/MAC.png';
import iOS from '@egoistdeveloper/operating-system-logos/src/48x48/IOS.png';
import Linux from '@egoistdeveloper/operating-system-logos/src/48x48/LIN.png';
import Android from '@egoistdeveloper/operating-system-logos/src/48x48/AND.png';

export default function BrowserIcon( { browserName, osName } ) {
	const browserNameOk = browserName?.replaceAll( ' ', '' );
	const osNameOk = osName?.replaceAll( ' ', '' );
	const browserIcons = {
		Chrome,
		ChromeWebView: Chrome,
		Firefox,
		Edge,
		Safari,
		IE,
		baiduboxapp: Chrome,
		WebKit,
		MobileSafari,
		SamsungBrowser,
		Opera,
		Brave,
		Vivaldi,
	};

	const osIcons = {
		Windows,
		macOs,
		MacOS: macOs,
		iOS,
		Linux,
		Android,
	};

	return (
		<div className="flex flex-align-center">
			{
				browserIcons[ browserNameOk ]
					? <img className="browserIcon" src={ browserIcons[ browserNameOk ] } alt={ browserName } />
					: <img className="browserIcon" src={ Generic } alt="Unknown browser" />
			}
			{
				osIcons[ osNameOk ]
					? <img className="ml-s browserIcon" src={ osIcons[ osNameOk ] } alt={ osName } />
					: <strong className="limit">&nbsp;{ osName }</strong>
			}
		</div>
	);
}
