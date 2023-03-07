import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import SortMenu from '../elements/SortMenu';

export default function LangMenu( { isFilter, children, onChange, checkedId } ) {
	const queryClient = useQueryClient();
	const data = queryClient.getQueryData( [ 'languages' ] );

	const langs = useMemo( () => {
		return data;
	}, [ data ] );

	const handleSelected = ( lang ) => {
		if ( onChange ) {
			onChange( lang );
		}
	};

	return (
		<SortMenu
			items={ langs }
			isFilter={ isFilter }
			name="languages"
			checkedId={ checkedId }
			onChange={ ( lang ) => handleSelected( lang ) }
		>{ children }</SortMenu>
	);
}
