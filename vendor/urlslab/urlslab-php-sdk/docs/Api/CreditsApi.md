# OpenAPI\Client\CreditsApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getCreditEvents()**](CreditsApi.md#getCreditEvents) | **GET** /v1/credits/events | Fetching Latest Events of user credit |
| [**getCreditEventsAggregation()**](CreditsApi.md#getCreditEventsAggregation) | **GET** /v1/credits/events/aggregation | Fetching aggregated credit events |
| [**getLastCreditStatus()**](CreditsApi.md#getLastCreditStatus) | **GET** /v1/credits | Fetching Last Status of user credit |


## `getCreditEvents()`

```php
getCreditEvents($limit, $last_id, $last_timestamp, $body): \OpenAPI\Client\Model\DomainUserCreditCreditEventResponse
```

Fetching Latest Events of user credit

Fetching Latest Events of user credit

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\CreditsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$limit = 56; // int | limit of events
$last_id = 'last_id_example'; // string | lastId of event
$last_timestamp = 56; // int | search from timestamp
$body = 'body_example'; // string

try {
    $result = $apiInstance->getCreditEvents($limit, $last_id, $last_timestamp, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CreditsApi->getCreditEvents: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **limit** | **int**| limit of events | [optional] |
| **last_id** | **string**| lastId of event | [optional] |
| **last_timestamp** | **int**| search from timestamp | [optional] |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainUserCreditCreditEventResponse**](../Model/DomainUserCreditCreditEventResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getCreditEventsAggregation()`

```php
getCreditEventsAggregation($agg, $from, $limit, $body): \OpenAPI\Client\Model\DomainUserCreditAggregatedCreditResponse
```

Fetching aggregated credit events

Fetching aggregated credit events

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\CreditsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$agg = 'day'; // string
$from = 56; // int
$limit = 50; // int
$body = 'body_example'; // string

try {
    $result = $apiInstance->getCreditEventsAggregation($agg, $from, $limit, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CreditsApi->getCreditEventsAggregation: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **agg** | **string**|  | [optional] [default to &#39;day&#39;] |
| **from** | **int**|  | [optional] |
| **limit** | **int**|  | [optional] [default to 50] |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainUserCreditAggregatedCreditResponse**](../Model/DomainUserCreditAggregatedCreditResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getLastCreditStatus()`

```php
getLastCreditStatus($body): \OpenAPI\Client\Model\DomainUserCreditCreditStatus
```

Fetching Last Status of user credit

Fetching Last Status of user credit

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\CreditsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string

try {
    $result = $apiInstance->getLastCreditStatus($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CreditsApi->getLastCreditStatus: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainUserCreditCreditStatus**](../Model/DomainUserCreditCreditStatus.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
