import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import SortMenu from '../elements/SortMenu';

export default function LangMenu( { noAll, isFilter, children, onChange, checkedId } ) {
	const queryClient = useQueryClient();
	const data = queryClient.getQueryData( [ 'languages' ] );

	const langs = useMemo( () => {
		if ( noAll ) {
			delete data.all;
		}
		return data;
	}, [ data, noAll ] );

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
