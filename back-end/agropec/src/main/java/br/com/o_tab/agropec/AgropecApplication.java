package br.com.o_tab.agropec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class AgropecApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgropecApplication.class, args);

		System.out.println("Agropec Application Started Successfully!");
	}

}
