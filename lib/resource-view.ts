import { averageRating, findAuthorById, findCategoryById, listReviewsByResource } from "./store";
import type { Resource } from "./types";

export function enrichResource(resource: Resource) {
  return {
    resource,
    author: findAuthorById(resource.author_id),
    category: findCategoryById(resource.category_id),
    rating: averageRating(resource.id),
    reviewCount: listReviewsByResource(resource.id).length,
  };
}

export function enrichResources(resources: Resource[]) {
  return resources.map(enrichResource);
}
