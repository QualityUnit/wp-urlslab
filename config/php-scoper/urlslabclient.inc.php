<?php

declare( strict_types=1 );

use Isolated\Symfony\Component\Finder\Finder;

return array(

	/*
	 * By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
	 * directory. You can however define which files should be scoped by defining a collection of Finders in the
	 * following configuration key.
	 *
	 * For more see: https://github.com/humbug/php-scoper#finders-and-paths
	 */
	'finders' => array(
		Finder::create()->files()->in( 'vendor/guzzlehttp/guzzle' )->name( array( '*.php', 'LICENSE', 'composer.json' ) ),
		Finder::create()->files()->in( 'vendor/guzzlehttp/promises' )->name( array( '*.php', 'LICENSE', 'composer.json' ) ),
		Finder::create()->files()->in( 'vendor/guzzlehttp/psr7' )->name( array( '*.php', 'LICENSE', 'composer.json' ) ),
		Finder::create()->files()->in( 'vendor/urlslab/urlslab-php-sdk' )->name( array( '*.php', 'LICENSE', 'composer.json' ) ),
	),

);
