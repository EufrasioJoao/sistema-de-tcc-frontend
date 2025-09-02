"use client";

import { useEffect, useState } from "react";
import { Form } from "./payment-data";
import { Subscription } from "@/types/index";
import { Confirmation } from "./confirmation";
import { api } from "@/lib/api";

interface IProps {
  closeModal: () => void;
  organizationId: number;
}

type OrgDataToSubmit = {
  price: string;
  gigabytes: string;
  planId: string;
  planName: string;
  plans: Subscription[];
};

export function MakePaymentDialog({ closeModal, organizationId }: IProps) {
  const [stage, setStage] = useState(1);
  const [dataToSubmit, setDataToSubmit] = useState({
    planId: "",
    planName: "",
    price: "",
    gigabytes: "",
    plans: [],
  } as OrgDataToSubmit);

  const fetchPlans = async () => {
    try {
      const response = await api.get(`/api/plans`);
      setDataToSubmit({ ...dataToSubmit, plans: response.data.plans });
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
          <Form
            handleNext={() => {
              setStage(2);
            }}
            dataToSubmit={dataToSubmit}
            setDataToSubmit={setDataToSubmit}
            closeModal={closeModal}
          />
        ) : (
          <Confirmation
            goBack={() => setStage(1)}
            dataToSubmit={dataToSubmit}
            organizationId={organizationId}
          />
        )}
      </div>
    </div>
  );
}
