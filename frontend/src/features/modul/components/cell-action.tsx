import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import React, { useCallback } from "react";

interface CellActionProps {
  //   data: IArticlesPagination;
}

const CellAction: React.FC<CellActionProps> = ({}) => {
  return (
    <div className="flex justify-center gap-2 ">
      <Link href={`#`} >
        <Eye className="w-5 h-5 " style={{ stroke: "#72A1E7" }} />
      </Link>
      <Link href={`#`} >
        <Pen className="w-5 h-5" style={{ stroke: "#999999" }} />
      </Link>
      <Link href={`#`}>
        <Trash className="w-5 h-5 " style={{ stroke: "#FF6969" }} />
      </Link>
    </div>
  );
};

export default CellAction;
