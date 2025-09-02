import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-content";

interface SettingsContentProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export function SettingsContent({
  currentFont,
  onFontChange,
  fontSize,
  onFontSizeChange,
}: SettingsContentProps) {
  const { t } = useLanguage();

  const fonts = [
    {
      name: "Geist",
      value: "font-geist",
      preview: "The quick brown fox jumps over the lazy dog",
    },
    {
      name: "Roboto Condensed",
      value: "font-roboto-condensed",
      preview: "The quick brown fox jumps over the lazy dog",
    },
    {
      name: "Poppins",
      value: "font-poppins",
      preview: "The quick brown fox jumps over the lazy dog",
    },
    {
      name: "Space Grotesk",
      value: "font-space",
      preview: "The quick brown fox jumps over the lazy dog",
    },
  ];

  const handleSave = () => {
    try {
      // Salvar no localStorage para persistir as preferências
      localStorage.setItem("userFont", currentFont);
      localStorage.setItem("userFontSize", fontSize.toString());
      toast.success("Preferências salvas com sucesso");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast.error("Erro ao salvar preferências");
    }
  };

  return (
    <div className="py-6  w-full max-w-[900px] m-auto">
      <div className="mb-8">
        <h1 className="text-[1.1rem] md:text-xl font-bold mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 m-auto">
        {/* Card de Tipografia */}
        <Card className="md:col-span-2 ">
          <CardHeader>
            <CardTitle>{t("settings.typography")}</CardTitle>
            <CardDescription>
              {t("settings.typography.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.font")}</Label>
                <Select value={currentFont} onValueChange={onFontChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("settings.selectFont")} />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.value}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t("settings.selectedFontExample")}
                </p>
                <div
                  className={`p-4 rounded-lg border bg-accent/5 ${currentFont}`}
                >
                  <p className="text-[1rem] font-medium md:text-lg mb-2">
                    {t("settings.fontPreview")}
                  </p>
                  <p className="text-[0.8rem] md:text-sm">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-[0.8rem] md:text-sm">
                    abcdefghijklmnopqrstuvwxyz
                  </p>
                  <p className="text-[0.8rem] md:text-sm">0123456789</p>
                  <p className="text-[0.8rem] md:text-sm mt-2">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t("settings.fontSize")}</Label>
                  <span className="text-sm text-muted-foreground">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  min={12}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div
                  className="p-3 rounded-lg border"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {t("settings.selectedFontSizeExample")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex justify-end">
          <Button onClick={handleSave} className="w-32">
            <Save className="mr-2 h-4 w-4" />
            {t("settings.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
