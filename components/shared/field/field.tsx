import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";

const CustomField = ({ title, value }: { title: string; value?: string }) => {
  return (
    <Field>
      <FieldLabel className="text-muted-foreground font-medium">
        {title}
      </FieldLabel>
      <FieldTitle>{value}</FieldTitle>
    </Field>
  );
};

export { CustomField };
