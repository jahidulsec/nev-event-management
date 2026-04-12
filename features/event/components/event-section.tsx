import { AuthUserRole } from "@/types/auth-user";
import React from "react";
import { EventSingleProps } from "../lib/event";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoData } from "@/components/shared/state/state";
import { formatNumber, getTitleCase } from "@/utils/formatter";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventSection({
  prevData,
  role,
}: {
  prevData: EventSingleProps;
  role: AuthUserRole;
}) {
  const totalBudget = prevData.event_budget?.reduce(
    (acc, sum) => acc + Number(sum.unit_cost) * sum.unit,
    0,
  );

  const totalHonorarium = prevData.event_consultant?.reduce(
    (acc, sum) => acc + Number(sum.honorarium || 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto py-10 w-full flex flex-col gap-6">
      <div className="flex justify-between items-center gap-5">
        <h3 className="text-2xl font-bold text-primary mb-6 w-full">
          Event Details
        </h3>
        {(role === "ec" || role === "superadmin") && (
          <Button asChild>
            <a
              href={`/print/event/${prevData.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Printer /> Print
            </a>
          </Button>
        )}
      </div>

      {/* Requester information */}
      <FieldContainer>
        <CustomField
          title="AO Full Name"
          value={prevData?.user.ao?.full_name}
        />
        <FieldGroup className="md:grid-cols-3 md:grid">
          <CustomField title="Work Area" value={prevData?.user_id} />{" "}
          <CustomField
            title="Employee ID"
            value={prevData?.user.ao?.employee_id ?? ""}
          />{" "}
          <CustomField
            title="Designation"
            value={prevData?.user.ao?.designation}
          />
        </FieldGroup>
      </FieldContainer>
      <Separator />

      {/* event basic information */}
      <FieldContainer>
        <CustomField title="Event Title & Topic" value={prevData?.title} />
        <FieldGroup className="flex-row">
          <CustomField
            title="Proposed Event Date"
            value={format(prevData?.event_date, "LLL dd, yyyy - h:mm aaa")}
          />
          <CustomField title="Product Name" value={prevData?.product.name} />
        </FieldGroup>
      </FieldContainer>
      <Separator />

      {/* venue information */}
      <FieldContainer>
        <CustomField title="Venue Name, Address" value={prevData?.venue} />
        <FieldGroup className="flex-row">
          <CustomField
            title="Venue Appropriateness"
            value={getTitleCase(prevData?.venue_appropriateness)}
          />
          <CustomField title="Food Supplier" value={prevData?.food_supplier} />
        </FieldGroup>
      </FieldContainer>
      <Separator />

      {/* institute information */}
      <FieldContainer>
        <CustomField
          title="Institute Name, Customer Code of the Institute, Address"
          value={prevData?.institute}
        />
        <FieldGroup className="flex-row">
          <CustomField title="Unit" value={prevData?.institute_unit ?? "-"} />
          <CustomField
            title="Department/Specialty"
            value={prevData?.institute_dept}
          />
        </FieldGroup>
      </FieldContainer>
      <Separator />

      {/* event additional information */}
      <FieldContainer>
        <FieldGroup className="flex-row">
          <CustomField
            title="Objective of the meeting"
            value={prevData.objective}
          />
          <CustomField title="Event Type" value={prevData.type} />
        </FieldGroup>
        <FieldGroup className="flex-row">
          <CustomField
            title="Approved Material"
            value={getTitleCase(prevData.approved_material)}
          />
          <CustomField
            title="Material Code"
            value={prevData?.material_code ?? "-"}
          />
        </FieldGroup>
      </FieldContainer>
      <Separator />

      {/* participation details */}
      <Card>
        <h4 className="font-semibold">Participants</h4>
        <Table className="border">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead>Participants Type</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Internal Participants</TableCell>
              <TableCell>{prevData.internal_participants}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>External Participants</TableCell>
              <TableCell>{prevData.external_participants}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Other Participants</TableCell>
              <TableCell>{prevData.other_participants}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                {prevData.internal_participants +
                  prevData.external_participants +
                  (prevData.other_participants || 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <CustomField
          title="Details of Participants"
          value={prevData.details_participants ?? "-"}
        />
      </Card>

      {/* Event Budget section */}
      <Card>
        <h4 className="font-semibold">Budgets</h4>
        <Table className="border">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prevData.event_budget.length > 0 ? (
              prevData.event_budget.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{formatNumber(Number(item.unit_cost))}</TableCell>
                  <TableCell>
                    {formatNumber(item.unit * Number(item.unit_cost))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100}>
                  <NoData />
                </TableCell>
              </TableRow>
            )}
            {prevData.event_consultant.length > 0 && (
              <TableRow>
                <TableCell>Honorarium</TableCell>
                <TableCell>{prevData.event_consultant.length}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{formatNumber(totalHonorarium)}</TableCell>
              </TableRow>
            )}
          </TableBody>
          {prevData.event_budget.length !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>
                  {formatNumber(totalBudget + totalHonorarium)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Card>

      {/* Event Consultant section */}
      <Card>
        <h4 className="font-semibold">Consultants</h4>
        <Table className="border">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead>Doctor, (Degrees) - Speciality </TableHead>
              <TableHead>Chamber ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Duration (hours)</TableHead>
              <TableHead>Honorarium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prevData.event_consultant.length > 0 ? (
              prevData.event_consultant.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.doctor.full_name},{" "}
                    <span className="text-xs">
                      ({item.doctor.degrees}){" - "}
                      {item.doctor.speciality}
                    </span>
                  </TableCell>
                  <TableCell>{item.doctor.dr_child_id}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{formatNumber(Number(item.duration_h))}</TableCell>
                  <TableCell>{formatNumber(Number(item.honorarium))}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100}>
                  <NoData />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {prevData.event_budget.length !== 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell colSpan={3}>
                  {formatNumber(totalHonorarium)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Card>

      {/* attachement section */}
      <Card className="gap-3">
        <h4 className="font-semibold">Attachments</h4>
        {prevData.event_attachment.length > 0 ? (
          prevData.event_attachment.map((item) => (
            <Field key={item.id}>
              {item.file_path && (
                <a
                  target="_blank"
                  href={`/api/files/?file_path=${item.file_path}`}
                  className="border rounded-md w-full p-2 flex items-center gap-3 [&_svg]:size-4"
                >
                  <FileText className="text-primary" /> {item.document_title}
                </a>
              )}
            </Field>
          ))
        ) : (
          <NoData />
        )}
      </Card>
    </div>
  );
}

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

const FieldContainer = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <div {...props} className={cn("flex flex-col gap-6", className)} />;
};

const Card = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-6 border rounded-md border-primary/50 p-6",
        className,
      )}
    />
  );
};
