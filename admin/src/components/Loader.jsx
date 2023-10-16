import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';

import { ReactComponent as LoaderAnim } from '../assets/images/ajax-loader.svg';
import { ReactComponent as LoaderAnimWhite } from '../assets/images/ajax-loader-white.svg';

import '../assets/styles/components/_Loader.scss';

export default function Loader( { children, className, style, isFullscreen, isWhite, overlay } ) {
	const { __ } = useI18n();

	return (
		<div
			className={ classNames( [
				'urlslab-loader',
				className ? className : null,
				isFullscreen ? 'fullscreen' : null,
				isWhite ? 'white' : null,
				overlay ? 'overlay' : null,
			] ) }
			style={ style }
		>
			{ ! isWhite

				? <LoaderAnim className="urlslab-loader-anim" />
				: <LoaderAnimWhite className="urlslab-loader-anim" />
			}
			<span className="urlslab-loader-text">
				{ children ? children : __( 'Loading…' ) }
			</span>
		</div>
	);
}
