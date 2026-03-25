"use client";

import React from "react";
import { EventSingleProps } from "../lib/event";
import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { formatDate, formatDateTime, formatNumber } from "@/utils/formatter";
import { EventApproverMultProps } from "../lib/event-approver";
import { convertPdfToImage } from "@/lib/pdf";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Poppins-Regular.ttf" }, // Regular
    { src: "/fonts/Poppins-Bold.ttf", fontWeight: "bold" }, // Bold
    { src: "/fonts/Poppins-Italic.ttf", fontStyle: "italic" }, // Italic
  ],
});

export default function PrintSection({
  eventData,
  eventApprover,
}: {
  eventData: EventSingleProps;
  eventApprover: EventApproverMultProps[];
}) {
  const attachments = eventData.event_attachment;

  return (
    <PDFViewer className="w-full min-h-svh">
      <Document>
        <Page size={"A4"} orientation="landscape" style={styles.page}>
          <HeaderSection />

          {/* page title */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Event Proposal Form</Text>
          </View>

          <EventBasicInformationSection
            eventApprover={eventApprover}
            data={eventData}
          />
        </Page>

        {attachments.length > 0 &&
          attachments.map(async (item) => {
            let convertedImage: string = "";

            if (item.file_path.split(".").pop() !== "pdf") {
              convertedImage = item.file_path;
            } else {
              try {
                convertedImage = await convertPdfToImage(
                  `/api/files/?file_path=${item.file_path}`,
                  1,
                );
              } catch (error) {
                console.error(error);
              }
            }

            if (!convertedImage) return;

            return (
              <Page size={"A4"} key={item.id}>
                <Image src={convertedImage} />
              </Page>
            );
          })}
      </Document>
    </PDFViewer>
  );
}

const HeaderSection = () => {
  return (
    <View fixed style={{ marginBottom: 10 }}>
      <Image src={"/logo/nevian.png"} style={styles.logo} />
    </View>
  );
};

const EventBasicInformationSection = ({
  data,
  eventApprover,
}: {
  data: EventSingleProps;
  eventApprover: EventApproverMultProps[];
}) => {
  const totalHonorarium = data.event_consultant.reduce(
    (acc, sum) => acc + Number(sum.honorarium),
    0,
  );

  const totalBudget =
    data.event_budget.reduce(
      (acc, sum) => acc + sum.unit * Number(sum.unit_cost),
      0,
    ) + totalHonorarium;

  return (
    <View>
      <View style={{ borderRight: 1, borderBottom: 1 }}>
        {/* basic information */}
        <View>
          <FieldGroup>
            <CustomField name="Tracking No." value={data.track_no} />
            <CustomField
              name="Request Date"
              value={data.created_at ? formatDate(data.created_at) : undefined}
            />
            <CustomField
              name="Proposed Date"
              value={formatDateTime(data.event_date)}
            />
          </FieldGroup>
        </View>

        {/* requestor information */}
        <View>
          <FieldGroup>
            <CustomField
              name="Activity Owner (AO)"
              value={data.user.ao?.full_name}
            />
            <CustomField name="Territory ID" value={data.user_id} />
          </FieldGroup>
          <FieldGroup>
            <CustomField name="Designation" value={data.user.ao?.designation} />
            <CustomField name="Reigon" value={data.user.ao?.rm_code} />
            <CustomField name="Employee ID" value={data.user.ao?.employee_id} />
          </FieldGroup>
        </View>

        {/* event information */}
        <View>
          <FieldGroup>
            <CustomField name="Event Title & Topic" value={data.title} />
            <CustomField
              name="Product Name"
              value={data.product_id.replace(/-/g, " ")}
            />
          </FieldGroup>
        </View>

        {/* venue information */}
        <View>
          <FieldGroup>
            <CustomField name="Venue Name with Address" value={data.venue} />
            <CustomField name="Food Supplier" value={data.food_supplier} />
            <CustomField
              name="Venue Appropiateness"
              value={data.venue_appropriateness}
            />
          </FieldGroup>
        </View>

        {/* Institute Information */}
        <View>
          <FieldGroup>
            <CustomField
              name="Institute Name with Code/Area"
              value={data.institute}
            />
            <CustomField name="Unit" value={data.institute_unit} />
            <CustomField
              name="Department/Speciality"
              value={data.institute_dept}
            />
          </FieldGroup>
        </View>

        {/* event category */}
        <View>
          <FieldGroup>
            <CustomField
              style={{ flex: 1 }}
              name="Objective"
              value={data.objective}
            />
            <CustomField
              style={{ flex: 1 }}
              name="Event Type"
              value={data.type}
            />
          </FieldGroup>
          <FieldGroup>
            <CustomField
              style={{ flex: 1 }}
              name="Approved Material"
              value={data.approved_material}
            />
            <CustomField
              style={{ flex: 1 }}
              name="Material Code"
              value={data.material_code}
            />
          </FieldGroup>
        </View>

        {/* participants */}
        <View>
          <FieldGroup>
            <Text
              style={{
                fontSize: 10,
                paddingVertical: 2,
                textAlign: "center",
                flex: 1,
                borderLeft: 1,
                fontWeight: "bold",
                backgroundColor: color.muted,
              }}
            >
              Participants
            </Text>
          </FieldGroup>
          <FieldGroup>
            <CustomField
              name="Internal"
              value={formatNumber(data.internal_participants)}
            />
            <CustomField
              name="External"
              value={formatNumber(data.external_participants)}
            />
            <CustomField
              name="Others"
              value={
                data.other_participants
                  ? formatNumber(data.other_participants)
                  : "0"
              }
            />
            <CustomField
              name="Total"
              value={formatNumber(
                data.internal_participants +
                  data.external_participants +
                  (data.other_participants || 0),
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <CustomField
              name="Details of Participants"
              value={data.details_participants}
            />
          </FieldGroup>
        </View>
      </View>

      {/* budget */}
      <View style={{ marginTop: 10 }}>
        <Table>
          <TableRow style={{ backgroundColor: color.muted }}>
            <TableHead>Event Budget</TableHead>
          </TableRow>
          <View fixed style={{ backgroundColor: color.muted }}>
            <TableRow>
              <TableHead style={{ flex: 1 }}>Item</TableHead>
              <TableHead style={{ flex: 1 }}>Unit</TableHead>
              <TableHead style={{ flex: 1 }}>Unit Cost</TableHead>
              <TableHead style={{ flex: 1 }}>Total</TableHead>
            </TableRow>
          </View>

          <View>
            {data.event_budget.length > 0 ? (
              <>
                {data.event_budget.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell style={{ flex: 1 }}>{item.item}</TableCell>
                    <TableCell style={{ textAlign: "center", flex: 1 }}>
                      {item.unit}
                    </TableCell>
                    <TableCell style={{ textAlign: "right", flex: 1 }}>
                      {formatNumber(Number(item.unit_cost))}
                    </TableCell>
                    <TableCell style={{ textAlign: "right", flex: 1 }}>
                      {formatNumber(Number(item.unit_cost) * item.unit)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell style={{ flex: 1 }}>Honorarium</TableCell>
                  <TableCell style={{ textAlign: "center", flex: 1 }}>
                    {data.event_consultant.length}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", flex: 1 }}>
                    -
                  </TableCell>
                  <TableCell style={{ textAlign: "right", flex: 1 }}>
                    {formatNumber(totalHonorarium)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 11,
                  borderBottom: 1,
                  borderRight: 1,
                }}
              >
                No data.
              </Text>
            )}
          </View>

          {/* footer */}
          <View>
            <TableRow>
              <TableCell style={{ flex: 1, fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell
                style={{
                  minWidth: 200,
                  textAlign: "right",
                  fontWeight: "bold",
                  flexBasis: 1,
                }}
              >
                {formatNumber(totalBudget)}
              </TableCell>
            </TableRow>
          </View>
        </Table>
      </View>

      {/* consultant */}
      <View break style={{ marginTop: 10 }}>
        <Table>
          <TableRow style={{ backgroundColor: color.muted }}>
            <TableHead>External Consultant Engagement</TableHead>
          </TableRow>
          <View fixed style={{ backgroundColor: color.muted }}>
            <TableRow>
              <TableHead style={{ maxWidth: 50 }}>SL. no.</TableHead>
              <TableHead style={{ flex: 1 }}>
                Name, Degree, Speciality
              </TableHead>
              <TableHead style={{ maxWidth: 100 }}>Chamber ID</TableHead>
              <TableHead style={{ maxWidth: 100 }}>Role</TableHead>
              <TableHead style={{ maxWidth: 100 }}>Duration (Hr.)</TableHead>
              <TableHead style={{ maxWidth: 150 }}>Honorarium</TableHead>
              <TableHead style={{ maxWidth: 150 }}>Approval</TableHead>
            </TableRow>
          </View>
          <View>
            {data.event_consultant ? (
              data.event_consultant.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell style={{ maxWidth: 50, width: "100%" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ flex: 1, width: "100%" }}>
                    {item.doctor.full_name}, ({item.doctor.degrees}),{" "}
                    {item.doctor.speciality}
                  </TableCell>
                  <TableCell style={{ maxWidth: 100, width: "100%" }}>
                    {item.doctor.dr_child_id}
                  </TableCell>
                  <TableCell style={{ maxWidth: 100, width: "100%" }}>
                    {item.role}
                  </TableCell>
                  <TableCell style={{ maxWidth: 100, width: "100%" }}>
                    {Number(item.duration_h)}
                  </TableCell>
                  <TableCell
                    style={{
                      maxWidth: 150,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {formatNumber(Number(item.honorarium))}
                  </TableCell>
                  <View
                    style={{
                      maxWidth: 150,
                      width: "100%",
                      paddingHorizontal: 6,
                      borderRight: 1,
                    }}
                  >
                    <Field
                      name="Relevant TA:"
                      value={item.event_consultant_approval?.topic_expert}
                    />

                    <Field
                      name="Suitable for Participant:"
                      value={item.event_consultant_approval?.is_suitable}
                    />
                    <View style={{ borderBottom: 1 }} />
                    <Field
                      name="Honorarium Check:"
                      value={item.event_consultant_approval?.honorarium_check}
                    />
                    <Field
                      name="Consultant Form:"
                      value={
                        item.event_consultant_approval?.consultant_form_attached
                      }
                    />
                    <Field
                      name="Nth Engagement:"
                      value={item.event_consultant_approval?.nth_engagement}
                    />
                  </View>
                </TableRow>
              ))
            ) : (
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 11,
                  borderBottom: 1,
                  borderRight: 1,
                }}
              >
                No data.
              </Text>
            )}
          </View>
        </Table>
      </View>

      <View style={{ marginTop: 10 }}>
        <Table>
          <View fixed style={{ backgroundColor: color.muted }}>
            <TableRow>
              <TableHead style={{ flex: 1 }}>Approver</TableHead>
              <TableHead style={{ flex: 1 }}>Full Name</TableHead>
              <TableHead style={{ flex: 1 }}>Designation</TableHead>
              <TableHead style={{ flex: 1 }}>Approved Date</TableHead>
            </TableRow>
          </View>

          <View>
            {eventApprover.length > 0 ? (
              eventApprover.map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ flex: 1 }}>
                    {item.user_role.replaceAll("_", " ").toUpperCase()}
                  </TableCell>
                  <TableCell style={{ flex: 1 }}>
                    {
                      item?.user[
                        (item?.user_role === "director_sales"
                          ? "franchise_head"
                          : item?.user_role) as "ao"
                      ]?.["full_name"]
                    }
                  </TableCell>
                  <TableCell style={{ flex: 1 }}>
                    {item?.user[
                      (item?.user_role === "director_sales"
                        ? "franchise_head"
                        : item?.user_role) as "ao"
                    ]?.designation || "-"}
                  </TableCell>
                  <TableCell style={{ flex: 1 }}>
                    {item.created_at ? formatDateTime(item.created_at) : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 11,
                  borderBottom: 1,
                  borderRight: 1,
                }}
              >
                No data.
              </Text>
            )}
          </View>
        </Table>
      </View>
    </View>
  );
};

const CustomField = ({
  name,
  value,
  style,
}: {
  name: string;
  value?: string | null;
  style?: any;
}) => {
  return (
    <View
      style={[
        {
          // flexDirection: "row",
          // gap: 6,
          paddingHorizontal: 4,
          paddingVertical: 1,
          flexWrap: "wrap",
          borderLeft: 1,
          minWidth: 180,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 9 }}>{name}</Text>
      <Text
        style={[
          {
            fontWeight: "bold",
            fontSize: 10,
          },
        ]}
      >
        {value ?? "-"}
      </Text>
    </View>
  );
};

const Table = ({ style, ...props }: React.ComponentProps<typeof View>) => {
  return (
    <View
      style={[
        {
          borderLeft: 1,
          borderTop: 1,
        },
        style as any,
      ]}
      {...props}
    />
  );
};

const TableCell = ({ style, ...props }: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      style={[
        {
          fontSize: 9,
          padding: 1,
          paddingHorizontal: 6,
          borderRight: 1,
        },
        style as any,
      ]}
      {...props}
    />
  );
};

const TableRow = ({ style, ...props }: React.ComponentProps<typeof View>) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottom: 1,
        },
        style as any,
      ]}
      {...props}
    />
  );
};

const TableHead = ({ style, ...props }: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      style={[
        {
          fontSize: 9,
          padding: 1,
          fontWeight: "bold",
          borderRight: 1,
          flex: 1,
          paddingHorizontal: 6,
          textAlign: "center",
        },
        style as any,
      ]}
      {...props}
    />
  );
};

const FieldGroup = ({ style, ...props }: React.ComponentProps<typeof View>) => {
  return (
    <View
      style={[
        { borderTop: 1, flexDirection: "row", justifyContent: "space-between" },
      ]}
      {...props}
    />
  );
};

const Field = ({
  name,
  value,
}: {
  name: string;
  value?: string | number | null;
}) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontSize: 9, paddingVertical: 1 }}>{name}</Text>
      <Text style={{ fontSize: 9, paddingVertical: 1, fontWeight: "bold" }}>
        {value ?? "-"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 20,
  },
  logo: {
    width: 120,
  },
  heading: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingContainer: { paddingBottom: 10 },
  fontSm: {
    fontSize: 10,
  },
});

const color = {
  muted: "#f4f4f7",
};
