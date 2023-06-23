<?php

function urlslab_get_screenshot_image_url( string $domain_id, string $url_id, $screenshot_id, string $screenshot_type ): string {
	switch ( $screenshot_type ) {
		case Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL:
			$path = 'https://api.urlslab.com/v1/public/screenshot/thumbnail/fullpage/%s/%s/%s';
			break;
		case Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL:
			$path = 'https://api.urlslab.com/v1/public/screenshot/thumbnail/carousel/%s/%s/%s';
			break;
		case Urlslab_Url_Row::SCREENSHOT_TYPE_FULL_PAGE:
			$path = 'https://api.urlslab.com/v1/public/screenshot/fullpage/%s/%s/%s';
			break;
		case Urlslab_Url_Row::SCREENSHOT_TYPE_CAROUSEL:
		default:
			$path = 'https://api.urlslab.com/v1/public/screenshot/carousel/%s/%s/%s';
			break;
	}

	return sprintf(
		$path,
		$domain_id,
		$url_id,
		$screenshot_id
	);

}
