package com.yupi.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.project.common.ErrorCode;
import com.yupi.project.exception.BusinessException;
import com.yupi.project.mapper.UserInterfaceInfoMapper;
import com.yupi.project.service.UserInterfaceInfoService;
import com.yupi.yuapicommon.model.entity.UserInterfaceInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户接口信息服务实现类
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@Service
public class UserInterfaceInfoServiceImpl extends ServiceImpl<UserInterfaceInfoMapper, UserInterfaceInfo>
    implements UserInterfaceInfoService{

    @Override
    public void validUserInterfaceInfo(UserInterfaceInfo userInterfaceInfo, boolean add) {
        if (userInterfaceInfo == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 创建时，所有参数必须非空
        if (add) {
            if (userInterfaceInfo.getInterfaceInfoId() <= 0 || userInterfaceInfo.getUserId() <= 0) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "接口或用户不存在");
            }
        }
        if (userInterfaceInfo.getLeftNum() < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "剩余次数不能小于 0");
        }
    }

    // [编程学习交流圈](https://www.code-nav.cn/) 快速入门编程不走弯路！30+ 原创学习路线和专栏、500+ 编程学习指南、1000+ 编程精华文章、20T+ 编程资源汇总

//    @Override
//    public boolean invokeCount(long interfaceInfoId, long userId) {
//        // 判断
//        if (interfaceInfoId <= 0 || userId <= 0) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        UpdateWrapper<UserInterfaceInfo> updateWrapper = new UpdateWrapper<>();
//        updateWrapper.eq("interfaceInfoId", interfaceInfoId);
//        updateWrapper.eq("userId", userId);
//
////        updateWrapper.gt("leftNum", 0);
//        updateWrapper.setSql("leftNum = leftNum - 1, totalNum = totalNum + 1");
//        return this.update(updateWrapper);
//    }

    @Override
    @Transactional // 必须加事务，防止并发插入重复数据
    public boolean invokeCount(long interfaceInfoId, long userId) {
        // 1. 判断参数
        if (interfaceInfoId <= 0 || userId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 2. 尝试执行更新
        UpdateWrapper<UserInterfaceInfo> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("interfaceInfoId", interfaceInfoId);
        updateWrapper.eq("userId", userId);
        updateWrapper.setSql("leftNum = leftNum - 1, totalNum = totalNum + 1");
        boolean updateResult = this.update(updateWrapper);

        // 3. 如果更新失败（说明数据库里没这一行）
        if (!updateResult) {
            // 判断是否真的没记录
            QueryWrapper<UserInterfaceInfo> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("interfaceInfoId", interfaceInfoId);
            queryWrapper.eq("userId", userId);
            long count = this.count(queryWrapper);

            if (count == 0) {
                // 4. 自动初始化一条“通行证”
                UserInterfaceInfo userInterfaceInfo = new UserInterfaceInfo();
                userInterfaceInfo.setUserId(userId);
                userInterfaceInfo.setInterfaceInfoId(interfaceInfoId);
                userInterfaceInfo.setTotalNum(1);     // 初始设为 1 次
                userInterfaceInfo.setLeftNum(99);    // 默认给 99 次可用
                userInterfaceInfo.setStatus(0);
                // 注意：如果你的数据库没有设置自动填充时间，请手动 setCreateTime 和 setUpdateTime
                return this.save(userInterfaceInfo);
            }
        }
        return updateResult;
    }

}




