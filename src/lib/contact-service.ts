import { supabase } from "@/lib/supabase";

export type ContactReportStatus = "nouveau" | "traite" | "archive";

export interface ContactReportFormInput {
  subject: string;
  message: string;
  email: string;
  profileType: string;
  civility: string;
  lastName: string;
  firstName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phonePrefix: string;
  phoneNumber: string;
  attachmentUrl: string | null;
}

export interface ContactReportItem {
  id: string;
  subject: string;
  email: string;
  last_name: string;
  first_name: string;
  status: ContactReportStatus;
  created_at: string;
}

export interface ContactReportDetail extends ContactReportItem {
  message: string;
  profile_type: string | null;
  civility: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  phone_prefix: string | null;
  phone_number: string | null;
  attachment_url: string | null;
}

const clean = (value: string) => value.trim();

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadContactAttachment = async (file: File, email: string) => {
  const safeEmail = clean(email).toLowerCase().replace(/[^a-z0-9@._-]/g, "") || "anonymous";
  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name || `attachment-${timestamp}`);
  const path = `${safeEmail}/${timestamp}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("contact-reports")
    .upload(path, file, { upsert: false });

  if (uploadError) throw uploadError;
  return path;
};

export const getContactAttachmentSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("contact-reports")
    .createSignedUrl(path, 60 * 10);

  if (error) throw error;
  return data.signedUrl;
};

export const createContactReport = async (input: ContactReportFormInput) => {
  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);

  const requiredPayload: Record<string, string> = {
    subject: clean(input.subject),
    message: clean(input.message),
    email: clean(input.email),
    last_name: lastName,
    first_name: firstName,
  };

  const payload: Record<string, string> = {
    ...requiredPayload,
    status: "nouveau" as ContactReportStatus,
  };

  const profileType = clean(input.profileType);
  const civility = clean(input.civility);
  const address = clean(input.address);
  const postalCode = clean(input.postalCode);
  const city = clean(input.city);
  const country = clean(input.country);
  const phonePrefix = clean(input.phonePrefix);
  const phoneNumber = clean(input.phoneNumber);

  if (profileType) payload.profile_type = profileType;
  if (civility) payload.civility = civility;
  if (address) payload.address = address;
  if (postalCode) payload.postal_code = postalCode;
  if (city) payload.city = city;
  if (country) payload.country = country;
  if (phoneNumber) {
    payload.phone_number = phoneNumber;
    if (phonePrefix) payload.phone_prefix = phonePrefix;
  }
  if (input.attachmentUrl) payload.attachment_url = input.attachmentUrl;

  const firstTry = await supabase.from("contact_reports").insert(payload);
  if (!firstTry.error) return;

  const secondTry = await supabase.from("contact_reports").insert(requiredPayload);
  if (!secondTry.error) return;

  const details = [secondTry.error.message, secondTry.error.details, secondTry.error.hint]
    .filter(Boolean)
    .join(" | ");

  throw new Error(details || "Insertion contact_reports echouee.");
};

export const fetchAdminContactReports = async (): Promise<ContactReportItem[]> => {
  const { data, error } = await supabase
    .from("contact_reports")
    .select("id, subject, email, last_name, first_name, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContactReportItem[];
};

export const fetchAdminContactReportById = async (id: string): Promise<ContactReportDetail> => {
  const { data, error } = await supabase
    .from("contact_reports")
    .select("id, subject, email, last_name, first_name, status, created_at, message, profile_type, civility, address, postal_code, city, country, phone_prefix, phone_number, attachment_url")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ContactReportDetail;
};

export const updateContactReportStatus = async (id: string, status: ContactReportStatus) => {
  const { error } = await supabase.from("contact_reports").update({ status }).eq("id", id);
  if (error) throw error;
};
