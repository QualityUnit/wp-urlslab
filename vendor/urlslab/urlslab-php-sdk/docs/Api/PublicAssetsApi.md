# OpenAPI\Client\PublicAssetsApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**loadCarouselThumbnail()**](PublicAssetsApi.md#loadCarouselThumbnail) | **GET** /v1/public/screenshot/thumbnail/carousel/{bucketId} | Fetching thumbnail of carousel screenshot of url |
| [**loadFullPageThumbnail()**](PublicAssetsApi.md#loadFullPageThumbnail) | **GET** /v1/public/screenshot/thumbnail/fullpage/{bucketId} | Fetching thumbnail of fullpage screenshot of url |
| [**loadImageCarousel()**](PublicAssetsApi.md#loadImageCarousel) | **GET** /v1/public/screenshot/carousel/{bucketId} | Fetching carousel screenshot of url |
| [**loadOriginalImage()**](PublicAssetsApi.md#loadOriginalImage) | **GET** /v1/public/screenshot/fullpage/{bucketId} | Fetching fullpage screenshot of url |
| [**loadTechnologyLogo()**](PublicAssetsApi.md#loadTechnologyLogo) | **GET** /v1/public/technologies/logos/{iconName} | Fetching icon logo of technology |


## `loadCarouselThumbnail()`

```php
loadCarouselThumbnail($bucket_id, $body): \SplFileObject
```

Fetching thumbnail of carousel screenshot of url

Fetching thumbnail of carousel screenshot of url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\PublicAssetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$bucket_id = 'bucket_id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->loadCarouselThumbnail($bucket_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PublicAssetsApi->loadCarouselThumbnail: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **bucket_id** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

**\SplFileObject**

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `image/png`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `loadFullPageThumbnail()`

```php
loadFullPageThumbnail($bucket_id, $body): \SplFileObject
```

Fetching thumbnail of fullpage screenshot of url

Fetching thumbnail of fullpage screenshot of url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\PublicAssetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$bucket_id = 'bucket_id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->loadFullPageThumbnail($bucket_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PublicAssetsApi->loadFullPageThumbnail: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **bucket_id** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

**\SplFileObject**

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `image/png`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `loadImageCarousel()`

```php
loadImageCarousel($bucket_id, $body): \SplFileObject
```

Fetching carousel screenshot of url

Fetching carousel screenshot of url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\PublicAssetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$bucket_id = 'bucket_id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->loadImageCarousel($bucket_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PublicAssetsApi->loadImageCarousel: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **bucket_id** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

**\SplFileObject**

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `image/png`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `loadOriginalImage()`

```php
loadOriginalImage($bucket_id, $body): \SplFileObject
```

Fetching fullpage screenshot of url

Fetching fullpage screenshot of url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\PublicAssetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$bucket_id = 'bucket_id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->loadOriginalImage($bucket_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PublicAssetsApi->loadOriginalImage: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **bucket_id** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

**\SplFileObject**

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `image/png`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `loadTechnologyLogo()`

```php
loadTechnologyLogo($icon_name, $body): \SplFileObject
```

Fetching icon logo of technology

Fetching icon logo of technology

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\PublicAssetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$icon_name = 'icon_name_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->loadTechnologyLogo($icon_name, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PublicAssetsApi->loadTechnologyLogo: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **icon_name** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

**\SplFileObject**

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `image/png`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
