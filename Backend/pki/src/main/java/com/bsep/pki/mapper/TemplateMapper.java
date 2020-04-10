package com.bsep.pki.mapper;

import com.bsep.pki.dto.TemplateDTO;
import com.bsep.pki.model.Template;

import java.time.LocalDateTime;

public class TemplateMapper implements MapperInterface<Template, TemplateDTO> {
    @Override
    public Template toEntity(TemplateDTO dto) {
        return new Template(dto.signatureAlgorithm, dto.keyAlgorithm, dto.keyUsage, dto.extendedKeyUsage, dto.name, LocalDateTime.now());
    }

    @Override
    public TemplateDTO toDto(Template entity) {
        return new TemplateDTO(entity.getId(), entity.getSignatureAlgorithm(), entity.getKeyAlgorithm(), entity.getKeyUsage(), entity.getExtendedKeyUsage(), entity.getName());
    }
}
