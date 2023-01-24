import Switch from '../elements/Switch';
export default function LazyLoading( { settings } ) {
	const handleOption = ( option ) => {
		console.log( option );
	};

	return (
		settings
			? ( settings.map( ( setting ) => {
				return setting.options.map( ( option ) => {
					return (
						<>
							<button onClick={ () => handleOption( option ) }>{ option.title }</button>
							<br />
						</>
					);
				} );
			} ) )
			: null
	);
}
