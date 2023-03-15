import { useRef } from "react";

/*
 *
 * Dialog
 *
 */
interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    children: any;
}

export default function Dialog({ open, setOpen, children }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const onClick = (e: any) => {
        if (ref.current) {
            if (!ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
    }
    return open ? (
        <div className='bg-[#11182740] fixed top-0 right-0 left-0 bottom-0 z-[998] flex justify-center items-center' onClick={onClick}>
            <div ref={ref} className="bg-base-100 shadow-md p-6 z-[999]">
                {children}
            </div>
        </div>
    ) : null;
}
