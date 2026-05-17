export const getStringParam = (param: string | string[] | undefined): string | undefined => {
  if (!param) return undefined;
  if (Array.isArray(param)) return param[0];
  return param;
};

export const getRequiredStringParam = (param: string | string[] | undefined, paramName: string): string => {
  const value = getStringParam(param);
  if (!value) {
    throw new Error(`${paramName} is required`);
  }
  return value;
};

export const getNumberParam = (param: string | string[] | undefined, defaultValue?: number): number | undefined => {
  const str = getStringParam(param);
  if (!str) return defaultValue;
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
};