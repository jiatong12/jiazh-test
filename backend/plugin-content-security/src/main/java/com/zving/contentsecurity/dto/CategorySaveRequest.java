package com.zving.contentsecurity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategorySaveRequest {

	@NotBlank(message = "分类名称不能为空")
	@Size(max = 100, message = "分类名称最长100字")
	private String categoryName;

	private Long orderFlag;

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public Long getOrderFlag() {
		return orderFlag;
	}

	public void setOrderFlag(Long orderFlag) {
		this.orderFlag = orderFlag;
	}
}
