"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { TCC } from "@/types/index";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  year: z.string().min(1, "Ano é obrigatório"),
  keywords: z.string().optional(),
  type: z.enum(["BACHELOR", "MASTER", "DOCTORATE"], {
    required_error: "Tipo é obrigatório",
  }),
  authorId: z.string().min(1, "Autor é obrigatório"),
  supervisorId: z.string().min(1, "Supervisor é obrigatório"),
  courseId: z.string().min(1, "Curso é obrigatório"),
});

// Using imported TCC type instead of local interface

interface EditTCCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tcc: TCC;
  onTCCUpdated: () => void;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  course: {
    id: string;
    name: string;
  };
}

interface Supervisor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
}

export function EditTCCDialog({
  open,
  onOpenChange,
  tcc,
  onTCCUpdated,
}: EditTCCDialogProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDefenseFile, setSelectedDefenseFile] = useState<File | null>(
    null
  );
  const [uploadingDefenseFile, setUploadingDefenseFile] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: "",
      keywords: "",
      type: "BACHELOR",
      authorId: "",
      supervisorId: "",
      courseId: "",
    },
  });

  useEffect(() => {
    if (open && tcc) {
      form.reset({
        title: tcc.title,
        year: tcc.year.toString(),
        keywords: tcc.keywords || "",
        type: tcc.type,
        authorId: tcc?.author?.id,
        supervisorId: tcc?.supervisor?.id,
        courseId: tcc?.course?.id,
      });
      fetchData();
    }
  }, [open, tcc, form]);

  const fetchData = async () => {
    try {
      const [studentsRes, supervisorsRes, coursesRes] = await Promise.all([
        api.get("/api/students"),
        api.get("/api/users"),
        api.get("/api/courses"),
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.students);
      }

      if (supervisorsRes.data.success) {
        setSupervisors(supervisorsRes.data.users);
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados");
      console.error("Error fetching data:", error);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", "default");

      const response = await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.file.id;
      } else {
        toast.error("Erro ao fazer upload do arquivo");
        return null;
      }
    } catch (error) {
      toast.error("Erro ao fazer upload do arquivo");
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      let defenseRecordFileId = tcc.defenseRecordFile?.id || null;

      // Upload new defense record file if selected
      if (selectedDefenseFile) {
        setUploadingDefenseFile(true);
        defenseRecordFileId = await uploadFile(selectedDefenseFile);
        setUploadingDefenseFile(false);

        if (!defenseRecordFileId) {
          return;
        }
      }

      const response = await api.put(`/api/tccs/${tcc.id}`, {
        ...values,
        defenseRecordFileId,
      });

      if (response.data.success) {
        toast.success("TCC atualizado com sucesso!");
        setSelectedDefenseFile(null);
        onTCCUpdated();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Erro ao atualizar TCC");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar TCC");
      console.error("Error updating TCC:", error);
    } finally {
      setLoading(false);
      setUploadingDefenseFile(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Apenas arquivos PDF são permitidos");
        return;
      }
      setSelectedDefenseFile(file);
    }
  };

  const removeFile = () => {
    setSelectedDefenseFile(null);
  };

  const typeLabels = {
    BACHELOR: "Monografia (Licenciatura)",
    MASTER: "Dissertação (Mestrado)",
    DOCTORATE: "Tese (Doutoramento)",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Editar TCC</DialogTitle>
          <DialogDescription>
            Atualize as informações do trabalho de conclusão de curso.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do TCC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input type="number" min="2000" max="2030" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor (Estudante)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o autor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} -{" "}
                            {student.studentNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supervisorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o supervisor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supervisors.map((supervisor) => (
                          <SelectItem key={supervisor.id} value={supervisor.id}>
                            {supervisor.first_name} {supervisor.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavras-chave</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite as palavras-chave separadas por vírgula"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Files Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Arquivo Principal</label>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {tcc?.file?.displayName}
                    </span>
                    <span className="text-xs text-gray-500">
                      (Não é possível alterar o arquivo principal)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Ata de Defesa (PDF)
                </label>
                <div className="mt-2">
                  {tcc.defenseRecordFile && !selectedDefenseFile ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {tcc.defenseRecordFile.displayName}
                        </span>
                        <span className="text-xs text-gray-500">(Atual)</span>
                      </div>
                    </div>
                  ) : null}

                  {selectedDefenseFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {selectedDefenseFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(selectedDefenseFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB) - Novo
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-gray-400" />
                        <div className="mt-2">
                          <label
                            htmlFor="defense-file"
                            className="cursor-pointer"
                          >
                            <span className="text-sm font-medium text-green-600 hover:text-green-500">
                              {tcc.defenseRecordFile
                                ? "Substituir ata de defesa"
                                : "Adicionar ata de defesa"}
                            </span>
                          </label>
                          <input
                            id="defense-file"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || uploadingDefenseFile}>
                {loading
                  ? "Salvando..."
                  : uploadingDefenseFile
                    ? "Enviando ata..."
                    : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
