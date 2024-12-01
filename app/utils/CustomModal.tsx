import React, { FC } from 'react'
import dynamic from 'next/dynamic'

const Modal = dynamic(() => import('@mui/material/Modal'), { ssr: false });

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    component?: React.ComponentType<any>;
    setRoute?: (route: string) => void;
    className?: string;
    isConfirmation?: boolean;
    title?: string;
    message?: string;
    onConfirm?: () => void;
}

const CustomModal: FC<Props> = ({ 
    open, 
    setOpen, 
    setRoute, 
    component: Component, 
    className,
    isConfirmation,
    title,
    message,
    onConfirm
}) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-lg shadow p-4 outline-none ${isConfirmation ? 'w-[400px]' : 'w-[450px]'} ${className}`}>
                {isConfirmation ? (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{message}</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm?.();
                                    setOpen(false);
                                }}
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                ) : (
                    Component && <Component setOpen={setOpen} setRoute={setRoute} />
                )}
            </div>
        </Modal>
    )
}

export default CustomModal
