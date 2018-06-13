import axios from 'axios';

const SERVER = 'https://conduit.productionready.io/api/';
const getEndPoint = (endPoint) => [SERVER, endPoint].join('');
const getAuthHeader = (token) => {
    return { Authorization: `Token ${token}` };
};

export const login = (email, password) => {
    const endPoint = getEndPoint('users/login');
    const payload = {
        user: { email, password }
    };

    return axios.post(endPoint, payload);
};

export const registration = (username, email, password) => {
    const endPoint = getEndPoint('users');
    const payload = {
        user: { username, email, password }
    };

    return axios.post(endPoint, payload);
};

export const currentUser = (token) => {
    const endPoint = getEndPoint('user');

    return axios.get(endPoint, { headers: getAuthHeader(token) });
};

export const updateUser = (token, user) => {
    const endPoint = getEndPoint('user');
    const { email, username, password, image, bio } = user;

    const payload = {
        user: { email, username, password, image, bio },
        headers: getAuthHeader(token)
    };

    return axios.put(endPoint, payload);
};

export const getArticles = ({ limit = 20, offset = 0, tag }) => {
    const endPoint = getEndPoint('articles');
    const params = { limit, offset };

    if (tag) {
        params.tag = tag;
    }

    return axios.get(endPoint, { params });
};

export const getArticle = (token = undefined, slug) => {
    const endPoint = getEndPoint(`articles/${slug}`);

    let payload = {};
    if (token) {
        payload = {
            headers: getAuthHeader(token)
        };
    }

    return axios.get(endPoint, payload);
};

export const getComments = (token = undefined, slug) => {
    const endPoint= getEndPoint(`articles/${slug}/comments`);
    let payload = {};
    if (token) {
        payload = {
            headers: getAuthHeader(token)
        };
    }

    return axios.get(endPoint, payload);
};

export const getFeeds = ({limit = 20, offset = 0, token}) => {
    const endPoint = getEndPoint('articles/feed');
    const params = { limit, offset };
    const payload = {
        params,
        headers: getAuthHeader(token)
    };

    return axios.get(endPoint, { ...payload });
};

export const getTags = () => {
    const endPoint = getEndPoint('tags');

    return axios.get(endPoint);
};

const getFollowEndPoint = (username) => {
    return getEndPoint(`profiles/${username}/follow`);
};

export const follow = (username, token) => {
    const endPoint = getFollowEndPoint(username);

    return axios.post(endPoint, {}, { headers: getAuthHeader(token) });
};

export const unfollow = (username, token) => {
    const endPoint = getFollowEndPoint(username);

    return axios.delete(endPoint, { headers: getAuthHeader(token) });
};

const getFavoriteEndPoint = (slug) => {
    return getEndPoint(`articles/${slug}/favorite`);
};

export const favorite = (slug, token) => {
    const endPoint = getFavoriteEndPoint(slug);

    return axios.post(endPoint, null, { headers: getAuthHeader(token) });
};

export const unfavorite = (slug, token) => {
    const endPoint = getFavoriteEndPoint(slug);

    return axios.delete(endPoint, { headers: getAuthHeader(token) });
};

export const createArticle = (token, data = {}) => {
    const endPoint = getEndPoint('/articles');
    const {
        articleTitle: title,
        articleDesc: description,
        articleBody: body,
        tags: tagList
    } = data;

    return axios.post(
        endPoint,
        {
            article: {
                title,
                description,
                body,
                tagList
            }
        },
        { headers: getAuthHeader(token) }
    );
};

export const all = (...promises) => {
    return axios.all(promises)
                .then(axios.spread((...data) => {
                    return data;
                }));
};
