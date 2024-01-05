import { memo } from 'react';
import classNames from 'classnames';

import SvgIcon from './SvgIcon';
import IconButton from './IconButton';

function RefreshButton( { tooltipText, loading, handleRefresh, className } ) {
	return <IconButton
		className={ classNames( [
			'refresh-icon',
			loading ? 'refreshing' : null,
			className ? className : null,

		] ) }
		tooltip={ tooltipText }
		tooltipClass="align-left-0"
		onClick={ handleRefresh }
	>
		<SvgIcon name="refresh" />
	</IconButton>;
}

export default memo( RefreshButton );
