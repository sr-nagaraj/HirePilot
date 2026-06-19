import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  defaultJobValues,
  formValuesToJobPayload,
  jobSchema,
  jobToFormValues,
  type JobSchemaValues,
} from "../schemas/jobSchema";
import type { RecruiterJob, RecruiterJobPayload } from "../types/recruiterDashboard";

interface RecruiterJobFormProps {
  job?: RecruiterJob | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (payload: RecruiterJobPayload) => void;
}

export function RecruiterJobForm({ job, submitLabel, isSubmitting = false, onSubmit }: RecruiterJobFormProps) {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<JobSchemaValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: job ? jobToFormValues(job) : defaultJobValues,
  });

  useEffect(() => {
    reset(job ? jobToFormValues(job) : defaultJobValues);
  }, [job, reset]);

  function handleValidSubmit(values: JobSchemaValues) {
    onSubmit(formValuesToJobPayload(values));
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack component="form" spacing={2.25} onSubmit={handleSubmit(handleValidSubmit)}>
          <TextField
            label="Title"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          <TextField
            label="Company"
            {...register("company")}
            error={Boolean(errors.company)}
            helperText={errors.company?.message}
          />
          <TextField
            label="Description"
            multiline
            minRows={5}
            {...register("description")}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Location"
              fullWidth
              {...register("location")}
              error={Boolean(errors.location)}
              helperText={errors.location?.message}
            />
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Salary"
                  type="number"
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value === "" ? null : Number(event.target.value))}
                  error={Boolean(errors.salary)}
                  helperText={errors.salary?.message}
                />
              )}
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Experience"
                  type="number"
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value === "" ? null : Number(event.target.value));
                  }}
                  error={Boolean(errors.experience)}
                  helperText={errors.experience?.message}
                />
              )}
            />
            <TextField
              label="Employment Type"
              fullWidth
              {...register("employmentType")}
              error={Boolean(errors.employmentType)}
              helperText={errors.employmentType?.message}
            />
          </Stack>
          <TextField
            label="Skills"
            multiline
            minRows={2}
            placeholder="React, TypeScript, Spring Boot"
            {...register("skills")}
            error={Boolean(errors.skills)}
            helperText={errors.skills?.message || "Skills are appended to the job description for the current backend."}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
