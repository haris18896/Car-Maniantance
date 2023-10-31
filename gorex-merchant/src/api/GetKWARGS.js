import {useTranslation} from "react-i18next";

export default GetKWARGS = (method, model, conditions) => {

  switch (method) {
    case "search_read":
      switch (model) {
        case "res.users":
          return {
            "context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
            fields: ["partner_id"],
          };
        case "product.template":
          return {
            "context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
            fields: ["name", "price", "file"],
          };
        case "res.partner":
          if (conditions?.isBranch) {
            return {
              "context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
              fields: [
                "name",
                "services",
                "active",
                "address",
                "longitude",
                "latitude",
                "opening_hours",
                "gorex_country",
                "gorex_city",
              ],
            };
          }
          return {
            "context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
            fields: [
              "id",
              "name",
              "first_name",
              "last_name",
              "email",
              "phone",
              "address",
              "gender",
              "dob",
              "balance",
              "pakage",
              "signup_completed",
              "profile_completed",
              "partner_type",
              "parent_partner_id",
              "driving_license_number",
              "driving_license_expiry",
              "active",
            ],
          };
        case "product.category":
          return { "context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["name", "file"] };
        case "gorex.manufacturer":
          return {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["name", "image_file"] };
        case "vehicle.model":
          return {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["name", "manufacturer"] };
        case "vehicle.variant":
          return {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["name", "vehicle_model"] };
        case "gorex.year":
          return {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"}, fields: ["year"] };
        case "gorex.vehicle":
          return {"context":{"lang":global.language === "en" ? "en_US" : "ar_001"},
            fields: [
              "name",
              "customer",
              "manufacturer",
              "vehicle_model",
              "vehicle_variant",
              "year_id",
              "is_primary",
            ],
          };
      }
  }
};
