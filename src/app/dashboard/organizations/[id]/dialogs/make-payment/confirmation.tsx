"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/language-content";

type OrgDataToSubmit = {
  price: string;
  gigabytes: string;
  planId: string;
  planName: string;
};

interface IProps {
  goBack: () => void;
  dataToSubmit: OrgDataToSubmit;
  organizationId: number;
}

export function Confirmation({ goBack, dataToSubmit, organizationId }: IProps) {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { t } = useLanguage();

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);
    try {
      const url = `/api/entities/${organizationId}/update-organization-plan-with-new-payment`;

      const response = await api.put(url, {
        ...dataToSubmit,
        organizationId: organizationId,
      });

      if (response.status == 201) {
        setResponseMessage(response.data?.message);

        toast.success(response.data?.message);
        location.reload();
      } else {
        toast.warning(response.data?.message, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Ocorreu um erro!");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="w-[315px] sm:min-w-[500px] bg-white border rounded-xl shadow-sm px-4 sm:px-7 py-4  max-h-[90vh] overflow-auto"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">
            {t("organization-page.confirmation")}
          </h1>
          <Button
            variant={"outline-solid"}
            className="p-3 rounded-lg"
            onClick={goBack}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
        </div>

        <div className="py-6">
          <p>
            {t("organization-page.confirmPaymentRegistration")}:
            {` ${dataToSubmit?.planName}`}?
          </p>
        </div>
      </div>

      {responseMessage && (
        <div className="mt-4 w-full bg-secondary px-3 py-2 rounded-lg ">
          <span className="font-semibold">Resposta do servidor</span>
          <p>
            <span className="text-primary text-lg">{responseMessage}</span>
          </p>
        </div>
      )}

      <Button type="submit" className="w-full text-sm h-9 mt-4">
        {loading ? (
          <PulseLoader color="#fff" size={8} />
        ) : (
          t("organization-page.create")
        )}
      </Button>
    </form>
  );
}
