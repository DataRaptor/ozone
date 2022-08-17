import sanitize from "sanitize-html";

export const utils = {
  clean(data: any): any {
    if (!data) return;

    if (typeof data === "string") {
      if (data.trim() == "") return;

      return sanitize(data);
    } else if (typeof data === "number") {
      return Number(sanitize(String(data)));
    } else if (typeof data === "boolean") {
      return JSON.parse(sanitize(String(data)));
    } else if (Array.isArray(data)) {
      const arr = [];

      for (let i = 0; i < data.length; i++) {
        arr.push(utils.clean(data[i]));
      }

      return arr;
    } else if (typeof data === "object") {
      const obj: any = {};
      for (const k in data) {
        obj[k] = utils.clean(data[k]);
      }

      return obj;
    }

    return data;
  },
};
