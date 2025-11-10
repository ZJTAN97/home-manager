import { usePGlite } from "@electric-sql/pglite-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { createExpiryItemSchema } from "../-data/dto";

export const CreateExpiryPage = () => {
  const db = usePGlite();
  const navigate = useNavigate();

  const formMethods = useForm({
    mode: "onChange",
    resolver: zodResolver(createExpiryItemSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const insertItem = formMethods.handleSubmit(async (payload) => {
    try {
      await db.query(`
        INSERT INTO expiry (id, name, description, expiry_date) 
        VALUES ('${uuidv4()}', '${payload.name}', '${payload.description}', '${dayjs(payload.expiryDate).toISOString()}');
      `);

      navigate({ to: ".." });
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  });

  return (
    <Stack component="form" p="sm" maw={600} onSubmit={insertItem}>
      <Controller
        control={formMethods.control}
        name="name"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            error={fieldState.error?.message}
            label="Name"
            placeholder="Name"
          />
        )}
      />

      <Controller
        control={formMethods.control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error?.message}
            rows={3}
            label="Description"
            placeholder="Description"
          />
        )}
      />

      <Controller
        control={formMethods.control}
        name="expiryDate"
        render={({ field, fieldState }) => (
          <DatePickerInput
            {...field}
            error={fieldState.error?.message}
            label="Expiry date"
            placeholder="Expiry date"
            excludeDate={(date) => new Date(date) < new Date()}
          />
        )}
      />

      <Flex gap="sm" justify="flex-end">
        <Button
          variant="default"
          renderRoot={(props) => <Link to=".." {...props} />}
        >
          Back
        </Button>
        <Button type="submit">Create</Button>
      </Flex>
    </Stack>
  );
};
