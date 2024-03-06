export class ValidatorSn {
  static createSanitizer() {
    return new ValidatorSn();
  }

  escape() {
    return (value: string): string => {
      return value.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    };
  }

  trim() {
    return (value: string): string => {
      return value.trim();
    };
  }

  lowerCase() {
    return (value: string): string => {
      return value.toLowerCase();
    };
  }

  upperCase() {
    return (value: string): string => {
      return value.toUpperCase();
    };
  }
}
