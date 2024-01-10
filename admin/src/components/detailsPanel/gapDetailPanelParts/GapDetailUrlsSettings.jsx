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

const UrlOption = memo( ( { index, url } ) => {
	const { updateOptions } = useContext( ContentGapContext );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	const { urls, processedUrls, processingUrls } = contentGapOptions;

	const processedUrlData = processedUrls[ index ];
	const isError = processedUrlData && processedUrlData.status === 'error';
	const title = `${ __( 'URL' ) } ${ +index.replace( 'url_', '' ) + 1 }`;

	const removeUrl = useCallback( ( urlKey ) => {
		const newUrls = {};
		const newProcessedUrls = {};
		let customIndex = 0;
		Object.entries( urls ).forEach( ( [ key, value ] ) => {
			if ( urlKey !== key ) {
				newUrls[ `url_${ customIndex }` ] = value;
				customIndex++;
			}
		} );
		customIndex = 0;
		Object.entries( processedUrls ).forEach( ( [ key, value ] ) => {
			if ( urlKey !== key ) {
				newProcessedUrls[ `url_${ customIndex }` ] = value;
				customIndex++;
			}
		} );
		updateOptions( { urls: newUrls, processedUrls: newProcessedUrls } );
	}, [ processedUrls, updateOptions, urls ] );

	const updateUrl = useCallback( ( newValue, urlKey ) => {
		const newUrls = { ...urls };
		newUrls[ urlKey ] = newValue;
		updateOptions( { urls: newUrls } );
	}, [ updateOptions, urls ] );

	return (
		<FormControl
			orientation="horizontal"
			sx={ { justifyContent: 'flex-end' } }
		>
			<FormLabel
				textNoWrap
				sx={ { width: 65 } }
			>{ title }</FormLabel>
			<Tooltip
				color={ isError && processedUrlData.url === url ? 'danger' : 'neutral' }
				title={
					( isError && processedUrlData.url === url )
						? <>{ processedUrlData.message }<br />{ url }</>
						: url
				}
			>
				<Input
					className="limit"
					defaultValue={ url }
					onChange={ ( event ) => updateUrl( event.target.value, index ) }
					// simulate our liveUpdate, until custom mui Input component isn't available
					//onChange={ ( event ) => delay( () => updateUrl( event.target.value, key ), 800 )() }
					//onBlur={ ( event ) => event.target.value !== url ? updateUrl( event.target.value, key ) : null }
					startDecorator={
						<>
							{ ( url && processingUrls ) &&
								<MuiIconButton
									size="xs"
									variant="soft"
									color="neutral"
									sx={ { pointerEvents: 'none' } }
								>
									<CircularProgress size="sm" sx={ { '--CircularProgress-size': '17px', '--CircularProgress-thickness': '2px' } } />
								</MuiIconButton>
							}

							{ ( url && ! processingUrls && isError ) &&
								<MuiIconButton
									size="xs"
									variant="soft"
									color={ processedUrlData.url === url ? 'danger' : 'neutral' }
									sx={ { pointerEvents: 'none' } }
								>
									<SvgIcon name="disable" />
								</MuiIconButton>
							}
							{ ( url && ! processingUrls && processedUrlData && processedUrlData.status === 'ok' ) &&
								<MuiIconButton
									size="xs"
									variant="soft"
									color={ processedUrlData.url === url ? 'success' : 'neutral' }
									sx={ { pointerEvents: 'none' } }
								>
									<SvgIcon name="checkmark-circle" />
								</MuiIconButton>
							}
						</>
					}
				/>
			</Tooltip>
			{
				Object.keys( urls ).length > 1 &&
				<IconButton className="ml-s info-grey-darker" onClick={ () => removeUrl( index ) }>
					<Tooltip title={
						// translators: %s is generated text, do not change it
						__( 'Remove %s' ).replace( '%s', title )
					} >
						<Box display="flex" alignItems="center">
							<SvgIcon name="minus-circle" />
						</Box>
					</Tooltip>
				</IconButton>
			}
		</FormControl>
	);
} );

const ColumnWrapper = memo( ( { children } ) => (
	<Box sx={ ( theme ) => ( {
		mb: 1, pr: 2,
		width: 340,
		[ theme.breakpoints.down( 'xxxl' ) ]: {
			width: '50%',
		},
		[ theme.breakpoints.down( 'xl' ) ]: {
			width: '33.3%',
		},
		[ theme.breakpoints.down( 'lg' ) ]: {
			width: '50%',
		},
	} ) }>{ children }</Box>
) );

export default memo( GapDetailUrlsSettings );
