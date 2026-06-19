'use client';

import { Button, Card, CardBody, Input } from "@heroui/react";
import { FormEvent, useState } from "react";

import { useCreateItem, useDeleteItem, useItemsQuery } from "@/entities/item";

/**
 * Small end-to-end demo of the stack: React Query + axios talking to the
 * FastAPI `/items` CRUD endpoints. Delete this once you start building.
 */
export const ItemsDemo = () => {
    const { data: items, isLoading, isError } = useItemsQuery();
    const createItem = useCreateItem();
    const deleteItem = useDeleteItem();

    const [title, setTitle] = useState("");

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        createItem.mutate({ title: title.trim() }, { onSuccess: () => setTitle("") });
    };

    return (
        <Card className="w-full max-w-md">
            <CardBody className="gap-4">
                <h2 className="text-lg font-semibold">Items (React Query demo)</h2>

                <form onSubmit={onSubmit} className="flex gap-2">
                    <Input
                        value={title}
                        onValueChange={setTitle}
                        placeholder="New item title"
                        size="sm"
                    />
                    <Button
                        type="submit"
                        color="primary"
                        size="sm"
                        isLoading={createItem.isPending}
                    >
                        Add
                    </Button>
                </form>

                {isLoading && <p className="text-sm text-default-500">Loading…</p>}
                {isError && (
                    <p className="text-sm text-danger">
                        Could not reach the API. Is the backend running on{" "}
                        <code>{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}</code>?
                    </p>
                )}

                {items && items.length === 0 && (
                    <p className="text-sm text-default-500">No items yet — add one above.</p>
                )}

                <ul className="flex flex-col gap-2">
                    {items?.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between rounded-medium bg-default-100 px-3 py-2"
                        >
                            <span className="text-sm">{item.title}</span>
                            <Button
                                size="sm"
                                variant="light"
                                color="danger"
                                isLoading={deleteItem.isPending && deleteItem.variables === item.id}
                                onPress={() => deleteItem.mutate(item.id)}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
};
