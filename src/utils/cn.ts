// Helper kecil gabung className kondisional — tidak menambah dependency baru
// (Tech Bible Bab 4: setiap library baru harus jelas alasannya).
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
