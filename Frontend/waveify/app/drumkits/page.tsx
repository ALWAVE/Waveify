"use client"

import { DrumKits } from "@/component/DrumKits";
import Header from "@/component/Header";
import SearchInput from "@/component/SearchInput";
import { createDrumKit, deleteDrumKit, DrumKitRequest, getAllDrumKits, updateDrumKit } from "@/services/drumKits";
import Title from "antd/es/typography/Title";
import Button from "antd/es/button/button"
import { useEffect, useState } from "react";
import { CreateUpdateDrumKit, Mode } from "@/component/CreateUpdateDrumKit";
import { DrumKit } from "@/models/DrumKit";


export default function DrumKitsPage() {
    const deffaultValues = {
        title: "",
        description: "",
        price: 1,
    } as DrumKit
    const [values, setValues] = useState<DrumKit>(deffaultValues);
    const [drumKits, setDrumKits] = useState<DrumKit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);

    const handleCreateDrumKit = async (request: DrumKitRequest) => {
        await createDrumKit(request);
        closeModal();
        const drumKit = await getAllDrumKits();
        setDrumKits(drumKit);
    }
    const handleUpdateDrumKit = async (id: string, request: DrumKitRequest) => {
        console.log("Updating drum kit:", id, request); // Логирование для отладки
        await updateDrumKit(id, request);
        closeModal();
        const drumKits = await getAllDrumKits();
        setDrumKits(drumKits);
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setValues(deffaultValues);
        setIsModalOpen(false);
    };
    const handleDeletDrumKit = async (id: string) => {
        await deleteDrumKit(id);
        closeModal();
        const drumKits = await getAllDrumKits();
        setDrumKits(drumKits);

    };
    const openEditModal = (drumKit: DrumKit) => {
        setMode(Mode.Edit); // Исправлено на Mode.Edit
        setValues(drumKit);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const getDrumKits = async () => {
            const drumKits = await getAllDrumKits();
            setLoading(false);
            setDrumKits(drumKits);
        };
        getDrumKits();
    }, []);
    return (
        <div className="
        
        bg-[var(--bgPage)]
        rounded-lg
        w-full h-full
        overflow-hidden
        overflow-y-auto">
            <div className="mb-2 flex-col gap-y-6">
                <h1 className=" mb-4 text-white text-3xl font-semibold">
                    Search: Drum Kits
                </h1>
                <SearchInput />
                <h1 className="hidden md:block mt-10 mb-4 text-white text-3xl font-semibold text-center">
                    Search results for:
                </h1>
                <Button onClick={openModal}>
                    Create Drum Kit
                </Button>
                <CreateUpdateDrumKit
                    mode={mode}
                    values={values}
                    isModalOpen={isModalOpen}
                    handleCreate={handleCreateDrumKit}
                    handleUpdate={handleUpdateDrumKit}
                    handleCancel={closeModal} />
                {loading ? (<Title>Loading...</Title>) : <DrumKits drumKits={drumKits} handleOpen={openEditModal} handleDelete={handleDeletDrumKit} />}

            </div>
        </div>
    );
};
