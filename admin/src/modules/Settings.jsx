// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';
import Loader from '../components/Loader';

export default function Settings( { settingId } ) {
	const queryClient = useQueryClient();
	const settings = queryClient.getQueryData( [ 'settings', settingId ] );

	if ( ! settings?.length ) {
		// queryClient.
		return <Loader />;
	}

	console.log( settings );

	return (
		<div className="urlslab-settingspanel">
			{
				settings.map( ( section ) => {
					return (
						<section className="urlslab-settingspanel-section" key={ section.id }>
							<h2>{ section.title }</h2>
							<p>{ section.description }</p>

							{ section.options.map( ( option ) => {
								return (
									<div className="urlslab-settingspanel-option" key={ option.id }>
										<h3>{ option.title }</h3>
										<p>{ option.description }</p>
									</div>
								);
							} ) }
						</section>
					);
				} )
			}
		</div>
	);
}
