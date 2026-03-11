import axios from "../auth/axios";

export const getUsers = async () => {
  const res = await axios.get("/users");
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`/update/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/delete/${id}`);
  return res.data;
};
