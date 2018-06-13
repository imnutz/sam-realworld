const state = {
    view: null,

    represent(model, options = {}) {
        const header = this.view.header(this.getHeaderData(model));
        const footer = this.view.footer();
        let content

        if (model.isAtHome()) {
            content = this.view.home(this.getHomeData(model));
        } else if (model.isAtSignIn()) {
            const signinData = this.getSignInData(model);

            if (signinData.isAuthenticated) {
                this.router.goTo('home');
            } else {
                content = this.view.signin(signinData);
            }
        } else if (model.isAtArticleDetails()) {
            content = this.view.articleDetails(this.getArticleDetailsData(model));
        } else if (model.isAtEditor()) {
            let articleCreated = options.articleCreated;

            if (articleCreated) {
                this.router.goToArticle(model.editor.responseArticle.slug);
            } else {
                content = this.view.editor(this.getEditorData());
            }
        }

        this.view.render([header, content, footer]);
        this.nextAction(model, options);
    },

    nextAction(model, options) {
    },

    getSignInData(model) {
        const {
            isLoading,
            auth: {
                invalidInfo
            },
            profile: {
                isAuthenticated
            }
        } = model;

        return {
            invalidInfo,
            isLoading,
            isAuthenticated
        };
    },

    getHeaderData(model) {
        const {
            profile: {
                isAuthenticated,
                username
            },
            menu: {
                items: {
                    home,
                    signin,
                    signup,
                    newpost,
                    settings
                }
            }
        } = model;

        let data = {};

        if (!isAuthenticated) {
            data.menuItems = [ home, signin, signup ];
        } else {
            const extraItem = {
                label: username,
                hash: '#/settings'
            };
            data.menuItems = [ home, newpost, settings, extraItem ];
        }

        return data;
    },

    getHomeData(model) {
        const { isAuthenticated } = model.profile;
        const {
            tabs: {
                globalFeed,
                yourFeed,
                tagFeed
            },
            selectedTab,
            tags,
            articlesCount,
            articlesPerPage,
            currentPage
        } = model.home;
        const { isLoading } = model;

        let data = {
            tabs: [ globalFeed ]
        };

        if (tagFeed.id) {
            data.tabs.push(tagFeed);
        }

        if (isAuthenticated) {
            data.tabs.unshift(yourFeed);
        }

        data.isLoading = isLoading;
        data.selectedTab = selectedTab;
        data.articles = model.home.articles;
        data.tags = tags;
        data.isAuthenticated = isAuthenticated;
        data.numberOfPages = this._populatePaginator(articlesCount, articlesPerPage);
        data.currentPage = currentPage;

        return data;
    },

    getArticleDetailsData(model) {
        const {
            isLoading,
            profile: {
                image,
                username,
                isAuthenticated
            },
            articleDetails: {
                article,
                comments
            }
        } = model;

        let isOwner = false;

        if (article.author && article.author.username === username) {
            isOwner = true;
        }

        return {
            isLoading,
            isAuthenticated,
            user: {
                image,
                username
            },
            article,
            comments,
            isOwner
        };
    },

    getEditorData() {
        return {};
    },

    _populatePaginator(itemsCount, itemsPerPage) {
        if (!itemsCount) return 0;

        let numberOfPages = Math.floor(itemsCount / itemsPerPage);
        let modulo = itemsCount % itemsPerPage;

        if (modulo > 0) {
            ++numberOfPages;
        }

        return numberOfPages;
    }
};

export default state;
