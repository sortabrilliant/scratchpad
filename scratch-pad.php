<?php
/**
 * Plugin Name: Scratchpad
 * Plugin URI: https://sortabrilliant.com/scratchpad/
 * Description: Keep notes where they're needed most.
 * Author: sorta brilliant
 * Author URI: https://sortabrilliant.com
 * Version: 1.0.3
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Scratchpad
 */

defined( 'ABSPATH' ) || exit;

define( 'SCRATCHPAD_VERSION', '1.0.3' );
define( 'SCRATCHPAD_PLUGIN_DIR', dirname( __FILE__ ) );
define( 'SCRATCHPAD_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 */
function scratchpad_register_block() {
	$default_asset_file = array(
		'dependencies' => array(),
		'version'      => SCRATCHPAD_VERSION,
	);

	// Editor Script.
	$asset_filepath = SCRATCHPAD_PLUGIN_DIR . '/build/scratchpad.asset.php';
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

	wp_enqueue_script(
		'scratchpad-editor',
		SCRATCHPAD_PLUGIN_URL . 'build/scratchpad.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true // Enqueue script in the footer.
	);
}

add_action( 'init', 'scratchpad_register_block' );

/**
 * Register ScratchPad Meta Field with the REST API.
 */
function scratchpad_register_meta() {
	register_meta(
		'post',
		'_sbb_scratchpad_field',
		array(
			'type'          => 'string',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => '__return_true',
		)
	);
}
add_action( 'init', 'scratchpad_register_meta' );
