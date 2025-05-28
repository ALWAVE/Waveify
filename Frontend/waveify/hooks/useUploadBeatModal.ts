import { create } from 'zustand';


interface UploadBeatModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

}

const useUploadBeatModal = create <UploadBeatModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))
export default useUploadBeatModal;