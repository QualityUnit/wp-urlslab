# OpenAPI\Client\ApikeyApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createAPIKey()**](ApikeyApi.md#createAPIKey) | **PUT** /v1/apikey | Creates a new API Key for the user |
| [**deleteAPIKey()**](ApikeyApi.md#deleteAPIKey) | **DELETE** /v1/apikey | Deletes an API Key for the user |
| [**listAPIKey()**](ApikeyApi.md#listAPIKey) | **GET** /v1/apikey | Lists all API Keys for the user |
| [**validate()**](ApikeyApi.md#validate) | **GET** /v1/apikey/validate | validate a given API Key |


## `createAPIKey()`

```php
createAPIKey($body): \OpenAPI\Client\Model\DomainAcknowledged
```

Creates a new API Key for the user

Creates a new API Key for the user

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ApikeyApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->createAPIKey($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApikeyApi->createAPIKey: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainAcknowledged**](../Model/DomainAcknowledged.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteAPIKey()`

```php
deleteAPIKey($body): \OpenAPI\Client\Model\DomainAcknowledged
```

Deletes an API Key for the user

Deletes an API Key for the user

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ApikeyApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->deleteAPIKey($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApikeyApi->deleteAPIKey: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainAcknowledged**](../Model/DomainAcknowledged.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listAPIKey()`

```php
listAPIKey($body): \OpenAPI\Client\Model\DomainAcknowledged
```

Lists all API Keys for the user

Lists API Key for the user

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ApikeyApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->listAPIKey($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApikeyApi->listAPIKey: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainAcknowledged**](../Model/DomainAcknowledged.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `validate()`

```php
validate($body): \OpenAPI\Client\Model\DomainAcknowledged
```

validate a given API Key

Validates the API Key provided in the request header

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ApikeyApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->validate($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApikeyApi->validate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainAcknowledged**](../Model/DomainAcknowledged.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
