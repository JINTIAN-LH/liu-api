package com.yupi.yuapiinterface.controller;

import com.yupi.yuapicommon.common.BaseResponse;
import com.yupi.yuapicommon.common.ResultUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/common")
public class CommonInterfaceController {

    private static final List<String> JOKES = Arrays.asList(
            "程序员最讨厌的四件事：写注释、写文档、别人不写注释、别人不写文档。",
            "问：程序员脱发的原因是什么？答：因为他们在寻找 Bug 的过程中，把头皮磨薄了。",
            "一程序员去面试，面试官问：你有什么缺点？程序员：我这人太实诚。面试官：其实实诚也不算缺点。程序员：我真的一点都不在乎你刚才放的那个响屁。"
    );

    private static final List<String> QUOTES = Arrays.asList(
            "代码是写给人看的，顺便给机器执行。—— Martin Fowler",
            "简单即是美。—— Python 之禅",
            "如果你无法简单地解释它，说明你还没能充分理解它。—— 爱因斯坦"
    );

    @RequestMapping("/joke")
    public BaseResponse<String> getRandomJoke() {
        int index = new Random().nextInt(JOKES.size());
        return ResultUtils.success(JOKES.get(index));
    }

    @RequestMapping("/quote")
    public BaseResponse<String> getRandomQuote() {
        int index = new Random().nextInt(QUOTES.size());
        return ResultUtils.success(QUOTES.get(index));
    }

    @RequestMapping("/ip")
    public BaseResponse<String> getIpLocation(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }
        return ResultUtils.success("您的当前访问 IP 为：" + ip);
    }
}