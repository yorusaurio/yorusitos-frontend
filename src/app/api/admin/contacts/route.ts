import { NextResponse } from "next/server";
import { createContact, listContacts } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminContact } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const contacts = await listContacts();
  return NextResponse.json({ contacts });
}

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<Omit<AdminContact, "id">>(request);
  if (
    !body.documentType ||
    !body.document ||
    !body.lastNamePaterno ||
    !body.lastNameMaterno ||
    !body.names ||
    !body.sex ||
    !body.birthDate ||
    !body.numero ||
    !body.client ||
    !body.cellphone ||
    !body.email ||
    !body.province ||
    !body.district ||
    !body.department ||
    !body.address ||
    !body.addressNumber ||
    !body.reference ||
    !body.agency ||
    !body.contactedBy ||
    !Array.isArray(body.contactedBy) ||
    (body.contactedBy.includes("OTROS") && !body.contactedByOther) ||
    !body.classification
  ) {
    const required = [
      "documentType",
      "document",
      "lastNamePaterno",
      "lastNameMaterno",
      "names",
      "sex",
      "birthDate",
      "numero",
      "client",
      "cellphone",
      "email",
      "province",
      "district",
      "department",
      "address",
      "addressNumber",
      "reference",
      "agency",
      "contactedBy",
      "classification",
    ];

    const missing = required.filter((key) => {
      // @ts-ignore
      return !body[key] && body[key] !== 0;
    });

    return NextResponse.json({ error: "Invalid payload.", missing }, { status: 400 });
  }

  const contact = await createContact({
    documentType: body.documentType,
    document: body.document,
    lastNamePaterno: body.lastNamePaterno,
    lastNameMaterno: body.lastNameMaterno,
    names: body.names,
    sex: body.sex,
    birthDate: body.birthDate,
    numero: body.numero,
    classification: body.classification,
    client: body.client,
    cellphone: body.cellphone,
    email: body.email,
    province: body.province,
    district: body.district,
    department: body.department,
    address: body.address,
    addressNumber: body.addressNumber,
    reference: body.reference,
    agency: body.agency,
    contactedBy: body.contactedBy,
    contactedByOther: body.contactedByOther || undefined,
  });

  return NextResponse.json({ contact }, { status: 201 });
}
