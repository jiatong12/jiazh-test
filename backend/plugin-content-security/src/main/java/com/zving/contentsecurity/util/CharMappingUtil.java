package com.zving.contentsecurity.util;

public class CharMappingUtil {

	private static final int CJK_START = 0x4E00;
	private static final int CJK_END = 0x9FFF;
	private static final int SHIFT = 1000;

	private CharMappingUtil() {
	}

	public static String encrypt(String original) {
		if (original == null || original.isEmpty()) {
			return original;
		}
		StringBuilder sb = new StringBuilder(original.length());
		for (int i = 0; i < original.length(); i++) {
			char c = original.charAt(i);
			sb.append(mapChar(c));
		}
		return sb.toString();
	}

	static char mapChar(char c) {
		if (c >= CJK_START && c <= CJK_END) {
			int offset = c - CJK_START;
			int shifted = (offset + SHIFT) % (CJK_END - CJK_START + 1);
			return (char) (CJK_START + shifted);
		}
		return c;
	}

	static char unmapChar(char c) {
		if (c >= CJK_START && c <= CJK_END) {
			int offset = c - CJK_START;
			int shifted = (offset - SHIFT + (CJK_END - CJK_START + 1)) % (CJK_END - CJK_START + 1);
			return (char) (CJK_START + shifted);
		}
		return c;
	}
}
