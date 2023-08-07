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
export const formatDateWithSuffix = (date: Date | null | undefined) => {
  if (date == undefined) {
    date = new Date();
  }
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

/**
 * Convert integer to alphabet
 *
 * 1 ---> a
 *
 * 2 ---> b
 *
 * 3 ---> c
 *
 * ...
 *
 * 26 ---> z
 *
 * @param num
 * @returns Corresponding Alphabet
 */
export const intToAlphabet = (num: number) => {
  if (num >= 1 && num <= 26) {
    // return String.fromCharCode(96 + num);
  }
  return String.fromCharCode(96 + num);
};

/**
 * Convert integer to roman numerals
 *
 * 1 ---> i
 *
 * 2 ---> ii
 *
 * 3 ---> iii
 *
 * ...
 *
 * @param num
 * @returns Corresponding Roman Numeral
 */
export const intToRoman = (num: number) => {
  const romanNumerals: { [key: number]: string } = {
    1: "i",
    4: "iv",
    5: "v",
    9: "ix",
    10: "x",
    40: "xl",
    50: "l",
    90: "xc",
    100: "c",
    400: "cd",
    500: "d",
    900: "cm",
    1000: "m",
  };

  const keys = Object.keys(romanNumerals)
    .map(Number)
    .sort((a, b) => b - a);

  let result = "";

  for (const value of keys) {
    while (num >= value) {
      result += romanNumerals[value];
      num -= value;
    }
  }

  return result;
};
