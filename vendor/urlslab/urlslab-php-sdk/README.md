# OpenAPIClient-php

optimize your website with SEO


## Installation & Usage

### Requirements

PHP 7.4 and later.
Should also work with PHP 8.0.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/urlslab/urlslab-php-sdk.git"
    }
  ],
  "require": {
    "urlslab/urlslab-php-sdk": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/OpenAPIClient-php/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

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

## API Endpoints

All URIs are relative to *https://api.urlslab.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ApikeyApi* | [**createAPIKey**](docs/Api/ApikeyApi.md#createapikey) | **PUT** /v1/apikey | Creates a new API Key for the user
*ApikeyApi* | [**deleteAPIKey**](docs/Api/ApikeyApi.md#deleteapikey) | **DELETE** /v1/apikey | Deletes an API Key for the user
*ApikeyApi* | [**listAPIKey**](docs/Api/ApikeyApi.md#listapikey) | **GET** /v1/apikey | Lists all API Keys for the user
*ApikeyApi* | [**validate**](docs/Api/ApikeyApi.md#validate) | **GET** /v1/apikey/validate | validate a given API Key
*AuthApi* | [**logout**](docs/Api/AuthApi.md#logout) | **POST** /v1/auth/signout | logout for users
*AuthApi* | [**signin**](docs/Api/AuthApi.md#signin) | **GET** /v1/auth/signin/{provider} | login for users
*PublicAssetsApi* | [**loadCarouselThumbnail**](docs/Api/PublicAssetsApi.md#loadcarouselthumbnail) | **GET** /v1/public/screenshot/thumbnail/carousel/{bucketId} | Fetching thumbnail of carousel screenshot of url
*PublicAssetsApi* | [**loadFullPageThumbnail**](docs/Api/PublicAssetsApi.md#loadfullpagethumbnail) | **GET** /v1/public/screenshot/thumbnail/fullpage/{bucketId} | Fetching thumbnail of fullpage screenshot of url
*PublicAssetsApi* | [**loadImageCarousel**](docs/Api/PublicAssetsApi.md#loadimagecarousel) | **GET** /v1/public/screenshot/carousel/{bucketId} | Fetching carousel screenshot of url
*PublicAssetsApi* | [**loadOriginalImage**](docs/Api/PublicAssetsApi.md#loadoriginalimage) | **GET** /v1/public/screenshot/fullpage/{bucketId} | Fetching fullpage screenshot of url
*PublicAssetsApi* | [**loadTechnologyLogo**](docs/Api/PublicAssetsApi.md#loadtechnologylogo) | **GET** /v1/public/technologies/logos/{iconName} | Fetching icon logo of technology
*ScheduleApi* | [**createSchedule**](docs/Api/ScheduleApi.md#createschedule) | **PUT** /v1/schedule | create a new schedule
*ScheduleApi* | [**deleteSchedule**](docs/Api/ScheduleApi.md#deleteschedule) | **DELETE** /v1/schedule/{id} | delete a schedule
*ScheduleApi* | [**getSchedule**](docs/Api/ScheduleApi.md#getschedule) | **GET** /v1/schedule/{id} | get a specific schedule details
*ScheduleApi* | [**listSchedules**](docs/Api/ScheduleApi.md#listschedules) | **GET** /v1/schedule | get list of all schedules for the user
*ScreenshotApi* | [**getScreenshots**](docs/Api/ScreenshotApi.md#getscreenshots) | **POST** /v1/screenshot | Get screenshot of url
*SummaryApi* | [**getSummary**](docs/Api/SummaryApi.md#getsummary) | **POST** /v1/summary | Get summarization data for url

## Models

- [DomainAPIError](docs/Model/DomainAPIError.md)
- [DomainAcknowledged](docs/Model/DomainAcknowledged.md)
- [DomainDataRetrievalScreenshotResponse](docs/Model/DomainDataRetrievalScreenshotResponse.md)
- [DomainDataRetrievalSummaryResponse](docs/Model/DomainDataRetrievalSummaryResponse.md)
- [DomainDataRetrievalUpdatableRetrieval](docs/Model/DomainDataRetrievalUpdatableRetrieval.md)
- [DomainScheduleAPISchedule](docs/Model/DomainScheduleAPISchedule.md)
- [DomainScheduleScheduleConf](docs/Model/DomainScheduleScheduleConf.md)

## Authorization

### OpenAIKeyAuth

- **Type**: API key
- **API key parameter name**: X-OPENAI-KEY
- **Location**: HTTP header



### UrlslabApiKeyAuth

- **Type**: API key
- **API key parameter name**: X-URLSLAB-KEY
- **Location**: HTTP header


## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author



## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
    - Package version: `0.0.25`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
