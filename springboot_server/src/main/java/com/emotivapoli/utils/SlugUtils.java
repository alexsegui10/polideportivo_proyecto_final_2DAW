package com.emotivapoli.utils;

public class SlugUtils {

    /**
     * Generar slug
     */
    public static String generateSlug(String... parts) {
        String combined = String.join(" ", parts);
        return combined.toLowerCase()
                .replaceAll("[áàäâ]", "a")
                .replaceAll("[éèëê]", "e")
                .replaceAll("[íìïî]", "i")
                .replaceAll("[óòöô]", "o")
                .replaceAll("[úùüû]", "u")
                .replaceAll("ñ", "n")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}
