import api from './api';

const register = (username, password, firstName, lastName) => {
    return api.post('/user/register', {
        username,
        password,
        firstName,
        lastName
    });
};

const login = (username, password) => {
    return api.post('/user/auth', {
        username,
        password,
    })
        .then((response) => {
            if (response.headers.authorization) {
                localStorage.setItem('token', response.headers.authorization);
            }
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
