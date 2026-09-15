package com.erp.prms.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class RFQCreateRequest {
    @NotNull private Long purchaseRequisitionId;
    @NotBlank @Size(max = 250) private String title;
    @NotBlank private String itemDetails;
    @NotNull @Future private LocalDate submissionDeadline;
}
