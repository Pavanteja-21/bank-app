package com.pavan.bankapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ConvertDto {
    private String fromCurrency;
    private String toCurrency;
    private Double amount;
}
