import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import type { AuthRole } from "../../../shared/types/auth";
import { ProfileForm } from "./ProfileForm";
import type { Profile } from "../types/profile";

interface EditProfileDialogProps {
  open: boolean;
  profile: Profile | null;
  fallbackEmail: string | null;
  role: AuthRole | null;
  onClose: () => void;
}

export function EditProfileDialog({
  open,
  profile,
  fallbackEmail,
  role,
  onClose,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <ProfileForm
          profile={profile}
          fallbackEmail={fallbackEmail}
          role={role}
          onCancel={onClose}
          onSaved={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
