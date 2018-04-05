const menu = {
    items: {
        'home': {
            label: 'Home',
            hash: '#'
        },
        'signin': {
            label: 'Sign in',
            hash: '#/signin'
        },
        'signup': {
            label: 'Sign up',
            hash: '#/signup'
        },
        'newpost': {
            label: 'New Article',
            hash: '#/newpost'
        },
        'settings': {
            label: 'Settings',
            hash: '#/settings'
        }
    }
};

const profile = {
    username: '',
    email: '',
    image: '',
    description: '',
    isAuthenticated: false,
    token: null
};

const home = {
    tabs: {
        globalFeed: {
            label: 'Global Feed',
            id: 'globalfeed'
        },
        yourFeed: {
            label: 'Your Feed',
            id: 'yourfeed'
        },
        tagFeed: {}
    },
    selectedTab: 'globalfeed',
    articles: [],
    articlesCount: 0,
    articlesPerPage: 10,
    currentPage: 1,
    tags: []
};

const auth = {
    username: null,
    password: null,
    invalidInfo: false
}

const defaultState = {
    page: 'home',
    isLoading: false
};

let model = {
    menu,
    profile,
    home,
    auth,
    ...defaultState
};

model.restService = null;
model.storage = null;

model.present = function present(proposal) {
    const page = proposal.page;

    if (page !== this.page) {
        this.page = page;
    }

    if (proposal.token) {
        this.profile.isAuthenticated = true;
        this.profile.token = proposal.token;
        this.home.selectedTab = 'yourfeed';
    }

    if (this.isAtHome()) {
        this.isLoading = true;

        const {
            tabId,
            tag,
            actionType,
            pageIndex = this.home.currentPage
        } = proposal;

        const currentTab = this.home.selectedTab;
        const offset = this.getOffset(pageIndex);

        const limitConfig = {
            limit: this.home.articlesPerPage,
            offset
        };

        if (pageIndex !== this.home.currentPage) {
            this.home.currentPage = pageIndex;
        }

        let promises = [];

        if (actionType === 'render') {
            promises = [ this.restService.getTags() ];
        }

        if (tabId && currentTab !== tabId) {
            this.home.selectedTab = tabId;
            this.home.tabs.tagFeed = {};
        } else if (tag && currentTab != tag) {
            this.home.selectedTab = tag;
            this.home.tabs.tagFeed.label = '#' + tag;
            this.home.tabs.tagFeed.id = tag;
        }

        if (this.home.selectedTab === 'yourfeed') {
            promises.unshift(this.restService.getFeeds({
                ...limitConfig,
                token: this.profile.token
            }));
        } else if (this.home.selectedTab === 'globalfeed') {
            promises.unshift(this.restService.getArticles({ ...limitConfig }));
        } else {
            promises.unshift(this.restService.getArticles({ ...limitConfig, tag: this.home.selectedTab }));
        }

        this.represent(this);
        this.restService
            .all(...promises)
            .then(([articleData, tagData]) => {
                this.home.articles = articleData.data.articles;
                this.home.articlesCount = articleData.data.articlesCount;

                if (tagData) {
                    this.home.tags = tagData.data.tags;
                }
                this.isLoading = false;
                this.represent(this);
            });

    } else if (this.isAtSignIn()) {
        const { actionType, username, password } = proposal;

        if (actionType === 'setUsername') {
            this.auth.username = username;
        } else if (actionType === 'setPassword') {
            this.auth.password = password;
        } else if (actionType === 'submitLogin') {
            const { username: validUsername, password: validPassword } = this.auth;

            if (!validUsername || !validPassword) {
                this.auth.invalidInfo = true;
                this.represent(this);
            } else {
                this.isLoading = true;
                this.restService.login(validUsername, validPassword)
                    .then(res => {
                        const {
                            user: {
                                id,
                                bio,
                                username,
                                email,
                                token,
                                createdAt,
                                updatedAt,
                                image
                            }
                        } = res.data;

                        this.profile = Object.assign(this.profile, {
                            username,
                            email,
                            image,
                            description: bio,
                            isAuthenticated: true,
                            token
                        });

                        this.storage.set('token', token);

                        this.home.selectedTab = 'yourfeed';

                        this.isLoading = false;
                        this.represent(this);
                    })
                    .catch(() => {
                        this.auth.invalidInfo = true;
                        this.represent(this);
                    })
            }
        } else if (actionType === 'render') {
            this.represent(this);
        }
    }
    // this.represent(this);
};

const helpers = {
    isAtHome() {
        return this.page === 'home' || !this.page;
    },

    isAtSignIn() {
        return this.page === 'signin'
    },

    getOffset(pageIndex) {
        return this.home.articlesPerPage * pageIndex;
    }
}

model = Object.assign(model, helpers);

export default model;
