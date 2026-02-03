import Swal, { SweetAlertOptions } from 'sweetalert2';

/**
 * Wrapper de SweetAlert que garantiza que aparezca sobre todos los modales
 */
export const showAlert = (options: SweetAlertOptions) => {
  return Swal.fire({
    ...options,
    didOpen: () => {
      const container = document.querySelector('.swal2-container') as HTMLElement;
      const popup = document.querySelector('.swal2-popup') as HTMLElement;
      if (container) container.style.zIndex = '99999';
      if (popup) popup.style.zIndex = '100000';
    }
  });
};

/**
 * Confirmación de eliminación
 */
export const confirmDelete = (title: string, text: string) => {
  return showAlert({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d32f2f'
  });
};

/**
 * Mensaje de éxito
 */
export const successAlert = (title: string, text: string) => {
  return showAlert({
    title,
    text,
    icon: 'success'
  });
};

/**
 * Mensaje de error
 */
export const errorAlert = (title: string, text: string) => {
  return showAlert({
    title,
    text,
    icon: 'error'
  });
};

/**
 * Mensaje de advertencia
 */
export const warningAlert = (title: string, text: string) => {
  return showAlert({
    title,
    text,
    icon: 'warning'
  });
};
