package com.bsep.pki.mapper;

import com.bsep.pki.dto.UserDTO;
import com.bsep.pki.model.User;

public class SubjectMapper implements MapperInterface<User, UserDTO> {

    @Override
    public User toEntity(UserDTO dto) {
//        return new User(dto.givenName, dto.lastName, dto.commonName, dto.country, dto.organization,
//                dto.organizationalUnit, dto.locality, dto.email, false);
        User user = new User();
        user.setGivenName(dto.givenName);
        user.setLastName(dto.lastName);
        user.setCommonName(dto.commonName);
        user.setCountry(dto.country);
        user.setOrganization(dto.organization);
        user.setOrganizationUnit(dto.organizationalUnit);
        user.setLocality(dto.locality);
        user.setEmail(dto.email);
        user.setCA(false);

        return user;
    }

    @Override
    public UserDTO toDto(User entity) {
        return new UserDTO(entity.getId(), entity.getGivenName(), entity.getLastName(), entity.getCommonName(),
                entity.getCountry(), entity.getOrganization(), entity.getOrganizationUnit(), entity.getLocality(),
                entity.getEmail());
    }
}
