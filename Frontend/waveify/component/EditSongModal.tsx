"use client";

import Modal from "./Modal";
import Input from "./Input";
import ButtonLogin from "./ButtonLogin";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";
import { Song } from "@/models/Song";
import useSongs from "@/hooks/useSongs";
import toast from "react-hot-toast";

interface EditSongModalProps {
  song: Song;
  onClose: () => void;
}

const EditSongModal: React.FC<EditSongModalProps> = ({ song, onClose }) => {
  // const { refresh } = useSongs();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<FieldValues>({
    defaultValues: {
      title: song.title,
      author: song.author,
      genre: song.genre,
      vibe: song.vibe,
      image: null,
    },
  });

  useEffect(() => {
    // при открытии сбрасываем значения
    setValue("title", song.title);
    setValue("author", song.author);
    setValue("genre", song.genre);
    setValue("vibe", song.vibe);
  }, [song, setValue]);

  const onSubmit = async (values: FieldValues) => {
    setIsLoading(true);
    try {
      const imageFile = values.image?.[0];

      const formData = new FormData();
      formData.append("Id", song.id); // обязательно передать ID песни
      formData.append("Title", values.title);
      formData.append("Author", values.author);
      formData.append("Genre", values.genre);
      formData.append("Vibe", values.vibe);
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      const response = await fetch(`http://77.94.203.78:5000/api/Song/update`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update song");

      await response.json();
      // refresh();
      onClose();
      reset();
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Ошибочка обновления");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      title="Edit song"
      description="Update song details"
      isOpen={true}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />
        <div className="flex justify-center">
          <Input
            id="genre"
            disabled={isLoading}
            {...register("genre", { required: true })}
            placeholder="Genre"
            className="mr-2"
          />
          <Input
            id="vibe"
            disabled={isLoading}
            {...register("vibe", { required: true })}
            placeholder="Vibe"
          />
        </div>

        <div>
          <div className="pb-1">Change cover image (optional)</div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
            {...register("image")}
          />
        </div>

        <ButtonLogin type="submit" className="hover:scale-105">
          Save Changes
        </ButtonLogin>
      </form>
    </Modal>
  );
};

export default EditSongModal;
