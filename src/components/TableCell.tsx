import React from "react";

interface CssTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: number;
  letterSpacing: string;
  alignment: "left" | "center" | "right";
}

interface TableCellProps {
  value: any;
  alignment: "left" | "center" | "right";
  padding: number;
  freezeLeft?: boolean;
  showVerticalLines: boolean;
  verticalLineColor: string;
  verticalLineWidth: number;
  wordWrap: boolean;
  textOverflow: "clip" | "ellipsis" | "wrap";
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
  decimalPlaces: number;
  thousandsSeparator: boolean;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  negativeNumberFormat: "minus" | "parentheses" | "minusred" | "parenthesesred";
  customNegativeColor: string;
  typographyStyle: CssTypographyStyle;
}

const formatValue = (
  value: any,
  decimalPlaces: number,
  thousandsSeparator: boolean,
  currencySymbol: string,
  currencyPosition: "before" | "after",
  negativeNumberFormat: "minus" | "parentheses" | "minusred" | "parenthesesred",
  customNegativeColor: string
): { text: string; color?: string } => {
  if (value == null) {
    return { text: "" };
  }

  if (typeof value === "number") {
    const abs = Math.abs(value);
    const opts: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: thousandsSeparator,
    } as any;
    let text = abs.toLocaleString(undefined, opts);
    if (currencySymbol && currencySymbol !== "none") {
      text =
        currencyPosition === "before"
          ? `${currencySymbol}${text}`
          : `${text}${currencySymbol}`;
    }
    let color: string | undefined;
    if (value < 0) {
      if (
        negativeNumberFormat === "parentheses" ||
        negativeNumberFormat === "parenthesesred"
      ) {
        text = `(${text})`;
      }
      if (
        negativeNumberFormat === "minusred" ||
        negativeNumberFormat === "parenthesesred"
      ) {
        color = customNegativeColor || "#ff0000";
      }
    }
    return { text, color };
  }

  if (value instanceof Date) {
    return { text: value.toLocaleDateString() };
  }

  return { text: String(value) };
};

export const TableCell: React.FC<TableCellProps> = ({
  value,
  alignment,
  padding,
  freezeLeft,
  showVerticalLines,
  verticalLineColor,
  verticalLineWidth,
  wordWrap,
  textOverflow,
  color,
  fontSize,
  backgroundColor,
  decimalPlaces,
  thousandsSeparator,
  currencySymbol,
  currencyPosition,
  negativeNumberFormat,
  customNegativeColor,
  typographyStyle,
}) => {
  const formatted = formatValue(
    value,
    decimalPlaces,
    thousandsSeparator,
    currencySymbol,
    currencyPosition,
    negativeNumberFormat,
    customNegativeColor
  );
  const whiteSpace = wordWrap ? "normal" : "nowrap";
  const overflow =
    textOverflow === "clip"
      ? "hidden"
      : textOverflow === "ellipsis"
      ? "hidden"
      : "visible";
  const textOverflowCSS = textOverflow === "ellipsis" ? "ellipsis" : "clip";
  return (
    <td
      style={{
        textAlign: alignment,
        padding,
        fontFamily: typographyStyle.fontFamily,
        fontSize: fontSize ? `${fontSize}px` : typographyStyle.fontSize,
        color: formatted.color || color || typographyStyle.fontColor,
        fontWeight: typographyStyle.fontWeight,
        fontStyle: typographyStyle.fontStyle,
        textDecoration: typographyStyle.textDecoration,
        letterSpacing: typographyStyle.letterSpacing,
        lineHeight: typographyStyle.lineHeight,
        position: freezeLeft ? ("sticky" as const) : undefined,
        left: freezeLeft ? 0 : undefined,
        background: freezeLeft ? backgroundColor || "#fff" : backgroundColor,
        borderRight: showVerticalLines
          ? `${verticalLineWidth}px solid ${verticalLineColor}`
          : undefined,
        whiteSpace,
        overflow,
        textOverflow: textOverflowCSS,
      }}
    >
      {formatted.text}
    </td>
  );
};
