import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';

import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box/Box';

const DataBox = ( { title, loadingText, loading, renderHiddenWhileLoading, children, className, color, variant, sx } ) => {
	const { __ } = useI18n();

	if ( ! loading && ! children ) {
		return null;
	}
	return (
		<Sheet
			{ ...( variant ? { variant } : null ) }
			{ ...( color ? { color } : null ) }
			className={
				classNames( [
					className ? className : null,
					loading ? 'flex flex-align-center flex-justify-center fs-m' : null,
				] )
			}
			sx={ {
				...sx,
				...( loading ? { p: 2 } : null ),
			} }
		>
			{ loading
				? <>
					<CircularProgress size="sm" sx={ { mr: 1 } } />
					{ loadingText ? loadingText : __( 'Loading…' ) }

					{ /* we might need to render hidden children that removes loading state via callback */ }
					{ renderHiddenWhileLoading && (
						<Box sx={ { display: 'none' } }>
							{ children }
						</Box>
					) }
				</>
				: <>
					{ title && <Typography color={ color ? color : 'neutral' } level="body-xs" sx={ ( theme ) => ( { textTransform: 'uppercase', fontWeight: 600, mb: theme.spacing( 1 ) } ) }>{ title }</Typography> }
					{ children }
				</>
			}
		</Sheet>
	);
};

export default DataBox;
