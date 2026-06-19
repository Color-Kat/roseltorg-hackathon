import { SuccessCardProps } from "@/shared/ui/success/model";
import { SuccessCard } from "@/shared/ui/success/SuccessCard";
import { Modal, ModalContent, ModalProps } from "@heroui/modal";
import { FC } from 'react';

type SuccessModalProps = {
    modalProps?: Partial<ModalProps>;
    cardProps: SuccessCardProps;
};

export const SuccessModal: FC<SuccessModalProps> = ({ modalProps = {}, cardProps }) => {
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
                <SuccessCard {...cardProps}/>
            </ModalContent>
        </Modal>
    );
}