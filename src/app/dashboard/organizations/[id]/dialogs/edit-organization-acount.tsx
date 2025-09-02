"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Organization, Subscription } from "@/types/index";
import { useLanguage } from "@/contexts/language-content";
import { useEffect, useState } from "react";
import { Building2, Phone, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  handleRefresh: () => Promise<void>;
}

type OrgDataToSubmit = {
  name: string;
  phone_number: string;
  type: string;
  address: string;
  city: string;
  state: string;
  plan_id: string;
  nuit: string;
  plans: Subscription[];
};

export function EditOrganizationAccountDialog({
  open,
  onOpenChange,
  organization: org,
  handleRefresh,
}: IProps) {
  const [organization, setOrganization] = useState({
    name: org?.name,
    id: org?.id,
    phone_number: org?.phone_number,
    type: org?.type,
    address: org?.address,
    city: org?.city,
    state: org?.state,
    plan_id: `${org?.plan_id}`,
    nuit: org?.nuit,
    plans: [],
  } as OrgDataToSubmit);
  const { t } = useLanguage();
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (
      !organization?.name ||
      !organization?.phone_number ||
      !organization?.type ||
      !organization?.address ||
      !organization?.city ||
      !organization?.state ||
      !organization?.plan_id
    )
      return;

    setResponseMessage("");
    setLoading(true);
    try {
      const url = `/api/entities/update`;

      const body = {
        ...organization,
      };

      const response = await api.post(url, body);

      if (response.status == 201) {
        setResponseMessage(response.data?.message);

        toast.success("Cliente atualizada com sucesso", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });

        await handleRefresh();
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
      if (error instanceof AxiosError) {
        const text =
          error.response?.data?.message ||
          "Ocorreu um erro ao atualizar o Cliente!";
        console.error(error);

        setResponseMessage(text);
        toast.error(text, {
          description: "Ocorreu um erro!",
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    }

    setLoading(false);
  }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            {t("organization-page.editOrganization")}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid gap-4 py-2">
            {/* Informações Básicas */}
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("organizations-page.basicInfo")}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    {t("organizations-page.name")}
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-8 text-sm"
                      placeholder="Nome do Cliente"
                      value={organization.name}
                      required
                      onChange={(event) => {
                        setOrganization({
                          ...organization,
                          name: event.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm">
                    {t("organizations-page.clientType")}
                  </Label>
                  <Select
                    value={organization.type}
                    required
                    onValueChange={(value) => {
                      setOrganization({ ...organization, type: value });
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue
                        placeholder={t("organizations-page.selectType")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empresa">Empresa</SelectItem>
                      <SelectItem value="ong">ONG</SelectItem>
                      <SelectItem value="governo">Governo</SelectItem>
                  <SelectItem value="particular">Particular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm">
                Plano
              </Label>
              <Select
                value={organization?.plan_id}
                required
                onValueChange={(value) => {
                  setOrganization({ ...organization, plan_id: value });
                }}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {organization?.plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contato */}
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("organizations-page.contact")}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
                    {t("organizations-page.phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-8 text-sm"
                      placeholder="(00) 0000-0000"
                      value={organization.phone_number}
                      required
                      onChange={(event) => {
                        setOrganization({
                          ...organization,
                          phone_number: event.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="grid gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("organizations-page.address")}
              </h3>
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">
                      {t("organizations-page.address")}
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        className="pl-8 text-sm"
                        placeholder="Rua, número"
                        value={organization.address}
                        required
                        onChange={(event) => {
                          setOrganization({
                            ...organization,
                            address: event.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm">
                      {t("organizations-page.city")}
                    </Label>
                    <Input
                      id="city"
                      className="text-sm"
                      placeholder="Cidade"
                      value={organization.city}
                      required
                      onChange={(event) => {
                        setOrganization({
                          ...organization,
                          city: event.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm">
                      {t("organizations-page.state")}
                    </Label>
                    <Input
                      id="state"
                      className="text-sm"
                      placeholder="Estado"
                      value={organization.state}
                      required
                      onChange={(event) => {
                        setOrganization({
                          ...organization,
                          state: event.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nuit" className="text-sm">
                      Nuit
                    </Label>
                    <Input
                      id="nuit"
                      className="text-sm"
                      placeholder="Nuit"
                      value={organization.nuit}
                      required
                      onChange={(event) => {
                        setOrganization({
                          ...organization,
                          nuit: event.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
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

          <div className="flex justify-end gap-2 mt-6">
            <Button type="submit" className="text-sm h-9">
              {loading ? (
                <PulseLoader color="#fff" size={8} />
              ) : (
                t("organizations-page.continue")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
