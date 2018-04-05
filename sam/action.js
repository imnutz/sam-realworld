const action = {
    storage: null,

    start() {
        const token = this.storage.get('token');
        this.present({ token });
    },

    goToPage(request, data) {
        const token = this.storage.get('token');

        this.present({
            token,
            actionType: 'render',
            page: request,
            params: data.params
        })
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
    }
};

export default action;
