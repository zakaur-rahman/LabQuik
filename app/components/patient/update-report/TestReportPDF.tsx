import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";
import { svgToPngDataUrl } from "./utils/svgToPng";
import ReactDOMServer from "react-dom/server";
import HeaderImage from "@/public/assests/header1.png";
import FooterImage from "@/public/assests/footer1.png";
// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "path-to/Helvetica.ttf" },
    { src: "path-to/Helvetica-Bold.ttf", fontWeight: "bold" },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    padding: "120pt 0",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "120pt",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100pt",
  },
  contentWrapper: {
    flex: 1,
  },
  patientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "20pt",
    borderBottom: "1pt solid #000",
    paddingBottom: "10pt",
    position: "relative",
  },
  patientInfo: {
    flexDirection: 'row',
    paddingBottom: '5pt',
    justifyContent: 'space-between',
    borderBottom: '1pt solid #000',
    margin:'0 10pt 5pt 10pt',
    position: 'relative',
  },
  patientRow: {
    marginBottom: "5pt",
  },
  patientLabel: {
    fontSize: 10,
  },
  barcodeSection: {
    position: "absolute",
    right: "120pt",
    top: "10pt",
    alignItems: "center",
  },
  barcode: {
    width: "200pt",
    height: "30pt",
    marginBottom: "5pt",
  },
  qrCode: {
    width: "50pt",
    height: "50pt",
  },
  departmentHeader: {
    backgroundColor: "#f8f8f8",
    padding: "5pt",
    marginBottom: "10pt",
  },
  departmentTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  testTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    padding: "1pt 0 1pt 5pt",
    fontSize: 9,
  },
  interpretationTableCell: {
    flex: 1,
    padding: '1pt',
    fontSize: 8,
    color: '#444',
  },
  testNameCell: {
    width: "40%",
  },
  valueCell: {
    width: "20%",
    textAlign: "left",
  },
  unitCell: {
    width: "15%",
    textAlign: "left",
  },
  referenceCell: {
    width: "25%",
  },
  abnormalHigh: {
    color: "#dc2626",
  },
  abnormalLow: {
    color: "#2563eb",
  },
  clinicalNotes: {
    marginTop: "15pt",
    fontSize: 9,
  },
  notesTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: "5pt",
  },
 
  disclaimer: {
    fontSize: 8,
    textAlign: "center",
    color: "#666",
  },
  tableCellTest: {
    padding: "1pt 0 1pt 5pt",
    fontSize: 9,
    //borderRightWidth: 1,
    //borderColor: "#000",
    width: "40%",
  },
  tableCellValue: {
    padding: "1pt",
    fontSize: 9,
    //borderRightWidth: 1,
    //borderColor: "#000",
    width: "20%",
    textAlign: "left",
  },
  tableCellUnit: {
    padding: "1pt",
    fontSize: 9,
   // borderRightWidth: 1,
   // borderColor: "#000",
    width: "15%",
    textAlign: "left",
  },
  tableCellReference: {
    padding: "1pt",
    fontSize: 9,
    //borderRightWidth: 1,
   // borderColor: "#000",
    width: "25%",
  },
  tableRow: {
    flexDirection: 'row',
    padding: '1pt',
  },
  interpretationTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  testCol: {
    width: "40%",
  },
  tableCellChild: {
    padding: "1pt 0 1pt 5pt",
    fontSize: 9,
    //borderRightWidth: 1,
    //borderColor: "#000",
    width: "40%",
    paddingLeft: "20pt",
  },
  tableCellBold: {
    padding: "1pt 0 1pt 5pt",
    fontSize: 9,
   // borderRightWidth: 1,
    //borderColor: "#000",
    width: "40%",
    fontFamily: "Helvetica-Bold",
  },
  dateInfo: {
    width: '40%',
    paddingRight: '10pt',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: '4pt',
    alignItems: 'center',
  },
  label: {
    width: '80pt',
    fontSize: 9,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 9,
    paddingLeft: '1pt',
  },
  headerLeft: {
    flex: 1,
  },
  qrSection: {
    width: '20%',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: '5pt',
    color: '#666',
  },
  patientDetails: {
    width: '40%',
    paddingRight: '10pt',
  },
  patientName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: '8pt',
  },
  testSection: {
    margin: "0 10pt 5pt 10pt",
  },
  testHeader: {
    padding: "0 10pt 0 10pt",
    marginBottom: "5pt",
    textAlign: "center",
  },
  departmentName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: "2pt",
  },
  testName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  interpretation: {
    marginTop: "15pt",
    padding: "5pt",
    backgroundColor: "#f5f5f5",
  },
  interpretationTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: "5pt",
  },
  interpretationText: {
    fontSize: 9,
    color: "#444",
  },
  headerImage: {
    width: "100%",
    height: "100pt",
  },
  interpretationTable: {
    width: '100%',
    marginVertical: '1pt',
    borderWidth: 1,
    borderColor: '#000',
  },
});

// Components
interface TestReportPDFProps {
  reportData: any;
  showHeaderFooter: boolean;
  reportType?: "single" | "combined";
  selectedTests?: string[];
  separateTestReports?: boolean;
  patientDetails?: any;
}

const TestReportPDF = ({
  reportData,
  showHeaderFooter = true,
  reportType = "single",
  selectedTests = [],
  separateTestReports = false,
  patientDetails,
}: TestReportPDFProps) => {


  const [qrDataUrl, setQrDataUrl] = React.useState("");
  //console.log("reportData hello", reportData);


  // Filter tests based on selection
  const filteredTests = React.useMemo(() => {
    if (!selectedTests.length) return reportData;
    return reportData?.filter((test: any) =>
      selectedTests.includes(test.testName)
    );
  }, [reportData.fields, selectedTests]);

 // console.log("filteredTests", filteredTests);

  // Handle separate vs combined reports
  const reportsToRender = React.useMemo(() => {
    if (!separateTestReports) {
      return [
        {
          ...patientDetails,
          tests: filteredTests,
        },
      ];
    }

    // Create separate reports for each test
    return filteredTests.map((test: any) => ({
      ...patientDetails,
      tests: [test],
    }));
  }, [patientDetails, filteredTests, separateTestReports]);

  console.log("reportsToRender", reportsToRender);
  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const qrHtml = ReactDOMServer.renderToString(
          <QRCodeSVG
            value={reportData.patientId}
            size={96}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        );

        const container = document.createElement("div");
        container.innerHTML = qrHtml;
        const svgElement = container.querySelector("svg");

        if (svgElement) {
          const dataUrl = await svgToPngDataUrl(svgElement);
          setQrDataUrl(dataUrl);
        }
      } catch (error) {
        console.error("QR generation failed:", error);
      }
    };

    generateQR();
  }, [reportData.patientId]);

  const TestTable = ({ test }: { test: any }) => (
    <View style={styles.testTable}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellTest}>TEST</Text>
        <Text style={styles.tableCellValue}>VALUE</Text>
        <Text style={styles.tableCellUnit}>UNIT</Text>
        <Text style={styles.tableCellReference}>REFERENCE</Text>
      </View>
      {test?.map((field: any, index: any) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.testCol}>
            <Text
              style={
                field.isChild
                  ? styles.tableCellChild
                  : field.flag
                  ? styles.tableCellBold
                  : styles.tableCell
              }
            >
              {field.test}
              {field.flag && field.flag !== "D" && (
                <Text
                  style={
                    field.flag === "H"
                      ? styles.abnormalHigh
                      : styles.abnormalLow
                  }
                >
                  {` ${field.flag}`}
                </Text>
              )}
            </Text>
          </View>
          {!field.isParent && (
            <>
              <Text style={styles.tableCellValue}>{field.value}</Text>
              <Text style={styles.tableCellUnit}>{field.unit}</Text>
              <Text style={styles.tableCellReference}>{field.reference}</Text>
            </>
          )}
        </View>
      ))}
    </View>
  );

  const parseHtmlInterpretation = (htmlContent: string) => {
    // Remove any script tags for security
    const sanitizedHtml = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Convert common HTML entities
    const decodedHtml = sanitizedHtml
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    // Extract table content if exists
    const hasTable = decodedHtml.includes('<table');
    const beforeTable = hasTable ? decodedHtml.split('<table')[0] : decodedHtml;
    const tableMatch = hasTable ? decodedHtml.match(/<table[^>]*>([\s\S]*?)<\/table>/i) : null;
    const afterTable = hasTable ? decodedHtml.split('</table>')[1] : '';

    return (
      <View>
        {/* Render text before table */}
        <Text style={styles.interpretationText}>
          {beforeTable.replace(/<[^>]+>/g, '').trim()}
        </Text>

        {/* Render table if exists */}
        {tableMatch && (
          <View style={styles.interpretationTable}>
            {tableMatch[1]
              .match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
              ?.map((row, rowIndex) => {
                const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
                return (
                  <View key={rowIndex} style={styles.interpretationTableRow}>
                    {cells.map((cell, cellIndex) => {
                      const isHeader = cell.startsWith('<th');
                      const content = cell
                        .replace(/<\/?t[dh][^>]*>/g, '')
                        .replace(/<[^>]+>/g, '')
                        .trim();
                      return (
                        <Text
                          key={cellIndex}
                          style={[
                            styles.interpretationTableCell,
                            isHeader ? { fontFamily: 'Helvetica-Bold' } : {}
                          ]}
                        >
                          {content}
                        </Text>
                      );
                    })}
                  </View>
                );
              })}
          </View>
        )}

        {/* Render text after table */}
        {afterTable && (
          <Text style={styles.interpretationText}>
            {afterTable.replace(/<[^>]+>/g, '').trim()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Document>
      {reportsToRender?.map((report: any, index: any) => (
        <Page key={index} size="A4" style={styles.page}>
          {showHeaderFooter && (
            <>
              <View style={styles.header} fixed>
                <Image style={styles.headerImage} src={HeaderImage.src} />
              </View>
              <View style={styles.footer} fixed>
                <Image style={styles.headerImage} src={FooterImage.src} />
              </View>
            </>
          )}

          <View style={styles.contentWrapper}>
            <View style={styles.patientInfo}>
              {/* Patient Details - 40% */}
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>
                  {report.designation} {report.firstName} {report.lastName}
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Age / Sex</Text>
                  <Text style={styles.value}>: {report.age} YRS / {report.gender}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Referred by</Text>
                  <Text style={styles.value}>: {report.referredBy || "Self"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Reg. no.</Text>
                  <Text style={styles.value}>: {report.patientId}</Text>
                </View>
              </View>

              {/* Date Information - 30% */}
              <View style={styles.dateInfo}>
                {["Registered on", "Collected on", "Received on", "Reported on"].map(
                  (label, index) => (
                    <View key={index} style={styles.infoRow}>
                      <Text style={styles.label}>{label}</Text>
                      <Text style={styles.value}>
                        : 17/10/2024 {index % 2 === 0 ? "04:55 PM" : ""}
                      </Text>
                    </View>
                  )
                )}
              </View>

              {/* QR Code Section - 20% */}
              <View style={styles.qrSection}>
                <Text style={styles.qrText}>Scan to download</Text>
                {qrDataUrl && <Image style={styles.qrCode} src={qrDataUrl} />}
              </View>
            </View>

            {report?.tests?.map((test: any, testIndex: number) => (
              <View key={testIndex} style={styles.testSection} break={testIndex > 0}>
                <View style={styles.testHeader}>
                  <Text style={styles.departmentName}>{test.department}</Text>
                  <Text style={styles.testName}>{test.testName}</Text>
                </View>
                <TestTable test={test?.fields} />
                {test.showInterpretation && (
                  <View style={styles.interpretation}>
                    <Text style={styles.interpretationTitle}>Clinical Notes:</Text>
                    {parseHtmlInterpretation(test.interpretation)}
                  </View>
                )}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TestReportPDF;
