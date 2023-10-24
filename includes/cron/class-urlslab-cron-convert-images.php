<?php

abstract class Urlslab_Cron_Convert_Images extends Urlslab_Cron {
	protected function execute(): bool {
		return ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) && $this->is_format_supported() && $this->convert_next_file();
	}

	abstract public function is_format_supported();

	abstract protected function convert_next_file();

	protected function get_file_types( $option_name, $default ): array {
		$values = get_option( $option_name, $default );
		if ( ! is_array( $values ) ) {
			$values = explode( ',', $values );
			if ( empty( $values ) ) {
				return array();
			}

			return $values;
		}

		return $values;
	}

	abstract protected function process_file( Urlslab_Data_File $file, string $new_file_name ): ?Urlslab_Data_File;

	abstract protected function create_file_for_pointer( Urlslab_Data_File $file ): ?Urlslab_Data_File;

	protected function convert_image_format( Urlslab_Data_File $file, string $original_image_filename, string $new_format ): string {
		if ( extension_loaded( 'imagick' ) && count( Imagick::queryFormats( strtoupper( $new_format ) . '*' ) ) > 0 ) {
			return $this->convert_with_imagick( $file, $original_image_filename, $new_format );
		}

		return $this->convert_with_native( $file, $original_image_filename, $new_format );
	}

	/**
	 * @return false|string new filename
	 */
	private function convert_with_imagick( Urlslab_Data_File $file, string $original_image_filename, string $new_format ): string {
		$image = new Imagick( $original_image_filename );
		if ( ! $image->setImageFormat( $new_format ) ) {
			return '';
		}

		switch ( $new_format ) {
			case 'webp':
				$image->setCompressionQuality( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_WEPB_QUALITY ) );

				break;

			case 'avif':
				$image->setCompressionQuality( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_AVIF_QUALITY ) );

				break;

			default:
		}
		if ( ! function_exists( 'wp_tempnam' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		$tmp_name = wp_tempnam();
		if ( ! $image->writeImage( $tmp_name ) ) {
			unlink( $tmp_name );

			return '';
		}

		return $tmp_name;
	}

	/**
	 * @return false|string new filename
	 */
	private function convert_with_native( Urlslab_Data_File $file, string $original_image_filename, string $new_format ): string {
		switch ( $file->get_filetype() ) {
			case 'image/png':
				$im = imagecreatefrompng( $original_image_filename );

				break;

			case 'image/jpeg':
				$im = imagecreatefromjpeg( $original_image_filename );

				break;

			case 'image/gif':
				$im = imagecreatefromgif( $original_image_filename );

				break;

			case 'image/bmp':
				$im = imagecreatefrombmp( $original_image_filename );

				break;

			default:
				return '';
		}

		if ( false === $im ) {
			return '';
		}

		if ( ! imageistruecolor( $im ) ) {
			if ( ! imagepalettetotruecolor( $im ) ) {
				return '';
			}
		}

		if ( ! function_exists( 'wp_tempnam' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		$tmp_name = wp_tempnam();

		switch ( $new_format ) {
			case 'webp':
				if ( ! function_exists( 'imagewebp' ) || ! imagewebp( $im, $tmp_name, Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_WEPB_QUALITY ) ) ) {
					unlink( $tmp_name );

					return '';
				}

				break;

			case 'avif':
				if ( ! function_exists( 'imageavif' ) || !
					imageavif(
						$im,
						$tmp_name,
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_AVIF_QUALITY ),
						Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Media_Offloader::SLUG )->get_option( Urlslab_Widget_Media_Offloader::SETTING_NAME_AVIF_SPEED )
					)
				) {
					unlink( $tmp_name );

					return false;
				}

				break;
		}

		return $tmp_name;
	}
}
