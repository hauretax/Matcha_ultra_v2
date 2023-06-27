import axiosPrivate from './axiosPrivate'

const apiProvider = {
  getProfile() {
    return axiosPrivate.get('/profile')
  },

  getOptions() {
    return axiosPrivate.get('/options')
  },

  updateProfile(firstName: string, lastName: string, age: number, gender: string, orientation: string, email: string) {
    return axiosPrivate.patch('/profile', { firstName, lastName, age, gender, orientation, email })
  },

  updateBio(biography: string) {
    return axiosPrivate.patch('/profileBio', { biography })
  },

  updateInterests(interests: string[]) {
    return axiosPrivate.patch('/profileInterests', { interests })
  },

  deletePicture(id: number) {
    return axiosPrivate.delete(`/picture/${id}`);
  },
}

export default apiProvider