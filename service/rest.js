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

export const getFeeds = ({limit = 20, offset = 0, token}) => {
    const endPoint = getEndPoint('articles/feed');
    const params = { limit, offset };
    const payload = {
        params,
        headers: getAuthHeader(token)
    };
    console.log(payload);

    return axios.get(endPoint, { ...payload });
};

export const getTags = () => {
    const endPoint = getEndPoint('tags');

    return axios.get(endPoint);
}

export const all = (...promises) => {
    return axios.all(promises)
                .then(axios.spread((...data) => {
                    return data;
                }));
}
