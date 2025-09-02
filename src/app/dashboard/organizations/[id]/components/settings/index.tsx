import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

import { Organization, Payment } from "@/types/index";
import ActivationSwitch from "./activation-switch";
import { formatDistanceStrict, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PaymentsTable } from "./payments";
import { StorageUsage } from "./storage-usage";
import { useLanguage } from "@/contexts/language-content";

export function Settings({
  organization,
  setIsEditOrganizaionDialogOpened,
  setIsDeleteOrganizationDialogOpened,
  setIsNewPaymentDialogOpened,
  payments,
}: {
  organization: Organization | null;
  handleRefresh: () => Promise<void>;
  setIsNewPaymentDialogOpened: Dispatch<SetStateAction<boolean>>;
  setIsEditOrganizaionDialogOpened: Dispatch<SetStateAction<boolean>>;
  setIsDeleteOrganizationDialogOpened: Dispatch<SetStateAction<boolean>>;
  payments: Payment[];
}) {
  function checkNextPaymentDate(nextPaymentDate: string) {
    const today = new Date();
    const paymentDate = parseISO(nextPaymentDate);

    if (isBefore(paymentDate, today)) {
      return {
        message: "Pagamento pendente! O prazo já passou.",
        pastDue: true,
      };
    }

    const daysLeft = formatDistanceStrict(today, paymentDate, {
      unit: "day",
      locale: ptBR,
    });

    return {
      message: `Faltam ${daysLeft} para o próximo pagamento.`,
      pastDue: false,
    };
  }

  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-8">
      {/* Storage Usage Component */}
      <div className="max-w-[1050px] mx-auto my-4">
        <StorageUsage organization={organization} />
      </div>

      <div className="max-w-[1050px] mx-auto my-4 border rounded-l">
        <div className="p-4 border-b mb-4">
          <h1 className="font-bold text-lg sm:text-xl">
            {t("organization-page.settings")}
          </h1>
          <p>{t("organization-page.manageProfile")}</p>
        </div>

        <div className="p-4 mt-4">
          <div className="flex justify-between gap-2 flex-wrap">
            <div>
              <strong className="font-semibold">
                {t("organization-page.emailAddress")}
              </strong>
              <p>{organization?.email}</p>
            </div>

            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteOrganizationDialogOpened(true);
              }}
              className="rounded-lg active:opacity-[0.6] hover:opacity-[0.8]"
            >
              {t("organization-page.deleteOrganization")}
            </Button>
          </div>

          <strong className="mt-7 block font-semibold">
            {t("organization-page.currentPlan")}
          </strong>
          <span className="text-foreground text-[#ccc]">
            {organization?.plan?.name}
          </span>

          <div className="flex justify-between flex-wrap mt-4 pt-4">
            <div>
              <h3 className="font-semibold">
                {t("organization-page.accountStatus")}
              </h3>
              <span className="text-foreground text-[#ccc]">
                {organization?.is_active ? "Ativada" : "Desativada"}
              </span>
            </div>

            <ActivationSwitch
              isActive={organization?.is_active as boolean}
              organizationId={organization?.id}
            />
          </div>

          <div className="flex justify-between flex-wrap gap-2 mt-4 pt-4">
            <div>
              <h3 className="font-semibold">
                {t("organization-page.paymentCalendar")}
              </h3>
              <span className="text-foreground text-[#ccc]">
                {
                  checkNextPaymentDate(organization?.nextPaymentDate as string)
                    ?.message
                }
              </span>
            </div>

            <Button
              onClick={() => setIsNewPaymentDialogOpened(true)}
              variant="outline"
              className=" rounded-lg active:opacity-[0.6] text-[0.8rem]"
            >
              {t("organization-page.makePayment")}
            </Button>
          </div>

          <div className="flex justify-between flex-wrap gap-2 mt-4 pt-4">
            <div>
              <h3 className="font-semibold">
                {t("organization-page.accountData")}
              </h3>
              <span className="text-foreground text-[#ccc]">
                {t("organization-page.updateAccountInfo")}
              </span>
            </div>

            <Button
              onClick={() => setIsEditOrganizaionDialogOpened(true)}
              variant="outline"
              className=" rounded-lg active:opacity-[0.6] text-[0.8rem]"
            >
              {t("organization-page.editInfo")}
            </Button>
          </div>
        </div>
      </div>

      {payments && <PaymentsTable data={payments} />}
    </div>
  );
}
