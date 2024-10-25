import React, { FC } from 'react'
import dynamic from 'next/dynamic'

const Modal = dynamic(() => import('@mui/material/Modal'), { ssr: false });

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    component: React.ComponentType<any>;
    setRoute?: (route: string) => void;
    className?: string;
}

const NewModal: FC<Props> = ({ open, setOpen, setRoute, component: Component, className }) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-lg shadow p-4 outline-none ${className}`}>
                <Component setOpen={setOpen} setRoute={setRoute} />
            </div>
        </Modal>
    )
}

export default NewModal
