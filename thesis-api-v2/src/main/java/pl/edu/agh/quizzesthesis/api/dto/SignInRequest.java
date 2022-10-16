package pl.edu.agh.quizzesthesis.api.dto;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public record SignInRequest(

        @NotBlank
        String login,

        @NotNull
        @Length(min = 8, max = 100)
        String password
) {}
