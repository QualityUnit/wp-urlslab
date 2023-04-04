import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { fetchData } from '../api/fetching';
import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function DetailsPanel( { options, handlePanel } ) {
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const { title, text, slug, url, showKeys, listId } = options;

	const { data } = useQuery( {
		queryKey: [ slug, `${ url }` ],
		queryFn: () => fetchData( `${ slug }/${ url }` ).then( ( res ) => res ),
		refetchOnWindowFocus: false,
	} );

	function hidePanel() {
		handleClose();
		if ( handlePanel ) {
			handlePanel();
		}
	}

	return (
		<div className="urlslab-panel-wrap wide urlslab-panel-floating fadeInto">
			<div className="urlslab-panel Details">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
					<p>{ text }</p>
				</div>
				<div className="mt-l">
					<div className="table-container">
						{ data &&
						<table>
							<thead>
								<tr >{ showKeys.map( ( key ) => <th className="pr-m" key={ key }>{ key.charAt( 0 ).toUpperCase() + key.slice( 1 ).replaceAll( '_', ' ' ) }</th> ) }</tr>
							</thead>
							<tbody>
								{ data.flat().map( ( row ) => {
									return <tr key={ row[ listId ] } className="">
										{ showKeys.map( ( key ) => {
											return <td className="pr-m" key={ row[ key ] }>
												<div className="limit">
													{ key.includes( 'url' ) ? <a href={ row[ key ] } target="_blank" rel="noreferrer">{ row[ key ] }</a> : row[ key ] }
												</div>
											</td>;
										} ) }
									</tr>;
								} ) }
							</tbody>
						</table>
						}
					</div>
					<div className="flex">
						<Button className="ma-left simple" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
