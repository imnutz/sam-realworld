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
            hash: '#/editor'
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
    currentPage: 0,
    tags: []
};

const articleDetails = {
    article: {},
    comments: []
};

const auth = {
    username: null,
    password: null,
    invalidInfo: false
}

const editor = {
    articleTitle: null,
    articleDesc: null,
    articleBody: null,
    tags: null,
    errors: {}
}

const defaultState = {
    page: 'home',
    isLoading: false,
    requiredProfileInfo: false
};

let model = {
    menu,
    profile,
    home,
    auth,
    editor,
    articleDetails,
    ...defaultState
};

model.restService = null;
model.storage = null;

model.present = function present(proposal) {
    const page = proposal.page !== undefined ? proposal.page : this.page;

    if (page !== this.page) {
        this.page = page;
    }

    if (proposal.token) {
        this.profile.isAuthenticated = true;
        this.profile.token = proposal.token;
        this.home.selectedTab = 'yourfeed';

        this.profile.email = proposal.email || '';
        this.profile.username = proposal.username || '';
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
    } else if (this.isAtArticleDetails()) {
        const { actionType, username } = proposal;

        if (actionType === 'follow') {
            this.restService.follow(username, this.profile.token)
                .then(response => {
                    this.articleDetails.article.author.following = true;
                    this.represent(this);
                });
        } else if (actionType === 'unfollow') {
            this.restService.unfollow(username, this.profile.token)
                .then(response => {
                    this.articleDetails.article.author.following = false;
                    this.represent(this);
                });
        } else if (actionType === 'favorite') {
            this.restService.favorite(this.articleDetails.article.slug, this.profile.token)
                .then(response => {
                    const {
                        data: {
                            article: {
                                favorited,
                                favoritesCount
                            }
                        }
                    } = response;

                    this.articleDetails.article.favorited = favorited;
                    this.articleDetails.article.favoritesCount = favoritesCount;
                    this.represent(this);
                });
        } else if (actionType === 'unfavorite') {
            this.restService.unfavorite(this.articleDetails.article.slug, this.profile.token)
                .then(response => {
                    const {
                        data: {
                            article: {
                                favorited,
                                favoritesCount
                            }
                        }
                    } = response;

                    this.articleDetails.article.favorited = favorited;
                    this.articleDetails.article.favoritesCount = favoritesCount;
                    this.represent(this);
                });
        }
        else {
            const [params] = proposal.params;
            const slug = params.slug;

            this.isLoading = true;
            this.represent(this);

            this.restService.all(
                this.restService.getArticle(this.profile.token, slug),
                this.restService.getComments(this.profile.token, slug)
            )
            .then(([articleDetails, commentData]) => {
                this.articleDetails.article = articleDetails.data.article;
                this.articleDetails.comments = commentData.data.comments;

                this.isLoading = false;
                this.represent(this);
            });
        }
    } else if (this.isAtEditor()) {
        const [
            params = {}
        ] = proposal.params || [];

        const actionType = proposal.actionType;
        const { slug = '' } = params;

        if (actionType === 'render') {
            this.represent(this);
        } else if (actionType === 'setArticleTitle') {
            this.editor.articleTitle = proposal.title;
        } else if (actionType === 'setArticleDesc') {
            this.editor.articleDesc = proposal.description;
        } else if (actionType === 'setArticleBody') {
            this.editor.articleBody = proposal.body;
        } else if (actionType === 'setArticleTags') {
            this.editor.tags = (proposal.tags || '').split(',');
        } else if (actionType === 'publishArticle') {
            const {
                articleTitle,
                articleDesc,
                articleBody,
                tags
            } = this.editor;

            if (!articleTitle) {
                this.editor.errors['title'] = {
                    message: 'Title cannot be blank'
                };
            }

            if (!articleDesc) {
                this.editor.errors['description'] = {
                    message: 'Description cannot be blank'
                };
            }

            if (!articleBody) {
                this.editor.errors['body'] = {
                    message: 'Article body cannot be blank'
                };
            }

            if (Object.keys(this.editor.errors).length) {
                return this.represent(this);
            } else {
                this.restService.createArticle(this.profile.token, this.editor)
                    .then(response => {
                        this.editor.responseArticle = response.data.article;
                        this.represent(this, {
                            articleCreated: true
                        });
                    })
                    .catch(() => {
                        this.editor.responseArticle = null;
                    });
            }
        }
    }
};

const helpers = {
    isAtHome() {
        return this.page === 'home' || !this.page;
    },

    isAtSignIn() {
        return this.page === 'signin'
    },

    isAtArticleDetails() {
        return /^\/?article\/([^\/?]+)\/?$/i.test(this.page);
    },

    isAtEditor() {
        return this.page === 'editor';
    },

    getOffset(pageIndex) {
        return this.home.articlesPerPage * pageIndex;
    }
};

model = Object.assign(model, helpers);

export default model;
