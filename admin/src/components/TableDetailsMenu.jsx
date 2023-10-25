import { memo } from 'react';
import SimpleButton from '../elements/SimpleButton';

function TableDetailsMenu( { menu, activeSection, activateSection } ) {
	const activator = ( menukey ) => {
		if ( menukey === activeSection ) {
			return 'active';
		}
		return '';
	};

	return <div className="urlslab-moduleView-headerTop">
		{
			Object.entries( menu ).map( ( [ key, value ] ) => {
				return (
					<SimpleButton
						key={ key }
						className={ activator( key ) }
						onClick={ () => activateSection( key ) }
					>
						{ value }
					</SimpleButton>
				);
			} )
		}
	</div>;
}

export default memo( TableDetailsMenu );
