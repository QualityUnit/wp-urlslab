# OpenAPI\Client\ScheduleApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createSchedule()**](ScheduleApi.md#createSchedule) | **PUT** /v1/schedule | create a new schedule |
| [**deleteSchedule()**](ScheduleApi.md#deleteSchedule) | **DELETE** /v1/schedule/{id} | delete a schedule |
| [**getSchedule()**](ScheduleApi.md#getSchedule) | **GET** /v1/schedule/{id} | get a specific schedule details |
| [**listSchedules()**](ScheduleApi.md#listSchedules) | **GET** /v1/schedule | get list of all schedules for the user |


## `createSchedule()`

```php
createSchedule($domain_schedule_schedule_conf): \OpenAPI\Client\Model\DomainScheduleAPISchedule[]
```

create a new schedule

Creates a new schedule for the user associated to the API Key. Update not possible

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ScheduleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_schedule_schedule_conf = new \OpenAPI\Client\Model\DomainScheduleScheduleConf(); // \OpenAPI\Client\Model\DomainScheduleScheduleConf

try {
    $result = $apiInstance->createSchedule($domain_schedule_schedule_conf);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ScheduleApi->createSchedule: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_schedule_schedule_conf** | [**\OpenAPI\Client\Model\DomainScheduleScheduleConf**](../Model/DomainScheduleScheduleConf.md)|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainScheduleAPISchedule[]**](../Model/DomainScheduleAPISchedule.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteSchedule()`

```php
deleteSchedule($id, $body): \OpenAPI\Client\Model\DomainAcknowledged
```

delete a schedule

Deletes a schedule for the user associated to the API Key

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ScheduleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->deleteSchedule($id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ScheduleApi->deleteSchedule: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
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

## `getSchedule()`

```php
getSchedule($id, $body): \OpenAPI\Client\Model\DomainScheduleAPISchedule
```

get a specific schedule details

Returns the details of a specific schedule

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ScheduleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->getSchedule($id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ScheduleApi->getSchedule: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainScheduleAPISchedule**](../Model/DomainScheduleAPISchedule.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listSchedules()`

```php
listSchedules($body): \OpenAPI\Client\Model\DomainScheduleAPISchedule[]
```

get list of all schedules for the user

Returns a list of all schedules for the user associated to the API Key

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\ScheduleApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = 'body_example'; // string | API Key to be validated

try {
    $result = $apiInstance->listSchedules($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ScheduleApi->listSchedules: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **body** | **string**| API Key to be validated | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainScheduleAPISchedule[]**](../Model/DomainScheduleAPISchedule.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
