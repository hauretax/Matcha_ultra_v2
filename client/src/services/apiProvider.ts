import axiosPrivate from './axiosPrivate'

const apiProvider = {
    getProfile() {
        return axiosPrivate.get('/profile')
    },

    updateProfile(firstName: string, lastName: string, age: number, gender: string, orientation: string, email: string) {
        return axiosPrivate.patch('/profile', {firstName, lastName, age, gender, orientation, email})
    },

    updateBio(biography: string) {
      return axiosPrivate.patch('/profileBio', {biography})
  }
}

export default apiProvider