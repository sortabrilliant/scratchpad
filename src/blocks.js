
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

        wp.apiFetch( { path: `/wp/v2/posts/${ this.props.postId }`, method: 'GET' } ).then( ( data ) => {
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
                            label={ __( 'Scratchpad' ) }
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
        isSavingPost,
        isPublishingPost,
        isAutosavingPost,
    } = select( 'core/editor' );

    return {
        postId: getCurrentPostId(),
        isSaving: forceIsSaving || isSavingPost(),
        isAutosaving: isAutosavingPost(),
        isPublishing: isPublishingPost(),
    };
} );

registerPlugin( 'sortabrilliant-scratchpad', {
    icon: 'welcome-write-blog',
    render: compose( applyWithSelect )( SBB_Scratchpad ),
} );
