package com.spring_react.spring_react.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

//    @GetMapping("/api/hello")
    @GetMapping("/hello")
    public String test() {
        return "Hello, world!";
    }
}