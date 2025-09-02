"use client";

import { useEffect, useState } from "react";
import { OrganizationForm } from "./organization-form";
import { Subscription } from "@/types/index";
import { AdminUserForm } from "./admin-user-form";
import { api } from "@/lib/api";

interface IProps {
  closeModal: () => void;
  handleRefresh: () => Promise<void>;
}

type OrgDataToSubmit = {
  organizationName: string;
  organizationEmail: string;
  organizationPhoneNumber: string;
  type: string;
  address: string;
  city: string;
  state: string;
  planId: string;
  organizationNuit: string;
  plans: Subscription[];
};

export function AddNewOrganizationDialog({
  closeModal,
  handleRefresh,
}: IProps) {
  const [stage, setStage] = useState(1);
  const [organization, setOrganization] = useState({
    organizationName: "",
    organizationEmail: "",
    organizationPhoneNumber: "",
    type: "",
    address: "",
    city: "",
    state: "",
    planId: "",
    organizationNuit: "",
    plans: [],
  } as OrgDataToSubmit);

  const fetchPlans = async () => {
    try {
      const response = await api.get(`/api/plans`);
      setOrganization({ ...organization, plans: response.data.plans });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao buscar planos:", error.message);
      } else {
        console.error("Erro ao buscar planos:", error);
      }
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div
      className="w-full h-screen fixed top-0 left-0 bg-black/70 overflow-scroll z-50 p-8 flex items-center justify-center"
      onClick={(event) => {
        event.stopPropagation();
        closeModal();
      }}
    >
      <div onClick={(event) => event.stopPropagation()}>
        {stage == 1 ? (
          <OrganizationForm
            handleNext={() => {
              setStage(2);
            }}
            organization={organization}
            setOrganization={setOrganization}
            closeModal={closeModal}
          />
        ) : (
          <AdminUserForm
            goBack={() => setStage(1)}
            organization={organization}
            handleRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  );
}
