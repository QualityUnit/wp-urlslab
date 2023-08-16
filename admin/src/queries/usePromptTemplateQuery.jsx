/*
*   Hook to get supported AI models
*/

import { useQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';

const usePromptTemplateQuery = () => {
	return useQuery( {
		queryKey: [ 'prompt-template' ],
		queryFn: async () => {
			const rsp = await postFetch( 'prompt-template', {} );
			if ( rsp.ok ) {
				const data = await rsp.json();
				return data.reduce( ( obj, item ) => {
					obj[ item.template_name ] = item;
					return obj;
				}, {} );
			}
		},
		refetchOnWindowFocus: false,
	} );
};

export default usePromptTemplateQuery;
