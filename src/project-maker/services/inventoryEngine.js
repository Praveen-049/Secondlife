import components from "../data/components";

/*
  Find a component using its ID.
*/
export function getComponentById(componentId) {
  return components.find(
    (component) => component.id === componentId
  );
}

/*
  Search the component database.

  The user can type:
  "esp32"
  "soil sensor"
  "ultrasonic"
  "servo"
  "jumper"

  and the engine will search names,
  aliases and categories.
*/
export function searchComponents(searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  const search = searchTerm.trim().toLowerCase();

  return components.filter((component) => {
    const nameMatch =
      component.name.toLowerCase().includes(search);

    const categoryMatch =
      component.category.toLowerCase().includes(search);

    const aliasMatch =
      component.aliases.some((alias) =>
        alias.toLowerCase().includes(search)
      );

    return (
      nameMatch ||
      categoryMatch ||
      aliasMatch
    );
  });
}

/*
  Convert user-entered component text into
  known component IDs.

  Example:

  "ESP32, soil sensor, buzzer"

  becomes:

  [
    "esp32",
    "soil-moisture",
    "buzzer"
  ]
*/
export function identifyComponents(text) {
  if (!text || !text.trim()) {
    return [];
  }

  const inputParts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const identified = [];

  inputParts.forEach((part) => {
    const matches = searchComponents(part);

    if (matches.length > 0) {
      identified.push(matches[0]);
    }
  });

  return identified;
}

/*
  Add a component to an existing inventory.

  If the component already exists,
  increase its quantity instead of
  creating a duplicate row.
*/
export function addToInventory(
  inventory,
  componentId,
  quantity = 1
) {
  if (!componentId || quantity <= 0) {
    return inventory;
  }

  const existing = inventory.find(
    (item) =>
      item.componentId === componentId
  );

  if (existing) {
    return inventory.map((item) =>
      item.componentId === componentId
        ? {
            ...item,
            quantity:
              item.quantity + quantity,
          }
        : item
    );
  }

  return [
    ...inventory,
    {
      componentId,
      quantity,
    },
  ];
}

/*
  Change the quantity of an inventory item.
*/
export function updateInventoryQuantity(
  inventory,
  componentId,
  quantity
) {
  if (quantity <= 0) {
    return inventory.filter(
      (item) =>
        item.componentId !== componentId
    );
  }

  return inventory.map((item) =>
    item.componentId === componentId
      ? {
          ...item,
          quantity,
        }
      : item
  );
}

/*
  Remove a component completely.
*/
export function removeFromInventory(
  inventory,
  componentId
) {
  return inventory.filter(
    (item) =>
      item.componentId !== componentId
  );
}

/*
  Turn raw inventory data into display-ready
  component objects.

  Example:

  {
    componentId: "esp32",
    quantity: 2
  }

  becomes:

  {
    id: "esp32",
    name: "ESP32",
    quantity: 2,
    category: "Microcontroller"
  }
*/
export function getInventoryDetails(
  inventory
) {
  return inventory
    .map((item) => {
      const component =
        getComponentById(
          item.componentId
        );

      if (!component) {
        return null;
      }

      return {
        ...component,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);
}