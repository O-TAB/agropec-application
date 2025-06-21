package br.com.o_tab.agropec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class AgropecApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgropecApplication.class, args);

		System.out.println("Agropec Application Started Successfully!");
	}

}
