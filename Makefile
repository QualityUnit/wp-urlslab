PATTERN := [0-9]+\.[0-9]+\.[0-9]+
version ?= 1.0.0
.PHONY: tag

tag:
	awk '{gsub(/[0-9]+\.[0-9]+\.[0-9]+/, "$(version)"); print}' info.json > info_new.json; mv info_new.json info.json
	awk '{gsub(/[0-9]+\.[0-9]+\.[0-9]+/, "$(version)"); print}' urlslab.php > urlslab.php_new; mv urlslab.php_new urlslab.php
	awk '{gsub(/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/, strftime("%Y-%m-%d %H:%M:%S")); print}' info.json > info_new.json; mv info_new.json info.json

