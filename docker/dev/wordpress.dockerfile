FROM wordpress:apache
WORKDIR /usr/src/wordpress

# Install XDebug
# We can uncomment the code and rebuild the image and container if it is necessary
RUN pecl install xdebug && \
    echo "zend_extension=\"$(php-config --extension-dir)/xdebug.so\"" > $PHP_INI_DIR/conf.d/xdebug.ini && \
    docker-php-ext-enable xdebug

RUN mkdir -p /usr/local/etc/php/conf.d && \
    touch /usr/local/etc/php/conf.d/xdebug.ini && \
    touch /usr/local/etc/php/conf.d/error_reporting.ini

RUN { \
		echo 'zend_extension=xdebug'; \
		echo '[xdebug]'; \
		echo 'xdebug.mode=develop,debug,trace'; \
		echo 'xdebug.client_host=host.docker.internal'; \
		echo 'xdebug.start_with_request=yes'; \
    	echo 'xdebug.discover_client_host = 1'; \
		echo 'xdebug.log_level=10'; \
	} > /usr/local/etc/php/conf.d/xdebug.ini
