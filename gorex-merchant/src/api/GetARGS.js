

export default GetARGS = (method, model, conditions) => {
  switch (method) {
    case "search_read":
      switch (model) {
        case "res.users":
          return [[["id", conditions?.id?.operator, conditions?.id?.value]]];
        case "product.template":
          if (conditions?.isService) {
            if (conditions?.id) {
              return [
                [
                  ["product_type", "=", "service"],
                  ["id", conditions?.id?.operator, conditions?.id?.value],
                ],
              ];
            }
            if (conditions?.branch && conditions?.category) {
              return [
                [
                  ["product_type", "=", "service"],
                  [
                    "partner_id",
                    conditions?.branch?.operator,
                    conditions?.branch?.value,
                  ],
                  [
                    "categ_id",
                    conditions?.category?.operator,
                    conditions?.category?.value,
                  ],
                ],
              ];
            }
            return [[["product_type", "=", "service"]]];
          }
          if (conditions?.branch && conditions?.category) {
            return [
              [
                ["product_type", "=", "product"],
                [
                  "partner_id",
                  conditions?.branch?.operator,
                  conditions?.branch?.value,
                ],
                [
                  "categ_id",
                  conditions?.category?.operator,
                  conditions?.category?.value,
                ],
              ],
            ];
          }
          return [[["product_type", "=", "product"]]];
        case "res.partner":
          if (conditions?.isBranch) {
            if (conditions?.services) {
              return [
                [
                  ["is_vendor", "=", 1],
                  [
                    "services",
                    conditions?.services?.operator,
                    conditions?.services?.value,
                  ],
                ],
              ];
            }
            return [[["is_vendor", "=", 1],'|',["service_tree", "!=", false],["product_tree", "!=", false]]];
            // return [[["is_vendor", "=", 1]]];
          }
          if (conditions?.id) {
            return [[["id", conditions?.id?.operator, conditions?.id?.value]]];
          }
          return [];
        case "product.category":
          if (conditions?.isService) {
            if (conditions?.id) {
              return [
                [
                  ["category_type", "=", "service"],
                  ["id", conditions?.id?.operator, conditions?.id?.value],
                ],
              ];
            } else {
              return [[["category_type", "=", "service"]]];
            }
          } else {
            return [[["category_type", "=", "product"]]];
          }
        case "gorex.manufacturer":
          return [];
        case "vehicle.model":
          return [];
        case "vehicle.variant":
          return [];
        case "gorex.year":
          return [];
        case "gorex.vehicle":
          return [
            [
              [
                "customer",
                conditions?.customer?.operator,
                conditions?.customer?.value,
              ],
            ],
          ];
      }
  }
};
