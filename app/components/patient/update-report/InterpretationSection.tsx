import React from "react";
import { View, Text } from "@react-pdf/renderer";

interface InterpretationSectionProps {
  htmlContent: string;
}

export const InterpretationSection: React.FC<InterpretationSectionProps> = ({ htmlContent }) => {
  return (
    <View style={styles.interpretation}>
      <Text style={styles.interpretationTitle}>Clinical Notes:</Text>
      <Text style={styles.interpretationText}>
        {htmlContent.replace(/<[^>]+>/g, '').trim()}
      </Text>
    </View>
  );
};

const styles = {
  interpretation: {
    margin: "10pt 0",
  },
  interpretationTitle: {
    fontSize: 9,
    marginBottom: "2pt",
    fontFamily: "Helvetica-Bold",
  },
  interpretationText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#000",
  },
}; 