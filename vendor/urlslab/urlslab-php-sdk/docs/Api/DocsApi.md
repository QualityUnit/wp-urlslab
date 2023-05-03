# OpenAPI\Client\DocsApi

All URIs are relative to https://api.urlslab.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**addDocument()**](DocsApi.md#addDocument) | **PUT** /v1/content/docs | Add Custom Document |
| [**deleteDocument()**](DocsApi.md#deleteDocument) | **DELETE** /v1/content/docs/{id} | Delete Document By Id |
| [**getDocument()**](DocsApi.md#getDocument) | **GET** /v1/content/docs/{id} | Get Document By Id |
| [**searchDocuments()**](DocsApi.md#searchDocuments) | **POST** /v1/content/docs | Get All Documents |


## `addDocument()`

```php
addDocument($domain_docs_doc_index_request): \OpenAPI\Client\Model\DomainAcknowledged
```

Add Custom Document

Add Custom Document

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\DocsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_docs_doc_index_request = new \OpenAPI\Client\Model\DomainDocsDocIndexRequest(); // \OpenAPI\Client\Model\DomainDocsDocIndexRequest | Document to be added

try {
    $result = $apiInstance->addDocument($domain_docs_doc_index_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocsApi->addDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_docs_doc_index_request** | [**\OpenAPI\Client\Model\DomainDocsDocIndexRequest**](../Model/DomainDocsDocIndexRequest.md)| Document to be added | |

### Return type

[**\OpenAPI\Client\Model\DomainAcknowledged**](../Model/DomainAcknowledged.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteDocument()`

```php
deleteDocument($id, $body): \OpenAPI\Client\Model\DomainAcknowledged
```

Delete Document By Id

Delete Document By Id

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\DocsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$body = 'body_example'; // string

try {
    $result = $apiInstance->deleteDocument($id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocsApi->deleteDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **body** | **string**|  | [optional] |

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

## `getDocument()`

```php
getDocument($id, $body): \OpenAPI\Client\Model\DomainDocsDocResponse
```

Get Document By Id

Get Document By Id

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\DocsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$body = 'body_example'; // string

try {
    $result = $apiInstance->getDocument($id, $body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocsApi->getDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **body** | **string**|  | [optional] |

### Return type

[**\OpenAPI\Client\Model\DomainDocsDocResponse**](../Model/DomainDocsDocResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `text/plain`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `searchDocuments()`

```php
searchDocuments($domain_docs_search_request): \OpenAPI\Client\Model\DomainDocsDocResponse
```

Get All Documents

Get All Documents

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: UrlslabApiKeyAuth
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey('X-URLSLAB-KEY', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('X-URLSLAB-KEY', 'Bearer');


$apiInstance = new OpenAPI\Client\Api\DocsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$domain_docs_search_request = new \OpenAPI\Client\Model\DomainDocsSearchRequest(); // \OpenAPI\Client\Model\DomainDocsSearchRequest | search parameters

try {
    $result = $apiInstance->searchDocuments($domain_docs_search_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocsApi->searchDocuments: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **domain_docs_search_request** | [**\OpenAPI\Client\Model\DomainDocsSearchRequest**](../Model/DomainDocsSearchRequest.md)| search parameters | |

### Return type

[**\OpenAPI\Client\Model\DomainDocsDocResponse**](../Model/DomainDocsDocResponse.md)

### Authorization

[UrlslabApiKeyAuth](../../README.md#UrlslabApiKeyAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
