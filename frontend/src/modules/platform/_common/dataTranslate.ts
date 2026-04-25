function DataTransfer() {
}

DataTransfer.treeToArray = function (data: any[], parent, level, expandedAll) {
  let tmp: any[] = []
  Array.from(data).forEach((record) => {
    if (record._expanded === undefined) {
      record._expanded = expandedAll
    }
    if (record.checked === undefined) {
      record.checked = false
    }
    if (parent) {
      record._parent = parent
    }
    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    record._level = _level
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = DataTransfer.treeToArray(record.children, record, _level, expandedAll)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}

export default {
  MSDataTransfer: DataTransfer,
}
