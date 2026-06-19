import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Card, CardContent, Container, Skeleton, Stack } from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../../../app/store/authStore";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { PageHeader } from "../../../shared/components/PageHeader";
import { calculateProfileCompletion } from "../api/profileApi";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileCard } from "../components/ProfileCard";
import { useProfileQuery } from "../hooks/profileHooks";

export function ProfilePage() {
  const fallbackEmail = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile = null, isLoading, isError } = useProfileQuery();
  const completion = calculateProfileCompletion(profile, fallbackEmail, role);
  const isRecruiter = role === "RECRUITER";

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <PageHeader
          title={isRecruiter ? "Recruiter Profile" : "Candidate Profile"}
          subtitle={
            isRecruiter
              ? "Keep your recruiter identity, company context, and professional links up to date."
              : "Keep your candidate profile complete, current, and ready for recruiter review."
          }
          actions={
            profile ? (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : undefined
          }
        />

        {isLoading ? <Skeleton variant="rounded" height={520} /> : null}
        {isError ? <ErrorState message="Profile could not be loaded." /> : null}
        {!isLoading && !isError && isRecruiter && !profile ? (
          <Card variant="outlined">
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <ProfileForm
                profile={profile}
                fallbackEmail={fallbackEmail}
                role={role}
                submitLabel="Create Profile"
              />
            </CardContent>
          </Card>
        ) : null}
        {!isLoading && !isError && !isRecruiter && !profile ? (
          <EmptyState
            icon={<PersonAddIcon />}
            title="Create your candidate profile"
            description="Add your headline, skills, experience, links, and about me section before applying."
            action={
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Create Profile
              </Button>
            }
          />
        ) : null}
        {!isLoading && !isError && !isRecruiter && profile ? (
          <ProfileCard
            profile={profile}
            completion={completion}
            fallbackEmail={fallbackEmail}
            role={role}
            onEdit={() => setIsEditing(true)}
          />
        ) : null}
        {!isLoading && !isError && isRecruiter && profile ? (
          <ProfileCard
            profile={profile}
            completion={completion}
            fallbackEmail={fallbackEmail}
            role={role}
            onEdit={() => setIsEditing(true)}
          />
        ) : null}
      </Stack>
      <EditProfileDialog
        open={isEditing}
        profile={profile}
        fallbackEmail={fallbackEmail}
        role={role}
        onClose={() => setIsEditing(false)}
      />
    </Container>
  );
}
