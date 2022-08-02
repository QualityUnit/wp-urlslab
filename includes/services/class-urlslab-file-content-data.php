<?php

class Urlslab_File_Content_Data {

	private $fileid;

	public function __construct( array $filecontent ) {
		$this->fileid = $filecontent['fileid'];
		$this->contentid = $filecontent['contentid'];
		$this->content = $filecontent['content'];
	}

	public function get_fileid() {
		return $this->fileid;
	}

	public function get_contentid() {
		return $this->contentid;
	}

	public function get_content() {
		return $this->content;
	}

}
