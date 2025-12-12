import api from "./apiClient";

export const CoursesService = {
  async getFeaturedCourses() {
    const res = await api.get("/courses/featured");
    return res.data;
  },

  async getAllCourses() {
    const res = await api.get("/courses");
    return res.data;
  },

  async getCourseById(id: string) {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  }
};
