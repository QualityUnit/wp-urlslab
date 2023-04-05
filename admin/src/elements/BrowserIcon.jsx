/* eslint-disable import/no-extraneous-dependencies */

import Chrome from '@browser-logos/chrome/chrome_48x48.png';
import Firefox from '@browser-logos/firefox/firefox_48x48.png';
import Edge from '@browser-logos/edge/edge_48x48.png';
import Safari from '@browser-logos/safari/safari_48x48.png';
import MobileSafari from '@browser-logos/safari-ios/safari-ios_48x48.png';
import IE from '@browser-logos/internet-explorer_9-11/internet-explorer_9-11_48x48.png';
import SamsungBrowser from '@browser-logos/samsung-internet/samsung-internet_48x48.png';
import Opera from '@browser-logos/opera/opera_48x48.png';
import Brave from '@browser-logos/brave/brave_48x48.png';
import Fake from '@browser-logos/fake/fake_48x48.png';

export default function BrowserIcon( { browserName } ) {
	const browserNameOk = browserName?.replaceAll( ' ', '' );
	const browserIcons = {
		Chrome,
		ChromeWebView: Chrome,
		Firefox,
		Edge,
		Safari,
		IE,
		baiduboxapp: Chrome,
		WebKit: Safari,
		MobileSafari,
		SamsungBrowser,
		Opera,
		Brave,
	};
	return (
		browserNameOk
			? <img className="browserIcon" src={ browserIcons[ browserNameOk ] } alt={ browserName } />
			: <img className="browserIcon" src={ Fake } alt="bot" />
	);
}
