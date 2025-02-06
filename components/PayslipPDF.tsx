import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register font
Font.register({
  family: "Inter",
  src: "https://rsms.me/inter/font-files/Inter-Regular.woff2",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  value: {
    fontSize: 12,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

interface PayslipData {
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  deductions: {
    tax: number;
    healthInsurance: number;
    pension: number;
    other?: number;
  };
  netSalary: number;
  currency: string;
  generatedAt: Date;
}

// Single payslip component
export function PayslipPage({ data }: { data: PayslipData }) {
  const totalDeductions =
    data.deductions.tax +
    data.deductions.healthInsurance +
    data.deductions.pension +
    (data.deductions.other || 0);

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Payslip</Text>
        <Text style={styles.subtitle}>Period: {data.period}</Text>
        <Text style={styles.subtitle}>
          Employee: {data.employeeName} (ID: {data.employeeId})
        </Text>
      </View>

      {/* Earnings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Basic Salary</Text>
          <Text style={styles.value}>
            {data.currency} {data.grossSalary.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Deductions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deductions</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>
            {data.currency} {data.deductions.tax.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Health Insurance</Text>
          <Text style={styles.value}>
            {data.currency} {data.deductions.healthInsurance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pension</Text>
          <Text style={styles.value}>
            {data.currency} {data.deductions.pension.toFixed(2)}
          </Text>
        </View>
        {data.deductions.other && data.deductions.other > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Other Deductions</Text>
            <Text style={styles.value}>
              {data.currency} {data.deductions.other.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Gross Pay</Text>
          <Text style={styles.value}>
            {data.currency} {data.grossSalary.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Deductions</Text>
          <Text style={styles.value}>
            {data.currency} {totalDeductions.toFixed(2)}
          </Text>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Net Pay</Text>
          <Text style={styles.totalValue}>
            {data.currency} {data.netSalary.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {format(data.generatedAt, "PPpp")}
      </Text>
    </Page>
  );
}

// Single payslip document
export function PayslipPDF({ data }: { data: PayslipData }) {
  return (
    <Document>
      <PayslipPage data={data} />
    </Document>
  );
}

// Batch payslip document
export function BatchPayslipPDF({ payslips }: { payslips: PayslipData[] }) {
  return (
    <Document>
      {payslips.map((payslip, index) => (
        <PayslipPage key={`${payslip.employeeId}-${index}`} data={payslip} />
      ))}
    </Document>
  );
}
