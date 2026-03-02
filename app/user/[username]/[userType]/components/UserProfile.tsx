"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import PersonalDetails from "./PersonalDetails";
import type { RootState } from "@/store/store";

type UserType = "labour" | "contractor";

export default function UserProfile() {
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const userType = params.userType as UserType;

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <PersonalDetails />
    </div>
  );
}
