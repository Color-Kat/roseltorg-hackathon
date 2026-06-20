import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { assessmentApi } from "@/entities/assessment/api/assessment-api";
import { AssessmentCreate } from "@/entities/assessment/model";

export const assessmentKeys = {
    all: ["assessments"] as const,
};

/** Список результатов ассессмента для кабинета работодателя. */
export function useAssessmentsQuery() {
    return useQuery({
        queryKey: assessmentKeys.all,
        queryFn: assessmentApi.list,
    });
}

/** Сохранить результат прохождения. */
export function useCreateAssessment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: AssessmentCreate) => assessmentApi.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
        },
    });
}
