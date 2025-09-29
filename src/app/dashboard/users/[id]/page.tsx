"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoles } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Shield,
  Building,
  Briefcase,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAuditLogs } from "./_components/UserAuditLogs";

// Define User type based on prisma schema
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  organization: {
    name: string;
  };
}

const roleTranslations: { [key: string]: string } = {
  ADMIN: "Administrador",
  SISTEM_MANAGER: "Gerente de Sistema",
  COURSE_COORDENATOR: "Coordenador de Curso",
  ACADEMIC_REGISTER: "Registro Acadêmico",
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex items-center space-x-3">
    <div className="text-muted-foreground">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  </div>
);

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          // Using the configured API instance with correct base URL
          const response = await api.get(`/api/users/${id}`);
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setError(response.data.message);
          }
        } catch (err) {
          setError("Falha ao carregar os dados do usuário.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error || "Usuário não encontrado."}
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0]}${user.last_name[0]}`;

  return (
    <motion.div
      className="mx-auto p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40 p-6 items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-background">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${user.email}.png`}
                  alt={fullName}
                />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {roleTranslations[user.role] || user.role}
              </p>
              <Badge
                variant={user.is_active ? "default" : "destructive"}
                className="mt-2"
              >
                {user.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <InfoRow
                icon={<Mail size={16} />}
                label="Email"
                value={user.email}
              />
              <Separator />
              <InfoRow
                icon={<Phone size={16} />}
                label="Telefone"
                value={user.phone_number || "Não informado"}
              />
              <Separator />
              <InfoRow
                icon={<Building size={16} />}
                label="Organização"
                value={user.organization.name}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Details Tabs */}
        <motion.div
          className="lg:col-span-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InfoRow
                    icon={<User size={16} />}
                    label="Nome Completo"
                    value={fullName}
                  />
                  <InfoRow
                    icon={<Shield size={16} />}
                    label="Cargo"
                    value={roleTranslations[user.role] || user.role}
                  />
                  <InfoRow
                    icon={<Calendar size={16} />}
                    label="Criado em"
                    value={formatDate(user.created_at)}
                  />
                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Último Login"
                    value={formatDate(user.last_login_at)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <UserAuditLogs userId={user.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

const UserProfileSkeleton = () => (
  <div className="mx-auto p-4 md:p-6 lg:p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="items-center text-center p-6">
            <Skeleton className="w-24 h-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16 mt-2" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Separator />
            <Skeleton className="h-10 w-full" />
            <Separator />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-10 w-48 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default UserProfilePage;
