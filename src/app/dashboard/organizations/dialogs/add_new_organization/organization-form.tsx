import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Mail, Phone, MapPin, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-content";
import { SetStateAction, Dispatch } from "react";
import { Subscription } from "@/types/index";

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

interface IProps {
  closeModal: () => void;
  handleNext: () => void;
  setOrganization: Dispatch<SetStateAction<OrgDataToSubmit>>;
  organization: OrgDataToSubmit;
}

export function OrganizationForm({
  handleNext,
  closeModal,
  setOrganization,
  organization,
}: IProps) {
  const { t } = useLanguage();

  async function handleSubmit() {
    if (
      !organization?.organizationName ||
      !organization?.organizationEmail ||
      !organization?.organizationPhoneNumber ||
      !organization?.type ||
      !organization?.address ||
      !organization?.city ||
      !organization?.state ||
      !organization?.planId
    )
      return;

    handleNext();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="w-[315px] sm:min-w-[500px] bg-white border rounded-xl shadow-sm px-4 sm:px-7 py-4  max-h-[90vh] overflow-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">
          {t("organizations-page.addClient")}
        </h1>
        <Button
          variant={"outline-solid"}
          className="p-3 rounded-lg"
          onClick={closeModal}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

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
                  value={organization.organizationName}
                  required
                  onChange={(event) => {
                    setOrganization({
                      ...organization,
                      organizationName: event.target.value,
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
            {t("organizations-page.plan")}
          </Label>
          <Select
            value={organization?.planId}
            required
            onValueChange={(value) => {
              setOrganization({ ...organization, planId: value });
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t("organizations-page.selectPlan")} />
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
              <Label htmlFor="email" className="text-sm">
                {t("organizations-page.email")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-8 text-sm"
                  placeholder="email@exemplo.com"
                  value={organization.organizationEmail}
                  required
                  onChange={(event) => {
                    setOrganization({
                      ...organization,
                      organizationEmail: event.target.value,
                    });
                  }}
                />
              </div>
            </div>

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
                  value={organization.organizationPhoneNumber}
                  required
                  onChange={(event) => {
                    setOrganization({
                      ...organization,
                      organizationPhoneNumber: event.target.value,
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
                  value={organization.organizationNuit}
                  required
                  onChange={(event) => {
                    setOrganization({
                      ...organization,
                      organizationNuit: event.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="submit" className="text-sm h-9">
          Continuar
        </Button>
      </div>
    </form>
  );
}
