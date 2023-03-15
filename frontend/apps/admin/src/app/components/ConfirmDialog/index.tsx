import Dialog from "../Dialog";

/*
 *
 * ConfirmDialog
 *
 */
interface Props {
  message: string;
  open: boolean;
  setOpen: any;
  handleAction: any;
}

export default function ConfirmDialog({ message, setOpen, open, handleAction }: Props) {
  //====================================== Callback ======================================
  const handleClose = () => {
    setOpen(false);
  };

  const clickAction = () => {
    handleAction();
    setOpen(false);
  };
  //====================================== Render ======================================
  return (
    <Dialog open={open} setOpen={setOpen}>
      <h1 className="text-2xl">{message}</h1>
      <div className="flex gap-2 justify-end mt-4">
        <button className="btn btn-ghost" onClick={handleClose}>
          Huỷ
        </button>
        <button className="btn btn-primary" onClick={clickAction}>
          Xác nhận
        </button>
      </div>
    </Dialog>
  );
}
