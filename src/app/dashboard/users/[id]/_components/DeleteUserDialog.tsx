"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/contexts/app-context";
import { UserRoles } from "@/types/index";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function DeleteUserDialog({ open, onOpenChange, user }: Props) {
    const [loading, setLoading] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const router = useRouter();
    const { user: currentUser } = useUserData();

    const handleDelete = async () => {
        if (!user || !canProceed) return;

        setLoading(true);
        try {
            const response = await api.delete(`/api/users/${user.id}`);

            if (response.data.success) {
                toast.success("Usuário excluído com sucesso!");
                handleClose();
                // Redirect to users list after successful deletion
                router.push("/dashboard/users");
            } else {
                toast.error(response.data.message || "Erro ao excluir usuário");
            }
        } catch (error: any) {
            console.error("Error deleting user:", error);
            toast.error(
                error.response?.data?.message || "Erro ao excluir usuário"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setConfirmationText("");
        onOpenChange(false);
    };

    if (!user || !currentUser) return null;

    const fullName = `${user.first_name} ${user.last_name}`;
    const isAdmin = user.role === "ADMIN";
    const isSystemManager = user.role === "SISTEM_MANAGER";
    const currentUserIsAdmin = currentUser.role === UserRoles.ADMIN;

    // Confirmation rules:
    // - Always require confirmation for ADMINs
    // - Require confirmation for SISTEM_MANAGERs when deleting other SISTEM_MANAGERs
    const confirmationRequired = isAdmin || (isSystemManager && currentUser.role === UserRoles.SISTEM_MANAGER);

    let expectedConfirmation = "";
    if (isAdmin) {
        expectedConfirmation = "EXCLUIR ADMIN";
    } else if (isSystemManager && currentUser.role === UserRoles.SISTEM_MANAGER) {
        expectedConfirmation = "EXCLUIR GERENTE";
    }

    const canProceed = !confirmationRequired || confirmationText === expectedConfirmation;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-left">Excluir Usuário</DialogTitle>
                            <DialogDescription className="text-left">
                                Esta ação não pode ser desfeita.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4"
                >
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Você está prestes a excluir o usuário:
                                </p>
                                <div className="space-y-1">
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Nome:</strong> {fullName}
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Cargo:</strong> {user.role}
                                    </p>
                                </div>
                                {isAdmin && (
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mt-2">
                                        ⚠️ Este usuário é um administrador!
                                    </p>
                                )}
                                {isSystemManager && currentUser.role === UserRoles.SISTEM_MANAGER && (
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mt-2">
                                        ⚠️ Este usuário é um gerente de sistema!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {confirmationRequired && (
                        <div className="space-y-3 mt-4">
                            <Label htmlFor="confirmation" className="text-sm font-medium">
                                Para confirmar, digite <code className="bg-muted px-1 py-0.5 rounded text-xs">{expectedConfirmation}</code>
                            </Label>
                            <Input
                                id="confirmation"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder={expectedConfirmation}
                                className="font-mono"
                            />
                        </div>
                    )}
                </motion.div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading || !canProceed}
                        className="gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Excluir Usuário
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}