import ubigeoPeru from "ubigeo-peru";

type UbigeoEntry = {
  departamento: string;
  provincia: string;
  distrito: string;
  nombre: string;
};

const reniecEntries = (ubigeoPeru as { reniec: UbigeoEntry[] }).reniec;

type Option = {
  code: string;
  name: string;
};

const departmentEntries = reniecEntries.filter((entry) => entry.provincia === "00" && entry.distrito === "00");

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

export const departmentOptions: Option[] = departmentEntries
  .map((entry) => ({ code: entry.departamento, name: entry.nombre }))
  .sort((left, right) => left.name.localeCompare(right.name, "es"));

export function findDepartmentOptionByName(departmentName: string): Option | undefined {
  const normalized = normalizeLabel(departmentName);
  return departmentOptions.find((option) => normalizeLabel(option.name) === normalized);
}

export function getProvinceOptions(departmentCode: string): Option[] {
  const department = departmentEntries.find((entry) => entry.departamento === departmentCode);
  if (!department) return [];

  return reniecEntries
    .filter((entry) => entry.departamento === department.departamento && entry.distrito === "00" && entry.provincia !== "00")
    .map((entry) => ({ code: entry.provincia, name: entry.nombre }))
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
}

export function findProvinceOptionByName(departmentCode: string, provinceName: string): Option | undefined {
  const normalized = normalizeLabel(provinceName);
  return getProvinceOptions(departmentCode).find((option) => normalizeLabel(option.name) === normalized);
}

export function getDistrictOptions(departmentCode: string, provinceCode: string): Option[] {
  const department = departmentEntries.find((entry) => entry.departamento === departmentCode);
  if (!department) return [];

  const province = reniecEntries.find((entry) => entry.departamento === department.departamento && entry.provincia === provinceCode && entry.distrito === "00");

  if (!province) return [];

  return reniecEntries
    .filter(
      (entry) =>
        entry.departamento === department.departamento &&
        entry.provincia === province.provincia &&
        entry.distrito !== "00",
    )
    .map((entry) => ({ code: entry.distrito, name: entry.nombre }))
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
}

export function findDistrictOptionByName(departmentCode: string, provinceCode: string, districtName: string): Option | undefined {
  const normalized = normalizeLabel(districtName);
  return getDistrictOptions(departmentCode, provinceCode).find((option) => normalizeLabel(option.name) === normalized);
}