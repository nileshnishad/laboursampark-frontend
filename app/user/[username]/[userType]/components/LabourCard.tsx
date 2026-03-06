"use client";

import { useRouter } from "next/navigation";
import IDCard from "@/app/components/common/IdCard";

interface LabourCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
  onViewProfile?: (labourId: string) => void;
  className?: string;
}

export default function LabourCard({
  labour,
  onConnect,
  onViewProfile,
  className,
}: LabourCardProps) {
  return (
    <IDCard
      labour={labour}
      onConnect={onConnect}
      onViewProfile={onViewProfile}
      className={className}
    />
  );
}


