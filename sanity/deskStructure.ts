import { Package, Layers, Award, Star, Settings } from "lucide-react";
import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Middle Ocean Content")
    .items([
      // Product Catalog Group
      S.listItem()
        .title("Product Catalog")
        .child(
          S.list()
            .title("Catalog")
            .items([
              S.documentTypeListItem("product").title("Products").icon(Package),
              S.documentTypeListItem("category").title("Categories").icon(Layers),
              S.documentTypeListItem("brand").title("Brands").icon(Award),
            ])
        )
        .icon(Package),

      S.divider(),

      // Customer Feedback Group
      S.listItem()
        .title("Customer Feedback")
        .child(
          S.list()
            .title("Feedback")
            .items([
              S.documentTypeListItem("productReview").title("Product Reviews").icon(Star),
            ])
        )
        .icon(Star),

      S.divider(),

      // Settings Group
      S.listItem()
        .title("Global Settings")
        .child(
          S.list()
            .title("Settings")
            .items([
              S.documentListItem()
                .schemaType("siteSettings")
                .id("siteSettings")
                .title("Site Settings")
                .icon(Settings),
            ])
        )
        .icon(Settings),

      // Filter out types that are already in the custom list
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["product", "category", "brand", "productReview", "siteSettings"].includes(
            listItem.getId() || ""
          )
      ),
    ]);
