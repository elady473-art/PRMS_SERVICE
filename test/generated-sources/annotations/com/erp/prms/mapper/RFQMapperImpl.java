package com.erp.prms.mapper;

import com.erp.prms.dto.request.RFQCreateRequest;
import com.erp.prms.entity.RFQ;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-15T16:37:09+0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Ubuntu)"
)
@Component
public class RFQMapperImpl implements RFQMapper {

    @Override
    public RFQ toEntity(RFQCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        RFQ rFQ = new RFQ();

        rFQ.setTitle( request.getTitle() );
        rFQ.setItemDetails( request.getItemDetails() );
        rFQ.setSubmissionDeadline( request.getSubmissionDeadline() );

        return rFQ;
    }
}
