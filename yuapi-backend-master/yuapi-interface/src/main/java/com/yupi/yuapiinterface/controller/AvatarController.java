package com.yupi.yuapiinterface.controller;

import com.yupi.yuapicommon.common.BaseResponse;
import com.yupi.yuapicommon.common.ResultUtils;
import com.yupi.yuapicommon.common.AvatarGenerator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    // 建议直接改为 PostMapping，或者同时支持 Get 和 Post
    @PostMapping("/random")
    public String getRandomAvatarNotice() {
        return "调用成功！您可以直接通过此链接访问图片：http://localhost:8123/api/avatar/image";
    }

    // 图片接口通常浏览器打开是 GET，但为了防止平台测试报错，也可以改为支持多种方式
    @RequestMapping(value = "/image", method = {RequestMethod.GET, RequestMethod.POST})
    public void getRandomAvatarImage(HttpServletResponse response) throws IOException {
        int randomNum = new Random().nextInt(20) + 1;
        ClassPathResource imgFile = new ClassPathResource("static/avatars/" + randomNum + ".jpg");
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        StreamUtils.copy(imgFile.getInputStream(), response.getOutputStream());
    }

    /**
     * 随机头像生成接口 - 支持网关传输版本
     */
    @PostMapping("/profile")
    public BaseResponse<String> getRandomAvatar(@RequestBody Map<String, String> params) {
        String name = params.getOrDefault("name", "User");
        String avatarData = AvatarGenerator.generateBase64Avatar(name);
        return ResultUtils.success(avatarData);
    }
}
