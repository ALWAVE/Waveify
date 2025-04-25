import { DrumKit } from "@/models/DrumKit";
import { DrumKitRequest } from "@/services/drumKits";
import { Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

interface CreateUpdateDrumKitProps {
    mode: Mode;
    values: DrumKit;
    isModalOpen: boolean; // Исправлено название переменной
    handleCancel: () => void;
    handleCreate: (request: DrumKitRequest) => void;
    handleUpdate: (id: string, request: DrumKitRequest) => void;
}

export enum Mode {
    Create,
    Edit,
}

export const CreateUpdateDrumKit = ({
    mode,
    values,
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate
}: CreateUpdateDrumKitProps) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [price, setPrice] = useState<number | string>(1); // Изменение типа

    useEffect(() => {
        if (values) {
            setTitle(values.title || ""); // Добавлена проверка
            setDescription(values.description || ""); // Добавлена проверка
            setUrl(values.url || "");
            setPrice(values.price || 1); // Добавлена проверка
        }
    }, [values]);

    const handleOnOk = async () => {
        const drumKitRequest: DrumKitRequest = { title, description, url, price: Number(price) }; // Приведение типа
        try {
            if (mode === Mode.Create) {
                await handleCreate(drumKitRequest);
            } else {
                await handleUpdate(values.id, drumKitRequest);
            }
        } catch (error) {
            console.error("Ошибка при сохранении набора барабанов:", error); // Обработка ошибок
        }
    };

    return (
        <Modal
            title={mode === Mode.Create ? "Add Drum Kit" : "Edit Drum Kit"}
            open={isModalOpen}
            cancelText={"Отмена"}
            onOk={handleOnOk}
            onCancel={handleCancel}
        >
            <div>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название"
                />
                <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    placeholder="Описание"
                />
                <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)} // Убедитесь, что это строка
                    placeholder="Url"
                />
                <Input
                    type="number" // Установить тип для ввода числа
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // Убедитесь, что это строка
                    placeholder="Цена"
                />
            </div>
        </Modal>
    );
};
