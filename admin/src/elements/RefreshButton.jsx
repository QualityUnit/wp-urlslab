import { memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import SvgIcon from './SvgIcon';
import IconButton from './IconButton';

function RefreshButton( { tooltipText, loading, handleRefresh, className } ) {
	// run reload animation only when reload running using click on this button
	const [ clicked, setClicked ] = useState( false );

	useEffect( () => {
		// when reload action finished, stop button animation
		if ( ! loading ) {
			setClicked( false );
		}
	}, [ loading ] );

	return <IconButton
		className={ classNames( [
			'refresh-icon',
			clicked && loading ? 'refreshing' : null,
			className ? className : null,

		] ) }
		tooltip={ tooltipText }
		tooltipClass="align-left-0"
		onClick={ () => {
			setClicked( true );
			handleRefresh();
		} }
	>
		<SvgIcon name="refresh" />
	</IconButton>;
}

export default memo( RefreshButton );
