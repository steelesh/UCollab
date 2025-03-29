import { AlertCircle, Check, Info, X } from "lucide-react";
import { toast } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
};

export function toastSuccess(title: string, options?: ToastOptions) {
  return toast.success(title, {
    icon: <Check className="h-6 w-6" />,
    duration: 4000,
    ...options,
  });
}

export function toastError(title: string, options?: ToastOptions) {
  return toast.error(title, {
    icon: <X className="h-6 w-6" />,
    duration: 4000,
    ...options,
  });
}

export function toastInfo(title: string, options?: ToastOptions) {
  return toast.info(title, {
    icon: <Info className="h-6 w-6" />,
    duration: 4000,
    ...options,
  });
}

export function toastWarning(title: string, options?: ToastOptions) {
  return toast.warning(title, {
    icon: <AlertCircle className="h-6 w-6" />,
    duration: 4000,
    ...options,
  });
}
