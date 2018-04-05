import hyperHTML from 'hyperhtml/esm';

export const Header = (data = {}) => {
    return hyperHTML.wire()`
        <nav class="navbar navbar-light">
            <div class="container">
                <a class="navbar-brand" href="">conduit</a>
                <ul class="nav navbar-nav pull-xs-right">
                    ${data.menuItems.map(item => {
                        return hyperHTML.wire()`
                            <li class="nav-item">
                                <a class="nav-link" href="${item.hash}">${item.label}</a>
                            </li>
                        `;
                    })}
                </ul>
            </div>
        </nav>
    `;
};

export const Footer = (data) => {
    return hyperHTML.wire()`
        <footer>
            <div class="container">
                <a href="/" class="logo-font">conduit</a>
                <span class="attribution">
                An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
                </span>
            </div>
        </footer>
    `;
}

export const AuthForm = (data) => {
    return hyperHTML.wire()`
        <div class="auth-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-6 offset-md-3 col-xs-12">
                        <h1 class="text-xs-center">Sign up</h1>
                        <p class="text-xs-center">
                            <a href="">Have an account?</a>
                        </p>

                        <ul class="error-messages">
                            <li>That email is already taken</li>
                        </ul>

                        <form>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Your Name">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Email">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="password" placeholder="Password">
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right"> Sign up </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const Profile = (data) => {
    return hyperHTML.wire()`
        <div class="profile-page">
            <div class="user-info">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-10 offset-md-1">
                            <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
                            <h4>Eric Simons</h4>
                            <p>
                                Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games
                            </p>
                            <button class="btn btn-sm btn-outline-secondary action-btn">
                                <i class="ion-plus-round"></i>
                                &nbsp; Follow Eric Simons
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">

                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <div class="articles-toggle">
                            <ul class="nav nav-pills outline-active">
                                <li class="nav-item">
                                    <a class="nav-link active" href="">My Articles</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="">Favorited Articles</a>
                                </li>
                            </ul>
                        </div>

                        <div class="article-preview">
                            <div class="article-meta">
                                <a href="">
                                    <img src="http://i.imgur.com/Qr71crq.jpg" />
                                </a>
                                <div class="info">
                                    <a href="" class="author">Eric Simons</a>
                                    <span class="date">January 20th</span>
                                </div>
                                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                                    <i class="ion-heart"></i> 29
                                </button>
                            </div>
                            <a href="" class="preview-link">
                                <h1>How to build webapps that scale</h1>
                                <p>This is the description for the post.</p>
                                <span>Read more...</span>
                            </a>
                        </div>

                        <div class="article-preview">
                            <div class="article-meta">
                                <a href="">
                                    <img src="http://i.imgur.com/N4VcUeJ.jpg" />
                                </a>
                                <div class="info">
                                    <a href="" class="author">Albert Pai</a>
                                    <span class="date">January 20th</span>
                                </div>
                                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                                    <i class="ion-heart"></i> 32
                                </button>
                            </div>
                            <a href="" class="preview-link">
                                <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
                                <p>This is the description for the post.</p>
                                <span>Read more...</span>
                                <ul class="tag-list">
                                    <li class="tag-default tag-pill tag-outline">Music</li>
                                    <li class="tag-default tag-pill tag-outline">Song</li>
                                </ul>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const Settings = (data) => {
    return hyperHTML.wire()`
        <div class="settings-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-6 offset-md-3 col-xs-12">
                        <h1 class="text-xs-center">Your Settings</h1>

                        <form>
                            <fieldset>
                                <fieldset class="form-group">
                                    <input class="form-control" type="text" placeholder="URL of profile picture">
                                </fieldset>
                                <fieldset class="form-group">
                                    <input class="form-control form-control-lg" type="text" placeholder="Your Name">
                                </fieldset>
                                <fieldset class="form-group">
                                    <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                                </fieldset>
                                <fieldset class="form-group">
                                    <input class="form-control form-control-lg" type="text" placeholder="Email">
                                </fieldset>
                                <fieldset class="form-group">
                                    <input class="form-control form-control-lg" type="password" placeholder="Password">
                                </fieldset>
                                <button class="btn btn-lg btn-primary pull-xs-right">
                                    Update Settings
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const _createTagList = (dispatch, { tags = [] }) => {
    const tagHandler = (evt) => {
        evt.preventDefault();
        dispatch('selectTag', evt.target.text);
    };

    return hyperHTML.wire()`
        <div class="tag-list">
            ${tags.map(tag => {
                return hyperHTML.wire()`<a href="" class="tag-pill tag-default" onclick=${tagHandler}>${tag}</a>`;
            })}
        </div>
    `;
};

const _createFeedTabs = (dispatch, { tabs, selectedTab }) => {
    const tabHandler = (tabId, evt) => {
        evt.preventDefault();

        dispatch('selectFeed', tabId);
    };

    return hyperHTML.wire()`
        <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
                ${tabs.map(tab => {
                    const cssClasses = ['nav-link'];

                    if (tab.id === selectedTab) {
                        cssClasses.push('active');
                    }
                    return hyperHTML.wire()`
                        <li class="nav-item">
                            <a class="${cssClasses.join(' ')}" href="#" onclick=${tabHandler.bind(null, tab.id)}>${tab.label}</a>
                        </li>
                    `;
                })}
            </ul>
        </div>
    `;
}

const _loading = () => {
    return hyperHTML.wire()`
        <div class="article-preview"><span>Loading...</span></div>
    `;
}

const _createArticle = (data) => {
    const {
        author: {
            image,
            username
        },
        createdAt,
        favoriteCount,
        description,
        body,
        tagList: tags = []
    } = data;

    return hyperHTML.wire()`
        <div class="article-preview">
            <div class="article-meta">
                <a href="profile.html">
                    <img src="${image}" />
                </a>
                <div class="info">
                    <a href="" class="author">${username}</a>
                    <span class="date">${createdAt}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                    <i class="ion-heart"></i> ${favoriteCount}
                </button>
            </div>
            <a href="" class="preview-link">
                <h1>${description}</h1>
                <p>${body}</p>
                <span>Read more...</span>
            </a>
            ${_createTagList(null, { tags })}
        </div>
    `;
}

const _createBanner = () => {
    return hyperHTML.wire()`
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>
    `;
}

const _createPaginator = (dispatch, itemsPerPage, currentPage) => {
    const links = [];

    const clickHandler = (evt) => {
        evt.preventDefault();

        const pageIndex = Number(evt.target.text);

        dispatch('paginate', pageIndex);
    }

    for (let idx = 0; idx < itemsPerPage; idx++) {
        const linkValue = idx + 1;
        const cssClasses = ['page-item'];

        if (linkValue === currentPage) {
            cssClasses.push('active');
        }

        links.push(
            hyperHTML.wire()`
                <li class=${cssClasses.join(' ')}>
                    <a href="#" class="page-link" onclick=${clickHandler}>${idx + 1}</a>
                </li>
            `
        );
    }

    return hyperHTML.wire()`
        <nav>
            <ul class="pagination">
                ${links}
            </ul>
        </nav>
    `;
}

export const Home = (dispatch, data = {}) => {
    const {
        isLoading,
        tabs,
        selectedTab,
        tags,
        isAuthenticated,
        numberOfPages,
        currentPage
    } = data;

    let contentEl, banner, paginator;

    if (numberOfPages > 1 && !isLoading) {
        paginator = _createPaginator(dispatch, numberOfPages, currentPage);
    }

    if (isLoading) {
        contentEl = _loading();
    } else {
        contentEl = data.articles.map(_createArticle);
    }

    if (!isAuthenticated) {
        banner = _createBanner();
    }

    return hyperHTML.wire()`
        <div class="home-page">
            <div class="container page">
                ${banner}
                <div class="row">

                    <div class="col-md-9">
                        ${_createFeedTabs(dispatch, { tabs, selectedTab })}
                        ${contentEl}
                        ${paginator}
                    </div>

                    <div class="col-md-3">
                        <div class="sidebar">
                            <p>Popular Tags</p>
                            ${_createTagList(dispatch, {tags})}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

export const SignIn = (dispatch, data = {}) => {
    const { invalidInfo } = data;
    let errorEl;

    if (invalidInfo) {
        errorEl = hyperHTML.wire()`
            <ul class="error-messages">
                <li>Invalid username or password</li>
            </ul>
        `;
    }

    const usernameHandler = (evt) => {
        dispatch('setLoginUsername', evt.target.value);
    };

    const passwordHandler = (evt) => {
        dispatch('setLoginPassword', evt.target.value);
    };

    const submitHandler = (evt) => {
        evt.preventDefault();

        dispatch('submitLogin');
    };

    return hyperHTML.wire()`
        <div class="auth-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-6 offset-md-3 col-xs-12">
                        <h1 class="text-xs-center">Sign in</h1>
                        <p class="text-xs-center">
                            <a href="">Need an account?</a>
                        </p>
                        ${errorEl}
                        <form>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Email" onkeyup=${usernameHandler}>
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="password" placeholder="Password" onkeyup=${passwordHandler}>
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right" onclick=${submitHandler}>Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}
