/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Path, SVG, PanelBody, TextareaControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

const ScratchPadPlugin = ( props ) => (
	<Fragment>
		<PluginSidebarMoreMenuItem target="sortabrilliant-scratchpad-sidebar">
			{ __( 'Scratchpad', 'scratchpad' ) }
		</PluginSidebarMoreMenuItem>
		<PluginSidebar
			name="sortabrilliant-scratchpad-sidebar"
			title={ __( 'Scratchpad', 'scratchpad' ) }>
			<PanelBody>
				<TextareaControl
					label={ __( 'Keep notes where they\'re needed most.', 'scratchpad' ) }
					value={ props.metaFieldValue }
					rows="25"
					onChange={ value => props.setMetaFieldValue( value ) }
				/>
			</PanelBody>
		</PluginSidebar>
	</Fragment>
);

registerPlugin( 'sortabrilliant-scratchpad', {
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z" />
		</SVG>
	),
	render: compose( [
		withSelect( select => {
			const {
				getEditedPostAttribute,
			} = select( 'core/editor' );

			return {
				metaFieldValue: getEditedPostAttribute( 'meta' )._sbb_scratchpad_field,
			};
		} ),
		withDispatch( dispatch => {
			const {
				editPost,
			} = dispatch( 'core/editor' );

			return {
				setMetaFieldValue: ( value ) => {
					editPost( { meta: { _sbb_scratchpad_field: value } } );
				}
			};
		} ),
	] )( ScratchPadPlugin ),
} );
