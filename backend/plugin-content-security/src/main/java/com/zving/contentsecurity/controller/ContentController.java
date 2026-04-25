package com.zving.contentsecurity.controller;

import java.util.Date;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.zving.contentsecurity.dto.ContentSaveRequest;
import com.zving.contentsecurity.menu.CSMenus;
import com.zving.contentsecurity.schema.ZSContent;
import com.zving.contentsecurity.util.CharMappingUtil;
import com.zving.framework.Report;
import com.zving.framework.User;
import com.zving.framework.annotation.Priv;
import com.zving.framework.data.DataTable;
import com.zving.framework.data.MaxNumberGenerator;
import com.zving.framework.data.Q;
import com.zving.framework.model.PagingDataReport;
import com.zving.framework.orm.DAOSet;
import com.zving.framework.utility.StringUtil;

@RestController
@RequestMapping("/ui/cs/contents")
public class ContentController {

	@Priv(CSMenus.ContentSecurity.ContentMenu.view)
	@GetMapping("")
	public PagingDataReport<DataTable> list(
			@RequestParam(name = "pageIndex", defaultValue = "1") int pageIndex,
			@RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "categoryID", required = false) Long categoryID,
			@RequestParam(name = "status", required = false) Integer status) {

		Q countQ = new Q("select count(*) from ZSContent c where 1=1 ");
		Q queryQ = new Q("select c.ID as id, c.Title as title, c.CategoryID as categoryID, c.Status as status, "
				+ "c.AddTime as addTime, c.AddUser as addUser, "
				+ "cat.CategoryName as categoryName "
				+ "from ZSContent c left join ZSCategory cat on c.CategoryID = cat.ID where 1=1 ");

		if (StringUtil.isNotEmpty(keyword)) {
			countQ.append(" and (c.Title like ? or c.OriginalContent like ?) ", "%" + keyword + "%",
					"%" + keyword + "%");
			queryQ.append(" and (c.Title like ? or c.OriginalContent like ?) ", "%" + keyword + "%",
					"%" + keyword + "%");
		}
		if (categoryID != null) {
			countQ.append(" and c.CategoryID = ? ", categoryID);
			queryQ.append(" and c.CategoryID = ? ", categoryID);
		}
		if (status != null) {
			countQ.append(" and c.Status = ? ", status);
			queryQ.append(" and c.Status = ? ", status);
		}

		int total = countQ.executeInt();
		queryQ.append(" order by c.ID desc ");
		DataTable dt = queryQ.executePagedDataTable(pageSize, pageIndex - 1);

		return Report.pagingData(dt, total, pageSize, pageIndex);
	}

	@Priv(CSMenus.ContentSecurity.ContentMenu.view)
	@GetMapping("/{id}")
	public Report<DataTable> get(@PathVariable("id") long id) {
		Q q = new Q("select c.ID as id, c.Title as title, c.OriginalContent as originalContent, "
				+ "c.EncryptedContent as encryptedContent, c.CategoryID as categoryID, c.Status as status, "
				+ "c.AddTime as addTime, c.AddUser as addUser, c.ModifyTime as modifyTime, c.ModifyUser as modifyUser, "
				+ "cat.CategoryName as categoryName from ZSContent c left join ZSCategory cat on c.CategoryID = cat.ID where c.ID = ? ", id);
		DataTable dt = q.executeDataTable();
		if (dt.getRowCount() == 0) {
			return Report.fail("内容不存在");
		}
		return Report.data(dt);
	}

	@Priv(CSMenus.ContentSecurity.ContentMenu.add)
	@PostMapping("")
	public Report<ZSContent> create(@Valid @RequestBody ContentSaveRequest request) {
		ZSContent dao = new ZSContent();
		dao.setID(MaxNumberGenerator.generate("ZSContent"));
		dao.setTitle(request.getTitle());
		dao.setOriginalContent(request.getOriginalContent());
		dao.setEncryptedContent(CharMappingUtil.encrypt(request.getOriginalContent()));
		if (request.getCategoryID() != null) {
			dao.setCategoryID(request.getCategoryID());
		}
		dao.setStatus(request.getStatus() != null ? request.getStatus() : 0);
		dao.setAddTime(new Date());
		dao.setAddUser(User.getUserName());
		if (!dao.insert()) {
			return Report.fail("新增失败");
		}
		return Report.data(dao);
	}

	@Priv(CSMenus.ContentSecurity.ContentMenu.edit)
	@PutMapping("/{id}")
	public Report<ZSContent> update(@PathVariable("id") long id,
			@Valid @RequestBody ContentSaveRequest request) {
		ZSContent dao = new ZSContent();
		dao.setID(id);
		if (!dao.fill()) {
			return Report.fail("内容不存在");
		}
		dao.setTitle(request.getTitle());
		dao.setOriginalContent(request.getOriginalContent());
		dao.setEncryptedContent(CharMappingUtil.encrypt(request.getOriginalContent()));
		if (request.getCategoryID() != null) {
			dao.setCategoryID(request.getCategoryID());
		}
		if (request.getStatus() != null) {
			dao.setStatus(request.getStatus());
		}
		dao.setModifyTime(new Date());
		dao.setModifyUser(User.getUserName());
		if (!dao.update()) {
			return Report.fail("修改失败");
		}
		return Report.data(dao);
	}

	@Priv(CSMenus.ContentSecurity.ContentMenu.delete)
	@DeleteMapping("/{id}")
	public Report<Integer> delete(@PathVariable("id") long id) {
		ZSContent dao = new ZSContent();
		dao.setID(id);
		if (!dao.fill()) {
			return Report.data(0);
		}
		boolean ok = dao.delete();
		return ok ? Report.data(1) : Report.fail("删除失败");
	}
}
