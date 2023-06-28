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

  insertPicture(formData: FormData) {
    return axiosPrivate.post('/picture/new', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updatePicture(formData: FormData, id: number) {
    return axiosPrivate.put(`/picture/${id}/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUsers() {
    return axiosPrivate.get('/users');
  }
}

export default apiProvider