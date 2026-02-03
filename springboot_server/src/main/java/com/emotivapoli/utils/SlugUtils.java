package com.emotivapoli.utils;

import java.util.Random;

public class SlugUtils {

    private static final Random random = new Random();

    /**
     * Generar slug con 4 números aleatorios al final
     */
    public static String generateSlug(String... parts) {
        String combined = String.join(" ", parts);
        String baseSlug = combined.toLowerCase()
                .replaceAll("[áàäâ]", "a")
                .replaceAll("[éèëê]", "e")
                .replaceAll("[íìïî]", "i")
                .replaceAll("[óòöô]", "o")
                .replaceAll("[úùüû]", "u")
                .replaceAll("ñ", "n")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        
        // Añadir 4 números aleatorios al final
        int randomNumber = 1000 + random.nextInt(9000); // Genera un número entre 1000 y 9999
        return baseSlug + "-" + randomNumber;
    }
}

