import Swal from 'sweetalert2';

export const showAlert = {
  success(title: string, text: string = '') {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#696cff',
      timer: 2500,
      timerProgressBar: true
    });
  },

  error(title: string, text: string = '') {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#696cff'
    });
  },

  warning(title: string, text: string = '') {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#696cff'
    });
  },

  async confirm(title: string, text: string = 'Tindakan ini tidak dapat dibatalkan!'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3e1d',
      cancelButtonColor: '#8592a3',
      confirmButtonText: 'Ya, Lanjutkan!',
      cancelButtonText: 'Batal'
    });
    return result.isConfirmed;
  },

  toast(title: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon,
      title
    });
  }
};
