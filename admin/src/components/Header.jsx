import { publicDir } from '../constants/variables';

export default function Header( { pageTitle } ) {
	return (
		<header className="urlslab-header">
			<img className="urlslab-header-logo" src={ `${ publicDir() }/images/urlslab-logo.svg` } alt="URLslab logo" />
			<span className="urlslab-header-slash">/</span>
			<h1 className="urlslab-header-title">{ pageTitle }</h1>
		</header>
	);
}
