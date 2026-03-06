"use client";

import VisitingCard from "@/app/components/common/VisitingCard";

interface ContractorCardProps {
  contractor: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (contractorId: string) => void;
}

export default function ContractorCard({
  contractor,
  onConnect,
}: ContractorCardProps) {
  return (
    <VisitingCard contractor={contractor} onConnect={onConnect} />
  );
}
