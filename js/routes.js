/** Hash routes for Buck and Bacon V 1.2. */

export function parseRoute(hash) {
  const raw = String(hash || "#/").replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "butchering" };

  const head = parts[0];
  if (head === "butchering") {
    if (parts[1] === "tools") return { name: "butch-tools" };
    if (parts[1] && parts[2]) {
      return { name: "cut", animalId: parts[1], cutId: parts[2] };
    }
    if (parts[1]) return { name: "animal", animalId: parts[1] };
    return { name: "butchering" };
  }
  if (head === "sausage") return { name: "sausage" };
  if (head === "recipe") {
    if (!parts[1]) return { name: "sausage" };
    return { name: "recipe", recipeId: parts[1] };
  }
  if (head === "jerky") {
    if (parts[1]) return { name: "jerky-topic", topicId: parts[1] };
    return { name: "jerky" };
  }
  if (head === "cure") return { name: "cure" };
  if (head === "tools") return { name: "tools" };
  if (head === "about") return { name: "about" };
  return { name: "butchering" };
}

export function hashFor(route) {
  if (!route || !route.name) return "#/butchering";
  switch (route.name) {
    case "butchering":
      return "#/butchering";
    case "butch-tools":
      return "#/butchering/tools";
    case "animal":
      return `#/butchering/${route.animalId}`;
    case "cut":
      return `#/butchering/${route.animalId}/${route.cutId}`;
    case "sausage":
      return "#/sausage";
    case "recipe":
      return `#/recipe/${route.recipeId}`;
    case "jerky":
      return "#/jerky";
    case "jerky-topic":
      return `#/jerky/${route.topicId}`;
    case "cure":
      return "#/cure";
    case "tools":
      return "#/tools";
    case "about":
      return "#/about";
    default:
      return "#/butchering";
  }
}

export function backRoute(route) {
  if (!route) return { name: "butchering" };
  if (route.name === "cut") return { name: "animal", animalId: route.animalId };
  if (route.name === "animal" || route.name === "butch-tools") {
    return { name: "butchering" };
  }
  if (route.name === "recipe" || route.name === "batch" || route.name === "hamburger") {
    return { name: "sausage" };
  }
  if (route.name === "jerky-topic") return { name: "jerky" };
  if (route.name === "sausage" || route.name === "jerky" || route.name === "cure") {
    return { name: "butchering" };
  }
  if (route.name === "tools" || route.name === "about") return { name: "butchering" };
  return { name: "butchering" };
}

export function isButcheringRoute(route) {
  return (
    route &&
    (route.name === "butchering" ||
      route.name === "animal" ||
      route.name === "cut" ||
      route.name === "butch-tools")
  );
}
