package com.zving.contentsecurity.menu;

import org.springframework.stereotype.Component;
import com.zving.framework.security.privilege.AutoRegistMenuClass;
import com.zving.framework.security.privilege.annotation.Action;
import com.zving.framework.security.privilege.annotation.Menu;

@Component
public class CSMenus extends AutoRegistMenuClass {
	@Menu(value = "内容安全", code = "cs", order = 0)
	public interface ContentSecurity {
		@Menu(value = "内容管理", code = "cs/content", order = 0)
		interface ContentMenu {
			@Action("查询")
			String view = "cs/content:view";
			@Action("新增")
			String add = "cs/content:add";
			@Action("修改")
			String edit = "cs/content:edit";
			@Action("删除")
			String delete = "cs/content:delete";
		}

		@Menu(value = "分类管理", code = "cs/category", order = 1)
		interface CategoryMenu {
			@Action("查询")
			String view = "cs/category:view";
			@Action("新增")
			String add = "cs/category:add";
			@Action("修改")
			String edit = "cs/category:edit";
			@Action("删除")
			String delete = "cs/category:delete";
		}
	}
}
