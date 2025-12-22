package com.spring_react.spring_react.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CloseEvent {
    private String type;

    public static CloseEvent of() {
        return new CloseEvent("CLOSE");
    }
}