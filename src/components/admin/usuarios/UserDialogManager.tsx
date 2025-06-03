
import { CreateUserDialog } from "@/components/admin/usuarios/CreateUserDialog";
import { EditUserDialog } from "@/components/admin/usuarios/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/usuarios/DeleteUserDialog";
import { User, Profile, UserFormValues, AuthUserCreateValues } from "@/types/users";

interface UserDialogManagerProps {
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  canManageUsers: boolean;
  selectedUser: User | null;
  profiles: Profile[];
  isCreating: boolean;
  onCreateDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onCreateSubmit: (data: AuthUserCreateValues) => void;
  onEditSubmit: (data: UserFormValues) => void;
  onDeleteConfirm: () => void;
}

export const UserDialogManager = ({
  isCreateDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  canManageUsers,
  selectedUser,
  profiles,
  isCreating,
  onCreateDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: UserDialogManagerProps) => {
  return (
    <>
      <CreateUserDialog
        open={isCreateDialogOpen && canManageUsers}
        onOpenChange={onCreateDialogChange}
        profiles={profiles}
        onSubmit={onCreateSubmit}
        isSubmitting={isCreating}
      />

      <EditUserDialog
        open={isEditDialogOpen && canManageUsers}
        onOpenChange={onEditDialogChange}
        profiles={profiles}
        selectedUser={selectedUser}
        onSubmit={onEditSubmit}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen && canManageUsers}
        onOpenChange={onDeleteDialogChange}
        selectedUser={selectedUser}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
};
