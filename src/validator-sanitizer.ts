/**
 * ValidatorSn class provides a set of sanitizers to sanitize the input data.
 */
export class ValidatorSn {
  /**
   * Creates a new instance of ValidatorSn.
   */
  static createSanitizer(): ValidatorSn {
    return new ValidatorSn();
  }

  /**
   * Escape special characters in a value.
   */
  escape(): (value: string) => string {
    return (value: string): string => {
      return value.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#x27;');
    };
  }

  /**
   * Trim a value.
   */
  trim(): (value: string) => string {
    return (value: string): string => {
      return value.trim();
    };
  }

  /**
   * Convert a value to lower case.
   */
  lowerCase(): (value: string) => string {
    return (value: string): string => {
      return value.toLowerCase();
    };
  }

  /**
   * Convert a value to upper case.
   */
  upperCase(): (value: string) => string {
    return (value: string): string => {
      return value.toUpperCase();
    };
  }

  /**
   * Replace all occurrences of a substring in a value.
   */
  replace(search: string, replacement: string): (value: string) => string {
    return (value: string): string => {
      return value.split(search).join(replacement);
    };
  }
}
