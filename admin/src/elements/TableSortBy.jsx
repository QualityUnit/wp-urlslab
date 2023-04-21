import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import IconButton from './IconButton';
import { ReactComponent as SortIcon } from '../assets/images/icons/icon-sort.svg';
import { ReactComponent as SortASC } from '../assets/images/icons/icon-sort-asc.svg';
import { ReactComponent as SortDESC } from '../assets/images/icons/icon-sort-desc.svg';

const SortBy = memo( ( { props, children } ) => {
	const { sorting, key, onClick } = props;
	const { __ } = useI18n();
	const sortedBy = sorting ? sorting[ key ]?.dir : undefined;

	const sortIcon = () => {
		switch ( sortedBy ) {
			case 'ASC':
				return <SortASC />;
			case 'DESC':
				return <SortDESC />;
			default:
				return <SortIcon />;
		}
	};

	return (
		<div className="flex flex-align-center">
			<IconButton
				onClick={ onClick }
				className={ `mr-s ${ sortedBy && 'active' }` }
				tooltip={ __( 'Sort by' ) }
			>{ sortIcon( ) }
			</IconButton>
			{ children }
		</div>
	);
} );

export default SortBy;
