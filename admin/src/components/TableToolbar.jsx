import { memo } from 'react';

import ColumnsMenu from '../elements/ColumnsMenu';
import RowCounter from '../components/RowCounter';
import TableActionsMenu from '../elements/TableActionsMenu';
import RefreshTableButton from '../elements/RefreshTableButton';

const TableToolbar = ( { tableActions, noCount, hideActions, noColumnsMenu } ) => {
	return (
		<div className="ma-left flex flex-align-center">
			{ ! noCount &&
				<RowCounter />
			}
			{ ! hideActions &&
				<TableActionsMenu options={ tableActions } className="mr-m" />
			}
			{ ! noColumnsMenu &&
				<ColumnsMenu className="menu-left ml-m" />
			}
			<RefreshTableButton noCount={ noCount } />
		</div>
	);
};

export default memo( TableToolbar );
