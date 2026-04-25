package com.zving.contentsecurity.schema;

import com.zving.framework.data.*;
import com.zving.framework.orm.*;
import com.zving.framework.utility.*;
import com.zving.framework.annotation.dao.*;
import java.util.*;

/**
 * <b>ZSCategory(分类表)</b><br>
 * 内容分类管理<br>
 * PrimaryKeys: <b>ID</b><br>
 */
@Table(value="ZSCategory",comment="分类表")
@Indexes("PK_ZSCategory:ID")
public class ZSCategory extends DAO<ZSCategory> {
	private static final long serialVersionUID = 1L;

	@Column(name = "ID", comment="分类ID", type = DataTypes.LONG, mandatory = true, pk = true)
	protected Long ID;

	@Column(name = "CategoryName", comment="分类名称", type = DataTypes.STRING, length = 100, mandatory = true)
	protected String CategoryName;

	@Column(name = "OrderFlag", comment="排序号", type = DataTypes.LONG)
	protected Long OrderFlag;

	@Column(name = "AddTime", comment="增加时间", type = DataTypes.DATETIME, mandatory = true)
	protected java.util.Date AddTime;

	@Column(name = "AddUser", comment="增加人", type = DataTypes.STRING, length = 200, mandatory = true)
	protected String AddUser;

	@Column(name = "ModifyTime", comment="修改时间", type = DataTypes.DATETIME)
	protected java.util.Date ModifyTime;

	@Column(name = "ModifyUser", comment="修改人", type = DataTypes.STRING, length = 200)
	protected String ModifyUser;

	/**
	 * <b>ID(分类ID)</b>,<b>LONG</b>,<b>primary key</b>,<b>mandatory</b><br>
	 */
	public long getID() {
		if(ID==null){return 0;}
		return ID;
	}

	/**
	 * <b>ID(分类ID)</b>, <b>LONG</b>, part of <b>Primary Keys</b>, <b>mandatory</b><br>
	 */
	public void setID(long ID) {
		this.ID = Long.valueOf(ID);
	}

	/**
	 * <b>ID(分类ID)</b>, <b>LONG</b>, , part of <b>Primary Keys</b>, <b>mandatory</b><br>
	 */
	public void setID(String ID) {
		if (StringUtil.isNull(ID)) {
			this.ID = null;
			return;
		}
		this.ID = Long.valueOf(ID);
	}

	/**
	 * <b>CategoryName(分类名称)</b>,<b>STRING</b>,<b>mandatory</b><br>
	 */
	public String getCategoryName() {
		return CategoryName;
	}

	/**
	 * <b>CategoryName(分类名称)</b>, <b>STRING</b>, <b>mandatory</b><br>
	 */
	public void setCategoryName(String categoryName) {
		this.CategoryName = categoryName;
	}

	/**
	 * <b>OrderFlag(排序号)</b>,<b>LONG</b><br>
	 */
	public long getOrderFlag() {
		if(OrderFlag==null){return 0;}
		return OrderFlag;
	}

	/**
	 * <b>OrderFlag(排序号)</b>, <b>LONG</b><br>
	 */
	public void setOrderFlag(long orderFlag) {
		this.OrderFlag = Long.valueOf(orderFlag);
	}

	/**
	 * <b>OrderFlag(排序号)</b>, <b>LONG</b>, <br>
	 */
	public void setOrderFlag(String orderFlag) {
		if (StringUtil.isNull(orderFlag)) {
			this.OrderFlag = null;
			return;
		}
		this.OrderFlag = Long.valueOf(orderFlag);
	}

	/**
	 * <b>AddTime(增加时间)</b>,<b>DATETIME</b>,<b>mandatory</b><br>
	 */
	public java.util.Date getAddTime() {
		return AddTime;
	}

	/**
	 * <b>AddTime(增加时间)</b>, <b>DATETIME</b>, <b>mandatory</b><br>
	 */
	public void setAddTime(java.util.Date addTime) {
		this.AddTime = addTime;
	}

	/**
	 * <b>AddTime(增加时间)</b>, <b>DATETIME</b>, , <b>mandatory</b><br>
	 */
	public void setAddTime(String addTime) {
		if (StringUtil.isNull(addTime)) {
			this.AddTime = null;
			return;
		}
		this.AddTime = DateUtil.parseDateTime(addTime);
	}

	/**
	 * <b>AddUser(增加人)</b>,<b>STRING</b>,<b>mandatory</b><br>
	 */
	public String getAddUser() {
		return AddUser;
	}

	/**
	 * <b>AddUser(增加人)</b>, <b>STRING</b>, <b>mandatory</b><br>
	 */
	public void setAddUser(String addUser) {
		this.AddUser = addUser;
	}

	/**
	 * <b>ModifyTime(修改时间)</b>,<b>DATETIME</b><br>
	 */
	public java.util.Date getModifyTime() {
		return ModifyTime;
	}

	/**
	 * <b>ModifyTime(修改时间)</b>, <b>DATETIME</b><br>
	 */
	public void setModifyTime(java.util.Date modifyTime) {
		this.ModifyTime = modifyTime;
	}

	/**
	 * <b>ModifyTime(修改时间)</b>, <b>DATETIME</b>, <br>
	 */
	public void setModifyTime(String modifyTime) {
		if (StringUtil.isNull(modifyTime)) {
			this.ModifyTime = null;
			return;
		}
		this.ModifyTime = DateUtil.parseDateTime(modifyTime);
	}

	/**
	 * <b>ModifyUser(修改人)</b>,<b>STRING</b><br>
	 */
	public String getModifyUser() {
		return ModifyUser;
	}

	/**
	 * <b>ModifyUser(修改人)</b>, <b>STRING</b><br>
	 */
	public void setModifyUser(String modifyUser) {
		this.ModifyUser = modifyUser;
	}

}
