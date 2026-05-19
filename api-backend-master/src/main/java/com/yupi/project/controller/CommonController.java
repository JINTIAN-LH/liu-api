package com.yupi.project.controller;

import com.yupi.project.common.BaseResponse;
import com.yupi.project.common.ErrorCode;
import com.yupi.project.common.ResultUtils;
import com.yupi.project.exception.BusinessException;
import com.yupi.yuapicommon.common.AvatarGenerator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/common")
public class CommonController {

    @PostMapping("/avatar")
    public BaseResponse<String> getAvatar(@RequestBody AvatarRequest request) {
        if (request == null || request.getName() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 传入的是 request.getName()，而不是整个 RequestBody
        String base64 = AvatarGenerator.generateBase64Avatar(request.getName());
        return ResultUtils.success(base64);
    }
}