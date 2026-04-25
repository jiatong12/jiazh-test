# 内容加密展示 API

## 文档信息
| 项目 | 内容 |
| --- | --- |
| 接口类别 | `ui` |
| 功能分类 | `content-security` |
| 创建时间 | `2026-04-25 17:30:00` |
| 最后修改时间 | `2026-04-25 17:30:00` |
| 维护人 | `AI` |

## 接口清单
| 名称 | 方法 | 路径 | 权限 | 说明 |
| --- | --- | --- | --- | --- |
| 新增内容 | POST | `/ui/cs/contents` | 需要登录 | 新增加密内容 |
| 查询内容列表 | GET | `/ui/cs/contents` | 需要登录 | 分页查询，支持关键字搜索 |
| 查询内容详情 | GET | `/ui/cs/contents/{id}` | 需要登录 | 获取单条内容详情 |
| 修改内容 | PUT | `/ui/cs/contents/{id}` | 需要登录 | 修改内容 |
| 删除内容 | DELETE | `/ui/cs/contents/{id}` | 需要登录 | 删除内容 |
| 新增分类 | POST | `/ui/cs/categories` | 需要登录 | 新增分类 |
| 查询分类列表 | GET | `/ui/cs/categories` | 需要登录 | 查询所有分类 |
| 修改分类 | PUT | `/ui/cs/categories/{id}` | 需要登录 | 修改分类 |
| 删除分类 | DELETE | `/ui/cs/categories/{id}` | 需要登录 | 删除分类 |
| 下载自定义字体 | GET | `/front/cs/font` | 无需登录 | 下载混淆字体文件 |

---

## 1. 新增内容

### 1.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 请求路径 | `/ui/cs/contents` |
| 权限要求 | 需要登录 |
| 说明 | 新增加密内容，后端自动生成加密内容 |

### 1.2 请求参数
#### Body 参数（JSON）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| title | string | 是 | 内容标题，最长200字 | `"机密文件A"` |
| originalContent | string | 是 | 原文内容 | `"这是一段需要加密的内容"` |
| categoryID | long | 否 | 分类ID | `1` |
| status | int | 否 | 状态：0草稿，1已发布，默认0 | `0` |

### 1.3 响应说明
```json
{
  "status": 1,
  "data": {
    "id": 1,
    "title": "机密文件A",
    "originalContent": "这是一段需要加密的内容",
    "encryptedContent": "丂乂丅丆...",
    "categoryID": 1,
    "status": 0,
    "addTime": "2026-04-25 17:30:00",
    "addUser": "admin"
  },
  "message": ""
}
```

### 1.4 响应数据字段说明
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容主键 |
| title | string | 是 | 内容标题 |
| originalContent | string | 是 | 原文内容 |
| encryptedContent | string | 是 | 加密后内容（用于前端展示） |
| categoryID | long | 否 | 所属分类ID |
| status | int | 是 | 状态：0草稿，1已发布 |
| addTime | string | 是 | 创建时间 |
| addUser | string | 是 | 创建人 |

---

## 2. 查询内容列表

### 2.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 请求路径 | `/ui/cs/contents` |
| 权限要求 | 需要登录 |
| 说明 | 分页查询内容列表，支持按关键字和分类筛选 |

### 2.2 请求参数
#### Query 参数
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| pageIndex | int | 否 | `1` | 页码 |
| pageSize | int | 否 | `20` | 每页条数 |
| keyword | string | 否 | - | 搜索关键字（按标题和原文内容模糊匹配） |
| categoryID | long | 否 | - | 按分类筛选 |
| status | int | 否 | - | 按状态筛选 |

### 2.3 响应说明
```json
{
  "status": 1,
  "data": [
    {
      "id": 1,
      "title": "机密文件A",
      "categoryID": 1,
      "categoryName": "内部文件",
      "status": 1,
      "addTime": "2026-04-25 17:30:00",
      "addUser": "admin"
    }
  ],
  "total": 100,
  "pageIndex": 1,
  "pageSize": 20,
  "message": ""
}
```

### 2.4 响应数据字段说明
列表中每项字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容主键 |
| title | string | 是 | 内容标题 |
| categoryID | long | 否 | 分类ID |
| categoryName | string | 否 | 分类名称 |
| status | int | 是 | 状态 |
| addTime | string | 是 | 创建时间 |
| addUser | string | 是 | 创建人 |

---

## 3. 查询内容详情

### 3.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 请求路径 | `/ui/cs/contents/{id}` |
| 权限要求 | 需要登录 |
| 说明 | 获取单条内容详情，包含原文和加密内容 |

### 3.2 请求参数
#### Path 参数
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容ID |

### 3.3 响应说明
```json
{
  "status": 1,
  "data": {
    "id": 1,
    "title": "机密文件A",
    "originalContent": "这是一段需要加密的内容",
    "encryptedContent": "丂乂丅丆...",
    "categoryID": 1,
    "categoryName": "内部文件",
    "status": 1,
    "addTime": "2026-04-25 17:30:00",
    "addUser": "admin",
    "modifyTime": "2026-04-25 18:00:00",
    "modifyUser": "admin"
  },
  "message": ""
}
```

### 3.4 响应数据字段说明
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容主键 |
| title | string | 是 | 内容标题 |
| originalContent | string | 是 | 原文内容 |
| encryptedContent | string | 是 | 加密内容 |
| categoryID | long | 否 | 分类ID |
| categoryName | string | 否 | 分类名称 |
| status | int | 是 | 状态 |
| addTime | string | 是 | 创建时间 |
| addUser | string | 是 | 创建人 |
| modifyTime | string | 否 | 修改时间 |
| modifyUser | string | 否 | 修改人 |

---

## 4. 修改内容

### 4.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 请求路径 | `/ui/cs/contents/{id}` |
| 权限要求 | 需要登录 |
| 说明 | 修改内容，后端自动重新生成加密内容 |

### 4.2 请求参数
#### Path 参数
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容ID |

#### Body 参数（JSON）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| title | string | 是 | 内容标题 | `"机密文件A"` |
| originalContent | string | 是 | 原文内容 | `"修改后的内容"` |
| categoryID | long | 否 | 分类ID | `1` |
| status | int | 否 | 状态 | `1` |

### 4.3 响应说明
```json
{
  "status": 1,
  "data": {
    "id": 1,
    "title": "机密文件A",
    "originalContent": "修改后的内容",
    "encryptedContent": "丂乂...",
    "categoryID": 1,
    "status": 1,
    "addTime": "2026-04-25 17:30:00",
    "addUser": "admin",
    "modifyTime": "2026-04-25 19:00:00",
    "modifyUser": "admin"
  },
  "message": ""
}
```

响应字段同"查询内容详情"。

---

## 5. 删除内容

### 5.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 请求路径 | `/ui/cs/contents/{id}` |
| 权限要求 | 需要登录 |
| 说明 | 删除指定内容，幂等操作 |

### 5.2 请求参数
#### Path 参数
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 内容ID |

### 5.3 响应说明
```json
{
  "status": 1,
  "data": 1,
  "message": ""
}
```

data 返回实际删除行数。如果目标不存在按幂等处理，`data=0`。

---

## 6. 新增分类

### 6.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `POST` |
| 请求路径 | `/ui/cs/categories` |
| 权限要求 | 需要登录 |
| 说明 | 新增内容分类 |

### 6.2 请求参数
#### Body 参数（JSON）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| categoryName | string | 是 | 分类名称，最长100字 | `"内部文件"` |
| orderFlag | long | 否 | 排序号 | `1` |

### 6.3 响应说明
```json
{
  "status": 1,
  "data": {
    "id": 1,
    "categoryName": "内部文件",
    "orderFlag": 1,
    "addTime": "2026-04-25 17:30:00",
    "addUser": "admin"
  },
  "message": ""
}
```

### 6.4 响应数据字段说明
| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 分类主键 |
| categoryName | string | 是 | 分类名称 |
| orderFlag | long | 否 | 排序号 |
| addTime | string | 是 | 创建时间 |
| addUser | string | 是 | 创建人 |

---

## 7. 查询分类列表

### 7.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 请求路径 | `/ui/cs/categories` |
| 权限要求 | 需要登录 |
| 说明 | 查询所有分类 |

### 7.2 请求参数
无额外参数。

### 7.3 响应说明
```json
{
  "status": 1,
  "data": [
    {
      "id": 1,
      "categoryName": "内部文件",
      "orderFlag": 1,
      "addTime": "2026-04-25 17:30:00",
      "addUser": "admin"
    }
  ],
  "message": ""
}
```

### 7.4 响应数据字段说明
同"新增分类"响应字段。

---

## 8. 修改分类

### 8.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `PUT` |
| 请求路径 | `/ui/cs/categories/{id}` |
| 权限要求 | 需要登录 |
| 说明 | 修改分类信息 |

### 8.2 请求参数
#### Path 参数
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 分类ID |

#### Body 参数（JSON）
| 字段 | 类型 | 必填 | 说明 | 示例 |
| --- | --- | --- | --- | --- |
| categoryName | string | 是 | 分类名称 | `"公开文件"` |
| orderFlag | long | 否 | 排序号 | `2` |

### 8.3 响应说明
```json
{
  "status": 1,
  "data": {
    "id": 1,
    "categoryName": "公开文件",
    "orderFlag": 2,
    "addTime": "2026-04-25 17:30:00",
    "addUser": "admin",
    "modifyTime": "2026-04-25 18:00:00",
    "modifyUser": "admin"
  },
  "message": ""
}
```

---

## 9. 删除分类

### 9.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `DELETE` |
| 请求路径 | `/ui/cs/categories/{id}` |
| 权限要求 | 需要登录 |
| 说明 | 删除分类，若分类下存在内容则不允许删除 |

### 9.2 请求参数
#### Path 参数
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | long | 是 | 分类ID |

### 9.3 响应说明
```json
{
  "status": 1,
  "data": 1,
  "message": ""
}
```

若分类下存在内容，返回：
```json
{
  "status": 0,
  "data": 0,
  "message": "该分类下存在内容，无法删除"
}
```

---

## 10. 下载自定义字体

### 10.1 基本信息
| 项目 | 内容 |
| --- | --- |
| 请求方法 | `GET` |
| 请求路径 | `/front/cs/font` |
| 权限要求 | 无需登录 |
| 说明 | 下载混淆字体文件（WOFF格式），前端加载此字体用于加密内容展示 |

### 10.2 请求参数
无。

### 10.3 响应说明
返回字体文件二进制流，Content-Type 为 `font/woff`。
前端通过 `@font-face` 加载该字体，对加密内容区域应用此字体族。
