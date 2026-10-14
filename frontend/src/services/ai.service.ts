import axios from "../lib/axios";
import { AiAnswer, StudyKit } from "../types/ai";
import { ApiResponse } from "../types/api";

export const aiService = {
  askCourse: async (
    courseId: string,
    question: string
  ): Promise<ApiResponse<AiAnswer>> => {
    const response = await axios.post(`/ai/courses/${courseId}/ask`, {
      question,
    });
    return response.data;
  },

  getStudyKit: async (
    materialId: string
  ): Promise<ApiResponse<StudyKit | null>> => {
    const response = await axios.get(`/ai/materials/${materialId}/study-kit`);
    return response.data;
  },

  generateStudyKit: async (
    materialId: string
  ): Promise<ApiResponse<StudyKit>> => {
    const response = await axios.post(`/ai/materials/${materialId}/study-kit`);
    return response.data;
  },
};
