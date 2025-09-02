"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/language-content";

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
};

interface IProps {
  goBack: () => void;
  handleRefresh: () => Promise<void>;
  organization: OrgDataToSubmit;
}

export function AdminUserForm({ goBack, handleRefresh, organization }: IProps) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { t } = useLanguage();

  async function handleSubmit() {
    if (loading) return;
    if (!firstName) return;
    if (!lastName) return;
    if (!email) return;
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const url = `/api/entities/create`;

      const body = {
        organization: organization,
        organizationAdmin: {
          organizationAdminFirstName: firstName,
          organizationAdminLastName: lastName,
          organizationAdminEmail: email,
          organizationAdminPhoneNumber: phoneNumber,
        },
      };

      const response = await api.post(url, body);

      if (response.status == 201) {
        setResponseMessage(
          response.data?.transaction?.organizationAdminPassword
        );

        toast.success("Cliente criada com sucesso", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });

        handleRefresh();
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
      toast.error("Ocorreu um erro ao criar o Cliente!", {
        description: "Ocorreu um erro ao criar o Cliente!",
        action: {
          label: "Ok",
          onClick: () => {},
        },
      });
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
            {t("organizations-page.adminData")}
          </h1>
          <Button
            variant={"outline-solid"}
            className="p-3 rounded-lg"
            onClick={goBack}
          >
            <ArrowLeft className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_name">
            {t("organizations-page.firstName")}
          </Label>
          <Input
            id="first_name"
            value={firstName}
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">{t("organizations-page.lastName")}</Label>
          <Input
            id="last_name"
            value={lastName}
            required
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("organizations-page.email")}</Label>
          <Input
            id="email"
            value={email}
            type="email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("organizations-page.phone")}</Label>
          <Input
            id="phone"
            required
            type="number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>
      </div>

      {responseMessage && (
        <div className="mt-4 w-full bg-secondary px-3 py-2 rounded-lg ">
          <span className="font-semibold">Resposta do servidor</span>
          <p>
            A senha do ADMIN é:{" "}
            <span className="text-primary text-lg">{responseMessage}</span>
          </p>
        </div>
      )}

      <Button type="submit" className="w-full text-sm h-9 mt-4">
        {loading ? (
          <PulseLoader color="#fff" size={8} />
        ) : (
          t("organizations-page.create")
        )}
      </Button>
    </form>
  );
}
