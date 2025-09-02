import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, X } from "lucide-react";
import { SetStateAction, Dispatch } from "react";
import { Subscription } from "@/types/index";
import { useLanguage } from "@/contexts/language-content";

type OrgDataToSubmit = {
  price: string;
  gigabytes: string;
  planName: string;
  planId: string;
  plans: Subscription[];
};

interface IProps {
  closeModal: () => void;
  handleNext: () => void;
  setDataToSubmit: Dispatch<SetStateAction<OrgDataToSubmit>>;
  dataToSubmit: OrgDataToSubmit;
}

export function Form({
  handleNext,
  closeModal,
  setDataToSubmit,
  dataToSubmit,
}: IProps) {
  const { t } = useLanguage();

  async function handleSubmit() {
    if (
      !dataToSubmit?.gigabytes ||
      !dataToSubmit?.price ||
      !dataToSubmit?.planId
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
          {t("organization-page.makePayment")}
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
            {t("organization-page.basicInfo")}
          </h3>

          {/* Plan */}
          <div className="space-y-2">
            <Label htmlFor="plan" className="text-sm">
              {t("organization-page.plan")}
            </Label>
            {dataToSubmit?.plans?.length > 0 && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex justify-between w-full"
                    >
                      <span
                        className={`${
                          dataToSubmit?.planName
                            ? "opacity-[1]"
                            : "opacity-[0.7]"
                        } font-normal text-sm`}
                      >
                        {dataToSubmit?.planName ||
                          t("organization-page.selectPlan")}
                      </span>
                      <ArrowDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel className="font-bold">
                      {t("table.actions")}
                    </DropdownMenuLabel>

                    {dataToSubmit?.plans.map((plan) => (
                      <DropdownMenuItem
                        key={plan.id}
                        onClick={() => {
                          setDataToSubmit({
                            ...dataToSubmit,
                            planId: plan?.id?.toString(),
                            planName: plan?.name?.toString(),
                            price: plan?.price?.toString(),
                            gigabytes: plan?.gigabytes?.toString(),
                          });
                        }}
                      >
                        {plan?.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm">
                {t("organization-page.price")}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  id="price"
                  className=" text-sm"
                  placeholder={t("organization-page.price")}
                  value={dataToSubmit.price}
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gb" className="text-sm">
                {t("organization-page.gigabytes")}
              </Label>
              <div className="relative">
                <Input
                  id="gb"
                  className="text-sm"
                  placeholder={t("organization-page.gigabytes")}
                  value={dataToSubmit.gigabytes}
                  required
                  type="number"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="submit" className="text-sm h-9">
          {t("organizations-page.continue")}
        </Button>
      </div>
    </form>
  );
}
