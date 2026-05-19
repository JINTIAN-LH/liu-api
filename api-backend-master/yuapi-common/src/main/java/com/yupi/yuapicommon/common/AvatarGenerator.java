package com.yupi.yuapicommon.common;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

public class AvatarGenerator {
    // 使用简单的本地缓存
    private static final ConcurrentHashMap<String, String> CACHE = new ConcurrentHashMap<>();

    /**
     * 根据名称生成随机头像 Base64 字符串
     */
    public static String generateBase64Avatar(String name) {
        // 如果缓存里有，直接返回
        if (CACHE.containsKey(name)) {
            return CACHE.get(name);
        }

        try {
            String firstChar = (name == null || name.isEmpty()) ? "U" : name.substring(0, 1).toUpperCase();
            int size = 200;
            BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2 = image.createGraphics();

            // 抗锯齿
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // 根据名字生成背景色
            int hashCode = name != null ? name.hashCode() : 0;
            Color bgColor = new Color(Math.abs(hashCode) % 255, Math.abs(hashCode * 31) % 255, Math.abs(hashCode * 17) % 255);
            g2.setColor(bgColor);
            g2.fillRect(0, 0, size, size);

            // 绘制文字
            g2.setColor(Color.WHITE);
            g2.setFont(new Font("Microsoft YaHei", Font.BOLD, 100));
            FontMetrics fm = g2.getFontMetrics();
            int x = (size - fm.stringWidth(firstChar)) / 2;
            int y = ((size - fm.getHeight()) / 2) + fm.getAscent();
            g2.drawString(firstChar, x, y);
            g2.dispose();

            // 转 Base64
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            String base64 = "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());

            // 放入缓存 (控制缓存大小防止 OOM)
            if (CACHE.size() < 1000) {
                CACHE.put(name, base64);
            }
            return base64;
        } catch (IOException e) {
            return ""; // 兜底返回空
        }
    }
}