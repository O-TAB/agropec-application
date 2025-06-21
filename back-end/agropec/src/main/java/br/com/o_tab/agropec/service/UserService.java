package br.com.o_tab.agropec.service;

import br.com.o_tab.agropec.dto.RequestLoginDTO;
import br.com.o_tab.agropec.model.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.o_tab.agropec.dto.LoginResponseDTO;
import br.com.o_tab.agropec.dto.RegisterDTO;
import br.com.o_tab.agropec.model.Users;
import br.com.o_tab.agropec.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService{

    // implementtation of user service methods
    // Create, authenticate, update, delete users
    private UserRepository userRepository;
    private AuthenticationManager authManager;
    private TokenService tokenService;
    

   // u need to specify what u will pass to the body of the http response
    public ResponseEntity<String> register(@Valid RegisterDTO data) {
        // check if its ok to register
        if(this.userRepository.findByEmail(data.email()) != null)
        return  ResponseEntity.badRequest().body("Email já cadastrado");

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        
        Users user = new Users();
        user.setUsername(data.username());
        user.setEmail(data.email());
        user.setPassword(encryptedPassword);
        user.setRole(data.role());

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    // 
    public ResponseEntity<?> login(@Valid RequestLoginDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authManager.authenticate(usernamePassword);

            var token = tokenService.generateToken((Users) auth.getPrincipal());

            Users user = userRepository.findByEmail(data.email());

            LoginResponseDTO response = new LoginResponseDTO(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
            );
            
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao realizar login.");
        }
    }

    public ResponseEntity<?> loginSuperAdmin(@Valid RequestLoginDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authManager.authenticate(usernamePassword);
            var token = tokenService.generateToken((Users) auth.getPrincipal());

            Users user = userRepository.findByEmail(data.email());

            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );

            if(user.getRole() == UserRole.SUPER_ADMIN){
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro: O usuário não é um Super Admin");
            }

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao realizar login.");
        }
    }

    public ResponseEntity<?> getAllUsers(){
        List<Users> foundUsers = userRepository.findAll();

        if(foundUsers.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum usuário cadastrado.");
        } else {
            return ResponseEntity.ok(foundUsers);
        }
    }

    public ResponseEntity<?> updateUserById(String userId, Users user){
        Optional<Users> foundUser = userRepository.findById(userId);

        if(foundUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum usuário cadastrado para o id informado.");
        } else {
            Users userUpdated = foundUser.get();

            userUpdated.setUsername(user.getUsername());
            userUpdated.setEmail(user.getEmail());
            userUpdated.setPassword(user.getPassword());
            userUpdated.setRole(user.getRole());

            return ResponseEntity.ok(userUpdated);
        }
    }

    public ResponseEntity<?> deleteUserById(String userId){
        Optional<Users> foundUser = userRepository.findById(userId);

        if(foundUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum usuário encontrado para o id informado.");
        } else {
            userRepository.deleteById(userId);

            return ResponseEntity.ok().body("Usuário deletado com sucesso!");
        }
    }

}
