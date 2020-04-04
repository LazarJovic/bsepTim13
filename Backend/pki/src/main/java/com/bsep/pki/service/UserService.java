package com.bsep.pki.service;

import com.bsep.pki.dto.UserDTO;
import com.bsep.pki.mapper.SubjectMapper;
import com.bsep.pki.model.User;
import com.bsep.pki.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private SubjectMapper subjectMapper;

    public UserService() {this.subjectMapper = new SubjectMapper();}

    public UserDTO create(UserDTO dto) {
        if(!validSubjectData(dto))
            return null;

        User subject = this.subjectMapper.toEntity(dto);

        return this.subjectMapper.toDto(this.userRepository.save(subject));

    }

    private boolean validSubjectData(UserDTO dto) {
        if(!validDataLength(dto.givenName) || !validDataLength(dto.lastName))
            return false;
        else if(notValidSingleData(dto.commonName) || notValidSingleData(dto.country) || notValidSingleData(dto.organization)
            || notValidSingleData(dto.organizationalUnit) || notValidSingleData(dto.locality) || notValidSingleData(dto.email))
            return false;
        else
            return true;
    }

    private boolean notValidSingleData(String data) {
        if(data == null || data.equals("") || !validDataLength(data)) {
            return true;
        }

        return false;
    }

    private boolean validDataLength(String data) {
        return data.length() < 50;
    }
}
