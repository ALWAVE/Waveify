import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface ModalProps {
    isOpen: boolean;
    onChange?: (open: boolean) => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    classNames?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children,
    classNames
}) => {
    const contentClasses = twMerge(`
        fixed
        drop-shadow-md
        border
        border-neutral-700
        top-[50%]
        left-[50%]
        max-h-full
        h-full
        md:h-auto
        md:max-h-[85vh]
        w-full
        md:w-[90vw]
        md:max-w-[450px]
        translate-x-[-50%]
        translate-y-[-50%]
        rounded-md
        bg-neutral-800
        p-[25px]
        z-10000
    `, classNames);

    return (
        <Dialog.Root
            open={isOpen}
            defaultOpen={isOpen}
            onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="
                        bg-neutral-900/90
                        backdrop-blur-sm
                        fixed
                        inset-0
                        z-[1000]
                    "
                >
                    <Dialog.Content className={contentClasses}>
                        <Dialog.Title
                            className="
                                text-xl
                                text-center
                                font-bold
                                md-4
                            ">
                            {title}
                        </Dialog.Title>
                        <Dialog.Description className="
                            mb-5
                            text-sm
                            leading-normal
                            text-center">
                            {description}
                        </Dialog.Description>
                        <div>
                            {children}
                        </div>
                        <Dialog.Close asChild>
                            <button
                                onClick={() => {
                                    if (onChange) onChange(false); // Проверка на undefined
                                }}
                                className="
                                    cursor-pointer
                                    text-neutral-400 
                                    hover:text-white 
                                    absolute
                                    top-[10px]
                                    right-[10px]
                                    inline-flex
                                    h-[25px]
                                    w-[25px]
                                    appearance-none
                                    items-center
                                    justify-center
                                    rounded-full
                                    focus:outline-none">
                                <IoMdClose />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default Modal;
