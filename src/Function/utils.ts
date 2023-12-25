import axios from "axios";
import BodyForm from "form-data";
import fs from "fs";

export const urlToBuffer = async (url: string | URL): Promise<Buffer | undefined> => {
    try {
        const response = await axios.get(url as any, { responseType: 'arraybuffer' })
        return response.data
    } catch (error) {
        console.log(error);
        return error
    }
}

export const getRedirectUrl = async (url: string | URL) => {
    let result = await fetch(url, { redirect: "manual" })
        .then((res) => res.headers.get("Location"))
        .catch((error) => error);
    return result
}

export const upload = async (Path: string) => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
        try {
          const form = new BodyForm();
          form.append("file", fs.createReadStream(Path));
          const data = await axios({
            url: "https://telegra.ph/upload",
            method: "POST",
            headers: {
              ...form.getHeaders(),
            },
            data: form,
          });
          
          return resolve("https://telegra.ph" + data.data[0].src);
        } catch (err) {
          return reject(new Error(String(err)));
        }
      });
}

export const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));
