# OpenAPI\Client\ContentApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getRelatedUrls()**](ContentApi.md#getRelatedUrls) | **POST** /v1/content/related-urls | Related Urls to a specific url |
| [**memoryLessAugment()**](ContentApi.md#memoryLessAugment) | **POST** /v1/content/augment | Augment based on the query and the given context |


## `getRelatedUrls()`

```php
getRelatedUrls($domain_data_retrieval_related_urls_request): \OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsResponse
```

Related Urls to a specific url

Get related urls to a specific url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ContentApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_data_retrieval_related_urls_request = new \OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest(); // \OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest | Url to get related urls

try {
    $result = $apiInstance->getRelatedUrls($domain_data_retrieval_related_urls_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContentApi->getRelatedUrls: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_data_retrieval_related_urls_request** | [**\OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest**](../Model/DomainDataRetrievalRelatedUrlsRequest.md)| Url to get related urls | |

### Return type

[**\OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsResponse**](../Model/DomainDataRetrievalRelatedUrlsResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `memoryLessAugment()`

```php
memoryLessAugment($domain_data_retrieval_augment_request, $with_source, $ignore_query, $custom_context, $context_mandatory): \OpenAPI\Client\Model\DomainDataRetrievalAugmentResponse
```

Augment based on the query and the given context

Augment based on the query and the given context filter from your data

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ContentApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_data_retrieval_augment_request = new \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest(); // \OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest | Augment request
$with_source = 'false'; // string
$ignore_query = 'false'; // string
$custom_context = 'false'; // string
$context_mandatory = 'true'; // string

try {
    $result = $apiInstance->memoryLessAugment($domain_data_retrieval_augment_request, $with_source, $ignore_query, $custom_context, $context_mandatory);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContentApi->memoryLessAugment: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_data_retrieval_augment_request** | [**\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest**](../Model/DomainDataRetrievalAugmentRequest.md)| Augment request | |
| **with_source** | **string**|  | [optional] [default to &#39;false&#39;] |
| **ignore_query** | **string**|  | [optional] [default to &#39;false&#39;] |
| **custom_context** | **string**|  | [optional] [default to &#39;false&#39;] |
| **context_mandatory** | **string**|  | [optional] [default to &#39;true&#39;] |

### Return type

[**\OpenAPI\Client\Model\DomainDataRetrievalAugmentResponse**](../Model/DomainDataRetrievalAugmentResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
