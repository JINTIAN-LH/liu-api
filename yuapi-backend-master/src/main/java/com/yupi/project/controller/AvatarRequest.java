package com.yupi.project.controller;

import lombok.Data;

@Data // 这个注解会自动生成 getName, setName, toString 等所有方法
public class AvatarRequest {
    private String name;
}
