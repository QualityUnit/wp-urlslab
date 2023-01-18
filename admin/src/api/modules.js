import apiFetch from "@wordpress/api-fetch";
import { domain } from "../constants/variables";

export async function fetchModules() {
	try {
		const result = await apiFetch({
			path: `${domain()}/wp-json/urlslab/v1/module`
		}).then((ModulesData) => {
			return ModulesData;
		});
		return result;
	} catch (error) {
		return false;
	}
}

export async function activateModule( slug, active ) {
	try {
		const result = await apiFetch(`${domain()}/wp-json/urlslab/v1/module/${slug}`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
			},
			credentials: 'include',
			body:JSON.stringify({
				active: active,
			})
		});

		return result.json();
	} catch (error) {
		return false;
	}
}
