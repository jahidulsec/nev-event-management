import { toast } from "sonner";

const deleteToastTemplate = (
  action: () => Promise<{ success: boolean; message: string; data: any }>,
) => {
  return toast.promise(action, {
    loading: "Deleting...",
    success: (data) => {
      if (!data.success) throw data;
      return data.message;
    },
    error: (data) => {
      return data.message;
    },
  });
};

export { deleteToastTemplate };
