package com.zving.contentsecurity.schema;

import com.zving.framework.data.*;
import com.zving.framework.orm.*;
import com.zving.framework.utility.*;
import com.zving.framework.annotation.dao.*;
import java.util.*;

/**
 * <b>ZSContent(内容表)</b><br>
 * 加密内容管理，存储原文和加密内容<br>
 * PrimaryKeys: <b>ID</b><br>
 */
@Table(value="ZSContent",comment="内容表")
@Indexes("PK_ZSContent:ID;IDX_ZSContent_Title:Title;IDX_ZSContent_CategoryID:CategoryID;IDX_ZSContent_Status:Status")
public class ZSContent extends DAO<ZSContent> {
	private static final long serialVersionUID = 1L;

	@Column(name = "ID", comment="内容ID", type = DataTypes.LONG, mandatory = true, pk = true)
	protected Long ID;

	@Column(name = "Title", comment="标题", type = DataTypes.STRING, length = 200, mandatory = true)
	protected String Title;

	@Column(name = "OriginalContent", comment="原文内容", type = DataTypes.CLOB, mandatory = true)
	protected String OriginalContent;

	@Column(name = "EncryptedContent", comment="加密内容", type = DataTypes.CLOB, mandatory = true)
	protected String EncryptedContent;

	@Column(name = "CategoryID", comment="分类ID", type = DataTypes.LONG)
	protected Long CategoryID;

	@Column(name = "Status", comment="状态", type = DataTypes.INTEGER, mandatory = true)
	protected Integer Status;

	@Column(name = "AddTime", comment="增加时间", type = DataTypes.DATETIME, mandatory = true)
	protected java.util.Date AddTime;

	@Column(name = "AddUser", comment="增加人", type = DataTypes.STRING, length = 200, mandatory = true)
	protected String AddUser;

	@Column(name = "ModifyTime", comment="修改时间", type = DataTypes.DATETIME)
	protected java.util.Date ModifyTime;

	@Column(name = "ModifyUser", comment="修改人", type = DataTypes.STRING, length = 200)
	protected String ModifyUser;

	/**
	 * <b>ID(内容ID)</b>,<b>LONG</b>,<b>primary key</b>,<b>mandatory</b><br>
	 */
	public long getID() {
		if(ID==null){return 0;}
		return ID;
	}

	/**
	 * <b>ID(内容ID)</b>, <b>LONG</b>, part of <b>Primary Keys</b>, <b>mandatory</b><br>
	 */
	public void setID(long ID) {
		this.ID = Long.valueOf(ID);
	}

	/**
	 * <b>ID(内容ID)</b>, <b>LONG</b>, , part of <b>Primary Keys</b>, <b>mandatory</b><br>
	 */
	public void setID(String ID) {
		if (StringUtil.isNull(ID)) {
			this.ID = null;
			return;
		}
		this.ID = Long.valueOf(ID);
	}

	/**
	 * <b>Title(标题)</b>,<b>STRING</b>,<b>mandatory</b><br>
	 */
	public String getTitle() {
		return Title;
	}

	/**
	 * <b>Title(标题)</b>, <b>STRING</b>, <b>mandatory</b><br>
	 */
	public void setTitle(String title) {
		this.Title = title;
	}

	/**
	 * <b>OriginalContent(原文内容)</b>,<b>CLOB</b>,<b>mandatory</b><br>
	 */
	public String getOriginalContent() {
		return OriginalContent;
	}

	/**
	 * <b>OriginalContent(原文内容)</b>, <b>CLOB</b>, <b>mandatory</b><br>
	 */
	public void setOriginalContent(String originalContent) {
		this.OriginalContent = originalContent;
	}

	/**
	 * <b>EncryptedContent(加密内容)</b>,<b>CLOB</b>,<b>mandatory</b><br>
	 */
	public String getEncryptedContent() {
		return EncryptedContent;
	}

	/**
	 * <b>EncryptedContent(加密内容)</b>, <b>CLOB</b>, <b>mandatory</b><br>
	 */
	public void setEncryptedContent(String encryptedContent) {
		this.EncryptedContent = encryptedContent;
	}

	/**
	 * <b>CategoryID(分类ID)</b>,<b>LONG</b><br>
	 */
	public long getCategoryID() {
		if(CategoryID==null){return 0;}
		return CategoryID;
	}

	/**
	 * <b>CategoryID(分类ID)</b>, <b>LONG</b><br>
	 */
	public void setCategoryID(long categoryID) {
		this.CategoryID = Long.valueOf(categoryID);
	}

	/**
	 * <b>CategoryID(分类ID)</b>, <b>LONG</b>, <br>
	 */
	public void setCategoryID(String categoryID) {
		if (StringUtil.isNull(categoryID)) {
			this.CategoryID = null;
			return;
		}
		this.CategoryID = Long.valueOf(categoryID);
	}

	/**
	 * <b>Status(状态)</b>,<b>INTEGER</b>,<b>mandatory</b><br>
	 */
	public int getStatus() {
		if(Status==null){return 0;}
		return Status;
	}

	/**
	 * <b>Status(状态)</b>, <b>INTEGER</b>, <b>mandatory</b><br>
	 */
	public void setStatus(int status) {
		this.Status = Integer.valueOf(status);
	}

	/**
	 * <b>Status(状态)</b>, <b>INTEGER</b>, , <b>mandatory</b><br>
	 */
	public void setStatus(String status) {
		if (StringUtil.isNull(status)) {
			this.Status = null;
			return;
		}
		this.Status = Integer.valueOf(status);
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
