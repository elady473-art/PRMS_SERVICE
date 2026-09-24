package com.erp.prms.util;

import com.erp.prms.entity.ApprovalStage;
import com.erp.prms.entity.ApprovalWorkflow;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ApprovalChainBuilder {
    public ApprovalWorkflow build(String name, String departmentCode, List<String> approverEmployeeIds) {
        ApprovalWorkflow workflow = new ApprovalWorkflow();
        workflow.setWorkflowName(name);
        workflow.setDepartmentCode(departmentCode);
        for (int i = 0; i < approverEmployeeIds.size(); i++) {
            ApprovalStage stage = new ApprovalStage();
            stage.setApprovalWorkflow(workflow);
            stage.setStageOrder(i + 1);
            stage.setApproverEmployeeId(approverEmployeeIds.get(i));
            workflow.getStages().add(stage);
        }
        return workflow;
    }
}
