package br.com.o_tab.agropec.controller;

import br.com.o_tab.agropec.dto.RequestLoginDTO;
import br.com.o_tab.agropec.model.Users;
import feign.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.o_tab.agropec.dto.RegisterDTO;
import br.com.o_tab.agropec.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;

    @PostMapping("/login/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDTO data){
        return userService.register(data);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid RequestLoginDTO data){
        return userService.login(data);
    }

    @PostMapping("/login/superadmin")
    public ResponseEntity<?> loginSuperAdmin(@RequestBody @Valid RequestLoginDTO data){
        return userService.loginSuperAdmin(data);
    }

    @GetMapping("/login/users")
    public ResponseEntity<?> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/login/{userId}")
    public ResponseEntity<?> updateUserById(@PathVariable String userId, @RequestBody Users user){
        return userService.updateUserById(userId, user);
    }

    @DeleteMapping("/login/delete/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable String userId){
        return userService.deleteUserById(userId);
    }
    
}
