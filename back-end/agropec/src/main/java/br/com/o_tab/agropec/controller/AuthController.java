package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.dto.RequestLoginDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.o_tab.agropec.dto.RegisterDTO;
import br.com.o_tab.agropec.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDTO data){
        return userService.register(data);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid RequestLoginDTO data){
        return userService.login(data);
    }
    
}
