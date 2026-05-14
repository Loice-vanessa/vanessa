package com.auca.backend.dto;

import lombok.Data;

@Data
public class RecordRequest {
    private String diagnosis;
    private String prescription;
    private String note;
}
