// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import { langName } from '../lib/helpers';

import SingleSelectMenu from './SingleSelectMenu';
import InputField from './InputField';
import MultiSelectMenu from './MultiSelectMenu';

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
				? <SingleSelectMenu
					autoClose={ autoClose }
					items={ langs }
					isFilter={ isFilter }
					name="languages"
					defaultAccept={ defaultAccept }
					checkedId={ checkedId }
					onChange={ ( lang ) => handleSelected( lang ) }
				>
					{ children }
				</SingleSelectMenu>
				: ! multiSelect && <InputField defaultValue={ checkedId } onChange={ ( lang ) => handleSelected( lang ) } />
			}
			{
				langs && multiSelect &&
				<MultiSelectMenu
					items={ langs }
					isFilter={ isFilter }
					checkedItems={ [ checkedId ].flat() }
					onChange={ ( lang ) => handleSelected( lang ) }
				/>
			}
		</>
	);
}
