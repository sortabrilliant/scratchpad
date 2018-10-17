<?php
/**
 * Plugin Name: Scratchpad
 * Plugin URI: https://github.com/sortabrilliant/scratchpad
 * Description: Scratchpad
 * Author: SortaBrilliant
 * Author URI: https://sortabrilliant.com
 * Version: 0.0.1
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package SB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

/**
 * GitHub Plugin Updater.
 */
function sbb_scratchpad_github_plugin_updater_test_init() {
	include_once 'updater.php';

	if ( is_admin() ) {
		$config = array(
			'slug'               => plugin_basename( __FILE__ ),
			'proper_folder_name' => 'sbb-scratchpad',
			'api_url'            => 'https://api.github.com/repos/sortabrilliant/scratchpad',
			'raw_url'            => 'https://raw.github.com/sortabrilliant/scratchpad/master',
			'github_url'         => 'https://github.com/sortabrilliant/scratchpad',
			'zip_url'            => 'https://github.com/sortabrilliant/scratchpad/archive/master.zip',
			'requires'           => '4.9.8',
			'tested'             => '4.9.8',
			'readme'             => 'README.md',
		);

		new WP_GitHub_Updater( $config );
	}
}
add_action( 'init', 'sbb_scratchpad_github_plugin_updater_test_init' );
