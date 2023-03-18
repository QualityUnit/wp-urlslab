# OpenAPI\Client\SummaryApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getSummary()**](SummaryApi.md#getSummary) | **POST** /v1/summary | Get summarization data for url |


## `getSummary()`

```php
getSummary($domain_data_retrieval_updatable_retrieval): \OpenAPI\Client\Model\DomainDataRetrievalSummaryResponse[]
```

Get summarization data for url

Get summarization data for url

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\SummaryApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_data_retrieval_updatable_retrieval = array(new \OpenAPI\Client\Model\DomainDataRetrievalUpdatableRetrieval()); // \OpenAPI\Client\Model\DomainDataRetrievalUpdatableRetrieval[]

try {
    $result = $apiInstance->getSummary($domain_data_retrieval_updatable_retrieval);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SummaryApi->getSummary: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_data_retrieval_updatable_retrieval** | [**\OpenAPI\Client\Model\DomainDataRetrievalUpdatableRetrieval[]**](../Model/DomainDataRetrievalUpdatableRetrieval.md)|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainDataRetrievalSummaryResponse[]**](../Model/DomainDataRetrievalSummaryResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
