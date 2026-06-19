import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { itemApi } from "@/entities/item/api/item-api";
import { ItemCreate } from "@/entities/item/model";

export const itemKeys = {
    all: ["items"] as const,
};

/** React Query hook: fetch the list of items. */
export function useItemsQuery() {
    return useQuery({
        queryKey: itemKeys.all,
        queryFn : itemApi.list,
    });
}

/** React Query hook: create an item and refresh the list. */
export function useCreateItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: ItemCreate) => itemApi.create(dto),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.all });
        },
    });
}

/** React Query hook: delete an item and refresh the list. */
export function useDeleteItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => itemApi.remove(id),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.all });
        },
    });
}
