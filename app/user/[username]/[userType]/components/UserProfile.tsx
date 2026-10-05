"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import PersonalDetails from "./PersonalDetails";
import type { RootState } from "@/store/store";

export default function UserProfile() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <PersonalDetails />
    </div>
  );
}
