package com.bsep.pki.service;

import com.bsep.pki.dto.TemplateDTO;
import com.bsep.pki.mapper.TemplateMapper;
import com.bsep.pki.model.Template;
import com.bsep.pki.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    public List<TemplateDTO> getTemplates() {
        List<Template> result = this.templateRepository.findAll();
        List<TemplateDTO> retVal = new ArrayList<>();
        for (Template t: result) {
            retVal.add(templateMapper.toDto(t));
        }
        return retVal;
    }
}
