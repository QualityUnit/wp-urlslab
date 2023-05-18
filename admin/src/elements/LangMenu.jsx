// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import { langName } from '../lib/helpers';

import SingleSelectMenu from './SingleSelectMenu';
import InputField from './InputField';
import MultiSelectMenu from './MultiSelectMenu';

export default function LangMenu( { noAll, multiSelect, isFilter, children, defaultAccept, onChange, defaultValue, autoClose } ) {
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

	if ( ! langData[ defaultValue ] ) {
		langData[ defaultValue ] = langName( defaultValue );
		// queryClient.setQueryData( [ 'languages' ], sortLangs( langData ) );
		queryClient.invalidateQueries( [ 'languages' ] );
	}

	// const langs = sortLangs( langData );

	const handleSelected = ( lang ) => {
		if ( onChange ) {
			onChange( lang );
		}
	};

	return (
		<>
			{ langData && ! multiSelect
				? <SingleSelectMenu
					autoClose={ autoClose }
					items={ langData }
					isFilter={ isFilter }
					name="languages"
					defaultAccept={ defaultAccept }
					defaultValue={ defaultValue }
					onChange={ ( lang ) => handleSelected( lang ) }
				>
					{ children }
				</SingleSelectMenu>
				: ! multiSelect && <InputField defaultValue={ defaultValue } onChange={ ( lang ) => handleSelected( lang ) } />
			}
			{
				langData && multiSelect &&
				<MultiSelectMenu
					items={ langData }
					defaultValue={ [ defaultValue ].flat() }
					onChange={ ( lang ) => handleSelected( lang ) }
				/>
			}
		</>
	);
}
