"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, Trash } from "lucide-react";

interface AlertDeleteModulProps {
  onClick: () => void;
  isPending: boolean;
}

const AlertDeleteModul: React.FC<AlertDeleteModulProps> = ({
  onClick,
  isPending,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Trash className="w-5 h-5 text-red-500" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Modul</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin menghapus modul ini ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onClick}
            disabled={isPending}
          >
            Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteModul;
