// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import { langName } from '../lib/helpers';

import SortMenu from '../elements/SortMenu';
import InputField from './InputField';
import FilterMenu from './FilterMenu';

export default function LangMenu( { noAll, multiSelect, isFilter, children, defaultAccept, onChange, checkedId, autoClose } ) {
	const queryClient = useQueryClient();
	const langData = queryClient.getQueryData( [ 'languages' ] );

	const sortLangs = ( langEntries ) => {
		return Object.fromEntries(
			Object.entries( langEntries ).sort( ( [ , a ], [ , b ] ) => a.localeCompare( b ) )
		);
	};

	if ( noAll ) {
		delete langData.all;
	}

	if ( ! langData[ checkedId ] ) {
		langData[ checkedId ] = langName( checkedId );
		queryClient.setQueryData( [ 'languages' ], sortLangs( langData ) );
		queryClient.invalidateQueries( [ 'languages' ] );
	}

	const langs = sortLangs( langData );

	const handleSelected = ( lang ) => {
		if ( onChange ) {
			onChange( lang );
		}
	};

	return (
		<>
			{ langs && ! multiSelect
				? <SortMenu
					autoClose={ autoClose }
					items={ langs }
					isFilter={ isFilter }
					name="languages"
					defaultAccept={ defaultAccept }
					checkedId={ checkedId }
					onChange={ ( lang ) => handleSelected( lang ) }
				>
					{ children }
				</SortMenu>
				: ! multiSelect && <InputField defaultValue={ checkedId } onChange={ ( lang ) => handleSelected( lang ) } />
			}
			{
				langs && multiSelect &&
				<FilterMenu
					items={ langs }
					isFilter={ isFilter }
					checkedItems={ [ checkedId ].flat() }
					onChange={ ( lang ) => handleSelected( lang ) }
				/>
			}
		</>
	);
}
