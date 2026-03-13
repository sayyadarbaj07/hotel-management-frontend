import axios from "../auth/axios";

export const getUsers = async () => {
  const res = await axios.get("/users/users");
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post("/users/auth/register", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`/users/update/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/users/delete/${id}`);
  return res.data;
};
