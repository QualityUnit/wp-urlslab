import { memo, useCallback, useContext } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../../hooks/useTablePanels';

import SvgIcon from '../../../elements/SvgIcon';
import IconButton from '../../../elements/IconButton';

import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import MuiIconButton from '@mui/joy/IconButton';
import CircularProgress from '@mui/joy/CircularProgress';

import { ContentGapContext, maxGapUrls } from '../GapDetailPanel';
import {ColumnWrapper, UrlOption} from "../../../elements/UrlOption";

function GapDetailUrlsSettings() {
	const { loadingUrls, updateOptions } = useContext( ContentGapContext );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	return (
		<Box className="limit flex">
			{ ! loadingUrls
				? <GapUrlsManager urls={ contentGapOptions.urls } onChange={ ( newUrls ) => updateOptions( { urls: newUrls } ) } />
				: <Box className="limit flex flex-align-center flex-justify-center">
					<CircularProgress />
				</Box>
			}
		</Box>
	);
}

const GapUrlsManager = memo( () => {
	const { updateOptions } = useContext( ContentGapContext );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	const isMaxUrls = maxGapUrls <= Object.keys( contentGapOptions.urls ).length;

	const addNewInput = useCallback( () => {
		const newUrl = { [ `url_${ Object.keys( contentGapOptions.urls ).length }` ]: '' };
		updateOptions( { urls: { ...contentGapOptions.urls, ...newUrl } } );
	}, [ contentGapOptions.urls, updateOptions ] );

	return (
		<Box className="limit">
			<Stack direction="row" flexWrap="wrap">

				{ Object.keys( contentGapOptions.urls ).length > 0 &&
					<>
						{
							Object.entries( contentGapOptions.urls ).map( ( [ key, url ] ) => (
								<ColumnWrapper key={
									// make sure to rerender inputs after change of their count, ie. after remove
									`${ key }-${ Object.keys( contentGapOptions.urls ).length }`
								}>
									<UrlOption index={ key } url={ url } />
								</ColumnWrapper>
							) )
						}
					</>
				}
				<ColumnWrapper>
					<Button
						color="neutral"
						variant="soft"
						disabled={ isMaxUrls }
						onClick={ addNewInput }
						startDecorator={ ! isMaxUrls && <SvgIcon name="plus" /> }
						sx={ ( theme ) => ( {
							width: '100%',
							'--Icon-fontSize': theme.vars.fontSize.sm,
						} ) }
					>
						{ isMaxUrls
							? (
							// translators: %i is generated number, do not change it
								__( 'Max %i URLs allowed' ).replace( '%i', maxGapUrls )
							)
							: __( 'Add another URL' )
						}
					</Button>
				</ColumnWrapper>
			</Stack>
		</Box>
	);
} );

export default memo( GapDetailUrlsSettings );
