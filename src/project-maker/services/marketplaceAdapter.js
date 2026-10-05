import components from '../data/components.js';

function normalizeLabel(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function marketplaceComponentKey(value = '') {
  const normalized = normalizeLabel(value);
  const names = component => [component.id, component.name, ...(component.aliases ?? [])].map(normalizeLabel);
  const component = components.find(item => names(item).includes(normalized)) ?? components
    .flatMap(item => names(item).filter(alias => alias.length >= 3 && normalized.startsWith(`${alias} `)).map(alias => ({item, alias})))
    .sort((left, right) => right.alias.length - left.alias.length)[0]?.item;
  return component?.id ?? normalized;
}

export function sameMarketplaceComponent(left, right) {
  return marketplaceComponentKey(left) === marketplaceComponentKey(right);
}

export function getAvailableMarketplaceInventory(listings = []) {
  const quantities = new Map();
  for (const listing of listings) {
    if (listing.status !== 'AVAILABLE' || Number(listing.available_quantity) <= 0) continue;
    const componentId = marketplaceComponentKey(listing.component_name);
    if (!components.some(component => component.id === componentId)) continue;
    quantities.set(componentId, (quantities.get(componentId) ?? 0) + Number(listing.available_quantity));
  }
  return [...quantities].map(([componentId, quantity]) => ({ componentId, quantity }));
}
