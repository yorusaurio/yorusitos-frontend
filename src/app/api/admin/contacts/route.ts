import { NextResponse } from "next/server";
import { createContact, listContacts } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminContact } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  return NextResponse.json({ contacts: listContacts() });
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
    !body.contactedBy
  ) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const contact = createContact({
    documentType: body.documentType,
    document: body.document,
    lastNamePaterno: body.lastNamePaterno,
    lastNameMaterno: body.lastNameMaterno,
    names: body.names,
    sex: body.sex,
    birthDate: body.birthDate,
    numero: body.numero,
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
  });

  return NextResponse.json({ contact }, { status: 201 });
}
