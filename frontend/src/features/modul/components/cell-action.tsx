import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import React, { useCallback } from "react";
import AlertDeleteModul from "./alert-delete-modul";
import { useDeleteModul } from "@/services/api/modul";

interface CellActionProps {
  //   data: IArticlesPagination;
  id: number;
}

const CellAction: React.FC<CellActionProps> = ({ id }) => {
  const { mutate, isPending } = useDeleteModul(id);
  return (
    <div className="flex justify-center gap-2 ">
      <Link href={`/admin/modul/${id}`}>
        <Eye className="w-5 h-5 " style={{ stroke: "#72A1E7" }} />
      </Link>
      <Link href={`/admin/modul/edit/${id}`}>
        <Pen className="w-5 h-5" style={{ stroke: "#999999" }} />
      </Link>
      {/* <Link href={`#`}>
        <Trash className="w-5 h-5 " style={{ stroke: "#FF6969" }} />
      </Link> */}
      <div>
        <AlertDeleteModul onClick={mutate} isPending={isPending} />
      </div>
    </div>
  );
};

export default CellAction;
