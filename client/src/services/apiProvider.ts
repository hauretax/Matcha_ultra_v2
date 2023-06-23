import axiosPrivate from './axiosPrivate'

const apiProvider = {
    getProfile() {
        return axiosPrivate.get('/profile')
    }
}

export default apiProvider