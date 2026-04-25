package com.zving.contentsecurity.controller;

import java.util.Date;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.zving.contentsecurity.dto.CategorySaveRequest;
import com.zving.contentsecurity.menu.CSMenus;
import com.zving.contentsecurity.schema.ZSContent;
import com.zving.contentsecurity.schema.ZSCategory;
import com.zving.framework.Report;
import com.zving.framework.User;
import com.zving.framework.annotation.Priv;
import com.zving.framework.data.MaxNumberGenerator;
import com.zving.framework.data.Q;
import com.zving.framework.data.DataTable;
import com.zving.framework.orm.DAOSet;

@RestController
@RequestMapping("/ui/cs/categories")
public class CategoryController {

	@Priv(CSMenus.ContentSecurity.CategoryMenu.view)
	@GetMapping("")
	public Report<DAOSet<ZSCategory>> list() {
		ZSCategory dao = new ZSCategory();
		return Report.data(dao.query());
	}

	@Priv(CSMenus.ContentSecurity.CategoryMenu.view)
	@GetMapping("/{id}")
	public Report<ZSCategory> get(@PathVariable("id") long id) {
		ZSCategory dao = new ZSCategory();
		dao.setID(id);
		if (!dao.fill()) {
			return Report.fail("分类不存在");
		}
		return Report.data(dao);
	}

	@Priv(CSMenus.ContentSecurity.CategoryMenu.add)
	@PostMapping("")
	public Report<ZSCategory> create(@Valid @RequestBody CategorySaveRequest request) {
		ZSCategory dao = new ZSCategory();
		dao.setID(MaxNumberGenerator.generate("ZSCategory"));
		dao.setCategoryName(request.getCategoryName());
		if (request.getOrderFlag() != null) {
			dao.setOrderFlag(request.getOrderFlag());
		} else {
			dao.setOrderFlag(MaxNumberGenerator.generate("ZSCategoryOrderFlag"));
		}
		dao.setAddTime(new Date());
		dao.setAddUser(User.getUserName());
		if (!dao.insert()) {
			return Report.fail("新增失败");
		}
		return Report.data(dao);
	}

	@Priv(CSMenus.ContentSecurity.CategoryMenu.edit)
	@PutMapping("/{id}")
	public Report<ZSCategory> update(@PathVariable("id") long id,
			@Valid @RequestBody CategorySaveRequest request) {
		ZSCategory dao = new ZSCategory();
		dao.setID(id);
		if (!dao.fill()) {
			return Report.fail("分类不存在");
		}
		dao.setCategoryName(request.getCategoryName());
		if (request.getOrderFlag() != null) {
			dao.setOrderFlag(request.getOrderFlag());
		}
		dao.setModifyTime(new Date());
		dao.setModifyUser(User.getUserName());
		if (!dao.update()) {
			return Report.fail("修改失败");
		}
		return Report.data(dao);
	}

	@Priv(CSMenus.ContentSecurity.CategoryMenu.delete)
	@DeleteMapping("/{id}")
	public Report<Integer> delete(@PathVariable("id") long id) {
		ZSCategory dao = new ZSCategory();
		dao.setID(id);
		if (!dao.fill()) {
			return Report.data(0);
		}
		Q checkQ = new Q("select count(*) from ZSContent where CategoryID = ? ", id);
		if (checkQ.executeInt() > 0) {
			return Report.fail("该分类下存在内容，无法删除");
		}
		boolean ok = dao.delete();
		return ok ? Report.data(1) : Report.fail("删除失败");
	}
}
