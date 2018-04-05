import hyperHTML from 'hyperhtml/esm';

const view = {
    renderer: null,

    init(renderer) {
        this.renderer = renderer;
    },

    header(data) {
        return this.renderer.Header(data);
    },

    footer(data) {
        return this.renderer.Footer(data);
    },

    home(data) {
        return this.renderer.Home(this.dispatch, data);
    },

    signin(data) {
        return this.renderer.SignIn(this.dispatch, data);
    },

    render(htmls) {
        hyperHTML(document.body)`${htmls}`;
    }
};

export default view;
