/**
 * Function for indexes in MCQ
 *
 * 0 - Not Chosen
 *
 * 1 - A
 *
 * 2 - B
 *
 * 3 - C
 *
 * 4 - D
 *
 * @param index
 * @returns String
 */
export const convertIntegerToASCII = (index: number) => {
  if (index == 0) {
    return "Not Chosen";
  }
  return String.fromCharCode(97 + index - 1).toUpperCase();
};

/**
 * Not Chosen - 0
 *
 * A - 1
 *
 * B - 2
 *
 * C - 3
 *
 * D - 4
 *
 * @param string
 * @returns Index
 */
export const convertASCIIToInteger = (string: string) => {
  if (string == "Not Chosen") {
    return 0;
  }
  return string.charCodeAt(0) - 64;
};

/**
 * Convert Date to a better format
 * Eg: 1st Jun 2004
 *
 * @param Date
 * @returns formattedDate
 */
export const formatDate = (date: Date) => {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let dayWithSuffix = day.toString();
  if (day >= 11 && day <= 13) {
    dayWithSuffix += "th";
  } else {
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        dayWithSuffix += "st";
        break;
      case 2:
        dayWithSuffix += "nd";
        break;
      case 3:
        dayWithSuffix += "rd";
        break;
      default:
        dayWithSuffix += "th";
    }
  }

  return `${dayWithSuffix} ${month ?? ""} ${year}`;
};
