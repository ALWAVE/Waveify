"use client"
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import ButtonLogin from "./ButtonLogin";
import { useAuth } from "@/providers/AuthProvider";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "lucide-react";
import { parseBlob } from "music-metadata-browser";
import ButtonLink from "./ButtonLink";
import useSongs from "@/hooks/useSongs"
import toast from "react-hot-toast";
import GenreSelect from "./GenreSelect";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    // const { refresh } = useSongs()
    const uploadModal = useUploadModal();
    const [selectedGenre, setSelectedGenre] = useState("");
    const hasPremiumSubscription = user?.subscription;
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    }
    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        setIsLoading(true);
        try {
            if (!values.song || values.song.length === 0) {
                throw new Error("No song file selected.");
            }

            const songFile = values.song[0];
            const imageFile = values.image?.[0];

            const metadata = await parseBlob(songFile);
            const durationSec = metadata.format.duration || 0;
            const duration = new Date(durationSec * 1000).toISOString().substr(11, 8);

            const formData = new FormData();
            formData.append("Title", values.title);
            formData.append("Author", values.author);
            formData.append("UserId", user?.id || "");
            formData.append("Duration", duration);
            formData.append("Genre", values.genre);
            formData.append("Vibe", values.vibe);
            formData.append("File", songFile);

            if (imageFile) {
                formData.append("Image", imageFile);
            }

            const response = await fetch("http://77.94.203.78:5000/Song/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            await response.json(); // Это должно быть здесь
            //   refresh();
            toast.success("Успешное добавление песни, загляните в Your Music!");
            uploadModal.onClose();
            reset();
        } catch (err) {
            console.error("Error uploading:", err);
            toast.error("Error uploading");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}>
            <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <h3 className="pb-1 font-semibold">Select Genre:</h3>
                    <GenreSelect value={selectedGenre} onChange={setSelectedGenre} />
                </div>

                <div>
                    <h3 className="pb-1 font-semibold">Select Vibe:</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Joyfully", "Energetic", "Quietly", "Sad"].map((vibe) => (
                            <label
                                key={vibe}
                                className="flex items-center cursor-pointer hover:bg-rose-500 rounded-lg px-3 py-2 bg-neutral-800 text-white transition-all text-sm"
                            >
                                <input
                                    type="radio"
                                    value={vibe}
                                    {...register("vibe", { required: true })}
                                    className="mr-2 accent-rose-500"
                                />
                                {vibe}
                            </label>
                        ))}
                    </div>

                </div>
                <div>

                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        {...register('song', { required: true })}

                    />
                </div>

                {/* {hasPremiumSubscription ? ( // Проверка на подписку */}
                <div>
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image', { required: true })}
                    />
                </div>
                {/* ) : (
                    <div>
                        <div className="pb-1">
                            Subscribe to upload an image
                        </div>
                        <div className="grid">
                            <div className="rounded-lg bg-gradient-to-r from-violet-300 to-rose-300  flex items-center">

                                <ButtonLogin href="/premium" className=" bg-transparent flex justify-center hover:text-white">
                                    Upgrade
                                    <GoArrowUpRight className=" " size={20} />
                                </ButtonLogin>
                            </div>
                        </div>
                    </div>


                )} */}

                <ButtonLogin type="submit" className="hover:scale-105">
                    Create
                </ButtonLogin>
            </form>
        </Modal>
    );
};

export default UploadModal;