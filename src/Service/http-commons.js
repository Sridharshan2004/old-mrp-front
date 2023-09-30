import axios from "axios";

const instance = axios.create({

    // Local host URL
    // baseURL: 'http://localhost:80/api/v1/auth/',
    // Dev URL
    baseURL: 'http://Mindmrp-mkt-env.eba-2rqbn63j.ap-south-1.elasticbeanstalk.com/api/v1/auth/',
    // PRODUCTION URL
    headers : {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin" : "*"
    }
});

function getAuthorization() {
    let Authorization = sessionStorage.getItem('Authorization')
    if(Authorization === null) return ''
    return Authorization
}

instance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = 'Bearer' +getAuthorization()
        return config
    }
)

export default instance