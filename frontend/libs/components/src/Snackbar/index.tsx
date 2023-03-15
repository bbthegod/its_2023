/*
 *
 * Snackbar
 *
 */
import { SnackbarContext } from '@its/common';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: any;
}

export function Snackbar(props: Props) {
  //====================================== Callback ======================================
  const open = (message: string, variant: string) => {
    if(variant === "success") {
      toast.success(message);
    }
    
    if(variant === "error") {
      toast.error(message);
    }
  };
  //====================================== Render ======================================
  return (
    <SnackbarContext.Provider value={{ open }}>
      {/* <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} ref={providerRef}> */}
      {props.children}
      {/* </SnackbarProvider> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </SnackbarContext.Provider>
  );
}
