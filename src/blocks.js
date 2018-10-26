
import './editor.scss';

const { __ } = wp.i18n;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { PanelBody, TextareaControl } = wp.components;
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { withSelect, dispatch } = wp.data;
const { registerPlugin } = wp.plugins;

class SBB_Scratchpad extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            key: '_sbb_scratchpad_field',
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);

        wp.apiFetch( { path: `/wp/v2/${ this.props.postType }s/${ this.props.postId }`, method: 'GET' } ).then( ( data ) => {
            this.setState( { value: data.meta._sbb_scratchpad_field } );
        } );
    }

    static getDerivedStateFromProps( nextProps, state ) {
        if ( nextProps.isPublishing || nextProps.isSaving || nextProps.isAutosaving ) {
            wp.apiRequest(
                {
                    path: `/sortabrilliant/v1/update-meta/${ nextProps.postId }`,
                    method: 'POST',
                    data: state
                }
            );
        }
    }

    handleChange( value ) {
        this.setState( { value } );
        // TODO: I don't think this is the proper way to let the editor know a change is made but it works for now.
        dispatch( 'core/editor' ).editPost( 'sortabrilliant-scratchpad' );
    }

    render() {
        return (
            <Fragment>
                <PluginSidebarMoreMenuItem target="sortabrilliant-scratchpad-sidebar">
                    { __( 'Scratchpad' ) }
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="sortabrilliant-scratchpad-sidebar"
                    title={ __( 'Scratchpad' ) }
                >
                    <PanelBody>
                        <TextareaControl
                            label={ __( 'Keep notes where they\'re needed most.' ) }
                            value={ this.state.value }
                            rows="25"
                            onChange={ this.handleChange }
                        />
                    </PanelBody>
                </PluginSidebar>
            </Fragment>
        );
    }
}

const applyWithSelect = withSelect( ( select, { forceIsSaving } ) => {
    const {
        getCurrentPostId,
        getCurrentPostType,
        isSavingPost,
        isPublishingPost,
        isAutosavingPost,
    } = select( 'core/editor' );

    return {
        postId: getCurrentPostId(),
        postType: getCurrentPostType(),
        isSaving: forceIsSaving || isSavingPost(),
        isAutosaving: isAutosavingPost(),
        isPublishing: isPublishingPost(),
    };
} );

registerPlugin( 'sortabrilliant-scratchpad', {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="sbb_scratchpad_button"><path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"/></svg>,
    render: compose( applyWithSelect )( SBB_Scratchpad ),
} );
