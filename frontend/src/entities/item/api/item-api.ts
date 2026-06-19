import { api } from "@/shared/api/api-instanse";
import { Item, ItemCreate } from "@/entities/item/model";

/**
 * Items endpoints. Matches the FastAPI backend (see backend/app/routers/items.py).
 */
export const itemApi = {
    list: async (): Promise<Item[]> => {
        const { data } = await api.get<Item[]>("/items");
        return data;
    },

    create: async (dto: ItemCreate): Promise<Item> => {
        const { data } = await api.post<Item>("/items", dto);
        return data;
    },

    remove: async (id: number): Promise<void> => {
        await api.delete(`/items/${id}`);
    },
};
