import { api } from "@/shared/api/api-instanse";
import { Assessment, AssessmentCreate } from "@/entities/assessment/model";

/** Эндпоинты результатов ассессмента (backend/app/routers/assessments.py). */
export const assessmentApi = {
    list: async (): Promise<Assessment[]> => {
        const { data } = await api.get<Assessment[]>("/assessments");
        return data;
    },

    create: async (dto: AssessmentCreate): Promise<Assessment> => {
        const { data } = await api.post<Assessment>("/assessments", dto);
        return data;
    },

    get: async (id: number): Promise<Assessment> => {
        const { data } = await api.get<Assessment>(`/assessments/${id}`);
        return data;
    },

    remove: async (id: number): Promise<void> => {
        await api.delete(`/assessments/${id}`);
    },
};
