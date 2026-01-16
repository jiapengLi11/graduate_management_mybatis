package com.niuniu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.niuniu.mapper")
public class Web03Application {

    public static void main(String[] args) {
        SpringApplication.run(Web03Application.class, args);
    }

}
