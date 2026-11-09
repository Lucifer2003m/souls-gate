
export type WeaponRequirement = {
  strength: number;
  dexterity: number;
};

const weaponRequirements: Record<string, WeaponRequirement> = {
  claymore: { strength: 16, dexterity: 13 },
  uchigatana: { strength: 11, dexterity: 16 },
  "sellsword twinblades": { strength: 10, dexterity: 16 },
};

export function findWeaponRequirements(
  name: string,
): WeaponRequirement | undefined {
  const normalized = name
    .toLowerCase()
    .replace(/\.(png|jpe?g|webp|avif)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return weaponRequirements[normalized];
}
