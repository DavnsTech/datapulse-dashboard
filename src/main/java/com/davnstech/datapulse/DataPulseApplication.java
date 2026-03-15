package com.davnstech.datapulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DataPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(DataPulseApplication.class, args);
    }
}
