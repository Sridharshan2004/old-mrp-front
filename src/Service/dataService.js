import httpClient from './http-commons';

const postexe = (url,data) => {
    return httpClient.post(url,data)
}

const getexe = (url) => {
    return httpClient.get(url)
}

const putexe = (url,data) => {
    return httpClient.put(url,data)
}

const deleteexe = (url) => {
    return httpClient.delete(url)
}

const setUser = (user) => {
    sessionStorage.setItem('User',JSON.stringify(user))
}

const getUser = () => {
    let user = JSON.parse(sessionStorage.getItem('User'))
    if(user === null) return ''
    return user
}

const setToken = (token) => {
    sessionStorage.setItem('Authorization',token)
}

const getToken = () => {
    let authorization = sessionStorage.getItem('Authorization')
    if(authorization === null) return ''
    return authorization
}

const setRole = (role) => {
    sessionStorage.setItem('Role',role)
}

const getRole = () => {
    let role = sessionStorage.getItem('Role')
    if(role ===  null) return ''
    return role
}

const isUserLoggedIn = () => {
    let userLoggedIn = sessionStorage.getItem('User')
    if(userLoggedIn === null) return false
    return true
}

const logout = () => {
    sessionStorage.clear();
}

const exportedObject = {
    postexe,
    getexe,
    putexe,
    deleteexe,
    setUser,
    getUser,
    setToken,
    getToken,
    setRole,
    getRole,
    isUserLoggedIn,
    logout
}

export default exportedObject;