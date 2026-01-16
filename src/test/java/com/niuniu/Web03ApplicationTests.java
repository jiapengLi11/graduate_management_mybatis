package com.niuniu;

import com.niuniu.mapper.UserMapper;
import com.niuniu.pojo.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class Web03ApplicationTests {
    @Autowired
    private UserMapper userMapper;

    @Test
    public void contextLoads() {
        List<User> userList = userMapper.selectAll();
        userList.forEach(System.out::println);
    }

}
