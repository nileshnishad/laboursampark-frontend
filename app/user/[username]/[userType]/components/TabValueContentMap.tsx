"use client";

import React from "react";
import type { DashboardTabValue, DashboardUserType } from "./dashboard-tabs-config";
import JobsTabContent from "./tab-content/JobsTabContent";
import ContractorsTabContent from "./tab-content/ContractorsTabContent";
import RequestsTabContent from "./tab-content/RequestsTabContent";
import JobRequirementsTabContent from "./tab-content/JobRequirementsTabContent";
import SubContractorsTabContent from "./tab-content/SubContractorsTabContent";
import LaboursTabContent from "./tab-content/LaboursTabContent";
import JobPostingsTabContent from "./tab-content/JobPostingsTabContent";
import LabourRequiredTabContent from "./tab-content/LabourRequiredTabContent";
import HistoryTabContent from "./tab-content/HistoryTabContent";

export interface TabContentProps {
  userType: DashboardUserType;
  usersLoading: boolean;
  usersError: string | null;
  filteredData: any[];
  onConnect: (userId: string) => void;
}

type NonProfileTabValue = Exclude<DashboardTabValue, "profile">;

export const TAB_CONTENT_COMPONENTS: Record<NonProfileTabValue, React.ComponentType<TabContentProps>> = {
  jobs: JobsTabContent,
  contractors: ContractorsTabContent,
  requests: RequestsTabContent,
  history: HistoryTabContent,
  job_requirements: JobRequirementsTabContent,
  sub_contractors: SubContractorsTabContent,
  labours: LaboursTabContent,
  job_postings: JobPostingsTabContent,
  labour_required: LabourRequiredTabContent,
};
