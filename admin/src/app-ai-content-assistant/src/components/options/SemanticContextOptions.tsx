import React, { useContext } from 'react';
import { AppContext } from '../../app/context';
import UrlsList from './UrlsList';

const SemanticContextOptions: React.FC = ( ) => {
	const { state } = useContext( AppContext );
	return (
		<div className="urlslab-urls-list flex flex-column">
			<UrlsList urls={ state.semantic_context.urls } />
		</div>
	);
};

export default React.memo( SemanticContextOptions );
