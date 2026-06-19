import { ErrorCard } from "@/shared/ui/error/ErrorCard";
import { ErrorCardProps } from "@/shared/ui/error/model";
import { Modal, ModalContent, ModalProps } from "@heroui/modal";
import { FC } from 'react';

type ErrorModalProps = {
    modalProps?: Partial<ModalProps>;
    cardProps: ErrorCardProps;
};

export const ErrorModal: FC<ErrorModalProps> = ({ modalProps = {}, cardProps }) => {
    return (
        <Modal
            classNames={{
                base       : "p-0 m-0",
                wrapper    : "p-2 m-0",
                closeButton: "hidden",
            }}
            backdrop="blur"
            placement="center"
            {...modalProps}
        >
            <ModalContent className="rounded-3xl w-max">
                <ErrorCard {...cardProps}/>
            </ModalContent>
        </Modal>
    );
}