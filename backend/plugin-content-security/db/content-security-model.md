<!-- ZCF_TABLE_MODEL_FILE -->

| 项目 | 内容 |
| --- | --- |
| 创建时间 | `2026-04-25 18:00:00` |
| 最后修改时间 | `2026-04-25 18:00:00` |
| DAO包名（可选） | `com.zving.contentsecurity.schema` |
| 说明（可选） | `内容加密展示模块数据模型` |

# 内容安全

## 内容表

### 表基础信息
| 项目 | 内容 |
| --- | --- |
| 表名称（Name） | `内容表` |
| 表代码（Code） | `ZSContent` |
| 业务说明 | `加密内容管理，存储原文和加密内容` |

### 字段信息
| 序号 | 字段中文名 | 字段代码 | 数据类型 | 长度/精度 | 主键 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `内容ID` | `ID` | `LONG` | `-` | `Y` | `Y` | `-` | `主键，使用MaxNumberGenerator.generate()生成` |
| 2 | `标题` | `Title` | `VARCHAR` | `200` | `N` | `Y` | `-` | `内容标题` |
| 3 | `原文内容` | `OriginalContent` | `CLOB` | `-` | `N` | `Y` | `-` | `原始文本内容，用于检索查询` |
| 4 | `加密内容` | `EncryptedContent` | `CLOB` | `-` | `N` | `Y` | `-` | `字库混淆后的加密文本，用于前端展示` |
| 5 | `分类ID` | `CategoryID` | `LONG` | `-` | `N` | `N` | `-` | `关联ZSCategory.ID` |
| 6 | `状态` | `Status` | `INTEGER` | `-` | `N` | `Y` | `0` | `0草稿，1已发布` |
| 7 | `增加时间` | `AddTime` | `DATETIME` | `-` | `N` | `Y` | `-` | `增加时间` |
| 8 | `增加人` | `AddUser` | `VARCHAR` | `200` | `N` | `Y` | `-` | `增加人` |
| 9 | `修改时间` | `ModifyTime` | `DATETIME` | `-` | `N` | `N` | `-` | `修改时间` |
| 10 | `修改人` | `ModifyUser` | `VARCHAR` | `200` | `N` | `N` | `-` | `修改人` |

### 索引信息
| 索引名称 | 索引类型 | 索引列 | 是否唯一 | 说明 |
| --- | --- | --- | --- | --- |
| `PK_ZSContent` | `PRIMARY KEY` | `ID` | `Y` | `主键索引` |
| `IDX_ZSContent_Title` | `NORMAL` | `Title` | `N` | `标题查询` |
| `IDX_ZSContent_CategoryID` | `NORMAL` | `CategoryID` | `N` | `分类筛选` |
| `IDX_ZSContent_Status` | `NORMAL` | `Status` | `N` | `状态筛选` |

## 分类表

### 表基础信息
| 项目 | 内容 |
| --- | --- |
| 表名称（Name） | `分类表` |
| 表代码（Code） | `ZSCategory` |
| 业务说明 | `内容分类管理` |

### 字段信息
| 序号 | 字段中文名 | 字段代码 | 数据类型 | 长度/精度 | 主键 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `分类ID` | `ID` | `LONG` | `-` | `Y` | `Y` | `-` | `主键，使用MaxNumberGenerator.generate()生成` |
| 2 | `分类名称` | `CategoryName` | `VARCHAR` | `100` | `N` | `Y` | `-` | `分类名称` |
| 3 | `排序号` | `OrderFlag` | `LONG` | `-` | `N` | `N` | `-` | `排序号，使用MaxNumberGenerator.generate()生成` |
| 4 | `增加时间` | `AddTime` | `DATETIME` | `-` | `N` | `Y` | `-` | `增加时间` |
| 5 | `增加人` | `AddUser` | `VARCHAR` | `200` | `N` | `Y` | `-` | `增加人` |
| 6 | `修改时间` | `ModifyTime` | `DATETIME` | `-` | `N` | `N` | `-` | `修改时间` |
| 7 | `修改人` | `ModifyUser` | `VARCHAR` | `200` | `N` | `N` | `-` | `修改人` |

### 索引信息
| 索引名称 | 索引类型 | 索引列 | 是否唯一 | 说明 |
| --- | --- | --- | --- | --- |
| `PK_ZSCategory` | `PRIMARY KEY` | `ID` | `Y` | `主键索引` |
