const Container = {
    intents: {},
    state: {},
    action: {},
    model: {},
    view: {},
    restService: null,
    storage: null,
    router: null,

    init(config) {
        this.intents = config.intents;
        this.action = config.action;
        this.model = config.model;
        this.state = config.state;
        this.view = config.view;
        this.restService = config.restService;
        this.storage = config.storage;
        this.router = config.router;

        this._wireComponents();
        this._setupRouter();
    },

    _wireComponents() {
        this.action.present = this.model.present.bind(this.model);
        this.action.storage = this.storage;
        this.action.restService = this.restService;

        this.model.represent = this.state.represent.bind(this.state);
        this.model.restService = this.restService;
        this.model.storage = this.storage;

        this.view.dispatch = this.dispatch.bind(this);

        this.state.view = this.view;
        this.state.router = this.router;
    },

    _setupRouter() {
        this.router.init([
            '',
            '/home',
            '/signin',
            '/settings',
            '/article/{slug}',
            '/editor/:slug:'
        ], this.dispatch.bind(this, 'navigate'));
    },

    dispatch(actionKey, ...args) {
        if (!actionKey) {
            throw new Error('Action is required for dispatching');
        }

        const intent = this.intents[actionKey];

        if (!this.action[intent]) {
            throw new Error(`No action handler found for action '${intent}'`);
        }

        this.action[intent](...args);
    }
}

export default Container;
