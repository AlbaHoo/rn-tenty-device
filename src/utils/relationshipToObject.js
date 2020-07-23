function relationshipToObject(resource, included, key, optional) {
  if (!resource.relationships) {
    if (!optional) {
      console.error(`Failed to traverse relationship named '${key}' because resource does not contain any relationships.`, resource);
    }
    return null;
  }

  const relationship = resource.relationships[key];
  if (!relationship || !relationship.data) {
    return null;
  }

  const data = relationship.data;
  if ((typeof data !== 'object') || Array.isArray(data)) {
    if (!optional) {
      console.error(`Failed to traverse relationship named '${key}' because relationship is not an object.`, resource);
    }
    return null;
  }

  const id = data.id;
  const dataType = data.type;
  const relatedResource = included.find((candidate) => (candidate.id === id && candidate.type === dataType));
  if (!relatedResource) {
    if (!optional) {
      console.error(`Failed to find resource with ID '${id}' and Type: ${dataType} in included resources.`, included);
    }
    return null;
  }

  return relatedResource;
}

export default relationshipToObject;

