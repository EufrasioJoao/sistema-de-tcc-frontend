"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Edit, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUserData } from "@/contexts/app-context";
import { UserRoles } from "@/types/index";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    role: string;
    is_active: boolean;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSuccess: (updatedUser: User) => void;
}

const roleTranslations: { [key: string]: string } = {
    ADMIN: "Administrador",
    SISTEM_MANAGER: "Gerente de Sistema",
    COURSE_COORDENATOR: "Coordenador de Curso",
    ACADEMIC_REGISTER: "Registro Acadêmico",
};

export function EditUserDialog({ open, onOpenChange, user, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useUserData();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        role: "",
        is_active: true,
    });

    // Initialize form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number || "",
                role: user.role,
                is_active: user.is_active,
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // Only send changed fields
            const updateData: any = {};

            if (formData.first_name !== user.first_name) updateData.first_name = formData.first_name;
            if (formData.last_name !== user.last_name) updateData.last_name = formData.last_name;

            if (formData.phone_number !== (user.phone_number || "")) updateData.phone_number = formData.phone_number;
            if (formData.role !== user.role) updateData.role = formData.role;
            if (formData.is_active !== user.is_active) updateData.is_active = formData.is_active;

            // If no changes, just close dialog
            if (Object.keys(updateData).length === 0) {
                toast.info("Nenhuma alteração foi feita");
                handleClose();
                return;
            }

            const response = await api.put(`/api/users/${user.id}`, updateData);

            if (response.data.success) {
                toast.success("Usuário atualizado com sucesso!");
                onSuccess(response.data.user);
                handleClose();
            } else {
                toast.error(response.data.message || "Erro ao atualizar usuário");
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast.error(
                error.response?.data?.message || "Erro ao atualizar usuário"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number || "",
                role: user.role,
                is_active: user.is_active,
            });
        }
        onOpenChange(false);
    };

    if (!user || !currentUser) return null;

    const canEditRole = currentUser.role === UserRoles.ADMIN && currentUser.id !== user.id;
    const canEditStatus = currentUser.role === UserRoles.ADMIN;
    const isEditingSelf = currentUser.id === user.id;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-left">Editar Usuário</DialogTitle>
                            <DialogDescription className="text-left">
                                Atualize as informações do usuário.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Nome */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Nome</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Sobrenome</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>


                        {/* Telefone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Telefone</Label>
                            <Input
                                id="phone_number"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>

                        {/* Role - Only admins can edit, and not their own */}
                        {canEditRole && (
                            <div className="space-y-2">
                                <Label htmlFor="role">Função</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(roleTranslations).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Status - Only admins can edit */}
                        {canEditStatus && !isEditingSelf && (
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="is_active">Status do Usuário</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Usuário {formData.is_active ? "ativo" : "inativo"}
                                    </div>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>
                        )}

                        {/* Info about restrictions */}
                        {isEditingSelf && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    ℹ️ Você não pode alterar sua própria função ou status.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}