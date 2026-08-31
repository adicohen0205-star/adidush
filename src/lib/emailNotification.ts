import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_mcwwfnl";
const TEMPLATE_ID = "template_rtx7i68";
const PUBLIC_KEY = "whcSeR35Xzaym9zrq";

interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  form_source: string;
}

export const sendEmailNotification = async (params: EmailParams) => {
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      name: params.name,
      email: params.email,
      phone: params.phone || "לא צוין",
      message: params.message || "לא צוין",
      form_source: params.form_source,
    }, PUBLIC_KEY);
  } catch (error) {
    console.error("EmailJS notification failed:", error);
  }
};
