export type DashboardUserType = "labour" | "contractor" | "sub_contractor";

export type DashboardTabValue =
  | "jobs"
  | "contractors"
  | "requests"
  | "history"
  | "profile"
  | "job_requirements"
  | "sub_contractors"
  | "labours"
  | "job_postings"
  | "labour_required";

export interface DashboardTabItem {
  label: string;
  value: DashboardTabValue;
  userTypes: DashboardUserType[];
}

export interface DashboardSearchMeta {
  label: string;
  placeholder: string;
  showSearch: boolean;
}

export const DASHBOARD_TAB_CONFIG: DashboardTabItem[] = [
  { label: "Jobs", value: "jobs", userTypes: ["labour"] },
  { label: "Contractors", value: "contractors", userTypes: ["labour"] },
  { label: "Jobs", value: "jobs", userTypes: ["sub_contractor"] },
  { label: "Create Jobs", value: "job_requirements", userTypes: ["contractor","sub_contractor"] },
  { label: "Contractors", value: "contractors", userTypes: ["sub_contractor"] },
  { label: "Contractors", value: "sub_contractors", userTypes: ["contractor"] },
  { label: "Find Labour", value: "labours", userTypes: ["contractor"] },
  { label: "Find Labour", value: "labour_required", userTypes: ["sub_contractor"] },
  { label: "Requests", value: "requests", userTypes: ["labour", "contractor", "sub_contractor"] },
  { label: "History", value: "history", userTypes: ["labour", "contractor", "sub_contractor"] },
  { label: "Profile", value: "profile", userTypes: ["labour", "contractor", "sub_contractor"] },

];

export const getTabsForUserType = (userType: DashboardUserType): DashboardTabItem[] => {
  return DASHBOARD_TAB_CONFIG.filter((tab) => tab.userTypes.includes(userType));
};

export const getSearchMetaForTab = (tabValue: DashboardTabValue): DashboardSearchMeta => {
  const baseByTab: Record<DashboardTabValue, DashboardSearchMeta> = {
    jobs: {
      label: "Search Jobs",
      placeholder: "Search by contractor name, location, or skills...",
      showSearch: false,
    },
    contractors: {
      label: "Search Contractors",
      placeholder: "Search contractors by name, location, or expertise...",
      showSearch: true,
    },
    requests: {
      label: "Search Requests",
      placeholder: "Search requests by name, location, or skill...",
      showSearch: true,
    },
    history: {
      label: "",
      placeholder: "",
      showSearch: false,
    },
    profile: {
      label: "",
      placeholder: "",
      showSearch: false,
    },
    job_requirements: {
      label: "Search Job Requirements",
      placeholder: "Search requirements by labour name, location, or skills...",
      showSearch: false,
    },
    sub_contractors: {
      label: "Search Sub-Contractors",
      placeholder: "Search sub-contractors by name, location, or trade...",
      showSearch: true,
    },
    labours: {
      label: "Search Labours",
      placeholder: "Search labours by name, location, or skills...",
      showSearch: true,
    },
    job_postings: {
      label: "Search Job Postings",
      placeholder: "Search postings by contractor, location, or skills needed...",
      showSearch: false,
    },
    labour_required: {
      label: "Search Labour",
      placeholder: "Search labour by name, location, or skills...",
      showSearch: true,
    },
  };

  return baseByTab[tabValue];
};
