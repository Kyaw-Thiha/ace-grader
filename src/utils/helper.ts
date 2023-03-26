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
