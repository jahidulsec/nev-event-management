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
import { formatDate, formatDateTime } from "@/utils/formatter";

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
    <View>
      <Image src={"/logo/nevian.png"} style={styles.logo} />
    </View>
  );
};

const EventBasicInformationSection = ({ data }: { data: EventSingleProps }) => {
  return (
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
          <CustomField
            name="Venue Appropiateness"
            value={data.venue_appropriateness}
          />
        </FieldGroup>
      </View>
    </View>
  );
};

const CustomField = ({
  name,
  value,
}: {
  name: string;
  value?: string | null;
}) => {
  return (
    <View
      style={{
        // flexDirection: "row",
        gap: 0,
        padding: 6,
        flexWrap: "wrap",
        borderLeft: 1,
        minWidth: 200
      }}
    >
      <Text style={{fontSize: 10}}>{name}</Text>
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

const FieldGroup = ({
  style,
  ...props
}: React.ComponentProps<typeof View>) => {
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
  headingContainer: { paddingVertical: 10 },
  fontSm: {
    fontSize: 12,
  },
});
