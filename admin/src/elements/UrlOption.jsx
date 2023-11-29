import { memo, useCallback, useContext } from 'react';
import { ContentGapContext } from '../components/detailsPanel/GapDetailPanel';
import useTablePanels from '../hooks/useTablePanels';
import { __ } from '@wordpress/i18n';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Tooltip from '@mui/joy/Tooltip';
import Input from '@mui/joy/Input';
import MuiIconButton from '@mui/joy/IconButton';
import CircularProgress from '@mui/joy/CircularProgress';
import SvgIcon from './SvgIcon';
import IconButton from './IconButton';
import Box from '@mui/joy/Box';

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
				color={ isError ? 'danger' : 'neutral' }
				title={
					( processedUrlData && processedUrlData.status === 'error' )
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
							{ processingUrls &&
							<MuiIconButton
								size="xs"
								variant="soft"
								color="neutral"
								sx={ { pointerEvents: 'none' } }
							>
								<CircularProgress size="sm" sx={ { '--CircularProgress-size': '17px', '--CircularProgress-thickness': '2px' } } />
							</MuiIconButton>
							}

							{ ( ! processingUrls && processedUrlData && processedUrlData.status === 'error' ) &&
							<MuiIconButton
								size="xs"
								variant="soft"
								color="danger"
								sx={ { pointerEvents: 'none' } }
							>
								<SvgIcon name="disable" />
							</MuiIconButton>
							}
							{ ( ! processingUrls && processedUrlData && processedUrlData.status === 'ok' ) &&
							<MuiIconButton
								size="xs"
								variant="soft"
								color="success"
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

export { UrlOption, ColumnWrapper };
