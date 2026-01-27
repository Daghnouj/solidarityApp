import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const UserService = {
  updateProfile: async (userId: string, profileData: any) => {
    const response = await axios.put(`${API_URL}/profile/${userId}`, profileData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  updateProfilePhoto: async (userId: string, photoFile: File) => {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await axios.put(`${API_URL}/profile/${userId}/photo`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getSavedSpecialists: async (userId: string) => {
    const response = await axios.get(`${API_URL}/profile/${userId}/saved-specialists`, {
      headers: getAuthHeaders(),
    });
    return response.data?.data || [];
  },

  saveSpecialist: async (userId: string, professionalId: string) => {
    const response = await axios.post(`${API_URL}/profile/${userId}/saved-specialists/${professionalId}`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data?.data || [];
  },

  unsaveSpecialist: async (userId: string, professionalId: string) => {
    const response = await axios.delete(`${API_URL}/profile/${userId}/saved-specialists/${professionalId}`, {
      headers: getAuthHeaders(),
    });
    return response.data?.data || [];
  },
};

export default UserService;
