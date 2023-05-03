# OpenAPI\Client\VideoApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getYTMicrodata()**](VideoApi.md#getYTMicrodata) | **POST** /v1/content/video/yt/microdata/{ytVidId} | get microdata for a youtube video |
| [**getYTVidCaption()**](VideoApi.md#getYTVidCaption) | **POST** /v1/content/video/yt/transcribe/{ytVidId} | get transcript for a youtube video |


## `getYTMicrodata()`

```php
getYTMicrodata($yt_vid_id, $body): \OpenAPI\Client\Model\DomainDataRetrievalVideoResponse
```

get microdata for a youtube video

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\VideoApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$yt_vid_id = 'yt_vid_id_example'; // string
$body = 'body_example'; // string

try {
    $result = $apiInstance->getYTMicrodata($yt_vid_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling VideoApi->getYTMicrodata: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **yt_vid_id** | **string**|  | |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainDataRetrievalVideoResponse**](../Model/DomainDataRetrievalVideoResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getYTVidCaption()`

```php
getYTVidCaption($yt_vid_id, $body): \OpenAPI\Client\Model\DomainDataRetrievalVideoResponse
```

get transcript for a youtube video

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\VideoApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$yt_vid_id = 'yt_vid_id_example'; // string
$body = 'body_example'; // string

try {
    $result = $apiInstance->getYTVidCaption($yt_vid_id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling VideoApi->getYTVidCaption: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **yt_vid_id** | **string**|  | |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainDataRetrievalVideoResponse**](../Model/DomainDataRetrievalVideoResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
