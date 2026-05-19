package com.yupi.project.service.impl.inner;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yupi.project.common.ErrorCode;
import com.yupi.project.exception.BusinessException;
import com.yupi.project.mapper.InterfaceInfoMapper;
import com.yupi.yuapicommon.model.entity.InterfaceInfo;
import com.yupi.yuapicommon.service.InnerInterfaceInfoService;
import org.apache.commons.lang3.StringUtils;
import org.apache.dubbo.config.annotation.DubboService;

import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j; // 确保有这一行

import java.util.List;

/**
 * 内部接口服务实现类
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@DubboService
@Slf4j // 添加这个注解，Lombok 会自动为你生成 log 变量
public class InnerInterfaceInfoServiceImpl implements InnerInterfaceInfoService {

    @Resource
    private InterfaceInfoMapper interfaceInfoMapper;

    @Override
    public InterfaceInfo getInterfaceInfo(String url, String method) {
        if (StringUtils.isAnyBlank(url, method)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 1. 尝试完全匹配（URL + Method）
        QueryWrapper<InterfaceInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("url", url);
        queryWrapper.eq("method", method.toUpperCase());
        InterfaceInfo interfaceInfo = interfaceInfoMapper.selectOne(queryWrapper);

        // 2. 如果完全匹配失败，说明可能是前端模拟调用的 method 传错了（比如 GET 变成 POST）
        if (interfaceInfo == null) {
            log.warn("完全匹配失败，尝试通过 URL 降级匹配: {}", url);
            QueryWrapper<InterfaceInfo> fallbackWrapper = new QueryWrapper<>();
            fallbackWrapper.eq("url", url);
            // 找这个路径下的第一个可用接口
            List<InterfaceInfo> list = interfaceInfoMapper.selectList(fallbackWrapper);
            if (list != null && !list.isEmpty()) {
                // 返回该路径下的第一个，网关后续会根据这个 info 里的真实 method 进行逻辑处理
                interfaceInfo = list.get(0);
            }
        }
        if (interfaceInfo != null) {
            log.info("后端成功匹配到接口 ID: {}", interfaceInfo.getId());
        } else {
            log.warn("后端未匹配到任何接口！");
        }
        return interfaceInfo;
    }

}
