export type Zone = { id: string; name: string }
export type Camera = { id: string; name: string; zones: Zone[] }
export type Store = { id: string; name: string; cameras: Camera[] }
export type Organization = { id: string; name: string; stores: Store[] }

function zones(...names: string[]): Zone[] {
  return names.map((name, i) => ({ id: `${i}-${name}`, name }))
}

/** Mocked cascading scope hierarchy: Organization -> Store -> Camera -> Zone. */
export const ORGANIZATIONS: Organization[] = [
  {
    id: "org-northwind",
    name: "Northwind Retail Group",
    stores: [
      {
        id: "store-downtown",
        name: "Downtown Flagship",
        cameras: [
          { id: "cam-entrance", name: "Entrance Cam", zones: zones("Vestibule", "Greeter Area") },
          { id: "cam-checkout", name: "Checkout Cam", zones: zones("Registers", "Queue Lane") },
          { id: "cam-apparel", name: "Apparel Cam", zones: zones("Menswear", "Womenswear", "Fitting Rooms") },
        ],
      },
      {
        id: "store-mall",
        name: "Riverside Mall",
        cameras: [
          { id: "cam-atrium", name: "Atrium Cam", zones: zones("Main Aisle", "Promo Display") },
          { id: "cam-electronics", name: "Electronics Cam", zones: zones("TVs", "Mobile", "Accessories") },
        ],
      },
    ],
  },
  {
    id: "org-summit",
    name: "Summit Grocers",
    stores: [
      {
        id: "store-westside",
        name: "Westside Market",
        cameras: [
          { id: "cam-produce", name: "Produce Cam", zones: zones("Fresh Produce", "Floral") },
          { id: "cam-deli", name: "Deli Cam", zones: zones("Deli Counter", "Bakery") },
        ],
      },
    ],
  },
]
