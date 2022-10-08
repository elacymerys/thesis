package pl.edu.agh.quizzesthesis.api.dto;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public record SignUpRequest(

        @NotNull
        @Pattern(regexp = "^\\w{3,16}$")
        String nick,

        @NotNull
        @Email
        String email,

        @NotNull
        @Length(min = 8, max = 100)
        String password
) {}
