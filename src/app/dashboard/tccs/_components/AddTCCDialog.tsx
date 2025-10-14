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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Upload, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  year: z.string().min(1, "Ano é obrigatório"),
  keywords: z.string().optional(),
  type: z.enum(["BACHELOR", "MASTER", "DOCTORATE"], {
    required_error: "Tipo é obrigatório",
  }),
  authorId: z.string().min(1, "Autor é obrigatório"),
  supervisor: z.string().optional(),
  courseId: z.string().min(1, "Curso é obrigatório"),
});

interface AddTCCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTCCAdded: () => void;
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


interface Course {
  id: string;
  name: string;
}

export function AddTCCDialog({
  open,
  onOpenChange,
  onTCCAdded,
}: AddTCCDialogProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDefenseFile, setSelectedDefenseFile] = useState<File | null>(
    null
  );
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingDefenseFile, setUploadingDefenseFile] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear().toString(),
      keywords: "",
      type: "BACHELOR",
      authorId: "",
      supervisor: "",
      courseId: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        api.get("/api/students"),
        api.get("/api/courses"),
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.students);
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados");
      console.error("Error fetching data:", error);
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile) {
      toast.error("Por favor, selecione o arquivo do TCC");
      return;
    }

    try {
      setLoading(true);

      // Create FormData with all TCC data and files
      const formData = new FormData();

      // Add form fields
      formData.append("title", values.title);
      formData.append("year", values.year);
      formData.append("keywords", values.keywords || "");
      formData.append("type", values.type);
      formData.append("authorId", values.authorId);
      formData.append("supervisor", values.supervisor || "");
      formData.append("courseId", values.courseId);

      // Add files
      formData.append("tccFile", selectedFile);
      if (selectedDefenseFile) {
        formData.append("defenseFile", selectedDefenseFile);
      }

      const response = await api.post("/api/tccs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("TCC adicionado com sucesso!");
        form.reset();
        setSelectedFile(null);
        setSelectedDefenseFile(null);
        onTCCAdded();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Erro ao adicionar TCC");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao adicionar TCC");
      console.error("Error creating TCC:", error);
    } finally {
      setLoading(false);
      setUploadingFile(false);
      setUploadingDefenseFile(false);
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    isDefenseFile = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file, isDefenseFile);
    }
  };

  const validateAndSetFile = (file: File, isDefenseFile = false) => {
    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      toast.error("Arquivo muito grande. Tamanho máximo: 50MB");
      return;
    }

    if (isDefenseFile) {
      setSelectedDefenseFile(file);
    } else {
      setSelectedFile(file);
    }
  };

  const removeFile = (isDefenseFile = false) => {
    if (isDefenseFile) {
      setSelectedDefenseFile(null);
    } else {
      setSelectedFile(null);
    }
  };

  // Dropzone for TCC file
  const {
    getRootProps: getTCCRootProps,
    getInputProps: getTCCInputProps,
    isDragActive: isTCCDragActive,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        validateAndSetFile(acceptedFiles[0], false);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  // Dropzone for defense file
  const {
    getRootProps: getDefenseRootProps,
    getInputProps: getDefenseInputProps,
    isDragActive: isDefenseDragActive,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        validateAndSetFile(acceptedFiles[0], true);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const typeLabels = {
    BACHELOR: "Monografia (Licenciatura)",
    MASTER: "Dissertação (Mestrado)",
    DOCTORATE: "Tese (Doutoramento)",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Adicionar Novo TCC</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Preencha as informações do trabalho de conclusão de curso.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-sm font-medium">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título do TCC"
                        className="text-sm"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="text-sm">
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
                    <FormLabel className="text-sm font-medium">Ano</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="2000"
                        max="2030"
                        className="text-sm"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">Curso</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id} className="text-sm">
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
                  <FormItem className="sm:col-span-1">
                    <FormLabel className="text-sm font-medium">Autor (Estudante)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione o autor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id} className="text-sm">
                            <span className="block sm:hidden">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="hidden sm:block">
                              {student.firstName} {student.lastName} - {student.studentNumber}
                            </span>
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
                name="supervisor"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel className="text-sm font-medium">Supervisor</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do supervisor"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
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
                  <FormLabel className="text-sm font-medium">Palavras-chave (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite as palavras-chave separadas por vírgula (opcional)"
                      className="resize-none text-sm min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Section */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Arquivo do TCC (PDF) *
                </label>
                <div className="mt-2">
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium block truncate">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(false)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...getTCCRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 sm:p-6 cursor-pointer transition-colors ${isTCCDragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                        }`}
                    >
                      <input {...getTCCInputProps()} />
                      <div className="text-center">
                        <Upload
                          className={`mx-auto h-6 w-6 sm:h-8 sm:w-8 ${isTCCDragActive ? "text-blue-500" : "text-gray-400"
                            }`}
                        />
                        <div className="mt-2">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-500 block sm:inline">
                            {isTCCDragActive
                              ? "Solte o arquivo aqui"
                              : "Clique para selecionar"}
                          </span>
                          <span className="text-sm text-gray-500 block sm:inline">
                            {" "}
                            ou arraste o arquivo aqui
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Apenas arquivos PDF (máx. 50MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Ata de Defesa (PDF) - Opcional
                </label>
                <div className="mt-2">
                  {selectedDefenseFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium block truncate">
                            {selectedDefenseFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(selectedDefenseFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(true)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...getDefenseRootProps()}
                      className={`border-2 border-dashed rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${isDefenseDragActive
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                        }`}
                    >
                      <input {...getDefenseInputProps()} />
                      <div className="text-center">
                        <Upload
                          className={`mx-auto h-5 w-5 sm:h-6 sm:w-6 ${isDefenseDragActive
                            ? "text-green-500"
                            : "text-gray-400"
                            }`}
                        />
                        <div className="mt-2">
                          <span className="text-sm font-medium text-green-600 hover:text-green-500 block sm:inline">
                            {isDefenseDragActive
                              ? "Solte a ata aqui"
                              : "Clique para selecionar ata de defesa"}
                          </span>
                          <span className="text-sm text-gray-500 block sm:inline">
                            {" "}
                            ou arraste o arquivo aqui
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Apenas arquivos PDF (máx. 50MB)
                        </p>
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
              <Button
                type="submit"
                disabled={loading || uploadingFile || uploadingDefenseFile}
              >
                {loading
                  ? "Salvando..."
                  : uploadingFile
                    ? "Enviando arquivo..."
                    : uploadingDefenseFile
                      ? "Enviando ata..."
                      : "Salvar TCC"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
