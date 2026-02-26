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
}: {
  eventData: EventSingleProps;
}) {
  return (
    <PDFViewer className="w-full min-h-svh">
      <Document>
        <Page size={"A4"} orientation="landscape" style={styles.page}>
          <HeaderSection />

          {/* page title */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Event Proposal Form</Text>
          </View>

          <EventBasicInformationSection data={eventData} />
        </Page>
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

const EventBasicInformationSection = ({ data }: { data: EventSingleProps }) => {
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
                fontSize: 14,
                paddingVertical: 6,
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
      <View break>
        <Table>
          <TableRow style={{ backgroundColor: color.muted }}>
            <TableHead>Event Budget</TableHead>
          </TableRow>
          <View>
            <TableRow>
              <TableHead style={{ flex: 1 }}>Item</TableHead>
              <TableHead style={{ flex: 1 }}>Unit</TableHead>
              <TableHead style={{ flex: 1 }}>Unit Cost</TableHead>
              <TableHead style={{ flex: 1 }}>Total</TableHead>
            </TableRow>
          </View>

          <View>
            {data.event_budget.length > 0 ? (
              data.event_budget.map((item) => (
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
                  flexBasis: 1
                }}
              >
                {formatNumber(
                  data.event_budget.reduce(
                    (acc, sum) => acc + sum.unit * Number(sum.unit_cost),
                    0,
                  ),
                )}
              </TableCell>
            </TableRow>
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
          gap: 0,
          padding: 4,
          flexWrap: "wrap",
          borderLeft: 1,
          minWidth: 170,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 10 }}>{name}</Text>
      <Text
        style={[
          styles.fontSm,
          {
            fontWeight: "bold",
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
          fontSize: 11,
          padding: 2,
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
          fontSize: 11,
          padding: 2,
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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 20,
  },
  logo: {
    width: 120,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingContainer: { paddingBottom: 10 },
  fontSm: {
    fontSize: 12,
  },
});

const color = {
  muted: "#f4f4f7",
};
