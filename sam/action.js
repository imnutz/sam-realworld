const action = {
    storage: null,
    cache: {},

    start() {
        const token = this.storage.get('token');
        this.present({ token });
    },

    goToPage(request, data = {}) {
        const token = this.storage.get('token');

        if (token) {
            let cachedUserPromise = this.cache[token];
            if (!cachedUserPromise) {
                cachedUserPromise = this.restService.currentUser(token)
                this.cache[token] = cachedUserPromise;
            }

            cachedUserPromise.then((response) => {
                let {
                    data: {
                        user: {
                            email,
                            username
                        }
                    }
                } = response;

                this.present({
                    token,
                    actionType: 'render',
                    page: request,
                    params: data.params,
                    email,
                    username
                });
            });
        } else {
            this.present({
                token,
                actionType: 'render',
                page: request,
                params: data.params
            });
        }
    },

    setLoginUsername(username) {
        this.present({
            page: 'signin',
            actionType: 'setUsername',
            username
        });
    },

    setLoginPassword(password) {
        this.present({
            page: 'signin',
            actionType: 'setPassword',
            password
        });
    },

    submitLogin() {
        this.present({
            page: 'signin',
            actionType: 'submitLogin'
        });
    },

    switchTab(tabId) {
        this.present({
            page: 'home',
            tabId
        });
    },

    selectTag(tag) {
        this.present({
            page: 'home',
            tag
        });
    },

    paginate(pageIndex) {
        this.present({
            page: 'home',
            pageIndex
        });
    },

    follow(username) {
        this.present({
            actionType: 'follow',
            username
        });
    },

    unfollow(username) {
        this.present({
            actionType: 'unfollow',
            username
        });
    },

    favorite() {
        this.present({
            actionType: 'favorite'
        });
    },

    unfavorite() {
        this.present({
            actionType: 'unfavorite'
        });
    },

    setArticleTitle(title) {
        this.present({
            actionType: 'setArticleTitle',
            title
        });
    },

    setArticleDesc(description) {
        this.present({
            actionType: 'setArticleDesc',
            description
        });
    },

    setArticleBody(body) {
        this.present({
            actionType: 'setArticleBody',
            body
        });
    },

    setArticleTags(tags) {
        this.present({
            actionType: 'setArticleBody',
            tags
        });
    },

    publishArticle() {
        this.present({
            actionType: 'publishArticle'
        })
    }
};

export default action;
