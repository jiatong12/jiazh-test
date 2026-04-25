package com.zving.contentsecurity.controller;

import java.io.IOException;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.zving.framework.annotation.Priv;

@RestController
@RequestMapping("/front/cs")
public class FontController {

	@Priv(login = false)
	@GetMapping("/font")
	public ResponseEntity<Resource> downloadFont() throws IOException {
		ClassPathResource resource = new ClassPathResource("static/font/obfuscated.woff");
		if (!resource.exists()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"obfuscated.woff\"")
				.contentType(MediaType.parseMediaType("font/woff"))
				.body(resource);
	}
}
