const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && value.constructor === Object;
};

type QueryParamValue = string | number | boolean | null | undefined;
type QueryParamArray = Array<QueryParamValue | Record<string, unknown>>;
type QueryParamObject = {
  [key: string]: QueryParamValue | QueryParamArray | Record<string, unknown>;
};

export const objectToQueryString = <T extends QueryParamObject>(obj: T): string => {
  const params = new URLSearchParams();

  const appendToParams = (data: unknown, prefix = ""): void => {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = prefix ? `${prefix}[${index}]` : index.toString();
        if (isPlainObject(item) || Array.isArray(item)) {
          appendToParams(item, key);
        } else {
          params.append(key, String(item));
        }
      });
    } else if (isPlainObject(data)) {
      for (const [key, value] of Object.entries(data)) {
        const fullKey = prefix ? `${prefix}[${key}]` : key;
        if (isPlainObject(value) || Array.isArray(value)) {
          appendToParams(value, fullKey);
        } else {
          params.append(fullKey, String(value));
        }
      }
    } else if (data !== undefined && data !== null) {
      params.append(prefix, String(data));
    }
  };

  appendToParams(obj);

  return params.toString();
};
