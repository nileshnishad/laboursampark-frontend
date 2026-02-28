"use client";

import React from "react";
import PersonalDetails from "./PersonalDetails";

type UserType = "labour" | "contractor";

interface UserProfileProps {
  user: any;
  userType: UserType;
}

export default function UserProfile({ user, userType }: UserProfileProps) {
  return (
    <div className="w-full">
      <PersonalDetails user={user} userType={userType} />
    </div>
  );
}
