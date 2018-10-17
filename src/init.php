<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @since 1.0.0
 */
function sbb_scratchpad_cgb_editor_assets() {
	wp_enqueue_script(
		'sbb_scratchpad-cgb-block-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-i18n', 'wp-element', 'wp-edit-post' ),
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ),
		true // load in the footer
	);
}
add_action( 'enqueue_block_editor_assets', 'sbb_scratchpad_cgb_editor_assets' );

/**
 * Register ScratchPad Meta Field with the REST API.
 */
function sbb_scratchpad_register_meta() {
	register_meta(
		'post',
		'_sbb_scratchpad_field',
		[
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		]
	);
}
add_action( 'init', 'sbb_scratchpad_register_meta' );

/**
 * Register ScratchPad Metabox to REST API.
 */
function sbb_scratchpad_api_posts_meta_field() {
	register_rest_route(
		'sortabrilliant/v1',
		'/update-meta/(?P<id>\d+)',
		[
			'methods'  => 'POST',
			'callback' => 'sbb_scratchpad_update_callback',
			'args'     => [
				'id' => [ 'sanitize_callback' => 'absint' ],
			],
		]
	);
}
add_action( 'rest_api_init', 'sbb_scratchpad_api_posts_meta_field' );

/**
 * ScratchPad REST API Callback.
 */
function sbb_scratchpad_update_callback( $data ) {
	return update_post_meta( $data['id'], $data['key'], $data['value'] );
}
