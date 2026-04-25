function defaultGetChildren<T>(node: T): readonly T[] | undefined {
  return (node as { children?: readonly T[] }).children
}

export function findTreeNode<T>(
  tree: readonly T[] | undefined,
  matcher: (node: T) => boolean,
  getChildren: (node: T) => readonly T[] | undefined = defaultGetChildren,
): T | undefined {
  if (!tree?.length) {
    return undefined
  }

  for (const node of tree) {
    if (matcher(node)) {
      return node
    }

    const children = getChildren(node)
    if (Array.isArray(children)) {
      const target = findTreeNode(children, matcher, getChildren)
      if (target) {
        return target
      }
    }
  }

  return undefined
}
