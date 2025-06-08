package br.com.o_tab.agropec.Service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.o_tab.agropec.DTO.RegisterDTO;
import br.com.o_tab.agropec.model.Users;
import br.com.o_tab.agropec.Repository.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService{

    // implementtation of user service methods
    // Create, authenticate, update, delete users
    UserRepository userRepository;
    

   // u need to specify what u will pass to the body of the http response
    public ResponseEntity<String> register(@Valid RegisterDTO data) {
        // check if its ok to register
        if(this.userRepository.findByEmail(data.email()) != null) return  ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        
        Users user = new Users();
        user.setUsername(data.username());
        user.setEmail(data.email());
        user.setPassword(encryptedPassword);


        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }
    
}
