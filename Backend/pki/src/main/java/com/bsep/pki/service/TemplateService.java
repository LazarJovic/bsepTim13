package com.bsep.pki.service;

import com.bsep.pki.dto.TemplateDTO;
import com.bsep.pki.mapper.TemplateMapper;
import com.bsep.pki.model.Template;
import com.bsep.pki.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    private TemplateMapper templateMapper;

    public TemplateService() {
        templateMapper = new TemplateMapper();
    }

    public TemplateDTO create(TemplateDTO dto) {
        Template template = this.templateMapper.toEntity(dto);

        return this.templateMapper.toDto(this.templateRepository.save(template));
    }
}
